const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { upload } = require('../middleware/multer.middleware');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', protect, getProducts);
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;