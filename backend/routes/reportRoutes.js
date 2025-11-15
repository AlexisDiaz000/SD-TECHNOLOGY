const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');

router.get('/', reportController.getAll.bind(reportController));
router.get('/:id', reportController.getById.bind(reportController));
router.post('/', reportController.create.bind(reportController));
router.delete('/:id', reportController.delete.bind(reportController));

module.exports = router;

