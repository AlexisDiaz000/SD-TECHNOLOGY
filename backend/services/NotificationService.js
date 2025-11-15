const Observer = require('../patterns/Observer');

/**
 * Servicio de Notificaciones usando Observer Pattern
 * Maneja notificaciones automáticas para cambios en inventario y promociones
 */
class NotificationService {
  constructor() {
    this.observer = new Observer();
    this.setupObservers();
  }

  setupObservers() {
    // Observador para notificaciones de stock bajo
    this.observer.subscribe({
      onLowStock: (product) => {
        console.log(`⚠️ ALERTA: Stock bajo para ${product.name}. Cantidad actual: ${product.amount}, Mínimo: ${product.min_stock}`);
        // Aquí se podría integrar con un sistema de notificaciones real
        // como email, SMS, push notifications, etc.
      }
    });

    // Observador para notificaciones de promociones
    this.observer.subscribe({
      onPromotionActivated: (promotion) => {
        console.log(`🎉 PROMOCIÓN ACTIVADA: ${promotion.name} - ${promotion.discount}% de descuento`);
        // Aquí se podría notificar a los clientes sobre la nueva promoción
      }
    });
  }

  notifyLowStock(product) {
    this.observer.notify('onLowStock', product);
  }

  notifyPromotionActivated(promotion) {
    this.observer.notify('onPromotionActivated', promotion);
  }

  // Método para agregar observadores personalizados
  addObserver(observer) {
    this.observer.subscribe(observer);
  }
}

module.exports = new NotificationService();

