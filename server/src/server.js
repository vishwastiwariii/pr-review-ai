const config = require('./config');
const app = require('./app');

// Port definition
const PORT = config.PORT;

// Start server
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`[START] Server running in ${config.NODE_ENV} mode`);
  console.log(`[LISTEN] Listening on port: ${PORT}`);
  console.log(`[HEALTH] Health check: http://localhost:${PORT}/health`);
  console.log(`=============================================`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n[WARN] Received ${signal}. Starting graceful shutdown...`);
  
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
