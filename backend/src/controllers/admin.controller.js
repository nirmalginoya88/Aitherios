const { User } = require('../models');

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.count();

        // Provide the full structure the frontend expects
        res.json({
            kpis: {
                totalRevenue: 125400,
                revenueGrowth: 12.5,
                totalOrders: 850,
                ordersGrowth: 8.2,
                totalVisitors: 45200,
                visitorsGrowth: 15.3,
                conversionRate: 3.2,
                conversionGrowth: 2.1
            },
            revenue: [
                { date: 'Jan', value: 8500 },
                { date: 'Feb', value: 9200 },
                { date: 'Mar', value: 10500 },
                { date: 'Apr', value: 12000 },
                { date: 'May', value: 11500 },
                { date: 'Jun', value: 13000 },
            ],
            orders: [
                { date: 'Jan', value: 60 },
                { date: 'Feb', value: 65 },
                { date: 'Mar', value: 80 },
                { date: 'Apr', value: 95 },
                { date: 'May', value: 90 },
                { date: 'Jun', value: 110 },
            ],
            topProducts: [
                { name: 'Void Runner', sales: 120, revenue: 12000 },
                { name: 'Nebula Tee', sales: 95, revenue: 4500 },
                { name: 'Cyber Hoodie', sales: 80, revenue: 6400 },
                { name: 'Glitch Socks', sales: 150, revenue: 1500 },
            ],
            trafficSources: [
                { name: 'Direct', value: 45 },
                { name: 'Social', value: 25 },
                { name: 'Search', value: 20 },
                { name: 'Referral', value: 10 },
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: { role: 'user' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH /api/admin/users/:id/role  — promote/demote a user
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin".' });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({ role });
        res.json({ message: `User role updated to ${role}`, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAnalytics, getAllUsers, updateUserRole };
