import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import SDLogo from '@/components/ui/SDLogo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      toast({
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen gradient-bg-auth relative overflow-hidden font-poppins">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-4xl lg:max-w-6xl flex flex-col lg:flex-row items-center justify-center">
          
          <motion.div 
            className="hidden lg:flex flex-1 items-center justify-center mb-8 lg:mb-0 lg:mr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <SDLogo className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <motion.button
                  onClick={() => navigate('/register')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="text-center mb-6 md:mb-8">
                <motion.div 
                  className="mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <SDLogo className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
                </motion.div>
                
                <motion.h1 
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  ¡Welcome!
                </motion.h1>
              </div>

              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Email address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu email"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu contraseña"
                      className="w-full pr-10 md:pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                    <span className="hidden md:block absolute right-10 md:right-12 top-1/2 transform -translate-y-1/2 text-xs md:text-sm text-gray-400">
                      Hide
                    </span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-10 md:h-12 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 text-sm md:text-base"
                  >
                    LOGIN
                  </Button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.footer 
        className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white text-xs md:text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        Términos y condiciones
      </motion.footer>
    </div>
  );
};

export default LoginPage;