/**
 * Utilidades para cálculos financieros y formateo
 * Específicamente diseñado para el mercado mexicano
 */

// Constantes del sistema mexicano
export const CONSTANTS = {
  COMMISSION_RATE: 1.8, // 1.8% comisión de apertura
  TAX_RATE: 0.16, // 16% IVA
  CURRENCY: 'MXN',
  LOCALE: 'es-MX'
};

/**
 * Calcula la cuota mensual usando la fórmula de anualidad
 * @param {number} principal - Monto principal del préstamo
 * @param {number} monthlyRate - Tasa mensual (anual/100/12)
 * @param {number} months - Número de meses
 * @returns {number} Cuota mensual
 */
export const calculateMonthlyPayment = (principal, monthlyRate, months) => {
  if (monthlyRate === 0) {
    return principal / months;
  }
  
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * (monthlyRate * factor) / (factor - 1);
};

/**
 * Calcula la tabla de amortización completa
 * @param {Object} params - Parámetros del préstamo
 * @returns {Object} Tabla de amortización y totales
 */
export const calculateAmortization = ({
  principal,
  annualRate,
  months,
  startDate,
  name
}) => {
  const monthlyRate = (annualRate / 100) / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, months);
  
  // Calcular comisiones
  const commissionAmount = principal * (CONSTANTS.COMMISSION_RATE / 100);
  const commissionTax = commissionAmount * CONSTANTS.TAX_RATE;
  const initialPayment = commissionAmount + commissionTax;
  
  const schedule = [];
  let balance = principal;
  let totalInterest = 0;
  let totalInterestTax = 0;
  const start = new Date(startDate);

  // Mes 0 - Solo comisiones
  schedule.push({
    month: 0,
    paymentDate: startDate,
    payment: initialPayment,
    principal: 0,
    interest: 0,
    interestTax: 0,
    commission: commissionAmount,
    commissionTax: commissionTax,
    balance: balance,
    isInitialPayment: true
  });

  // Meses 1 a N - Cuotas normales con IVA en intereses
  for (let month = 1; month <= months; month++) {
    const interestPayment = balance * monthlyRate;
    const interestTax = interestPayment * CONSTANTS.TAX_RATE;
    const principalPayment = monthlyPayment - interestPayment;
    const totalMonthlyPayment = monthlyPayment + interestTax;
    
    balance = Math.max(0, balance - principalPayment);
    totalInterest += interestPayment;
    totalInterestTax += interestTax;

    // Calcular fecha de pago
    const paymentDate = new Date(start);
    paymentDate.setMonth(paymentDate.getMonth() + month);

    schedule.push({
      month,
      paymentDate: paymentDate.toISOString().split('T')[0],
      payment: totalMonthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      interestTax: interestTax,
      commission: 0,
      commissionTax: 0,
      balance: balance,
      isInitialPayment: false
    });

    if (balance === 0) break;
  }

  // Calcular fecha final
  const endDate = new Date(start);
  endDate.setMonth(endDate.getMonth() + months);

  // Calcular totales
  const totalPayments = schedule.reduce((sum, row) => sum + row.payment, 0);

  return {
    id: Date.now(),
    name,
    principal,
    annualRate,
    months,
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    monthlyPayment,
    monthlyPaymentWithTax: monthlyPayment + (totalInterestTax / months),
    commissionAmount,
    commissionTax,
    initialPayment,
    totalInterest,
    totalInterestTax,
    totalPayment: totalPayments,
    schedule,
    createdAt: new Date().toISOString()
  };
};

/**
 * Calcula el saldo pendiente actual de un préstamo
 * @param {Object} loan - Objeto del préstamo
 * @returns {number} Saldo pendiente
 */
export const calculateCurrentBalance = (loan) => {
  const today = new Date();
  const startDate = new Date(loan.startDate || loan.createdAt);
  
  const monthsElapsed = calculateMonthsElapsed(startDate, today);
  
  if (monthsElapsed <= 0) {
    return loan.principal;
  }
  
  if (monthsElapsed >= loan.months) {
    return 0;
  }
  
  const monthlyRate = (loan.annualRate / 100) / 12;
  let balance = loan.principal;
  
  for (let month = 1; month <= Math.min(monthsElapsed, loan.months); month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = loan.monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
  }
  
  return balance;
};

/**
 * Calcula meses transcurridos entre dos fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} currentDate - Fecha actual
 * @returns {number} Meses transcurridos
 */
export const calculateMonthsElapsed = (startDate, currentDate) => {
  const years = currentDate.getFullYear() - startDate.getFullYear();
  const months = currentDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
};

/**
 * Calcula el progreso actual del préstamo
 * @param {Object} loan - Objeto del préstamo
 * @returns {Object} Progreso del préstamo
 */
