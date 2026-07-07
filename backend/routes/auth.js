const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  addAddress,
  deleteAddress,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);
router.post("/address", protect, addAddress);
router.delete("/address/:id", protect, deleteAddress);

module.exports = router;
