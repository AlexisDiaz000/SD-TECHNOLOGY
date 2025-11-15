/**
 * Modelo de Venta
 */
class Sale {
  constructor(data) {
    this.id = data.id;
    this.product = data.product;
    this.quantity = data.quantity;
    this.price = data.price;
    this.total = data.total;
    this.ticket_number = data.ticket_number;
    this.client = data.client;
    this.payment_method = data.payment_method;
    this.subtotal = data.subtotal;
    this.tax = data.tax;
    this.warranty = data.warranty;
    this.sale_date = data.sale_date;
    this.sale_time = data.sale_time;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      product: this.product,
      quantity: this.quantity,
      price: this.price,
      total: this.total,
      ticket_number: this.ticket_number,
      client: this.client,
      payment_method: this.payment_method,
      subtotal: this.subtotal,
      tax: this.tax,
      warranty: this.warranty,
      sale_date: this.sale_date,
      sale_time: this.sale_time,
      created_at: this.created_at
    };
  }
}

module.exports = Sale;