export const calculateLoanProgress = (loan) => {
  const today = new Date();
  const startDate = new Date(loan.startDate || loan.createdAt);
  
  const monthsElapsed = Math.max(0, calculateMonthsElapsed(startDate, today));
  const totalMonths = loan.months || loan.termMonths;
  const principal = loan.principal || loan.amount;
  
  // Si no ha comenzado el préstamo
  if (monthsElapsed <= 0) {
    return {
      monthsElapsed: 0,
      paymentsCompleted: 0,
      capitalPaid: 0,
      remainingBalance: principal,
      progressPercentage: 0,
      capitalProgressPercentage: 0
    };
  }
  
  // Si el préstamo ya terminó
  if (monthsElapsed >= totalMonths) {
    return {
      monthsElapsed: totalMonths,
      paymentsCompleted: totalMonths,
      capitalPaid: principal,
      remainingBalance: 0,
      progressPercentage: 100,
      capitalProgressPercentage: 100
    };
  }
  
  // Calcular progreso actual
  const monthlyRate = ((loan.annualRate || loan.interestRate) / 100) / 12;
  const monthlyPayment = loan.monthlyPayment || calculateMonthlyPayment(principal, monthlyRate, totalMonths);
  
  let balance = principal;
  let totalCapitalPaid = 0;
  
  // Simular pagos hasta el mes actual
  for (let month = 1; month <= monthsElapsed; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    balance = Math.max(0, balance - principalPayment);
    totalCapitalPaid += principalPayment;
    
    if (balance === 0) break;
  }
  
  const progressPercentage = (monthsElapsed / totalMonths) * 100;
  const capitalProgressPercentage = (totalCapitalPaid / principal) * 100;
  
  return {
    monthsElapsed,
    paymentsCompleted: monthsElapsed,
    capitalPaid: totalCapitalPaid,
    remainingBalance: balance,
    progressPercentage: Math.min(progressPercentage, 100),
    capitalProgressPercentage: Math.min(capitalProgressPercentage, 100)
  };
};

/**
 * Calcula la fecha del próximo pago de un préstamo
 * @param {Object} loan - Objeto del préstamo
 * @returns {string|null} Fecha del próximo pago o null si ya terminó
 */
export const calculateNextPaymentDate = (loan) => {
  const today = new Date();
  const startDate = new Date(loan.startDate || loan.createdAt);
  
  const monthsElapsed = calculateMonthsElapsed(startDate, today);
  const totalMonths = loan.months || loan.termMonths;
  
  // Si el préstamo aún no ha comenzado
  if (monthsElapsed < 0) {
    // El primer pago será en el mes 1 (mes después de la fecha de inicio)
    const firstPaymentDate = new Date(startDate);
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
    return firstPaymentDate.toISOString().split('T')[0];
  }
  
  // Si ya terminó el préstamo
  if (monthsElapsed >= totalMonths) {
    return null;
  }
  
  // Calcular la fecha del próximo pago
  const nextPaymentMonth = monthsElapsed + 1;
  const nextPaymentDate = new Date(startDate);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + nextPaymentMonth);
  
  return nextPaymentDate.toISOString().split('T')[0];
};

/**
 * Formatea un número como moneda mexicana
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(CONSTANTS.LOCALE, {
    style: 'currency',
    currency: CONSTANTS.CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatea una fecha al formato mexicano
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return date.toLocaleDateString(CONSTANTS.LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha corta
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada corta
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(CONSTANTS.LOCALE, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Valida los inputs del préstamo
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de validación
 */
export const validateLoanInputs = ({ amount, interestRate, termMonths }) => {
  const errors = {};
  
  if (!amount || amount <= 0) {
    errors.amount = 'El monto debe ser mayor a 0';
  }
  
  if (interestRate === undefined || interestRate === null || interestRate < 0 || interestRate > 100) {
    errors.interestRate = 'La tasa de interés debe estar entre 0% y 100%';
  }
  
  if (!termMonths || termMonths <= 0) {
    errors.termMonths = 'El plazo debe ser mayor a 0 meses';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Genera estadísticas de un conjunto de préstamos
 * @param {Array} loans - Array de préstamos
 * @returns {Object} Estadísticas generales
 */
export const generateLoanStats = (loans) => {
  if (!loans || loans.length === 0) {
    return {
      totalLoans: 0,
      totalAmount: 0,
      totalToPay: 0,
      totalPaid: 0,
      totalPending: 0,
      averageProgress: 0
    };
  }

  const totalAmount = loans.reduce((sum, loan) => sum + loan.principal, 0);
  const totalToPay = loans.reduce((sum, loan) => sum + loan.totalPayment, 0);
  const totalPending = loans.reduce((sum, loan) => sum + calculateCurrentBalance(loan), 0);
  const totalPaid = totalToPay - totalPending;
  const averageProgress = totalToPay > 0 ? (totalPaid / totalToPay) * 100 : 0;

  return {
    totalLoans: loans.length,
    totalAmount,
    totalToPay,
    totalPaid,
    totalPending,
    averageProgress
  };
};
