// En NotificationService.js - Esto es CAJA BLANCA
// Se ve la IMPLEMENTACIÓN INTERNA

class NotificationService {
    sendLowStockAlert(product, currentStock, minStock) {
        // Camino 1: Stock crítico (menos de 10%)
        if (currentStock < minStock * 0.1) {
            return this.sendCriticalAlert(product, currentStock);
        }
        // Camino 2: Stock bajo (menos de 30%)  
        else if (currentStock < minStock * 0.3) {
            return this.sendWarningAlert(product, currentStock);
        }
        // Camino 3: Stock normal
        else {
            return null; // No enviar notificación
        }
    }
}