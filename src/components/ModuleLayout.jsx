import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, User, Home } from 'lucide-react';
import SDLogo from '@/components/ui/SDLogo';

const ModuleLayout = ({ title, children, showSearch = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg-module relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-20 flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-64 gradient-bg-main p-6 flex flex-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <SDLogo className="w-12 h-12" />
            <span className="text-white font-bold text-lg hidden lg:inline">SD</span>
          </div>

          <nav className="space-y-4 flex-1">
            <NavItem title="SALES" active={title === 'Sales'} onClick={() => navigate('/sales')} />
            <NavItem title="STOCK" active={title === 'Stock'} onClick={() => navigate('/stock')} />
            <NavItem title="PROMO" active={title === 'Promo'} onClick={() => navigate('/promo')} />
            <NavItem title="REPORT" active={title === 'Report'} onClick={() => navigate('/report')} />
          </nav>

          <div className="pt-6 border-t border-white/20 space-y-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-white hover:text-white/80 w-full transition-colors duration-200"
              data-testid="back-to-dashboard-button"
            >
              <Home className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Dashboard</span>
            </button>
            <button className="flex items-center space-x-2 text-white hover:text-white/80 w-full transition-colors duration-200">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">Profile</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 lg:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-white/80 transition-colors duration-200"
                data-testid="back-button-header"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">
                {title}
              </h1>
            </div>

            {showSearch && (
              <div className="hidden md:flex items-center bg-white/10 rounded-lg px-4 py-2 border border-white/20">
                <Search className="w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent ml-2 text-white placeholder-white/60 outline-none w-40"
                />
              </div>
            )}
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="text-white/60 hover:text-white">&lt;</button>
              <span className="text-white/60 text-sm">Page 1 of 1</span>
              <button className="text-white/60 hover:text-white">&gt;</button>
            </div>
            <button className="text-white/60 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
            </button>
          </footer>
        </motion.main>
      </div>
    </div>
  );
};

const NavItem = ({ title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded transition-all duration-200 text-sm font-medium ${
      active
        ? 'bg-white/20 text-white'
        : 'text-white/70 hover:text-white hover:bg-white/10'
    }`}
    data-testid={`nav-${title.toLowerCase()}`}
  >
    {title}
  </button>
);

export default ModuleLayout;