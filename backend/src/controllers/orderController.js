const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        const newOrder = new Order({
            user: userId,
            items,
            totalAmount,
            status: 'Pending',
        });
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get order status by order ID
exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('user', 'username email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order status', error: error.message });
    }
};