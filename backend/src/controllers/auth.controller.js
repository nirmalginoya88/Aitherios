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

module.exports = { register, login, getMe };