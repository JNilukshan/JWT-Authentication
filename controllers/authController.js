const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');

exports.register = async (req, res) => {
    try {
        const { name, email, password, whatsappNumber } = req.body;

        if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
            return res.status(400).json({ message: 'Password must meet security requirements' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, whatsappNumber });

        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        await sendVerificationEmail(email, token);
        res.status(201).json({ message: 'User registered. Check your email for verification' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.id, { isVerified: true });
        res.json({ message: 'Email verified' });

    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.logout = async (req, res) => {
    res.json({ message: 'Logged out' });
};
