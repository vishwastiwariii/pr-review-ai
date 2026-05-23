const express = require('express');
const cors = require('cors');
const config = require('./config');
const healthRouter = require('./routes/health');
const webhookRouter = require('./routes/webhooks');

// Initialize Express app
const app = express();

// Configure CORS
const corsOrigin = config.CORS_ORIGIN || '*';
const corsOptions = {
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: corsOrigin !== '*',
};

app.use(cors(corsOptions));

// Standard middlewares
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl && req.originalUrl.startsWith('/webhooks')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/health', healthRouter);
app.use('/webhooks', webhookRouter);

// Fallback route for unmatched resources (404 Not Found)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      stack: config.isProduction ? undefined : err.stack
    }
  });
});

module.exports = app;
