import React from 'react';
import Navigation from './Navigation';
import { useLoan } from '../context/LoanContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { error, clearError } = useLoan();

  // Componente de notificación
  const Notification = ({ type, message, onClose }) => {
    const getIcon = () => {
      switch (type) {
        case 'error':
          return <AlertCircle className="h-5 w-5" />;
        case 'success':
          return <CheckCircle className="h-5 w-5" />;
        default:
          return <Info className="h-5 w-5" />;
      }
    };

    const getStyles = () => {
      switch (type) {
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div className={`rounded-lg border p-4 flex items-start space-x-3 ${getStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-auto pl-3"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mostrar notificación de error si existe */}
        {error && (
          <div className="mb-6">
            <Notification
              type="error"
              message={error}
              onClose={clearError}
            />
          </div>
        )}
        
        {/* Contenido principal */}
        <div className="space-y-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-secondary-600">
              © 2025 PréstamoBnk. Sistema de Administración de Créditos.
            </div>
            <div className="text-sm text-secondary-500 mt-2 md:mt-0">
              Diseñado para el mercado mexicano
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
