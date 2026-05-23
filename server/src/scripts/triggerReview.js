#!/usr/bin/env node

/**
 * PR Review AI — CLI Manual Trigger Utility
 * 
 * Usage:
 *   node src/scripts/triggerReview.js <owner> <repository> <prNumber>
 * 
 * Example:
 *   node src/scripts/triggerReview.js vishwastiwariii multivendor-marketplace-backend 2
 */

const path = require('path');

// Automatically load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const reviewService = require('../services/reviewService');
const config = require('../config');

// ANSI escape codes for beautiful formatting
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log(`\n${COLORS.bright}${COLORS.red}Error: Missing required arguments.${COLORS.reset}`);
    console.log(`${COLORS.bright}Usage:${COLORS.reset}`);
    console.log(`  node src/scripts/triggerReview.js <owner> <repository> <prNumber>`);
    console.log(`\n${COLORS.bright}Example:${COLORS.reset}`);
    console.log(`  node src/scripts/triggerReview.js vishwastiwariii multivendor-marketplace-backend 2\n`);
    process.exit(1);
  }

  const [owner, repo, prStr] = args;
  const prNumber = parseInt(prStr, 10);

  if (isNaN(prNumber) || prNumber <= 0) {
    console.error(`\n${COLORS.red}Error: Invalid Pull Request number: "${prStr}". Must be a positive integer.${COLORS.reset}\n`);
    process.exit(1);
  }

  // Double check credentials before running
  if (!config.GITHUB_TOKEN) {
    console.warn(`\n${COLORS.yellow}[WARN] GITHUB_TOKEN is not defined in your .env file! Requests may fail due to rate limits or permission boundaries.${COLORS.reset}`);
  }
  if (!config.OPENROUTER_API_KEY) {
    console.warn(`${COLORS.yellow}[WARN] OPENROUTER_API_KEY is missing! The service will run in MOCK mode simulating reviews.${COLORS.reset}`);
  }

  console.log(`\n======================================================================`);
  console.log(`${COLORS.bright}${COLORS.cyan}🚀 MANUAL AI REVIEW TRIGGER ACTIVATED${COLORS.reset}`);
  console.log(`======================================================================`);
  console.log(`${COLORS.bright}Target Repository:${COLORS.reset} ${owner}/${repo}`);
  console.log(`${COLORS.bright}PR Number:        ${COLORS.reset} #${prNumber}`);
  console.log(`======================================================================\n`);

  const prMetadata = {
    number: prNumber,
    title: `Manual CLI Trigger Review for PR #${prNumber}`,
    repository: `${owner}/${repo}`
  };

  const start = Date.now();

  try {
    // Execute the core processPullRequest orchestrator pipeline
    const response = await reviewService.processPullRequest(prMetadata);
    
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    
    console.log(`\n======================================================================`);
    console.log(`${COLORS.bright}${COLORS.green}🎉 SUCCESS: Manual review successfully posted to GitHub!${COLORS.reset}`);
    console.log(`${COLORS.bright}Duration:${COLORS.reset} ${duration} seconds`);
    console.log(`======================================================================\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n======================================================================`);
    console.error(`${COLORS.bright}${COLORS.red}❌ FAILURE: Review pipeline encountered a fatal crash.${COLORS.reset}`);
    console.error(`${COLORS.bright}Error Message:${COLORS.reset} ${err.message}`);
    console.error(`======================================================================\n`);
    process.exit(1);
  }
}

main();
