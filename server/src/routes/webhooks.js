const express = require('express');
const { parsePullRequestPayload } = require('../utils/parseWebhook');
const { validateWebhookSignature } = require('../middleware/validateWebhook');
const reviewService = require('../services/reviewService');

const router = express.Router();

// Apply signature validation middleware to all webhook routes
router.use(validateWebhookSignature);

/**
 * @route   POST /webhooks/github
 * @desc    Receive GitHub webhook events (ping, pull_request, etc.)
 * @access  Public (Validated via HMAC signature middleware)
 */
router.post('/github', (req, res) => {
  const event = req.webhookEvent;
  const payload = req.body;

  try {
    // 1. Process Webhook Event Types
    if (event === 'ping') {
      console.log('[SUCCESS] [HTTP 200] [Webhook] Ping event received. GitHub connection successful!');
      return res.status(200).json({ message: 'pong' });
    }

    if (event === 'pull_request') {
      const { repo, pr, author } = parsePullRequestPayload(payload);

      console.log(`[INFO] [PR Event] Repository: ${repo.fullName} | PR #${pr.number}`);
      console.log(`[INFO] [PR Event] Author: @${author.login} | Title: "${pr.title}"`);
      console.log(`[INFO] [PR Event] Action: "${pr.action}" | Branch: ${pr.head.ref} -> ${pr.base.ref}`);

      // Filter for target actions that trigger an AI review
      const monitoredActions = ['opened', 'synchronize', 'reopened'];

      if (monitoredActions.includes(pr.action)) {
        console.log(`[SUCCESS] [HTTP 202] [PR Event] Action "${pr.action}" triggers review. Initializing AI PR Review pipeline...`);
        
        // ASYNCHRONOUS PIPELINE HANDOFF (Non-blocking background worker)
        const reviewMetadata = {
          number: pr.number,
          title: pr.title,
          repository: repo.fullName
        };
        
        reviewService.processPullRequest(reviewMetadata)
          .catch(err => console.error(`[ERROR] [Pipeline] Background process failed: ${err.message}`));

        return res.status(202).json({
          message: `Webhook accepted. AI review pipeline triggered for PR #${pr.number} (${pr.action}).`,
          details: {
            repository: repo.fullName,
            prNumber: pr.number,
            action: pr.action
          }
        });
      } else {
        console.log(`[INFO] [HTTP 200] [PR Event] Action "${pr.action}" is ignored (unmonitored action).`);
        return res.status(200).json({
          message: `Webhook received. No review action required for action: "${pr.action}"`
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

