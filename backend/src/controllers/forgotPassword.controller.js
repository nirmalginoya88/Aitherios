const { forgotPassword, verifyOtp, resetPassword } = require('../services/forgotpassword.service');

// POST /auth/forgot-password
// Body: { email }
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required.' });
        await forgotPassword(email);
        // Always respond 200 — don't reveal whether the email exists
        res.status(200).json({ message: 'If that email is registered, a code has been sent.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /auth/verify-otp
// Body: { email, otp }
async function verifyOtpController(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });
        const { resetToken } = await verifyOtp(email, otp);
        res.status(200).json({ resetToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// POST /auth/reset-password
// Body: { resetToken, newPassword }
async function resetPasswordController(req, res) {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) return res.status(400).json({ error: 'Reset token and new password are required.' });
        if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        await resetPassword(resetToken, newPassword);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { forgotPasswordController, verifyOtpController, resetPasswordController };