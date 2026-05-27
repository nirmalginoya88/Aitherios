const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ── Helpers ──────────────────────────────────────────────────────────────────

function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
}

// ── Step 1: Generate OTP, save to DB, send email ─────────────────────────────

async function forgotPassword(email) {
    // Silently succeed if user not found (don't leak existence)
    const user = await User.findOne({ where: { email } });
    if (!user) return; // Return silently — don't throw

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiredAt = otpExpiredAt;
    await user.save();

    // Send the email asynchronously in the background so the HTTP response is instant
    const transporter = createTransporter();
    transporter.sendMail({
        from: `"Aitherios" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Aitherios Password Reset Code',
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
                <h2 style="color: #dc2626;">Aitherios Password Reset</h2>
                <p>Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #dc2626; margin: 24px 0;">
                    ${otp}
                </div>
                <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    }).then(info => {
        console.log('[Email Sent Successfully]:', info.messageId);
    }).catch(err => {
        console.error('[Email Send Error]:', err.message);
    });
}

// ── Step 2: Verify OTP → return short-lived reset JWT ────────────────────────

async function verifyOtp(email, otp) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.otp) throw new Error('Invalid or expired code.');

    // Check expiry
    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
        throw new Error('Code has expired. Please request a new one.');
    }

    // Compare OTP
    if (user.otp !== otp) {
        throw new Error('Incorrect code. Please try again.');
    }

    // Clear OTP fields so the code can't be reused
    user.otp = null;
    user.otpExpiredAt = null;
    await user.save();

    // Issue a short-lived reset token (15 min) so only this step can trigger a reset
    const resetToken = jwt.sign(
        { id: user.id, purpose: 'password-reset' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    return { resetToken };
}

// ── Step 3: Verify reset token → update password ─────────────────────────────

async function resetPassword(resetToken, newPassword) {
    let payload;
    try {
        payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
        throw new Error('Reset link is invalid or has expired. Please start again.');
    }

    if (payload.purpose !== 'password-reset') {
        throw new Error('Invalid reset token.');
    }

    const user = await User.findByPk(payload.id);
    if (!user) throw new Error('User not found.');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
}

module.exports = { forgotPassword, verifyOtp, resetPassword };