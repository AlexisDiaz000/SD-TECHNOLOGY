/**
 * Modelo de Producto
 */
class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.amount = data.amount;
    this.price = data.price;
    this.min_stock = data.min_stock;
    this.supplier = data.supplier;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  isLowStock() {
    return this.amount < this.min_stock;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      amount: this.amount,
      price: this.price,
      min_stock: this.min_stock,
      supplier: this.supplier,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Product;

