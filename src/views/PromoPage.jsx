import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Tag, Power, PowerOff } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { promotionAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const PromoPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    discount: 0,
    active: true,
    start_date: '',
    end_date: '',
    description: '',
    applicable_categories: ''
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const promotions = await promotionAPI.getAll();
      setPromos(promotions);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las promociones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name,
      discount: promo.discount,
      active: promo.active,
      start_date: promo.start_date,
      end_date: promo.end_date,
      description: promo.description || '',
      applicable_categories: promo.applicable_categories || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta promoción?')) {
      try {
        await promotionAPI.delete(id);
        toast({
          title: "Éxito",
          description: "Promoción eliminada correctamente",
        });
        loadPromotions();
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "No se pudo eliminar la promoción",
          variant: "destructive"
        });
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      await promotionAPI.toggleActive(id);
      toast({
        title: "Éxito",
        description: "Estado de promoción actualizado",
      });
      loadPromotions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.discount <= 0 || !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingPromo) {
        await promotionAPI.update(editingPromo.id, formData);
        toast({
          title: "Éxito",
          description: "Promoción actualizada correctamente",
        });
      } else {
        await promotionAPI.create(formData);
        toast({
          title: "Éxito",
          description: "Promoción creada correctamente",
        });
      }
      setShowModal(false);
      setEditingPromo(null);
      setFormData({ name: '', discount: 0, active: true, start_date: '', end_date: '', description: '', applicable_categories: '' });
      loadPromotions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la promoción",
        variant: "destructive"
      });
    }
  };

  const openNewModal = () => {
    setEditingPromo(null);
    setFormData({ name: '', discount: 0, active: true, start_date: '', end_date: '', description: '', applicable_categories: '' });
    setShowModal(true);
  };

  const handleViewDetail = (promo) => {
    setSelectedPromo(promo);
    setShowDetailModal(true);
  };

  const filteredPromos = promos.filter(promo => 
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout title="Promo" showSearch={false}>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar promociones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-gray-700"
              data-testid="promo-search-input"
            />
          </div>
          <Button
            onClick={openNewModal}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            data-testid="new-promo-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>

        {/* Promos Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-600">Cargando promociones...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromos.map((promo, index) => (
            <motion.div
              key={promo.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`promo-card-${promo.id}`}
            >
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white relative">
                <div className="flex justify-between items-start">
                  <div>
                    <Tag className="w-6 h-6 mb-2" />
                    <h3 className="text-xl font-bold">{promo.name}</h3>
                    <p className="text-3xl font-bold mt-2">{promo.discount}% OFF</p>
                  </div>
                  <button
                    onClick={() => toggleActive(promo.id)}
                    className={`p-2 rounded-full transition-all ${
                      promo.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                    data-testid={`toggle-promo-${promo.id}`}
                  >
                    {promo.active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Estado</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promo.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Vigencia</p>
                  <p className="text-sm text-gray-700">{promo.start_date} - {promo.end_date}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Categorías</p>
                  <p className="text-sm text-gray-700">{promo.applicable_categories}</p>
                </div>

                <div className="flex space-x-2 pt-3 border-t">
                  <button
                    onClick={() => handleViewDetail(promo)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                    data-testid={`view-promo-detail-${promo.id}`}
                  >
                    Ver Detalle
                  </button>
                  <button
                    onClick={() => handleEdit(promo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    data-testid={`edit-promo-${promo.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    data-testid={`delete-promo-${promo.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPromo && (
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
              data-testid="promo-detail-modal"
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mb-4">
                  <Tag className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedPromo.name}</h2>
                <p className="text-4xl font-bold text-pink-600 mt-2">{selectedPromo.discount}% OFF</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estado:</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedPromo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPromo.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Período de Vigencia:</p>
                  <p className="font-semibold text-gray-800">{selectedPromo.start_date} - {selectedPromo.end_date}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Categorías Aplicables:</p>
                  <p className="font-semibold text-gray-800">{selectedPromo.applicable_categories}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Descripción:</p>
                  <p className="text-gray-800">{selectedPromo.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="promo-modal"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingPromo ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Promoción</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="promo-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="promo-discount-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                    <input
                      type="text"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      placeholder="DD/MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      data-testid="promo-start-date-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                    <input
                      type="text"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      placeholder="DD/MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      data-testid="promo-end-date-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorías Aplicables</label>
                  <input
                    type="text"
                    value={formData.applicable_categories}
                    onChange={(e) => setFormData({ ...formData, applicable_categories: e.target.value })}
                    placeholder="Ej: Laptops, Monitores"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="promo-categories-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="promo-description-input"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                    data-testid="promo-active-checkbox"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Promoción activa
                  </label>
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
                    data-testid="save-promo-button"
                  >
                    {editingPromo ? 'Actualizar' : 'Crear'}
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

export default PromoPage;
