const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly, notForDemoAdmin } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', adminOnly, notForDemoAdmin, updateOrderStatus);

module.exports = router;
