// Script para probar la migración con datos de prueba
// Ejecutar en consola del navegador después de cargar la página

// 1. Limpiar localStorage primero
localStorage.clear();

// 2. Crear datos de prueba simulando el formato anterior
const testLoan = {
  id: Date.now(),
  name: "Préstamo de Prueba",
  principal: 100000,
  annualRate: 12,
  months: 24,
  startDate: "2025-01-22",
  endDate: "2027-01-22",
  monthlyPayment: 4700.66,
  monthlyPaymentWithTax: 4824.68,
  commissionAmount: 1800,
  commissionTax: 288,
  initialPayment: 2088,
  totalInterest: 12815.84,
  totalInterestTax: 2050.53,
  totalPayment: 117954.37,
  createdAt: new Date().toISOString(),
  // Generar una tabla de amortización simple para pruebas
  schedule: Array.from({ length: 24 }, (_, i) => ({
    month: i + 1,
    paymentDate: new Date(2025, 0, 22 + i * 30).toISOString().split('T')[0],
    date: new Date(2025, 0, 22 + i * 30).toISOString().split('T')[0],
    payment: 4824.68,
    principal: 4000 - (i * 20),
    interest: 824.68 - (i * 5),
    interestTax: 131.95 - (i * 0.8),
    vatOnInterest: 131.95 - (i * 0.8),
    commission: i === 0 ? 1800 : 0,
    commissionTax: i === 0 ? 288 : 0,
    balance: 100000 - ((i + 1) * 4000),
    isInitialPayment: i === 0
  }))
};

// 3. Guardar en localStorage con diferentes formatos para probar compatibilidad
localStorage.setItem('loans', JSON.stringify([testLoan]));
localStorage.setItem('prestamos', JSON.stringify([testLoan]));
localStorage.setItem('loan_1', JSON.stringify(testLoan));

console.log('✅ Datos de prueba creados en localStorage');
console.log('📊 Préstamos guardados:', localStorage.getItem('loans'));

// 4. Ejecutar migración
const migrate = async () => {
  try {
    console.log('🚀 Iniciando migración...');
    
    // Buscar todas las claves de localStorage que contengan préstamos
    const loanKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('loan') || key.includes('prestamo'))) {
        loanKeys.push(key);
      }
    }
    
    console.log('🔍 Claves encontradas:', loanKeys);
    
    let migratedCount = 0;
    
    for (const key of loanKeys) {
      try {
        const data = localStorage.getItem(key);
        const parsed = JSON.parse(data);
        
        // Si es un array, migrar cada elemento
        if (Array.isArray(parsed)) {
          for (const loan of parsed) {
            await migrateLoan(loan);
            migratedCount++;
          }
        } else {
          // Si es un objeto individual
          await migrateLoan(parsed);
          migratedCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${key}:`, error);
      }
    }
    
    console.log(`✅ Migración completada: ${migratedCount} préstamos migrados`);
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
};

const migrateLoan = async (loanData) => {
  // Mapear campos para compatibilidad
  const mappedLoan = {
    ...loanData,
    amount: loanData.amount || loanData.principal,
    interestRate: loanData.interestRate || loanData.annualRate,
    termMonths: loanData.termMonths || loanData.months
  };
  
  console.log('📤 Enviando préstamo:', mappedLoan.name);
  
  const response = await fetch('http://localhost:3001/api/loans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mappedLoan)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  const result = await response.json();
  console.log('✅ Préstamo migrado:', result.name);
  return result;
};

// Ejecutar migración automáticamente
migrate();
