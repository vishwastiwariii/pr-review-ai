/**
 * Markdown Comment Formatter for GitHub Pull Request Reviews.
 * 
 * Transforms raw, AI-generated review comments into premium, visually stunning
 * GitHub markdown segments utilising emojis, severity badges, and native
 * GitHub Alert block containers (e.g. [!WARNING], [!CAUTION], [!TIP], [!NOTE]).
 */

const CATEGORY_MAP = {
  security: {
    emoji: '🔴',
    label: 'SECURITY AUDIT',
    alertType: 'WARNING'
  },
  bug: {
    emoji: '💥',
    label: 'BUG & LOGIC AUDIT',
    alertType: 'CAUTION'
  },
  performance: {
    emoji: '⚡',
    label: 'PERFORMANCE AUDIT',
    alertType: 'TIP'
  },
  style: {
    emoji: '🎨',
    label: 'CODE QUALITY AUDIT',
    alertType: 'NOTE'
  }
};

/**
 * Formats a clean, validated AI comment into a highly structured GitHub markdown review comment.
 * 
 * @param {Object} comment - The sanitized comment object
 * @param {string} comment.path - Target file path
 * @param {number} comment.line - Target line number
 * @param {'bug'|'security'|'performance'|'style'} comment.category - Category type
 * @param {'critical'|'major'|'minor'} comment.severity - Severity level
 * @param {string} comment.body - Review description text
 * @returns {string} Fully styled markdown segment
 */
function formatGitHubComment(comment) {
  if (!comment || typeof comment !== 'object') return '';

  const { category = 'style', severity = 'minor', body = '' } = comment;

  // Retrieve category descriptor assets
  const meta = CATEGORY_MAP[category] || CATEGORY_MAP.style;
  const uppercaseSeverity = severity.toUpperCase();

  // Construct a premium alert-based block layout
  const markdown = [
    `### ${meta.emoji} [${uppercaseSeverity}] ${meta.label}`,
    `> [!${meta.alertType}]`,
    `> **AI Code Review Recommendation**:`,
    `> ${body.trim().split('\n').join('\n> ')}`
  ];

  return markdown.join('\n');
}

module.exports = {
  formatGitHubComment,
  CATEGORY_MAP
};
