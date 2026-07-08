const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly, notForDemoAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, notForDemoAdmin, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, notForDemoAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, notForDemoAdmin, deleteProduct);

module.exports = router;
