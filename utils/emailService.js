const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Click the link to verify your email: ${process.env.BASE_URL}/auth/verify/${token}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
