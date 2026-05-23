const axios = require('axios');
const config = require('../config');

/**
 * Reusable, authenticated service for interacting with the GitHub REST API.
 * 
 * Uses Axios client instance with central token authentication, custom media type
 * overrides, and structured error extraction (including rate-limit awareness).
 */
class GithubService {
  constructor() {
    const token = config.GITHUB_TOKEN;

    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      if (config.isProduction) {
        console.error('[ERROR] [GitHub Service] GITHUB_TOKEN is missing in production! API requests will fail.');
      } else {
        console.warn('[WARN] [GitHub Service] GITHUB_TOKEN is not configured. Running unauthenticated (highly rate-limited).');
      }
    }

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers,
      timeout: 30000, // 30 seconds timeout
    });
  }

  /**
   * Fetches basic metadata details for a pull request.
   * 
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @returns {Promise<Object>} PR metadata
   */
  async getPullRequest(owner, repo, prNumber) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}`);
      console.log(`[SUCCESS] [GitHub API] Fetched PR details for ${owner}/${repo} #${prNumber}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Fetching PR #${prNumber} details`);
    }
  }

  /**
   * Fetches the raw patch/diff text of a pull request.
   * Leverages GitHub's specialized 'application/vnd.github.v3.diff' header.
   * 
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @returns {Promise<string>} Raw diff file content
   */
  async getPullRequestDiff(owner, repo, prNumber) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
        headers: {
          'Accept': 'application/vnd.github.v3.diff',
        },
        responseType: 'text', // Diff is returned as raw text
      });
      console.log(`[SUCCESS] [GitHub API] Fetched raw diff for ${owner}/${repo} #${prNumber} (${Buffer.byteLength(response.data)} bytes)`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Fetching PR #${prNumber} raw diff`);
    }
  }

  /**
   * Fetches the list of modified files in a pull request.
   * 
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @returns {Promise<Array>} List of changed files with patch content
   */
  async getPullRequestFiles(owner, repo, prNumber) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/pulls/${prNumber}/files`);
      console.log(`[SUCCESS] [GitHub API] Fetched changed files for ${owner}/${repo} #${prNumber} (${response.data.length} files)`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Fetching PR #${prNumber} files`);
    }
  }

  /**
   * Submits a full pull request review with optional inline line comments.
   * 
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @param {string} body - Review summary text
   * @param {'APPROVE'|'REQUEST_CHANGES'|'COMMENT'} [event='COMMENT'] - Action type
   * @param {Array<Object>} [comments=[]] - Optional inline review comments
   * @returns {Promise<Object>} Response data
   */
  async createPullRequestReview(owner, repo, prNumber, body, event = 'COMMENT', comments = []) {
    try {
      const payload = { body, event };

      if (Array.isArray(comments) && comments.length > 0) {
        payload.comments = comments.map(c => ({
          path: c.path,
          line: c.line,
          body: c.body
        }));
      }

      const response = await this.client.post(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, payload);
      console.log(`[SUCCESS] [GitHub API] Created PR review (${event}) with ${comments.length} inline comments for ${owner}/${repo} #${prNumber}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Creating PR #${prNumber} review (${event}) with ${comments.length} comments`);
    }
  }

  /**
   * Submits a single review comment on a specific line of a file.
   * 
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @param {string} commitId - SHA of the commit being reviewed
   * @param {string} path - Relative file path
   * @param {number} line - Line number of the comment
   * @param {string} body - Comment body
   * @returns {Promise<Object>} Response data
   */
  async postReviewComment(owner, repo, prNumber, commitId, path, line, body) {
    try {
      const response = await this.client.post(`/repos/${owner}/${repo}/pulls/${prNumber}/comments`, {
        body,
        commit_id: commitId,
        path,
        line,
        side: 'RIGHT', // Comments on the modified side of the diff
      });
      console.log(`[SUCCESS] [GitHub API] Posted review comment to ${owner}/${repo} #${prNumber} on ${path}:${line}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Posting review comment to ${path}:${line}`);
    }
  }

  /**
   * Private central utility to format, inspect, and throw GitHub/Axios REST errors.
   * Extends native Errors with rate-limiting, status-codes, and parsed payloads.
   * 
   * @private
   */
  _handleError(error, context) {
    let message = error.message;
    let status = null;
    let githubMessage = null;
    let rateRemaining = null;
    let rateReset = null;

    if (error.response) {
      status = error.response.status;
      rateRemaining = error.response.headers['x-ratelimit-remaining'];
      rateReset = error.response.headers['x-ratelimit-reset'];

      // Pull request diff endpoint returns text, parse JSON error manually if possible
      if (typeof error.response.data === 'string') {
        try {
          const parsed = JSON.parse(error.response.data);
          githubMessage = parsed.message;
        } catch {
          githubMessage = error.response.data.substring(0, 200); // Truncate text response
        }
      } else if (error.response.data && error.response.data.message) {
        githubMessage = error.response.data.message;
      }
      
      message = `HTTP ${status}${githubMessage ? `: ${githubMessage}` : ''}`;
    }

    const logPrefix = `[ERROR] [GitHub API] Fail: [${context}]`;
    const logDetails = [
      `Msg: ${message}`,
      status ? `Status: ${status}` : null,
      rateRemaining !== undefined ? `RateLimit-Remaining: ${rateRemaining}` : null,
      rateReset ? `RateLimit-ResetTime: ${new Date(Number(rateReset) * 1000).toLocaleTimeString()}` : null,
    ].filter(Boolean).join(' | ');

    console.error(`${logPrefix} -> ${logDetails}`);

    const customError = new Error(`${context} failed: ${message}`);
    customError.status = status;
    customError.githubMessage = githubMessage;
    customError.rateRemaining = rateRemaining;
    customError.rateReset = rateReset;
    customError.isAxiosError = true;

    throw customError;
  }
}

module.exports = new GithubService();
