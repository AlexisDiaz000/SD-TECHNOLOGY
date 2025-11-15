import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import SDLogo from '@/components/ui/SDLogo';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg-main relative overflow-hidden font-poppins">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 flex justify-between items-center p-4 md:p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <SDLogo className="w-12 h-12 md:w-16 md:h-16" />
        </div>
        
        <motion.button
          onClick={() => navigate('/register')}
          className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">Inicio</span>
          <User className="w-5 h-5" />
        </motion.button>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <motion.div 
          className="flex-1 max-w-2xl text-center lg:text-left mb-10 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bienvenido a SD Technology
          </motion.h1>
          
          <motion.div 
            className="space-y-4 md:space-y-6 text-white text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p>
              En un mundo donde la eficiencia marca la diferencia, SD Technology 
              nace como una solución digital inteligente diseñada para 
              transformar la manera en que gestionas tu inventario. Nuestra 
              plataforma permite a los gestores supervisar existencias en tiempo 
              real, identificar los productos de mayor rotación y anticiparse a los 
              cambios de stock antes de que impacten la operación.
            </p>
            
            <p>
              Con SD Technology, simplificas procesos, tomas decisiones basadas 
              en datos y mantienes el control total de tu inventario desde 
              cualquier lugar. Optimiza tu negocio con tecnología diseñada para 
              crecer contigo.
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative illustration */}
        <motion.div 
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <motion.div 
              className="w-64 h-64 md:w-80 md:h-80 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-4 border-2 border-white/30 rounded-full"></div>
              <div className="absolute inset-8 border border-white/40 rounded-full"></div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <SDLogo className="w-16 h-16 md:w-24 md:h-24" />
              </div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full pulse-animation"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full pulse-animation" style={{ animationDelay: '1s' }}></div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full pulse-animation" style={{ animationDelay: '2s' }}></div>
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full pulse-animation" style={{ animationDelay: '3s' }}></div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 md:h-2 bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.div 
          className="h-full bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3, delay: 1.5 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;