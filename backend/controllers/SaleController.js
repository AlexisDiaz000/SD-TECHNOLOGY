const { v4: uuidv4 } = require('uuid');
const saleRepository = require('../repositories/SaleRepository');
const Sale = require('../models/Sale');

/**
 * Controller para Ventas
 */
class SaleController {
  async getAll(req, res) {
    try {
      const sales = await saleRepository.findAll();
      res.json(sales);
    } catch (err) {
      console.error('Error fetching sales:', err);
      res.status(500).json({ error: 'Error fetching sales' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const sale = await saleRepository.findById(id);
      
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      
      res.json(sale);
    } catch (err) {
      console.error('Error fetching sale:', err);
      res.status(500).json({ error: 'Error fetching sale' });
    }
  }

  async create(req, res) {
    try {
      const {
        product, quantity, price, total, ticket_number, client,
        payment_method, subtotal, tax, warranty, sale_date, sale_time
      } = req.body;
      
      const id = uuidv4();
      
      const saleData = {
        id,
        product,
        quantity,
        price,
        total,
        ticket_number,
        client,
        payment_method,
        subtotal,
        tax,
        warranty,
        sale_date,
        sale_time
      };
      
      const sale = await saleRepository.create(saleData);
      res.status(201).json(sale);
    } catch (err) {
      console.error('Error creating sale:', err);
      res.status(500).json({ error: 'Error creating sale' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const sale = await saleRepository.delete(id);
      
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      
      res.json({ message: 'Sale deleted successfully' });
    } catch (err) {
      console.error('Error deleting sale:', err);
      res.status(500).json({ error: 'Error deleting sale' });
    }
  }
}

module.exports = new SaleController();

