/**
 * JSON Resiliency & Sanitization Utility.
 * 
 * Provides robust JSON extraction, truncated string repairing (for LLM max-token limit cuts),
 * and strict structural schema validation for AI Code Review payloads.
 */

/**
 * Strips markdown codeblock ticks and returns a cleaned raw string.
 * 
 * @param {string} rawString - The raw response text
 * @returns {string} Cleaned string
 */
function stripMarkdownTicks(rawString) {
  if (!rawString || typeof rawString !== 'string') return '';
  
  let cleaned = rawString.trim();

  // Strip leading ```json or ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');

  // Strip trailing ```
  cleaned = cleaned.replace(/\s*```$/, '');

  return cleaned.trim();
}

/**
 * Stack-based character scanner that closes unclosed quotes, brackets, and braces.
 * Used to repair truncated JSON caused by model max-token exhaustion.
 * 
 * @param {string} jsonString - The malformed truncated string
 * @returns {string} Repaired string
 */
function closeDanglingBrackets(jsonString) {
  let cleaned = jsonString.trim();
  const stack = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{' || char === '[') {
      stack.push(char === '{' ? '}' : ']');
    } else if (char === '}' || char === ']') {
      if (stack.length > 0 && stack[stack.length - 1] === char) {
        stack.pop();
      }
    }
  }

  // 1. Close unclosed string literal if truncated mid-string
  if (inString) {
    cleaned += '"';
  }

  // 2. Append matching closing characters in reverse stack order
  const closeSequence = [...stack].reverse().join('');
  cleaned += closeSequence;

  return cleaned;
}

/**
 * Deep repair algorithm for truncated reviews.
 * If simple brace closing fails (due to a trailing comma or uncompleted key-value pair),
 * this scans backwards to discard the trailing broken object and closes the structure safely.
 * 
 * @param {string} rawString - The raw, potentially truncated string
 * @returns {Object|null} Parsed JSON object, or null if completely unrecoverable
 */
function cleanAndRepairJSON(rawString) {
  if (!rawString) return null;

  const cleaned = stripMarkdownTicks(rawString);

  // 1. Try normal parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Standard parse failed, proceed to repair
  }

  // 2. Try simple brace closing repair
  try {
    const repaired = closeDanglingBrackets(cleaned);
    return JSON.parse(repaired);
  } catch (err) {
    // Simple repair failed (typically due to dangling commas/keys at the truncation point)
  }

  // 3. Deep Repair: Slice off trailing uncompleted comment elements in the comments array
  // Find the last complete object close '}' within a comments array context
  const lastCloseBraceIdx = cleaned.lastIndexOf('}');
  
  if (lastCloseBraceIdx !== -1) {
    let sliced = cleaned.substring(0, lastCloseBraceIdx + 1);
    
    // Attempt to close the sliced string cleanly
    try {
      const repairedSliced = closeDanglingBrackets(sliced);
      return JSON.parse(repairedSliced);
    } catch (err) {
      // Deep repair attempt failed, try trimming trailing commas before closing
      try {
        let commaCleaned = sliced.trim();
        if (commaCleaned.endsWith(',')) {
          commaCleaned = commaCleaned.slice(0, -1);
        }
        const repairedCommaCleaned = closeDanglingBrackets(commaCleaned);
        return JSON.parse(repairedCommaCleaned);
      } catch (innerErr) {
        // Unrecoverable
      }
    }
  }

  return null;
}

/**
 * Sanitizes and validates the parsed review object.
 * Enforces the strict schema, casts types, and filters out bad or malformed comment fields.
 * 
 * @param {Object} rawJson - Parsed review object
 * @returns {Object} Sanitized review object matching the schema: { summary: string, comments: Array }
 */
function sanitizeReviewPayload(rawJson) {
  const result = {
    summary: '',
    comments: []
  };

  if (!rawJson || typeof rawJson !== 'object') {
    result.summary = '### 🤖 AI Pull Request Review\n\n*(Warning: AI response was malformed or could not be parsed.)*';
    return result;
  }

  // 1. Sanitize summary
  if (rawJson.summary && typeof rawJson.summary === 'string') {
    result.summary = rawJson.summary;
  } else {
    result.summary = '### 🤖 AI Pull Request Review\n\nNo overall summary was provided by the reviewer.';
  }

  // 2. Sanitize comments array
  const rawComments = rawJson.comments;
  if (Array.isArray(rawComments)) {
    rawComments.forEach((c) => {
      if (!c || typeof c !== 'object') return;

      // Extract core properties
      const path = c.path;
      const rawLine = c.line;
      const body = c.body;
      const rawCategory = c.category;
      const rawSeverity = c.severity;

      // Validate core fields exist
      if (!path || typeof path !== 'string' || !body || typeof body !== 'string') {
        return; // Exclude incomplete comments
      }

      // Sanitize line number: must be an integer, greater than 0, not NaN
      let line = parseInt(rawLine, 10);
      if (isNaN(line) || line <= 0) {
        return; // Exclude comments with invalid line mappings
      }

      // Validate and sanitize category and severity
      const validCategories = ['bug', 'security', 'performance', 'style'];
      const validSeverities = ['critical', 'major', 'minor'];

      const category = (rawCategory && typeof rawCategory === 'string') 
        ? rawCategory.trim().toLowerCase() 
        : 'style';
      
      const severity = (rawSeverity && typeof rawSeverity === 'string') 
        ? rawSeverity.trim().toLowerCase() 
        : 'minor';

      const finalCategory = validCategories.includes(category) ? category : 'style';
      const finalSeverity = validSeverities.includes(severity) ? severity : 'minor';

      // Append clean, validated comment
      result.comments.push({
        path: path.trim(),
        line,
        category: finalCategory,
        severity: finalSeverity,
        body: body.trim()
      });
    });
  }

  return result;
}

module.exports = {
  cleanAndRepairJSON,
  sanitizeReviewPayload,
  closeDanglingBrackets
};
