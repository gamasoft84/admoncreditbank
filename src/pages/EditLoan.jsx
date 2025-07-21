import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext';
import { formatCurrency, validateLoanInputs, calculateAmortization } from '../utils/financial';
import {
  ArrowLeft,
  Save,
  Calculator,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

const EditLoan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loans, updateLoan } = useLoan();

  const [loan, setLoan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    interestRate: '',
    termMonths: '',
    startDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [calculation, setCalculation] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar datos del préstamo
  useEffect(() => {
    const foundLoan = loans.find(l => l.id === id || l.id === parseInt(id) || l.id.toString() === id);
    
    if (foundLoan) {
      setLoan(foundLoan);
      setFormData({
        name: foundLoan.name || '',
        amount: (foundLoan.principal || foundLoan.amount || '').toString(),
        interestRate: (foundLoan.annualRate || foundLoan.interestRate || '').toString(),
        termMonths: (foundLoan.months || foundLoan.termMonths || '').toString(),
        startDate: foundLoan.startDate || ''
      });
    } else {
      navigate('/prestamos');
    }
  }, [id, loans, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setErrors({});
    
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
        setShowPreview(true);
        setIsCalculating(false);
      }, 500);
    } catch (error) {
      setErrors({ general: 'Error en el cálculo. Por favor verifica los datos.' });
      setIsCalculating(false);
    }
  };

  const handleSave = () => {
    if (!calculation) {
      handleCalculate();
      return;
    }

    const updatedLoan = {
      ...calculation,
      id: loan.id, // Mantener el ID original
      createdAt: loan.createdAt, // Mantener fecha de creación
      status: loan.status || 'active' // Mantener estado
    };

    const result = updateLoan(updatedLoan);
    if (result.success) {
      navigate(`/prestamo/${loan.id}`);
    } else {
      setErrors({ general: result.message });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.')) {
        navigate(`/prestamo/${loan.id}`);
      }
    } else {
      navigate(`/prestamo/${loan.id}`);
    }
  };

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del préstamo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Detalles
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn-secondary"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Ocultar' : 'Vista'} Previa
            </button>
            
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={isCalculating}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Préstamo</h1>
          <p className="text-gray-600">
            Modifica los datos del préstamo: <strong>{loan.name}</strong>
          </p>
          {hasChanges && (
            <div className="mt-2 text-sm text-amber-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Hay cambios sin guardar
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de edición */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">📝 Datos del Préstamo</h2>
            
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-700">{errors.general}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Nombre del préstamo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Préstamo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Préstamo Personal, Crédito Automotriz..."
                  className={`input ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Monto del préstamo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto del Préstamo (MXN) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="100000"
                  min="1"
                  step="0.01"
                  className={`input ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.amount && (
                  <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Tasa de interés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Interés Anual (%) *
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="12.5"
                  min="0"
                  max="100"
                  step="0.1"
                  className={`input ${errors.interestRate ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.interestRate && (
                  <p className="text-red-600 text-sm mt-1">{errors.interestRate}</p>
                )}
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo en Meses *
                </label>
                <input
                  type="number"
                  name="termMonths"
                  value={formData.termMonths}
                  onChange={handleInputChange}
                  placeholder="24"
                  min="1"
                  max="360"
                  className={`input ${errors.termMonths ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.termMonths && (
                  <p className="text-red-600 text-sm mt-1">{errors.termMonths}</p>
                )}
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`input ${errors.startDate ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.startDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              {/* Botón de calcular */}
              <div className="pt-4">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="btn btn-primary w-full"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Recalcular Préstamo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="space-y-6">
          {showPreview && calculation && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Vista Previa</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cuota Mensual</p>
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(calculation.monthlyPaymentWithTax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pago Inicial</p>
                    <p className="font-semibold text-yellow-600">
                      {formatCurrency(calculation.initialPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Intereses</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(calculation.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total a Pagar</p>
                    <p className="font-semibold text-red-600">
                      {formatCurrency(calculation.totalPayment)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Comisión apertura: 1.8% + IVA 16%</p>
                    <p>• IVA sobre intereses: 16% mensual</p>
                    <p>• Sistema bancario mexicano</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información del préstamo original */}
          <div className="bg-gray-50 rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Datos Actuales</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monto Original:</span>
                <span className="font-medium">{formatCurrency(loan.principal || loan.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa Actual:</span>
                <span className="font-medium">{loan.annualRate || loan.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plazo Actual:</span>
                <span className="font-medium">{loan.months || loan.termMonths} meses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuota Actual:</span>
                <span className="font-medium">{formatCurrency(loan.monthlyPaymentWithTax || loan.monthlyPayment)}</span>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Importante</p>
                <p>
                  Al editar el préstamo se recalculará toda la tabla de amortización. 
                  Los pagos ya realizados se mantendrán en el historial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLoan;
