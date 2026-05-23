const config = require('./config');
const app = require('./app');

// Port definition
const PORT = config.PORT;

let ngrokSession = null;

/**
 * Initializes the ngrok tunnel in development mode if configured
 */
async function startNgrok() {
  if (!config.START_NGROK) {
    return;
  }

  if (config.NODE_ENV !== 'development') {
    console.log('[INFO] [NGROK] Automatic tunnel only allowed in development mode.');
    return;
  }

  if (!config.NGROK_AUTHTOKEN) {
    console.warn('=============================================');
    console.warn('[WARN] [NGROK] START_NGROK is true, but NGROK_AUTHTOKEN is missing.');
    console.warn('[WARN] [NGROK] Please add your NGROK_AUTHTOKEN to your server/.env file.');
    console.warn('[WARN] [NGROK] Get a free authtoken at: https://dashboard.ngrok.com/get-started/your-authtoken');
    console.warn('=============================================');
    return;
  }

  try {
    console.log(`[INFO] [NGROK] Initializing secure tunnel to port ${PORT}...`);
    const ngrok = require('@ngrok/ngrok');

    // Forward the Express port
    const forwardOptions = {
      addr: PORT,
      authtoken: config.NGROK_AUTHTOKEN,
    };

    if (config.NGROK_DOMAIN) {
      forwardOptions.domain = config.NGROK_DOMAIN;
    }

    const listener = await ngrok.forward(forwardOptions);

    const tunnelUrl = listener.url();
    console.log(`=============================================`);
    console.log(`[SUCCESS] [NGROK] Tunnel active: ${tunnelUrl}`);
    console.log(`[SUCCESS] [NGROK] Forwarding to: http://localhost:${PORT}`);
    console.log(`[SUCCESS] [NGROK] GitHub Webhook URL: ${tunnelUrl}/webhooks/github`);
    console.log(`=============================================`);

    ngrokSession = listener;
  } catch (error) {
    console.error('=============================================');
    console.error('[ERROR] [NGROK] Failed to establish secure tunnel.');
    console.error(`[ERROR] [NGROK] Reason: ${error.message}`);
    console.error('=============================================');
  }
}

// Start server
const server = app.listen(PORT, async () => {
  console.log(`=============================================`);
  console.log(`[START] Server running in ${config.NODE_ENV} mode`);
  console.log(`[LISTEN] Listening on port: ${PORT}`);
  console.log(`[HEALTH] Health check: http://localhost:${PORT}/health`);
  console.log(`=============================================`);

  // Try to start ngrok tunnel if configured
  await startNgrok();
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n[WARN] Received ${signal}. Starting graceful shutdown...`);
  
  if (ngrokSession) {
    try {
      console.log('[INFO] [NGROK] Closing secure tunnel...');
      await ngrokSession.close();
      console.log('[SUCCESS] [NGROK] Tunnel closed.');
    } catch (error) {
      console.error(`[ERROR] [NGROK] Error closing tunnel: ${error.message}`);
    }
  }

  server.close(() => {
    console.log('[SUCCESS] HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown if connections cannot be closed in 10s
  setTimeout(() => {
    console.error('[ERROR] Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
