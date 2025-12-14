import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Download, Search, X, FileText, TrendingUp, Package, Tag } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { reportAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'Ventas',
    description: '',
    period: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsData = await reportAPI.getAll();
      setReports(reportsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleGenerateReport = async () => {
    if (!newReport.title || !newReport.type) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    try {
      await reportAPI.create(newReport);
      toast({
        title: "Éxito",
        description: "Reporte generado correctamente",
      });
      setShowNewReportModal(false);
      setNewReport({ title: '', type: 'Ventas', description: '', period: '' });
      loadReports();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo generar el reporte",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (report) => {
    const revenue = Number(report.revenue || 0).toFixed(0);
    const totalDiscount = Number(report.total_discount || 0).toFixed(0);
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${report.title}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { font-size: 24px; margin: 0 0 8px; }
          .subtitle { font-size: 12px; color: #6B7280; margin-bottom: 16px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
          .card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; }
          .label { font-size: 12px; color: #6B7280; margin: 0 0 4px; }
          .value { font-size: 16px; font-weight: 600; margin: 0; }
          .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
          .tag-ventas { background: #DBEAFE; color: #1E40AF; }
          .tag-stock { background: #EDE9FE; color: #5B21B6; }
          .tag-promo { background: #FFEDD5; color: #9A3412; }
          .tag-default { background: #F3F4F6; color: #1F2937; }
          .section { margin-top: 16px; }
          .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
          @page { size: A4; margin: 16mm; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <div class="subtitle">Generado el ${report.report_date || ''}</div>
        <div>
          <span class="tag ${report.type === 'Ventas' ? 'tag-ventas' : report.type === 'Stock' ? 'tag-stock' : report.type === 'Promo' ? 'tag-promo' : 'tag-default'}">${report.type}</span>
          <span class="tag ${report.status === 'Completado' ? 'tag-default' : 'tag-default'}" style="margin-left:8px">${report.status}</span>
        </div>
        <div class="grid">
          <div class="card">
            <p class="label">Período</p>
            <p class="value">${report.period || ''}</p>
          </div>
          <div class="card">
            <p class="label">Fecha</p>
            <p class="value">${report.report_date || ''}</p>
          </div>
        </div>
        <div class="section">
          <div class="title">Detalles</div>
          <div class="card">
            <p class="label">Descripción</p>
            <p class="value" style="font-weight:500">${report.description || ''}</p>
          </div>
        </div>
        ${report.type === 'Ventas' ? `
          <div class="grid" style="margin-top:12px">
            <div class="card">
              <p class="label">Total de Ventas</p>
              <p class="value">${report.total_sales ?? ''}</p>
            </div>
            <div class="card">
              <p class="label">Ingresos</p>
              <p class="value">$${revenue}</p>
            </div>
          </div>
        ` : ''}
        ${report.type === 'Promo' ? `
          <div class="grid" style="margin-top:12px">
            <div class="card">
              <p class="label">Promociones Activas</p>
              <p class="value">${report.active_promos ?? ''}</p>
            </div>
            <div class="card">
              <p class="label">Descuento Total</p>
              <p class="value">$${totalDiscount}</p>
            </div>
          </div>
        ` : ''}
        ${report.type === 'Stock' ? `
          <div class="grid" style="margin-top:12px">
            <div class="card">
              <p class="label">Total de Productos</p>
              <p class="value">${report.total_products ?? ''}</p>
            </div>
            <div class="card">
              <p class="label">Stock Bajo</p>
              <p class="value">${report.low_stock_items ?? ''}</p>
            </div>
          </div>
        ` : ''}
      </body>
    </html>`;
    const win = window.open('', '_blank');
    if (!win) {
      toast({
        title: "Error",
        description: "No se pudo abrir la ventana de impresión",
        variant: "destructive"
      });
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
    toast({
      title: "Éxito",
      description: "Usa 'Guardar como PDF' para descargar el reporte",
    });
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReportIcon = (type) => {
    switch(type) {
      case 'Ventas': return <TrendingUp className="w-5 h-5" />;
      case 'Stock': return <Package className="w-5 h-5" />;
      case 'Promo': return <Tag className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Ventas': return 'bg-blue-100 text-blue-800';
      case 'Stock': return 'bg-purple-100 text-purple-800';
      case 'Promo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModuleLayout title="Report" showSearch={false}>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-gray-700"
              data-testid="report-search-input"
            />
          </div>
          <Button
            onClick={() => setShowNewReportModal(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            data-testid="new-report-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </div>

        {/* Reports Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <p className="text-gray-600">Cargando reportes...</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Título del Reporte</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  className={`border-b border-gray-200 hover:bg-pink-50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`report-row-${report.id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-pink-100 rounded-lg mr-3 text-pink-600">
                        {getReportIcon(report.type)}
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.report_date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'Completado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(report)}
                        className="text-blue-600 hover:text-blue-700"
                        data-testid={`view-report-detail-${report.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(report)}
                        className="text-green-600 hover:text-green-700"
                        data-testid={`download-report-${report.id}`}
                      >
                        <Download className="w-4 h-4" />
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

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedReport && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="report-detail-modal"
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-3 text-white">
                    {getReportIcon(selectedReport.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedReport.title}</h2>
                    <p className="text-sm text-gray-500">Generado el {selectedReport.report_date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tipo de Reporte:</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedReport.type)}`}>
                      {selectedReport.type}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Estado:</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.status === 'Completado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Período:</p>
                  <p className="font-semibold text-gray-800">{selectedReport.period}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Descripción:</p>
                  <p className="text-gray-800">{selectedReport.description}</p>
                </div>

                {selectedReport.type === 'Ventas' && selectedReport.total_sales !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 mb-1">Total de Ventas:</p>
                      <p className="text-2xl font-bold text-blue-700">{selectedReport.total_sales}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 mb-1">Ingresos:</p>
                      <p className="text-2xl font-bold text-green-700">
                        ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedReport.revenue || 0))}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReport.type === 'Stock' && selectedReport.total_products !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 mb-1">Total de Productos:</p>
                      <p className="text-2xl font-bold text-purple-700">{selectedReport.total_products}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-red-600 mb-1">Stock Bajo:</p>
                      <p className="text-2xl font-bold text-red-700">{selectedReport.low_stock_items}</p>
                    </div>
                  </div>
                )}

                {selectedReport.type === 'Promo' && selectedReport.active_promos !== null && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-600 mb-1">Promociones Activas:</p>
                      <p className="text-2xl font-bold text-orange-700">{selectedReport.active_promos}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                      <p className="text-sm text-pink-600 mb-1">Descuento Total:</p>
                      <p className="text-2xl font-bold text-pink-700">
                        ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(selectedReport.total_discount || 0))}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={() => handleDownload(selectedReport)}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Report Modal */}
      <AnimatePresence>
        {showNewReportModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewReportModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="new-report-modal"
            >
              <button
                onClick={() => setShowNewReportModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">Generar Nuevo Reporte</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título del Reporte</label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ej: Reporte Mensual de Ventas"
                    data-testid="new-report-title-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    data-testid="new-report-type-select"
                  >
                    <option value="Ventas">Ventas</option>
                    <option value="Stock">Stock</option>
                    <option value="Promo">Promo</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <input
                    type="text"
                    value={newReport.period}
                    onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ej: 01/01/25 - 31/01/25"
                    data-testid="new-report-period-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Descripción del reporte..."
                    data-testid="new-report-description-input"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => setShowNewReportModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateReport}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                    data-testid="generate-report-button"
                  >
                    Generar Reporte
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

export default ReportPage;
