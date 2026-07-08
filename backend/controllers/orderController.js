const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route POST /api/orders
exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Validate all stock upfront before making any changes
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product)
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product.name}` });
      if (product.quantity < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.quantity -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: item.price,
        quantity: item.quantity,
      });
      totalAmount += item.price * item.quantity;
    }

    const initialStatus = paymentMethod === "DummyPay" ? "To Ship" : "Pending";
    const paymentStatus = paymentMethod === "DummyPay" ? "Paid" : "Pending";

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus: initialStatus,
      totalAmount,
      statusHistory: [{ status: initialStatus }],
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route GET /api/orders  (admin: all, customer: own)
exports.getOrders = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = req.user.role === "admin" ? {} : { user: req.user.id };
  if (status) query.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    orders,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

// @route GET /api/orders/:id
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  res.json(order);
};

// @route PUT /api/orders/:id/status  (admin only)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = status;
  if (status === "Delivered") order.paymentStatus = "Paid";
  order.statusHistory.push({ status });
  await order.save();

  const updatedOrder = await Order.findById(order._id).populate(
    "user",
    "name email",
  );
  res.json(updatedOrder);
};
