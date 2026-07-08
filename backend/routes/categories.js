const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly, notForDemoAdmin } = require('../middleware/auth');

const multer = require('multer');
const memUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getCategories);
router.post('/', protect, adminOnly, notForDemoAdmin, memUpload.single('image'), createCategory);
router.delete('/:id', protect, adminOnly, notForDemoAdmin, deleteCategory);

module.exports = router;
