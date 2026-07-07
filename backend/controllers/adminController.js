const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  const [
    totalProducts,
    totalCustomers,
    totalOrders,
    pendingOrders,
    toShipOrders,
    shippedOrders,
    outForDeliveryOrders,
    deliveredOrders,
    outOfStockProducts,
    lowStockProducts,
    revenueData,
  ] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'Pending' }),
    Order.countDocuments({ orderStatus: 'To Ship' }),
    Order.countDocuments({ orderStatus: 'Shipped' }),
    Order.countDocuments({ orderStatus: 'Out for Delivery' }),
    Order.countDocuments({ orderStatus: 'Delivered' }),
    Product.countDocuments({ status: 'Out of Stock' }),
    Product.countDocuments({ status: 'Low Stock' }),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'Paid', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    totalProducts,
    totalCustomers,
    totalOrders,
    pendingOrders,
    toShipOrders,
    shippedOrders,
    outForDeliveryOrders,
    deliveredOrders,
    outOfStockProducts,
    lowStockProducts,
    totalRevenue: revenueData[0]?.total || 0,
    monthlyRevenue,
  });
};

// @route GET /api/admin/customers
exports.getCustomers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments({ role: 'customer' });
  const customers = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ customers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};
