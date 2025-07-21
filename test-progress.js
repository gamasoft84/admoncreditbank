// Script de prueba para generar préstamo con progreso
// Este script se puede ejecutar en la consola del navegador

const testLoan = {
  id: Date.now(),
  name: "Préstamo de Prueba - Con Progreso",
  principal: 100000,
  annualRate: 12,
  months: 24,
  startDate: "2024-01-01", // Hace más de 6 meses
  endDate: "2026-01-01",
  monthlyPayment: 4707.35,
  monthlyPaymentWithTax: 5460.53,
  commissionAmount: 1800,
  commissionTax: 288,
  initialPayment: 2088,
  totalInterest: 12976.4,
  totalInterestTax: 2076.22,
  totalPayment: 133140.84,
  schedule: [],
  createdAt: new Date().toISOString(),
  status: "active"
};

// Para agregarlo manualmente:
// 1. Ir a http://localhost:5173/nuevo
// 2. Llenar el formulario con datos similares
// 3. Cambiar la fecha de inicio a una fecha pasada (ej: 01/01/2024)
// 4. Crear el préstamo
// 5. Ver los detalles para observar el progreso calculado

console.log("Préstamo de prueba configurado:", testLoan);
console.log("Fecha de inicio:", testLoan.startDate);
console.log("Meses transcurridos estimados desde enero 2024:", Math.floor((Date.now() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24 * 30)));
