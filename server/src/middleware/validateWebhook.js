const crypto = require('crypto');
const config = require('../config');

/**
 * Express middleware that validates GitHub webhook signatures using HMAC SHA-256.
 *
 * This middleware performs two checks before passing control to the route handler:
 *   1. Validates that required GitHub webhook headers are present
 *      (x-github-event, x-github-delivery).
 *   2. Verifies the payload integrity using the x-hub-signature-256 header
 *      and the configured GITHUB_WEBHOOK_SECRET via timing-safe comparison.
 *
 * On success, it attaches `req.webhookEvent` and `req.webhookDeliveryId`
 * for convenient downstream access.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateWebhookSignature = (req, res, next) => {
  // --- 1. Required header validation ---
  const event = req.headers['x-github-event'];
  const deliveryId = req.headers['x-github-delivery'];

  if (!event || !deliveryId) {
    console.error('[ERROR] [HTTP 400] [Middleware] Rejected: Missing required GitHub webhook headers.');
    return res.status(400).json({
      error: 'Missing required GitHub headers: x-github-event and x-github-delivery'
    });
  }

  // Attach parsed headers to the request for downstream handlers
  req.webhookEvent = event;
  req.webhookDeliveryId = deliveryId;

  console.log(`\n[INFO] [Middleware] Received Event: "${event}" | Delivery ID: ${deliveryId}`);

  // --- 2. HMAC SHA-256 signature verification ---
  const secret = config.GITHUB_WEBHOOK_SECRET;

  // If no secret is configured, skip verification with a warning
  if (!secret) {
    if (config.isProduction) {
      console.warn('[WARN] [Middleware] GITHUB_WEBHOOK_SECRET is missing in production! Payload validation is disabled.');
    } else {
      console.log('[WARN] [Middleware] GITHUB_WEBHOOK_SECRET is not configured. Skipping signature verification in development.');
    }
    return next();
  }

  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    console.error('[ERROR] [HTTP 401] [Middleware] Missing x-hub-signature-256 header when secret is configured.');
    return res.status(401).json({
      error: 'Missing x-hub-signature-256 header. Webhook signature is required.'
    });
  }

  if (!req.rawBody) {
    console.error('[ERROR] [HTTP 500] [Middleware] Raw request body buffer is missing. Check express.json verify configuration.');
    return res.status(500).json({
      error: 'Server misconfiguration: raw body buffer unavailable for signature verification.'
    });
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const computedSignature = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    );

    if (!isValid) {
      console.error('[ERROR] [HTTP 401] [Middleware] HMAC SHA-256 signature mismatch.');
      return res.status(401).json({
        error: 'HMAC signature verification failed. Invalid webhook secret.'
      });
    }
  } catch (error) {
    console.error('[ERROR] [HTTP 401] [Middleware] Signature verification error:', error.message);
    return res.status(401).json({
      error: 'HMAC signature verification failed. Invalid webhook secret.'
    });
  }

  // Signature valid — proceed to route handler
  console.log('[SUCCESS] [Middleware] Webhook signature verified.');
  next();
};

module.exports = { validateWebhookSignature };
