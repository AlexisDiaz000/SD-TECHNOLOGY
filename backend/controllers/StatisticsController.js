const statisticsRepository = require('../repositories/StatisticsRepository');

/**
 * Controller para Estadísticas
 */
class StatisticsController {
  async getDashboard(req, res) {
    try {
      const stats = await statisticsRepository.getDashboardStats();
      res.json(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      res.status(500).json({ error: 'Error fetching statistics' });
    }
  }
}

module.exports = new StatisticsController();

