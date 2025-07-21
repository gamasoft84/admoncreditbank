import React from 'react';
import { Link } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { formatCurrency, formatDate, calculateCurrentBalance, calculateLoanProgress } from '../utils/financial';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { loans, stats } = useLoan();

  // Calcular estadísticas actualizadas
  const updatedStats = React.useMemo(() => {
    if (!loans || loans.length === 0) return stats;

    const totalAmount = loans.reduce((sum, loan) => sum + (loan.principal || loan.amount), 0);
    const totalToPay = loans.reduce((sum, loan) => sum + loan.totalPayment, 0);
    
    // Usar calculateLoanProgress para obtener saldos más precisos
    const loanProgresses = loans.map(loan => calculateLoanProgress(loan));
    const totalPending = loanProgresses.reduce((sum, progress) => sum + progress.remainingBalance, 0);
    const totalPaid = totalToPay - totalPending;
    
    // Calcular progreso promedio basado en tiempo transcurrido
    const averageProgress = loanProgresses.length > 0 
      ? loanProgresses.reduce((sum, progress) => sum + progress.progressPercentage, 0) / loanProgresses.length
      : 0;

    return {
      totalLoans: loans.length,
      totalAmount,
      totalToPay,
      totalPaid,
      totalPending,
      averageProgress
    };
  }, [loans, stats]);

  // Obtener préstamos recientes
  const recentLoans = React.useMemo(() => {
    return loans
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(loan => {
        const loanProgress = calculateLoanProgress(loan);
        return {
          ...loan,
          currentBalance: loanProgress.remainingBalance,
          progress: loanProgress.progressPercentage,
          paymentsCompleted: loanProgress.paymentsCompleted,
          totalPayments: loan.months || loan.termMonths
        };
      });
  }, [loans]);

  // Estadísticas de la tarjetas
  const statCards = [
    {
      title: 'Total Préstamos',
      value: updatedStats.totalLoans,
      icon: CreditCard,
      color: 'blue',
      format: 'number'
    },
    {
      title: 'Monto Total Prestado',
      value: updatedStats.totalAmount,
      icon: DollarSign,
      color: 'green',
      format: 'currency'
    },
    {
      title: 'Total Pagado',
      value: updatedStats.totalPaid,
      icon: CheckCircle,
      color: 'emerald',
      format: 'currency'
    },
    {
      title: 'Saldo Pendiente',
      value: updatedStats.totalPending,
      icon: AlertCircle,
      color: 'red',
      format: 'currency'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Resumen general de tus créditos y préstamos
          </p>
        </div>
        <Link
          to="/nuevo"
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Préstamo
        </Link>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 mt-1">
                    {formatValue(stat.value, stat.format)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de progreso general */}
      {updatedStats.totalLoans > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-secondary-900">
                Progreso General de Pagos
              </h3>
              <p className="text-sm text-secondary-600">
                {updatedStats.averageProgress.toFixed(1)}% completado del total
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary-600">Total a Pagar</p>
              <p className="text-lg font-semibold text-secondary-900">
                {formatCurrency(updatedStats.totalToPay)}
              </p>
            </div>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(updatedStats.averageProgress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-secondary-600 mt-2">
            <span>Pagado: {formatCurrency(updatedStats.totalPaid)}</span>
            <span>Pendiente: {formatCurrency(updatedStats.totalPending)}</span>
          </div>
        </div>
      )}

      {/* Estado cuando no hay préstamos */}
      {updatedStats.totalLoans === 0 && (
        <div className="card text-center py-12">
          <TrendingUp className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-secondary-900 mb-2">
            ¡Bienvenido a PréstamoBnk!
          </h3>
          <p className="text-secondary-600 mb-6 max-w-md mx-auto">
            Comienza creando tu primer préstamo para ver estadísticas detalladas 
            y gestionar tus créditos de manera profesional.
          </p>
          <Link to="/nuevo" className="btn btn-primary">
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Primer Préstamo
          </Link>
        </div>
      )}

      {/* Préstamos recientes */}
      {recentLoans.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-secondary-900">
              Préstamos Recientes
            </h3>
            <Link
              to="/prestamos"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-secondary-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">{loan.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      loan.progress === 100 
                        ? 'bg-green-100 text-green-800'
                        : loan.progress > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {loan.progress === 100 ? 'LIQUIDADO' : 
                       loan.progress > 0 ? 'EN PROCESO' : 'PENDIENTE'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-secondary-600">Monto Original</p>
                      <p className="font-medium">{formatCurrency(loan.principal || loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Saldo Pendiente</p>
                      <p className={`font-medium ${
                        loan.currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(loan.currentBalance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Progreso</p>
                      <p className="font-medium">
                        {loan.paymentsCompleted}/{loan.totalPayments} 
                        <span className="text-xs text-secondary-500 ml-1">
                          ({loan.progress.toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-600">Fecha Inicio</p>
                      <p className="font-medium">{formatDate(loan.startDate)}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          loan.progress === 100 ? 'bg-green-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${Math.min(loan.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <Link
                    to={`/prestamo/${loan.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
