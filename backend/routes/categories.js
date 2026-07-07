const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

const multer = require('multer');
const memUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getCategories);
router.post('/', protect, adminOnly, memUpload.single('image'), createCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
