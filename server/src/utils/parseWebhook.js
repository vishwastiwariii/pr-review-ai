/**
 * Parses a GitHub pull_request webhook payload and extracts
 * structured repository and PR metadata.
 *
 * @param {Object} payload - The raw webhook request body (req.body)
 * @returns {Object} Parsed metadata with safe fallback defaults
 */
const parsePullRequestPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid or empty webhook payload received.');
  }

  const { action, number, pull_request, repository, sender } = payload;

  // --- Repository metadata ---
  const repo = {
    fullName: repository?.full_name || 'unknown/unknown',
    name: repository?.name || 'unknown',
    owner: repository?.owner?.login || 'unknown',
    isPrivate: repository?.private ?? false,
    defaultBranch: repository?.default_branch || 'main',
    url: repository?.html_url || null,
  };

  // --- Pull request metadata ---
  const pr = {
    number: number || null,
    title: pull_request?.title || 'Untitled',
    body: pull_request?.body || '',
    action: action || 'unknown',
    state: pull_request?.state || 'unknown',
    draft: pull_request?.draft ?? false,
    url: pull_request?.html_url || null,
    diffUrl: pull_request?.diff_url || null,
    createdAt: pull_request?.created_at || null,
    updatedAt: pull_request?.updated_at || null,

    // Branch details
    head: {
      ref: pull_request?.head?.ref || 'unknown',
      sha: pull_request?.head?.sha || null,
    },
    base: {
      ref: pull_request?.base?.ref || 'unknown',
      sha: pull_request?.base?.sha || null,
    },

    // Diff stats (available on some events)
    additions: pull_request?.additions ?? null,
    deletions: pull_request?.deletions ?? null,
    changedFiles: pull_request?.changed_files ?? null,
  };

  // --- Sender / author metadata ---
  const author = {
    login: sender?.login || pull_request?.user?.login || 'unknown',
    avatarUrl: sender?.avatar_url || pull_request?.user?.avatar_url || null,
    url: sender?.html_url || pull_request?.user?.html_url || null,
  };

  return { repo, pr, author };
};

module.exports = { parsePullRequestPayload };
