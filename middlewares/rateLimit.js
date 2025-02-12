const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: "Too many login attempts. Try again later.",
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});

module.exports = { authLimiter, apiLimiter };
