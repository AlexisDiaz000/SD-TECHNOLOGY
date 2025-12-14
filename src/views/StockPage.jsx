import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, AlertTriangle } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { productAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    price: 0,
    min_stock: 0,
    category: '',
    supplier: ''
  });
  const [priceDisplay, setPriceDisplay] = useState('0');

  const formatCurrencyCOP = (value) => {
    try {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number.isFinite(value) ? value : 0);
    } catch {
      return `$${(value ?? 0).toFixed(0)}`;
    }
  };

  const formatNumberEsCO = (value) => {
    try {
      return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number.isFinite(value) ? value : 0);
    } catch {
      return (value ?? 0).toFixed(0);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await productAPI.getAll();
      setStocks(products);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      name: stock.name,
      amount: stock.amount,
      price: stock.price,
      min_stock: stock.min_stock,
      category: stock.category,
      supplier: stock.supplier || ''
    });
    setPriceDisplay(formatNumberEsCO(stock.price ?? 0));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productAPI.delete(id);
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        });
        loadProducts();
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "No se pudo eliminar el producto",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.amount < 0 || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingStock) {
        await productAPI.update(editingStock.id, formData);
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
        });
      } else {
        await productAPI.create(formData);
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        });
      }
      setShowModal(false);
      setEditingStock(null);
      setFormData({ name: '', amount: 0, price: 0, min_stock: 0, category: '', supplier: '' });
      loadProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive"
      });
    }
  };

  const openNewModal = () => {
    setEditingStock(null);
    setFormData({ name: '', amount: 0, price: 0, min_stock: 0, category: '', supplier: '' });
    setPriceDisplay('0');
    setShowModal(true);
  };

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stocks.filter(s => s.amount < s.min_stock);

  return (
    <ModuleLayout title="Stock" showSearch={false}>
      <div className="space-y-4">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <motion.div
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            data-testid="low-stock-alert"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ {lowStockItems.length} producto(s) con stock bajo: {lowStockItems.map(s => s.name).join(', ')}
              </p>
            </div>
          </motion.div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-gray-700"
              data-testid="stock-search-input"
            />
          </div>
          <Button
            onClick={openNewModal}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            data-testid="new-stock-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        {/* Stock Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-600">Cargando productos...</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proveedor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock, index) => (
                <motion.tr
                  key={stock.id}
                  className={`border-b border-gray-200 hover:bg-pink-50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } ${stock.amount < stock.minStock ? 'bg-yellow-50' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`stock-row-${stock.id}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{stock.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{stock.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      stock.amount < stock.min_stock ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stock.amount} {stock.amount < stock.min_stock && '⚠️'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrencyCOP(stock.price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{stock.supplier}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(stock)}
                        className="text-blue-600 hover:text-blue-700"
                        data-testid={`edit-stock-${stock.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(stock.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-stock-${stock.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="stock-modal"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingStock ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="stock-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="stock-category-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      data-testid="stock-amount-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.min_stock}
                      onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      data-testid="stock-min-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      const trimmed = raw.replace(/^0+(?=\d)/, '');
                      const value = trimmed === '' ? 0 : parseInt(trimmed, 10);
                      setPriceDisplay(formatNumberEsCO(value));
                      setFormData({ ...formData, price: value });
                    }}
                    onBlur={() => {
                      const value = typeof formData.price === 'number' ? formData.price : 0;
                      setPriceDisplay(formatNumberEsCO(value));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="stock-price-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="stock-supplier-input"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                    data-testid="save-stock-button"
                  >
                    {editingStock ? 'Actualizar' : 'Crear'}
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

export default StockPage;
