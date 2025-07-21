import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { formatCurrency, formatDate, calculateCurrentBalance } from '../utils/financial';
import {
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  PlusCircle
} from 'lucide-react';

const LoanList = () => {
  const { loans, deleteLoan } = useLoan();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Procesar préstamos con datos calculados
  const processedLoans = useMemo(() => {
    return loans.map(loan => {
      const currentBalance = calculateCurrentBalance(loan);
      const totalPaid = loan.totalPayment - currentBalance;
      const progress = loan.totalPayment > 0 ? (totalPaid / loan.totalPayment) * 100 : 0;
      
      let status = 'pending';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'active';

      return {
        ...loan,
        currentBalance,
        totalPaid,
        progress,
        status
      };
    });
  }, [loans]);

  // Filtrar y ordenar préstamos
  const filteredLoans = useMemo(() => {
    let filtered = processedLoans;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    // Ordenar
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'amount':
        filtered.sort((a, b) => b.principal - a.principal);
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [processedLoans, searchTerm, statusFilter, sortBy]);

  // Manejar eliminación de préstamo
  const handleDelete = (loan) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${loan.name}"?`)) {
      deleteLoan(loan.id);
    }
  };

  // Obtener icono y clase de estado
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'LIQUIDADO',
          className: 'bg-green-100 text-green-800'
        };
      case 'active':
        return {
          icon: Clock,
          label: 'EN PROCESO',
          className: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          icon: AlertCircle,
          label: 'PENDIENTE',
          className: 'bg-red-100 text-red-800'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Mis Préstamos</h1>
          <p className="text-secondary-600 mt-1">
            Gestiona y monitorea todos tus préstamos activos
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

      {/* Controles de filtrado */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Buscar préstamos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filtro por estado */}
          <div className="relative">
            <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="active">En proceso</option>
              <option value="completed">Liquidados</option>
            </select>
          </div>

          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="recent">Más recientes</option>
            <option value="amount">Mayor monto</option>
            <option value="progress">Mayor progreso</option>
            <option value="name">Nombre A-Z</option>
          </select>

          {/* Estadísticas rápidas */}
          <div className="text-right">
            <p className="text-sm text-secondary-600">
              {filteredLoans.length} de {loans.length} préstamos
            </p>
          </div>
        </div>
      </div>

      {/* Lista de préstamos */}
      {filteredLoans.length === 0 ? (
        <div className="card text-center py-12">
          {loans.length === 0 ? (
            <>
              <PlusCircle className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-secondary-900 mb-2">
                No tienes préstamos aún
              </h3>
              <p className="text-secondary-600 mb-6">
                Crea tu primer préstamo para comenzar a gestionar tus créditos.
              </p>
              <Link to="/nuevo" className="btn btn-primary">
                Crear Primer Préstamo
              </Link>
            </>
          ) : (
            <>
              <Search className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-secondary-900 mb-2">
                No se encontraron préstamos
              </h3>
              <p className="text-secondary-600 mb-6">
                Intenta ajustar los filtros de búsqueda.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="btn btn-secondary"
              >
                Limpiar Filtros
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const statusInfo = getStatusInfo(loan.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={loan.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {loan.name}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          Creado: {formatDate(loan.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${statusInfo.className}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-secondary-600">Monto Original</p>
                        <p className="font-semibold text-secondary-900">
                          {formatCurrency(loan.principal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-600">Saldo Pendiente</p>
                        <p className={`font-semibold ${loan.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(loan.currentBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-600">Total Pagado</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(loan.totalPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-600">Progreso</p>
                        <p className="font-semibold text-secondary-900">
                          {loan.progress.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-4">
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            loan.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                          }`}
                          style={{ width: `${Math.min(loan.progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-secondary-600 mt-1">
                        <span>Inicio: {formatDate(loan.startDate)}</span>
                        <span>{loan.progress.toFixed(1)}% completado</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2 lg:ml-6">
                    <Link
                      to={`/prestamo/${loan.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                    <button
                      onClick={() => {/* Implementar exportación individual */}}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </button>
                    <button
                      onClick={() => handleDelete(loan)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoanList;
