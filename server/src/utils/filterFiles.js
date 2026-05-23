/**
 * Utility to filter out irrelevant pull request files (lock files, binaries, 
 * generated build outputs, etc.) before sending them to the review LLM.
 */

// Extensions of common binary, asset, and font files that don't need code reviews
const BINARY_EXTENSIONS = new Set([
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'bmp', 'tiff', 'heic',
  // Audio/Video
  'mp3', 'wav', 'flac', 'ogg', 'mp4', 'mov', 'avi', 'mkv', 'webm',
  // Documents / Binaries
  'pdf', 'zip', 'tar', 'gz', 'rar', '7z', 'exe', 'dll', 'so', 'dylib', 'bin',
  // Fonts
  'woff', 'woff2', 'ttf', 'otf', 'eot'
]);

// File basenames that are typical lock files or generated configurations
const IGNORED_BASENAMES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'cargo.lock',
  'gemfile.lock',
  'composer.lock',
  'mix.lock',
  '.ds_store',
  'thumbs.db'
]);

// Folder names (segments in the file path) that represent compiled outputs or metadata
const IGNORED_FOLDERS = new Set([
  'dist',
  'build',
  'out',
  'target',
  'bin',
  'obj',
  'node_modules',
  'bower_components',
  '.next',
  '.nuxt',
  '.cache',
  '.git',
  '.idea',
  '.vscode'
]);

/**
 * Determines whether a file path is relevant for code review.
 * 
 * @param {string} filePath - The path to check
 * @returns {boolean} True if the file should be reviewed, false otherwise
 */
function shouldReviewFile(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;

  const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/');
  const basename = pathParts[pathParts.length - 1];

  // 1. Check ignored folders/directories
  for (const part of pathParts.slice(0, -1)) {
    if (IGNORED_FOLDERS.has(part)) {
      return false;
    }
  }

  // 2. Check exact ignored basenames (e.g. lock files)
  if (IGNORED_BASENAMES.has(basename)) {
    return false;
  }

  // 3. Check binary and asset extensions
  const extParts = basename.split('.');
  if (extParts.length > 1) {
    const ext = extParts[extParts.length - 1];
    if (BINARY_EXTENSIONS.has(ext)) {
      return false;
    }

    // 4. Check minified files (e.g. bundle.min.js)
    if (extParts.length > 2 && extParts[extParts.length - 2] === 'min') {
      return false;
    }
  }

  return true;
}

/**
 * Filters a list of pull request file objects or strings.
 * Supports raw string paths or GitHub pull request file structures (with a `filename` field).
 * 
 * @param {Array<Object|string>} files - List of file objects or path strings
 * @returns {Array<Object|string>} Filtered list of review-eligible files
 */
function filterPRFiles(files) {
  if (!Array.isArray(files)) return [];

  return files.filter(file => {
    const path = typeof file === 'string' ? file : file.filename;
    return shouldReviewFile(path);
  });
}

module.exports = {
  shouldReviewFile,
  filterPRFiles
};
