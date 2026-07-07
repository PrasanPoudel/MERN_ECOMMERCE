const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @route GET /api/products
exports.getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, availability, sort, page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  const priceFilter = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length) query.price = priceFilter;
  if (availability === 'inStock') query.quantity = { $gt: 0 };
  if (availability === 'outOfStock') query.quantity = 0;

  const sortOptions = {
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    newest: { createdAt: -1 },
    bestSelling: { sold: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// @route GET /api/products/:id
exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @route POST /api/products
exports.createProduct = async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  const images = req.files ? req.files.map((f) => ({ url: f.path, public_id: f.filename })) : [];

  const product = await Product.create({ name, description, price, quantity, category, images });
  await product.populate('category', 'name');
  res.status(201).json(product);
};

// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { name, description, price, quantity, category, removeImages } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (category) product.category = category;

  // Remove selected images from Cloudinary
  if (removeImages) {
    const toRemove = JSON.parse(removeImages);
    for (const pid of toRemove) {
      await cloudinary.uploader.destroy(pid);
    }
    product.images = product.images.filter((img) => !toRemove.includes(img.public_id));
  }

  // Add new images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
    product.images.push(...newImages);
  }

  await product.save();
  await product.populate('category', 'name');
  res.json(product);
};

// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};
