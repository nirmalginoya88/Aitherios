const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({ message: 'User created', user: result.user, token: result.token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Returns the currently authenticated user (requires protect middleware)
const getMe = async (req, res) => {
    res.status(200).json({ user: req.user });
};

// Logs out the user by removing the token (requires protect middleware)
const logout = async (req, res) => {
    try {
        // Since the token is sent via the Authorization header, there's nothing to remove server-side.
        // Logout is handled client-side by clearing the token.
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await authService.updateProfile(userId, req.body);
        res.status(200).json({ message: 'User profile updated successfully', user: result.user, token: result.token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { register, login, getMe, logout, updateProfile };