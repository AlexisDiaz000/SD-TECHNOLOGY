const { v4: uuidv4 } = require('uuid');
const productRepository = require('../repositories/ProductRepository');
const Product = require('../models/Product');
const NotificationService = require('../services/NotificationService');

/**
 * Controller para Productos
 */
class ProductController {
  async getAll(req, res) {
    try {
      const products = await productRepository.findAll();
      res.json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error fetching products' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productRepository.findById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  async create(req, res) {
    try {
      const { name, category, amount, price, min_stock, supplier } = req.body;
      const id = uuidv4();
      
      const productData = {
        id,
        name,
        category,
        amount,
        price,
        min_stock,
        supplier
      };
      
      const product = await productRepository.create(productData);
      
      // Notificar si el stock es bajo
      const productModel = new Product(product);
      if (productModel.isLowStock()) {
        NotificationService.notifyLowStock(productModel);
      }
      
      res.status(201).json(product);
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, category, amount, price, min_stock, supplier } = req.body;
      
      const productData = {
        name,
        category,
        amount,
        price,
        min_stock,
        supplier
      };
      
      const product = await productRepository.update(id, productData);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Notificar si el stock es bajo
      const productModel = new Product(product);
      if (productModel.isLowStock()) {
        NotificationService.notifyLowStock(productModel);
      }
      
      res.json(product);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await productRepository.delete(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async getLowStock(req, res) {
    try {
      const products = await productRepository.findLowStock();
      res.json(products);
    } catch (err) {
      console.error('Error fetching low stock products:', err);
      res.status(500).json({ error: 'Error fetching low stock products' });
    }
  }
}

module.exports = new ProductController();

