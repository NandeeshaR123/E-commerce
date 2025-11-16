const express = require('express');
const { createOrder, getOrderStatus } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/:orderId', authMiddleware, getOrderStatus);

module.exports = router;