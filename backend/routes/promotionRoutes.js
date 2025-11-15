const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/PromotionController');

router.get('/', promotionController.getAll.bind(promotionController));
router.get('/:id', promotionController.getById.bind(promotionController));
router.post('/', promotionController.create.bind(promotionController));
router.put('/:id', promotionController.update.bind(promotionController));
router.patch('/:id/toggle', promotionController.toggleActive.bind(promotionController));
router.delete('/:id', promotionController.delete.bind(promotionController));

module.exports = router;

