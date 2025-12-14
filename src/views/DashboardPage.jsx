import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Package, Megaphone, BarChart3, FileText } from 'lucide-react';
import SDLogo from '@/components/ui/SDLogo';
import { statisticsAPI } from '@/services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const statistics = await statisticsAPI.getDashboard();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    { id: 'admin', title: 'Admin', icon: User },
    { id: 'stock', title: 'Stock', icon: Package },
    { id: 'promo', title: 'Promo', icon: Megaphone },
    { id: 'sales', title: 'Sales', icon: BarChart3 },
    { id: 'report', title: 'Report', icon: FileText },
  ];

  const staticPositions = {
    admin: { top: '15%', left: '50%', transform: 'translate(-50%, -50%)' },
    stock: { top: '45%', left: '20%', transform: 'translate(-50%, -50%)' },
    report: { top: '45%', left: '80%', transform: 'translate(-50%, -50%)' },
    promo: { top: '70%', left: '35%', transform: 'translate(-50%, -50%)' },
    sales: { top: '70%', left: '65%', transform: 'translate(-50%, -50%)' },
  };

  // Diseño estático: sin flechas ni auto-rotación

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-bg-main relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <SDLogo className="w-12 h-12" />
        </div>
        
        <div className="flex items-center space-x-6">
          {stats && !loading && (
            <div className="hidden md:flex items-center space-x-4 text-white text-sm">
              <div className="text-center">
                <p className="font-semibold">{stats.totalProducts}</p>
                <p className="text-xs opacity-80">Productos</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{stats.totalSalesCount}</p>
                <p className="text-xs opacity-80">Ventas</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">
                  ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(stats.totalRevenue || 0)}
                </p>
                <p className="text-xs opacity-80">Ingresos</p>
              </div>
            </div>
          )}
          <motion.button
            onClick={handleLogout}
            className="text-white hover:text-white/80 transition-colors duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="logout-button"
          >
            log out
          </motion.button>
          
        </div>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-120px)]">
        
        {/* Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">
            SD TECHNOLOGY
          </h1>
          <p className="text-xl text-white/90">
            Efficiency, Control and Quality
          </p>
        </motion.div>

        

        <div className="relative w-full max-w-4xl h-96">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const pos = staticPositions[module.id];
            return (
              <motion.div
                key={module.id}
                className="absolute"
                style={pos}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  onClick={() => navigate(`/${module.id}`)}
                  className="flex flex-col items-center space-y-3 group cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`module-${module.id}`}
                >
                  <div className="w-20 h-20 bg-black/80 rounded-2xl flex items-center justify-center group-hover:bg-black transition-all duration-200 shadow-2xl">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-white font-medium text-lg group-hover:text-white/80 transition-colors duración-200">
                    {module.title}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
