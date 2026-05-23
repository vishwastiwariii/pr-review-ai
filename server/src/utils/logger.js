const config = require('../config');

// ANSI Terminal Escape Color Mappings
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',     // Error
  green: '\x1b[32m',   // Success
  yellow: '\x1b[33m',  // Warning
  blue: '\x1b[34m',    // Info
  magenta: '\x1b[35m', // Debug
  cyan: '\x1b[36m',    // HTTP
  white: '\x1b[37m'
};

/**
 * Returns a precise current timestamp string in format: YYYY-MM-DD HH:MM:SS.SSS
 * Uses the local machine time-zone details for developer convenience.
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Central printing engine that structures and outputs log strings to stdout.
 * Respects production environments by automatically stripping ANSI colors to prevent log file noise.
 * 
 * @param {'info'|'success'|'warn'|'error'|'http'|'debug'} level - Log severity level
 * @param {string} colorSequence - ANSI color code from COLORS mapping
 * @param {string} message - Primary log description
 * @param {string} [context=''] - Optional operational context segment (e.g. 'GitHub Service')
 */
function printLog(level, colorSequence, message, context = '') {
  const ts = getTimestamp();
  
  // Only use colors in development (exclude production and test environments)
  const env = config.NODE_ENV || 'development';
  const useColors = env !== 'production' && env !== 'test';

  const tsPart = useColors ? `${COLORS.dim}[${ts}]${COLORS.reset}` : `[${ts}]`;
  const levelPart = useColors ? `${COLORS.bright}${colorSequence}[${level.toUpperCase()}]${COLORS.reset}` : `[${level.toUpperCase()}]`;
  const contextPart = context ? (useColors ? `${COLORS.white}[${context}]${COLORS.reset} ` : `[${context}] `) : '';

  console.log(`${tsPart} ${levelPart} ${contextPart}${message}`);
}

/**
 * Lightweight, zero-dependency Logger Utility.
 */
const logger = {
  /**
   * Logs a standard operational information message.
   */
  info(message, context = '') {
    printLog('info', COLORS.blue, message, context);
  },

  /**
   * Logs an action success or validation pass confirmation.
   */
  success(message, context = '') {
    printLog('success', COLORS.green, message, context);
  },

  /**
   * Logs a warning or non-critical exception event.
   */
  warn(message, context = '') {
    printLog('warn', COLORS.yellow, message, context);
  },

  /**
   * Logs a critical error. Optionally captures and outputs stack traces safely.
   */
  error(message, error = null, context = '') {
    const errorMsg = error ? `${message} -> Details: ${error.message}` : message;
    printLog('error', COLORS.red, errorMsg, context);
    
    // Output stack trace in development mode for easy debugging
    if (error && error.stack && config.NODE_ENV !== 'production') {
      console.error(`${COLORS.dim}${error.stack}${COLORS.reset}`);
    }
  },

  /**
   * Logs incoming Express HTTP requests or networking actions.
   */
  http(method, url, status, duration = null, context = 'HTTP') {
    const durationPart = duration !== null ? ` - ${duration}ms` : '';
    const msg = `${method} ${url} | Status: ${status}${durationPart}`;
    
    let statusColor = COLORS.cyan;
    if (status >= 400 && status < 500) statusColor = COLORS.yellow;
    else if (status >= 500) statusColor = COLORS.red;
    
    printLog('http', statusColor, msg, context);
  },

  /**
   * Logs verbose diagnostic elements.
   */
  debug(message, context = '') {
    // Only output debug logs if in development or debug mode is active
    if (config.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      printLog('debug', COLORS.magenta, message, context);
    }
  }
};

module.exports = logger;
