const express = require('express');
const router = express.Router();
const { getDashboardStats, getCustomers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getDashboardStats);
router.get('/customers', getCustomers);

module.exports = router;
