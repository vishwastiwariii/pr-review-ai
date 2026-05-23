const githubService = require('./githubService');
const aiService = require('./aiService');
const { filterPRFiles } = require('../utils/filterFiles');
const { formatPRFilesForLLM } = require('../utils/formatDiff');
const { formatGitHubComment } = require('../utils/formatComment');

/**
 * Orchestrator Service responsible for the end-to-end pull request review workflow.
 * 
 * Flow:
 *  1. Fetch changed files patch data from the GitHub API.
 *  2. Filter out non-code assets, lockfiles, and binaries.
 *  3. Format patches into compact line-numbered LLM prompts.
 *  4. Execute structured AI review generations (via OpenRouter).
 *  5. Publish unified summary reviews and inline suggestions back to the PR.
 */
class ReviewService {
  /**
   * Processes a pull request review asynchronously.
   * Runs inside an isolated try/catch block to avoid process crashes.
   * 
   * @param {Object} prMetadata - Parsed PR context metadata
   * @param {number} prMetadata.number - Pull request number
   * @param {string} prMetadata.title - Pull request title
   * @param {string} prMetadata.repository - Repository full name (owner/repo)
   * @returns {Promise<void>}
   */
  async processPullRequest(prMetadata) {
    const { number, repository, title, installationId } = prMetadata;
    const [owner, repo] = repository.split('/');

    console.log(`\n======================================================================`);
    console.log(`[PIPELINE] [START] Initiating Autonomous Code Review for PR #${number}`);
    console.log(`[PIPELINE] Repo: ${repository} | Title: "${title}"`);
    if (installationId) {
      console.log(`[PIPELINE] GitHub App Installation ID: ${installationId}`);
    }
    console.log(`======================================================================\n`);

    try {
      // --- Step 1: Fetch changed files from GitHub ---
      console.log(`[PIPELINE] [STEP 1/5] Fetching changed files patches from GitHub REST API...`);
      const rawFiles = await githubService.getPullRequestFiles(owner, repo, number, installationId);
      
      if (!rawFiles || rawFiles.length === 0) {
        console.warn(`[PIPELINE] [WARN] No files retrieved for PR #${number}. Aborting review.`);
        return;
      }

      // --- Step 2: Filter out irrelevant files ---
      console.log(`[PIPELINE] [STEP 2/5] Filtering lockfiles, binaries, build outputs, and assets...`);
      const filteredFiles = filterPRFiles(rawFiles);
      console.log(`[PIPELINE] Filtered files: ${filteredFiles.length} of ${rawFiles.length} eligible for review.`);

      if (filteredFiles.length === 0) {
        console.log(`[PIPELINE] [SUCCESS] All modified files are excluded (e.g. lockfiles or assets). Skipping AI analysis.`);
        await githubService.createPullRequestReview(
          owner,
          repo,
          number,
          `### 🤖 Automated AI Review\n\nAll modified files in this Pull Request are lockfiles, builds, or binary assets that do not require code auditing. Skipping automated review.`,
          'COMMENT',
          [],
          installationId
        );
        return;
      }

      // --- Step 3: Format patches into compact line-numbered layouts ---
      console.log(`[PIPELINE] [STEP 3/5] Transforming patches into line-numbered AI-readable diff layouts...`);
      const formattedDiff = formatPRFilesForLLM(filteredFiles);
      
      // --- Step 4: Request AI completion via OpenRouter ---
      console.log(`[PIPELINE] [STEP 4/5] Sending diff payload to AI Service for structured review...`);
      const reviewPayload = await aiService.generatePullRequestReview(formattedDiff, prMetadata);

      if (!reviewPayload || !reviewPayload.summary) {
        throw new Error('AI generated review is missing a summary content.');
      }

      // --- Step 5: Publish unified review back to GitHub ---
      const inlineComments = reviewPayload.comments || [];
      console.log(`[PIPELINE] [STEP 5/5] Submitting review summary and ${inlineComments.length} inline comment suggestions back to PR...`);
      
      const formattedComments = inlineComments.map(c => ({
        path: c.path,
        line: c.line,
        body: formatGitHubComment(c)
      }));

      const headerPrefix = `### 🤖 AI Pull Request Review\n\n`;
      const finalSummary = `${headerPrefix}${reviewPayload.summary}`;

      let githubResponse;
      try {
        // Attempt unified review submission in a single transaction (fastest and cleanest)
        githubResponse = await githubService.createPullRequestReview(
          owner,
          repo,
          number,
          finalSummary,
          'COMMENT',
          formattedComments,
          installationId
        );
      } catch (reviewError) {
        // Check if the error is a 422 Unprocessable Entity (commonly caused by hallucinated invalid inline comment line numbers)
        if (reviewError.status === 422 && formattedComments.length > 0) {
          console.warn(`[WARN] [Pipeline] Unified review submission failed with HTTP 422 (likely invalid comment line numbers).`);
          console.log(`[INFO] [Pipeline] Falling back to separate submission: posting summary review first, then individual comments...`);
          
          // 1. Submit the high-level summary review alone (guaranteed to succeed if permissions are correct)
          githubResponse = await githubService.createPullRequestReview(
            owner,
            repo,
            number,
            finalSummary,
            'COMMENT',
            [],
            installationId
          );
          
          // 2. Fetch the HEAD commit SHA needed for individual comments
          console.log(`[INFO] [Pipeline] Fetching PR details to get HEAD commit SHA for inline comments...`);
          const prDetails = await githubService.getPullRequest(owner, repo, number, installationId);
          const commitId = prDetails?.head?.sha;
          
          if (!commitId) {
            console.error(`[ERROR] [Pipeline] Could not retrieve HEAD commit SHA. Skipping individual inline comments.`);
            return githubResponse;
          }
          
          // 3. Post each inline comment individually, catching 422/404 errors gracefully
          let successCommentsCount = 0;
          for (const comment of formattedComments) {
            try {
              await githubService.postReviewComment(
                owner,
                repo,
                number,
                commitId,
                comment.path,
                comment.line,
                comment.body,
                installationId
              );
              successCommentsCount++;
            } catch (commentError) {
              // Gracefully skip 422/404 errors (out-of-bounds line numbers)
              if (commentError.status === 422 || commentError.status === 404) {
                console.warn(`[WARN] [Pipeline] Skipping invalid inline comment on ${comment.path}:${comment.line} (Error: ${commentError.message})`);
              } else {
                // Rethrow other errors (e.g. rate limit, auth) to not mask them
                throw commentError;
              }
            }
          }
          
          console.log(`[SUCCESS] [Pipeline] Graceful fallback completed. Successfully posted ${successCommentsCount} of ${formattedComments.length} inline comments.`);
        } else {
          // If it is not a 422 or there are no comments, rethrow the original error
          throw reviewError;
        }
      }

      console.log(`\n======================================================================`);
      console.log(`[PIPELINE] [SUCCESS] Successfully completed code review for PR #${number}!`);
      console.log(`[PIPELINE] Review process finished successfully.`);
      console.log(`======================================================================\n`);
      
      return githubResponse;
    } catch (error) {
      console.error(`\n======================================================================`);
      console.error(`[PIPELINE] [ERROR] Review pipeline failed for PR #${number}`);
      console.error(`[PIPELINE] [ERROR] Reason: ${error.message}`);
      console.error(`======================================================================\n`);
    }
  }
}

module.exports = new ReviewService();
