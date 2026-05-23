const express = require('express');
const config = require('../config');
const router = express.Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint to monitor server status
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV
  });
});

module.exports = router;
