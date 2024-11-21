const morgan = require('morgan');

// Custom Morgan tokens
morgan.token('custom-method', (req) => req.method);
morgan.token('custom-url', (req) => req.originalUrl);
morgan.token('custom-status', (req, res) => res.statusCode);

// Define a custom format for logging, using Morgan's built-in response-time token
const customFormat = ':custom-method :custom-url :custom-status :response-time ms';

// Export the Morgan middleware
const loggerMiddleware = morgan(customFormat);

module.exports = loggerMiddleware;
