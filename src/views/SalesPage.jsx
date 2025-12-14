import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Search, X } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { saleAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newSale, setNewSale] = useState({
    product: '',
    quantity: 1,
    price: 0,
    client: '',
    payment_method: 'Efectivo'
  });

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const salesData = await saleAPI.getAll();
      setSales(salesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const handleCreateSale = async () => {
    if (!newSale.product || newSale.quantity < 1 || newSale.price <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const now = new Date();
      const total = newSale.quantity * newSale.price;
      const tax = total * 0.0625;
      const subtotal = total + tax;
      const warrantyDate = new Date(now);
      warrantyDate.setFullYear(warrantyDate.getFullYear() + 1);

      const saleData = {
        product: newSale.product,
        quantity: newSale.quantity,
        price: newSale.price,
        total: total,
        ticket_number: `TICKET-${Math.floor(1000 + Math.random() * 9000)}-${String(sales.length + 1).padStart(3, '0')}`,
        client: newSale.client,
        payment_method: newSale.payment_method,
        subtotal: subtotal,
        tax: tax,
        warranty: `12 Meses (Válido Hasta ${warrantyDate.toLocaleDateString('es-ES')})`,
        sale_date: now.toLocaleDateString('es-ES'),
        sale_time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };

      await saleAPI.create(saleData);
      toast({
        title: "Éxito",
        description: "Venta creada correctamente",
      });
      setShowNewSaleModal(false);
      setNewSale({ product: '', quantity: 1, price: 0, client: '', payment_method: 'Efectivo' });
      loadSales();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la venta",
        variant: "destructive"
      });
    }
  };

  const filteredSales = sales.filter(sale => 
    sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout title="Sales" showSearch={false}>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por producto o ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-gray-700"
              data-testid="sales-search-input"
            />
          </div>
          <Button
            onClick={() => setShowNewSaleModal(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            data-testid="new-sale-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Venta
          </Button>
        </div>

        {/* Sales Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-600">Cargando ventas...</p>
          </div>
        ) : (
        <motion.div
          className="bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">Ticket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Cantidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha/Hora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  className={`border-b border-gray-200 hover:bg-pink-50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`sale-row-${sale.id}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.ticket_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold text-pink-600">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(sale.total || 0))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.sale_date} {sale.sale_time}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetail(sale)}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center"
                      data-testid={`view-sale-detail-${sale.id}`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalle
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        )}
      </div>

      {/* Detail Modal - Ticket View */}
      <AnimatePresence>
        {showDetailModal && selectedSale && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="sale-detail-modal"
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                data-testid="close-detail-modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">TICKET DE VENTA</h2>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <span className="text-sm">📊</span>
                  <span className="text-sm">TICKETS</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Fecha / Hora:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.sale_date} - {selectedSale.sale_time}</p>
                </div>

                <div>
                  <p className="text-gray-600">N Ticket:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.ticket_number}</p>
                </div>

                <div>
                  <p className="text-gray-600">Cliente:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.client}</p>
                </div>

                <div>
                  <p className="text-gray-600">Método de Pago:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.payment_method}</p>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-600">Producto Vendido:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.product}</p>
                </div>

                <div>
                  <p className="text-gray-600">Cantidad:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.quantity}</p>
                </div>

                <div>
                  <p className="text-gray-600">Precio Unitario:</p>
                  <p className="font-semibold text-pink-600">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedSale.price || 0))}
                  </p>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-600">Subtotal:</p>
                  <p className="font-semibold text-gray-800">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedSale.subtotal || 0))}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Impuestos (6.25%):</p>
                  <p className="font-semibold text-gray-800">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedSale.tax || 0))}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Garantía:</p>
                  <p className="font-semibold text-gray-800">{selectedSale.warranty}</p>
                </div>

                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <p className="text-gray-600">Total Pago:</p>
                  <p className="font-bold text-2xl text-pink-600">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedSale.total || 0))}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Sale Modal */}
      <AnimatePresence>
        {showNewSaleModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewSaleModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="new-sale-modal"
            >
              <button
                onClick={() => setShowNewSaleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva Venta</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <input
                    type="text"
                    value={newSale.product}
                    onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nombre del producto"
                    data-testid="new-sale-product-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({ ...newSale, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="new-sale-quantity-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newSale.price}
                    onChange={(e) => setNewSale({ ...newSale, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="new-sale-price-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={newSale.client}
                    onChange={(e) => setNewSale({ ...newSale, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nombre y DNI del cliente"
                    data-testid="new-sale-client-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                  <select
                    value={newSale.payment_method}
                    onChange={(e) => setNewSale({ ...newSale, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="new-sale-payment-select"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta Visa">Tarjeta Visa</option>
                    <option value="Tarjeta Mastercard">Tarjeta Mastercard</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total a pagar:</p>
                  <p className="text-2xl font-bold text-pink-600">
                    ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number((newSale.quantity || 0) * (newSale.price || 0)))}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => setShowNewSaleModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateSale}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                    data-testid="create-sale-button"
                  >
                    Crear Venta
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModuleLayout>
  );
};

export default SalesPage;
