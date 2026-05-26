const { User, Order } = require('../models');

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.count();

        // Provide the full structure the frontend expects
        res.json({
            
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/admin/customers
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: { role: 'user' },
            include: [{
                model: Order,
                as: 'orders'
            }]
        });

        // Format the users to match the Customer type in frontend
        const customers = users.map(user => {
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';
            const avatar = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
            
            // Calculate real spent and orders count from the database relations
            const userOrders = user.orders || [];
            const totalOrders = userOrders.length;
            const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
            
            const joinDate = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2026-01-01';
            
            let lastActive = user.updatedAt ? new Date(user.updatedAt).toISOString().split('T')[0] : '2026-01-01';
            if (userOrders.length > 0) {
                const dates = userOrders.map(o => new Date(o.createdAt));
                const mostRecent = new Date(Math.max(...dates));
                lastActive = mostRecent.toISOString().split('T')[0];
            }
            
            let status = 'active';
            if (totalSpent > 500) {
                status = 'vip';
            } else if (totalOrders === 0) {
                status = 'inactive';
            }

            return {
                id: user.id.toString(),
                name: `${firstName} ${lastName}`.trim(),
                email: user.email,
                joinDate,
                totalOrders,
                totalSpent,
                lastActive,
                status,
                avatar
            };
        });

        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                as: 'customer',
                attributes: ['firstName', 'lastName', 'email']
            }]
        });

        const formattedOrders = orders.map(order => {
            const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}`.trim() : 'Unknown';
            const customerEmail = order.customer ? order.customer.email : 'Unknown';

            return {
                id: order.id,
                customerId: order.userId.toString(),
                customerName,
                customerEmail,
                date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : '2026-01-01',
                status: order.status,
                total: parseFloat(order.total || 0),
                shippingAddress: order.shippingAddress,
                trackingId: order.trackingId || undefined,
                items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
            };
        });

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be pending, processing, shipped, delivered, or cancelled.' });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        await order.update({ status });
        
        res.json({ message: `Order status updated successfully`, id, status });
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

module.exports = { getAnalytics, getAllUsers, getAllOrders, updateOrderStatus, updateUserRole };
