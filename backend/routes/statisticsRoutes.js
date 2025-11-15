const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/StatisticsController');

router.get('/dashboard', statisticsController.getDashboard.bind(statisticsController));

module.exports = router;

