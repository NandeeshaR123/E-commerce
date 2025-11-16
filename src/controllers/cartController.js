const Cart = require('../models/cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        } else {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error });
    }
};