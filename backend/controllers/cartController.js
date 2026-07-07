const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route GET /api/cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name images price quantity status');
  res.json(cart || { items: [] });
};

// @route POST /api/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const existingItem = cart.items.find((i) => i.product.toString() === productId);

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (product.quantity < newQty) return res.status(400).json({ message: 'Insufficient stock' });
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price quantity status');
  res.json(cart);
};

// @route PUT /api/cart/:itemId
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const product = await Product.findById(item.product);
  if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name images price quantity status');
  res.json(cart);
};

// @route DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  await cart.populate('items.product', 'name images price quantity status');
  res.json(cart);
};

// @route DELETE /api/cart
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.json({ message: 'Cart cleared' });
};
