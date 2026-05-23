const path = require('path');

// Immediately load .env using dynamic path resolution relative to this directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Configuration Schema Definition
const schema = {
  PORT: {
    key: 'PORT',
    type: 'number',
    default: 5001,
    validate: (val) => !isNaN(val) && val > 0 && val < 65536,
    message: 'Must be a valid port integer between 1 and 65535.',
  },
  NODE_ENV: {
    key: 'NODE_ENV',
    type: 'string',
    default: 'development',
    validate: (val) => ['development', 'production', 'test'].includes(val),
    message: 'Must be one of: development, production, test.',
  },
  CORS_ORIGIN: {
    key: 'CORS_ORIGIN',
    type: 'string',
    default: 'http://localhost:5173',
  },
  GITHUB_TOKEN: {
    key: 'GITHUB_TOKEN',
    type: 'string',
    required: isProduction,
    message: 'GitHub Personal Access Token is required in production mode to authenticate API actions.',
  },
  OPENROUTER_API_KEY: {
    key: 'OPENROUTER_API_KEY',
    type: 'string',
    required: isProduction,
    message: 'OpenRouter API Key is required in production mode to interface with review LLMs.',
  },
  GITHUB_WEBHOOK_SECRET: {
    key: 'GITHUB_WEBHOOK_SECRET',
    type: 'string',
    required: false,
    message: 'Optional but highly recommended webhook signature validation key.',
  },
  START_NGROK: {
    key: 'START_NGROK',
    type: 'boolean',
    default: false,
    message: 'Set to true to automatically start ngrok tunnel in development.',
  },
  NGROK_AUTHTOKEN: {
    key: 'NGROK_AUTHTOKEN',
    type: 'string',
    required: false,
    message: 'Your personal ngrok authtoken to establish the forward tunnel.',
  },
  NGROK_DOMAIN: {
    key: 'NGROK_DOMAIN',
    type: 'string',
    required: false,
    message: 'Your permanent static ngrok domain to bind the forward tunnel.',
  },
};

const errors = [];
const config = {};

// Parse and validate each environment key
Object.keys(schema).forEach((configKey) => {
  const rule = schema[configKey];
  let rawValue = process.env[rule.key];

  // 1. Apply default if not provided
  if (rawValue === undefined || rawValue === '') {
    if (rule.default !== undefined) {
      rawValue = rule.default;
    } else if (rule.required) {
      errors.push(`[ERROR] Environment variable [${rule.key}] is required but not defined. ${rule.message || ''}`);
      return;
    } else {
      // Not required and no default, set to undefined
      config[configKey] = undefined;
      return;
    }
  }

  // 2. Type casting
  let parsedValue = rawValue;
  if (rule.type === 'number') {
    parsedValue = Number(rawValue);
  } else if (rule.type === 'boolean') {
    parsedValue = rawValue === 'true' || rawValue === '1';
  }

  // 3. Validation rule checks
  if (rule.validate && !rule.validate(parsedValue)) {
    errors.push(`[ERROR] Environment variable [${rule.key}] is invalid. Current value: "${rawValue}". ${rule.message || ''}`);
    return;
  }

  // 4. Save to final config object
  config[configKey] = parsedValue;
});

// If validation errors are present, block server startup and output detailed logs
if (errors.length > 0) {
  console.error('\n=============================================');
  console.error('[ERROR] ENV CONFIGURATION VALIDATION FAILED');
  console.error('=============================================');
  errors.forEach((err) => console.error(err));
  console.error('=============================================\n');
  process.exit(1);
}

// Attach helper tags for ease of use
config.isProduction = isProduction;
config.isDevelopment = NODE_ENV === 'development';
config.isTest = NODE_ENV === 'test';

module.exports = config;
