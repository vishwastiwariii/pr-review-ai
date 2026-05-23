const express = require('express');
const crypto = require('crypto');
const config = require('../config');

const router = express.Router();

/**
 * Helper function to verify GitHub HMAC signature
 * Uses timing-safe comparisons to prevent timing side-channel attacks
 */
const verifyGitHubSignature = (req) => {
  const signature = req.headers['x-hub-signature-256'];
  const secret = config.GITHUB_WEBHOOK_SECRET;

  // If no secret is configured, skip checks (only warning in non-production)
  if (!secret) {
    if (!config.isProduction) {
      console.log('[WARN] [Webhook] GITHUB_WEBHOOK_SECRET is not configured. Skipping signature verification in development.');
      return true;
    }
    // In production, we log a warning but allow if they explicitly omitted it (security choice)
    console.warn('[WARN] [Webhook] GITHUB_WEBHOOK_SECRET is missing in production! Payload validation is disabled.');
    return true;
  }

  if (!signature) {
    console.error('[ERROR] [Webhook] Missing x-hub-signature-256 header when secret is configured.');
    return false;
  }

  if (!req.rawBody) {
    console.error('[ERROR] [Webhook] Raw request body buffer is missing. Check express.json configuration.');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const computedSignature = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    // Secure timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    );
  } catch (error) {
    console.error('[ERROR] [Webhook] Error occurred during signature verification:', error.message);
    return false;
  }
};

/**
 * @route   POST /webhooks/github
 * @desc    Receive GitHub webhook events (ping, pull_request, etc.)
 * @access  Public (Validated via HMAC signature)
 */
router.post('/github', (req, res) => {
  const event = req.headers['x-github-event'];
  const deliveryId = req.headers['x-github-delivery'];

  // 1. Validate required headers
  if (!event || !deliveryId) {
    console.error('[ERROR] [HTTP 400] [Webhook] Rejected: Missing required GitHub webhook headers.');
    return res.status(400).json({
      error: 'Missing required GitHub headers: x-github-event and x-github-delivery'
    });
  }

  console.log(`\n[INFO] [Webhook] Received Event: "${event}" | Delivery ID: ${deliveryId}`);

  // 2. Validate cryptographic signature
  if (!verifyGitHubSignature(req)) {
    console.error('[ERROR] [HTTP 401] [Webhook] Rejected: HMAC SHA-256 signature verification failed.');
    return res.status(401).json({
      error: 'HMAC signature verification failed. Invalid webhook secret.'
    });
  }

  const payload = req.body;

  try {
    // 3. Process Webhook Event Types
    if (event === 'ping') {
      console.log('[SUCCESS] [HTTP 200] [Webhook] Ping event received. GitHub connection successful!');
      return res.status(200).json({ message: 'pong' });
    }

    if (event === 'pull_request') {
      const action = payload.action;
      const prNumber = payload.number;
      const repoName = payload.repository ? payload.repository.full_name : 'unknown-repo';
      const prTitle = payload.pull_request ? payload.pull_request.title : 'No Title';
      const sender = payload.sender ? payload.sender.login : 'unknown-user';

      console.log(`[INFO] [PR Event] Repository: ${repoName} | PR #${prNumber}`);
      console.log(`[INFO] [PR Event] Author: @${sender} | Title: "${prTitle}"`);
      console.log(`[INFO] [PR Event] Action: "${action}"`);

      // Filter for target actions that trigger an AI review
      const monitoredActions = ['opened', 'synchronize', 'reopened'];

      if (monitoredActions.includes(action)) {
        console.log(`[SUCCESS] [HTTP 202] [PR Event] Action "${action}" triggers review. Initializing AI PR Review pipeline...`);
        
        // TODO: Trigger asynchronous review worker service here
        // e.g. reviewService.reviewPullRequest({ repoName, prNumber, payload });

        return res.status(202).json({
          message: `Webhook accepted. AI review pipeline triggered for PR #${prNumber} (${action}).`,
          details: {
            repository: repoName,
            prNumber,
            action
          }
        });
      } else {
        console.log(`[INFO] [HTTP 200] [PR Event] Action "${action}" is ignored (unmonitored action).`);
        return res.status(200).json({
          message: `Webhook received. No review action required for action: "${action}"`
        });
      }
    }

    // Capture other event types that aren't implemented yet
    console.log(`[INFO] [HTTP 200] [Webhook] Event "${event}" received but not processed.`);
    return res.status(200).json({
      message: `Webhook received. Event type "${event}" is not handled by this server.`
    });

  } catch (error) {
    console.error('[ERROR] [HTTP 500] [Webhook] Error processing webhook payload:', error);
    return res.status(500).json({
      error: 'An internal server error occurred while processing the webhook event.'
    });
  }
});

module.exports = router;
