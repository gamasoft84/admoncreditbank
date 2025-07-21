import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { 
  calculateAmortization, 
  validateLoanInputs, 
  formatCurrency, 
  formatDate 
} from '../utils/financial';
import AmortizationTable from '../components/AmortizationTable';
import {
  Calculator,
  Save,
  RefreshCw,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  Table
} from 'lucide-react';

const NewLoan = () => {
  const navigate = useNavigate();
  const { addLoan } = useLoan();

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '12',
    termMonths: '36',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Estado de la calculadora
  const [calculation, setCalculation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAmortizationTable, setShowAmortizationTable] = useState(false);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Calcular amortización
  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Validar inputs
    const validation = validateLoanInputs({
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      termMonths: parseInt(formData.termMonths)
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsCalculating(false);
      return;
    }

    // Validar nombre
    if (!formData.name.trim()) {
      setErrors({ name: 'El nombre del préstamo es requerido' });
      setIsCalculating(false);
      return;
    }

    try {
      // Simular delay de cálculo
      setTimeout(() => {
        const result = calculateAmortization({
          principal: parseFloat(formData.amount),
          annualRate: parseFloat(formData.interestRate),
          months: parseInt(formData.termMonths),
          startDate: formData.startDate,
          name: formData.name.trim()
        });

        setCalculation(result);
        setShowResults(true);
        setIsCalculating(false);
      }, 500);
    } catch (error) {
      setErrors({ general: 'Error en el cálculo. Por favor verifica los datos.' });
      setIsCalculating(false);
    }
  };

  // Guardar préstamo
  const handleSave = () => {
    if (!calculation) return;

    const result = addLoan(calculation);
    if (result.success) {
      navigate('/prestamos');
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData({
      name: '',
      amount: '',
      interestRate: '12',
      termMonths: '36',
      startDate: new Date().toISOString().split('T')[0]
    });
    setCalculation(null);
    setErrors({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Nuevo Préstamo</h1>
        <p className="text-secondary-600 mt-1">
          Calcula y configura un nuevo préstamo con amortización detallada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Datos del Préstamo
          </h2>

          <div className="space-y-4">
            {/* Nombre del préstamo */}
            <div>
              <label className="label">
                Nombre del Préstamo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Ej: Préstamo Personal - Enero 2025"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Monto */}
            <div>
              <label className="label">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Monto del Préstamo (MXN)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`input ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="100000"
                min="1"
                step="0.01"
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Tasa de interés */}
            <div>
              <label className="label">
                <Percent className="h-4 w-4 inline mr-1" />
                Tasa de Interés Anual (%)
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                className={`input ${errors.interestRate ? 'border-red-300 focus:ring-red-500' : ''}`}
                min="0.1"
                max="100"
                step="0.1"
              />
              {errors.interestRate && (
                <p className="text-red-600 text-sm mt-1">{errors.interestRate}</p>
              )}
            </div>

            {/* Plazo */}
            <div>
              <label className="label">
                <Clock className="h-4 w-4 inline mr-1" />
                Plazo en Meses
              </label>
              <input
                type="number"
                name="termMonths"
                value={formData.termMonths}
                onChange={handleInputChange}
                className={`input ${errors.termMonths ? 'border-red-300 focus:ring-red-500' : ''}`}
                min="1"
                max="480"
              />
              {errors.termMonths && (
                <p className="text-red-600 text-sm mt-1">{errors.termMonths}</p>
              )}
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="label">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="btn btn-primary flex-1"
              >
                {isCalculating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4 mr-2" />
                )}
                {isCalculating ? 'Calculando...' : 'Calcular'}
              </button>
              
              <button
                onClick={handleReset}
                className="btn btn-secondary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            Resumen del Préstamo
          </h2>

          {!showResults ? (
            <div className="text-center py-12">
              <Calculator className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">
                Completa los datos del préstamo y haz clic en "Calcular" 
                para ver el resumen y la tabla de amortización.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Resumen de totales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <p className="text-sm font-medium text-primary-700">Monto Solicitado</p>
                  <p className="text-lg font-bold text-primary-900">
                    {formatCurrency(calculation?.principal || 0)}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">Cuota Mensual (con IVA)</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(calculation?.monthlyPaymentWithTax || 0)}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">Pago Inicial (Mes 0)</p>
                  <p className="text-lg font-bold text-yellow-900">
                    {formatCurrency(calculation?.initialPayment || 0)}
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700">Total a Pagar</p>
                  <p className="text-lg font-bold text-red-900">
                    {formatCurrency(calculation?.totalPayment || 0)}
                  </p>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-secondary-900 mb-3">Detalles del Cálculo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Tasa Anual:</span>
                    <span className="font-medium">{calculation?.annualRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Plazo:</span>
                    <span className="font-medium">{calculation?.months} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Comisión Apertura (1.8%):</span>
                    <span className="font-medium">{formatCurrency(calculation?.commissionAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">IVA Comisión:</span>
                    <span className="font-medium">{formatCurrency(calculation?.commissionTax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total IVA Intereses:</span>
                    <span className="font-medium">{formatCurrency(calculation?.totalInterestTax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Fecha Inicio:</span>
                    <span className="font-medium">{formatDate(calculation?.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Fecha Final:</span>
                    <span className="font-medium">{formatDate(calculation?.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Botón guardar */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSave}
                  className="btn btn-success w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Préstamo
                </button>
                
                {/* Botón mostrar tabla de amortización */}
                <button
                  onClick={() => setShowAmortizationTable(!showAmortizationTable)}
                  className="btn btn-primary w-full"
                >
                  <Table className="h-4 w-4 mr-2" />
                  {showAmortizationTable ? 'Ocultar' : 'Ver'} Tabla de Amortización
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de amortización */}
      {showResults && showAmortizationTable && calculation && (
        <div className="mt-8">
          <AmortizationTable 
            amortization={calculation.schedule}
            loanData={{
              amount: calculation.principal,
              rate: formData.interestRate,
              term: formData.termMonths
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NewLoan;
