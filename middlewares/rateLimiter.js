const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

module.exports = { rateLimiter };
