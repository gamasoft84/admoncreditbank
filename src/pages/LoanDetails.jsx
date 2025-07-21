import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { formatCurrency, formatDate, calculateAmortization } from '../utils/financial';
import AmortizationTable from '../components/AmortizationTable';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Table
} from 'lucide-react';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, deleteLoan } = useLoan();

  const [loan, setLoan] = useState(null);
  const [showAmortizationTable, setShowAmortizationTable] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('LoanDetails: useEffect triggered');
    console.log('ID from params:', id);
    console.log('Available loans:', loans);
    console.log('Loans count:', loans.length);
    
    // Dar tiempo para que los préstamos se carguen
    const timeoutId = setTimeout(() => {
      // Convertir ID a número si es necesario para la comparación
      const foundLoan = loans.find(l => l.id === id || l.id === parseInt(id) || l.id.toString() === id);
      console.log('Found loan:', foundLoan);
      
      if (foundLoan) {
        setLoan(foundLoan);
        setError(null);
      } else if (loans.length > 0) {
        // Solo mostrar error si ya se cargaron los préstamos y no se encontró
        setError(`Préstamo con ID "${id}" no encontrado`);
      }
      setLoading(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [id, loans]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del préstamo...</p>
          <p className="mt-2 text-sm text-gray-400">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Préstamo no encontrado</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/prestamos')}
                className="btn btn-primary mr-3"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Mis Préstamos
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Recargar Página
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p><strong>Debug info:</strong></p>
              <p>ID buscado: {id}</p>
              <p>Préstamos disponibles: {loans.length}</p>
              {loans.length > 0 && (
                <p>IDs disponibles: {loans.map(l => l.id).join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del préstamo...</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteLoan(loan.id);
    navigate('/prestamos');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: CheckCircle,
        label: 'Activo' 
      },
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: Clock,
        label: 'Pendiente' 
      },
      completed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        icon: CheckCircle,
        label: 'Completado' 
      },
      overdue: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: AlertTriangle,
        label: 'Vencido' 
      }
    };

    const badge = badges[status] || badges.pending;
    const IconComponent = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/prestamos')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Préstamos
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/prestamo/${loan.id}/editar`)}
              className="btn btn-secondary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{loan.name}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Creado: {formatDate(loan.createdAt)}
              </span>
              {getStatusBadge(loan.status)}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Monto del Préstamo</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(loan.amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Detalles del préstamo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Información del Préstamo</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Monto Principal</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Percent className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Tasa de Interés</p>
                    <p className="font-semibold text-gray-900">{loan.interestRate}% anual</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Plazo</p>
                    <p className="font-semibold text-gray-900">{loan.termMonths} meses</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Inicio</p>
                    <p className="font-semibold text-gray-900">{formatDate(loan.startDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cálculos financieros */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Resumen Financiero</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Cuota Mensual</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(loan.monthlyPaymentWithTax)}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-600 font-medium">Pago Inicial (Mes 0)</p>
                <p className="text-xl font-bold text-yellow-900">
                  {formatCurrency(loan.initialPayment)}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium">Total a Pagar</p>
                <p className="text-xl font-bold text-red-900">
                  {formatCurrency(loan.totalPayment)}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Total Intereses</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(loan.totalInterest)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Progreso */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Progreso</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pagos realizados</span>
                  <span>0 / {loan.termMonths}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Capital pagado</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Próximo pago */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🗓️ Próximo Pago</h3>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(loan.monthlyPaymentWithTax)}
              </p>
              <p className="text-sm text-gray-600">
                Fecha estimada: {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Acciones</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAmortizationTable(!showAmortizationTable)}
                className="btn btn-primary w-full"
              >
                <Table className="h-4 w-4 mr-2" />
                {showAmortizationTable ? 'Ocultar' : 'Ver'} Tabla de Amortización
              </button>
              
              <button className="btn btn-secondary w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Registrar Pago
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de amortización */}
      {showAmortizationTable && (
        <div className="mb-8">
          <AmortizationTable 
            amortization={loan.schedule || loan.amortization || (() => {
              const recalculated = calculateAmortization({
                principal: loan.amount,
                annualRate: loan.interestRate,
                months: loan.termMonths,
                startDate: loan.startDate,
                name: loan.name
              });
              return recalculated.schedule;
            })()}
            loanData={{
              amount: loan.amount,
              rate: loan.interestRate,
              term: loan.termMonths
            }}
          />
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el préstamo <strong>"{loan.name}"</strong>? 
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
