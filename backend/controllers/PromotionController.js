const { v4: uuidv4 } = require('uuid');
const promotionRepository = require('../repositories/PromotionRepository');
const Promotion = require('../models/Promotion');
const NotificationService = require('../services/NotificationService');

/**
 * Controller para Promociones
 */
class PromotionController {
  async getAll(req, res) {
    try {
      const promotions = await promotionRepository.findAll();
      res.json(promotions);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      res.status(500).json({ error: 'Error fetching promotions' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const promotion = await promotionRepository.findById(id);
      
      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      
      res.json(promotion);
    } catch (err) {
      console.error('Error fetching promotion:', err);
      res.status(500).json({ error: 'Error fetching promotion' });
    }
  }

  async create(req, res) {
    try {
      const {
        name, discount, active, start_date, end_date,
        description, applicable_categories
      } = req.body;
      
      const id = uuidv4();
      
      const promotionData = {
        id,
        name,
        discount,
        active: active !== undefined ? active : true,
        start_date,
        end_date,
        description,
        applicable_categories
      };
      
      const promotion = await promotionRepository.create(promotionData);
      
      // Notificar si la promoción está activa
      const promotionModel = new Promotion(promotion);
      if (promotionModel.isActive()) {
        NotificationService.notifyPromotionActivated(promotionModel);
      }
      
      res.status(201).json(promotion);
    } catch (err) {
      console.error('Error creating promotion:', err);
      res.status(500).json({ error: 'Error creating promotion' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name, discount, active, start_date, end_date,
        description, applicable_categories
      } = req.body;
      
      const promotionData = {
        name,
        discount,
        active,
        start_date,
        end_date,
        description,
        applicable_categories
      };
      
      const promotion = await promotionRepository.update(id, promotionData);
      
      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      
      // Notificar cambios en promoción
      const promotionModel = new Promotion(promotion);
      if (promotionModel.isActive()) {
        NotificationService.notifyPromotionActivated(promotionModel);
      }
      
      res.json(promotion);
    } catch (err) {
      console.error('Error updating promotion:', err);
      res.status(500).json({ error: 'Error updating promotion' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const promotion = await promotionRepository.delete(id);
      
      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      
      res.json({ message: 'Promotion deleted successfully' });
    } catch (err) {
      console.error('Error deleting promotion:', err);
      res.status(500).json({ error: 'Error deleting promotion' });
    }
  }

  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const promotion = await promotionRepository.toggleActive(id);
      
      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      
      // Notificar cambio de estado
      const promotionModel = new Promotion(promotion);
      if (promotionModel.isActive()) {
        NotificationService.notifyPromotionActivated(promotionModel);
      }
      
      res.json(promotion);
    } catch (err) {
      console.error('Error toggling promotion:', err);
      res.status(500).json({ error: 'Error toggling promotion' });
    }
  }
}

module.exports = new PromotionController();

