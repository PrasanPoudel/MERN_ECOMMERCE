const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// @desc  Register customer
// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  const token = generateToken(user._id, user.role);
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc  Get profile
// @route GET /api/auth/profile
exports.getProfile = async (req, res) => {
  if (req.user.role === "admin") {
    return res.json({
      _id: "admin",
      name: req.user?.name || "Admin",
      email: req.user?.email,
      role: "admin",
      addresses: [],
    });
  }
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// @desc  Update profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  if (req.user.role === "admin")
    return res
      .status(403)
      .json({ message: "Cannot update admin profile here" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, password } = req.body;
  if (name) user.name = name;
  if (password) user.password = password;

  await user.save();
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// @desc  Delete current customer account
// @route DELETE /api/auth/account
exports.deleteAccount = async (req, res) => {
  if (req.user.role === "admin") {
    return res
      .status(403)
      .json({ message: "Admin accounts cannot be deleted here" });
  }

  const { email } = req.body || {};
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!email || email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return res
      .status(400)
      .json({ message: "Please enter your email to confirm account deletion" });
  }

  await Promise.all([
    Cart.deleteOne({ user: user._id }),
    Order.deleteMany({ user: user._id }),
    User.findByIdAndDelete(user._id),
  ]);

  res.json({ message: "Account deleted" });
};

// @desc  Add/update address
// @route POST /api/auth/address
exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const {
    label,
    province,
    district,
    municipality,
    wardNo,
    town,
    landmark,
    isDefault,
  } = req.body;

  if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));

  user.addresses.push({
    label,
    province,
    district,
    municipality,
    wardNo,
    town,
    landmark,
    isDefault: Boolean(isDefault),
  });
  await user.save();
  res.status(201).json(user.addresses);
};

// @desc  Delete address
// @route DELETE /api/auth/address/:id
exports.deleteAddress = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.id,
  );
  await user.save();
  res.json(user.addresses);
};
