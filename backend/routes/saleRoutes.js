const express = require('express');
const router = express.Router();
const saleController = require('../controllers/SaleController');

router.get('/', saleController.getAll.bind(saleController));
router.get('/:id', saleController.getById.bind(saleController));
router.post('/', saleController.create.bind(saleController));
router.delete('/:id', saleController.delete.bind(saleController));

module.exports = router;

