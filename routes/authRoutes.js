const express = require('express');
const { register, login, verifyEmail, logout } = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, login);
router.get('/verify/:token', verifyEmail);
router.post('/logout', logout);

module.exports = router;
