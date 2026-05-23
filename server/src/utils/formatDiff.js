/**
 * Utility to parse GitHub patch structures and generate a clean, compact,
 * and mathematically precise line-numbered diff format optimized for LLMs.
 * 
 * Traditional git hunk formats (@@ -x,y +a,b @@) frequently lead to LLM
 * line-number hallucinations. By parsing the hunks and annotating each line
 * with its exact line number in the modified (new) file, the LLM can
 * accurately reference lines in its feedback.
 */

/**
 * Parses a standard git patch string and returns an array of annotated lines.
 * 
 * @param {string} patch - The raw patch string from GitHub API (file.patch)
 * @returns {string} Fully annotated patch string with explicit line numbers
 */
function parseAndAnnotatePatch(patch) {
  if (!patch) return '(No content changes or binary file)';

  const lines = patch.split('\n');
  const annotatedLines = [];
  
  let currentOldLine = 0;
  let currentNewLine = 0;

  for (const line of lines) {
    // Detect hunk header, e.g., @@ -13,7 +13,8 @@
    const hunkHeaderMatch = line.match(/^@@ -(\d+),?\d* \+(\d+),?\d* @@/);
    
    if (hunkHeaderMatch) {
      currentOldLine = parseInt(hunkHeaderMatch[1], 10);
      currentNewLine = parseInt(hunkHeaderMatch[2], 10);
      annotatedLines.push(`\n[Hunk: Old Lines ${hunkHeaderMatch[1]}... | New Lines ${hunkHeaderMatch[2]}...]`);
      continue;
    }

    if (line.startsWith('+')) {
      // Line added in new file
      annotatedLines.push(`  ${String(currentNewLine).padStart(4, ' ')}: + ${line.substring(1)}`);
      currentNewLine++;
    } else if (line.startsWith('-')) {
      // Line deleted from old file (does not exist in new file, marked with original line)
      annotatedLines.push(`  ${String(currentOldLine).padStart(4, ' ')}: - ${line.substring(1)}`);
      currentOldLine++;
    } else {
      // Unchanged contextual line (exists in both)
      annotatedLines.push(`  ${String(currentNewLine).padStart(4, ' ')}:   ${line.substring(1)}`);
      currentOldLine++;
      currentNewLine++;
    }
  }

  return annotatedLines.join('\n');
}

/**
 * Converts a list of filtered PR files (with filename, status, and patch properties)
 * into a single compact AI-readable markdown string.
 * 
 * @param {Array<Object>} files - List of file objects from GitHub API
 * @returns {string} Formatted markdown diff payload
 */
function formatPRFilesForLLM(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return 'No reviewable files or code changes in this pull request.';
  }

  const output = [];

  output.push('======================================================================');
  output.push(` PULL REQUEST CODE DIFFS (${files.length} Files to Review)`);
  output.push('======================================================================\n');
  output.push('Please review the code changes below. Each changed file contains a line-by-line diff.');
  output.push('Lines starting with "+" are additions. Lines starting with "-" are deletions.');
  output.push('The prefix number represents the exact line number of that line in the NEW file.');
  output.push('For deleted lines, the prefix represents the line number in the OLD file.');
  output.push('Use the exact line numbers when submitting inline review comments.\n');

  files.forEach((file, idx) => {
    const status = file.status || 'modified';
    const additions = file.additions || 0;
    const deletions = file.deletions || 0;
    
    output.push(`----------------------------------------------------------------------`);
    output.push(`[FILE #${idx + 1}] File: ${file.filename} (Status: ${status} | +${additions} -${deletions})`);
    output.push(`----------------------------------------------------------------------`);
    
    if (file.patch) {
      output.push(parseAndAnnotatePatch(file.patch));
    } else if (status === 'added') {
      output.push('(Empty new file)');
    } else if (status === 'removed') {
      output.push('(File was deleted completely)');
    } else {
      output.push('(Binary file or diff omitted due to size)');
    }
    output.push('\n');
  });

  return output.join('\n');
}

module.exports = {
  parseAndAnnotatePatch,
  formatPRFilesForLLM
};
