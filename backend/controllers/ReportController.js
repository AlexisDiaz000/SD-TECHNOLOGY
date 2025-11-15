const { v4: uuidv4 } = require('uuid');
const reportRepository = require('../repositories/ReportRepository');
const ReportFactory = require('../patterns/ReportFactory');
const Report = require('../models/Report');

/**
 * Controller para Reportes
 */
class ReportController {
  async getAll(req, res) {
    try {
      const reports = await reportRepository.findAll();
      res.json(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      res.status(500).json({ error: 'Error fetching reports' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const report = await reportRepository.findById(id);
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      
      res.json(report);
    } catch (err) {
      console.error('Error fetching report:', err);
      res.status(500).json({ error: 'Error fetching report' });
    }
  }

  async create(req, res) {
    try {
      const {
        title, type, description, period
      } = req.body;
      
      const id = uuidv4();
      const now = new Date();
      const report_date = now.toLocaleDateString('es-ES');
      
      // Usar Factory Method para crear el reporte según su tipo
      const reportData = await ReportFactory.createReport(type, {
        id,
        title,
        type,
        report_date,
        status: 'Completado',
        description,
        period: period || 'Actual'
      });
      
      const report = await reportRepository.create(reportData);
      res.status(201).json(report);
    } catch (err) {
      console.error('Error creating report:', err);
      res.status(500).json({ error: 'Error creating report' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const report = await reportRepository.delete(id);
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      
      res.json({ message: 'Report deleted successfully' });
    } catch (err) {
      console.error('Error deleting report:', err);
      res.status(500).json({ error: 'Error deleting report' });
    }
  }
}

module.exports = new ReportController();

