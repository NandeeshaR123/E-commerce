const Order = require('../models/order');
const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { products, totalAmount, addressId } = req.body;

        // Validate required fields
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products are required' });
        }
        if (!totalAmount) {
            return res.status(400).json({ message: 'Total amount is required' });
        }
        if (!addressId) {
            return res.status(400).json({ message: 'Address ID is required' });
        }

        // Check product stock
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }
        }

        // Get user and find the address
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // stored snapshotted version in case user update the addresss.
        const { _id, isDefault, createdAt, updatedAt, ...addressFields } = address.toObject();
        const orderAddress = { ...addressFields };

        const newOrder = new Order({
            user: userId,
            products,
            totalAmount,
            orderAddress,
            orderStatus: 'Pending',
        });

        await newOrder.save();

        // Deduct product stock
        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
        );

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate('products.product', 'name price image')
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get order status by order ID
exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('user', 'username email')
            .populate('products.product', 'name price image');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order status', error: error.message });
    }
};