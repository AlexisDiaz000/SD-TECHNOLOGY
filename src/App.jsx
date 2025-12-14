
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import WelcomePage from '@/views/WelcomePage';
import LoginPage from '@/views/LoginPage';
import RegisterPage from '@/views/RegisterPage';
import DashboardPage from '@/views/DashboardPage';
import StockPage from '@/views/StockPage';
import PromoPage from '@/views/PromoPage';
import SalesPage from '@/views/SalesPage';
import ReportPage from '@/views/ReportPage';
import AdminPanel from '@/views/AdminPanel';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-poppins">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/promo" element={<PromoPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
