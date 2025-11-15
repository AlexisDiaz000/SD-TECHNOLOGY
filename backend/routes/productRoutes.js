const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

router.get('/', productController.getAll.bind(productController));
router.get('/low-stock/alert', productController.getLowStock.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.post('/', productController.create.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

module.exports = router;

