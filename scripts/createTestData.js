// Script para crear datos de prueba en localStorage para demostrar la migración
// Ejecutar en la consola del navegador

(function createTestData() {
  console.log('🧪 Creando datos de prueba para migración...');
  
  const testLoans = [
    {
      id: 'test-loan-1',
      name: 'Préstamo Automotriz',
      principal: 250000,
      amount: 250000,
      annualRate: 12,
      interestRate: 12,
      months: 36,
      termMonths: 36,
      startDate: '2025-01-01',
      endDate: '2027-12-01',
      monthlyPayment: 8300.12,
      monthlyPaymentWithTax: 9628.14,
      commissionAmount: 4500,
      commissionTax: 720,
      initialPayment: 5220,
      totalInterest: 48804.32,
      totalInterestTax: 7808.69,
      totalPayment: 311833.01,
      createdAt: '2025-01-15T10:30:00.000Z',
      updatedAt: '2025-01-15T10:30:00.000Z'
    },
    {
      id: 'test-loan-2',
      name: 'Préstamo Personal',
      principal: 100000,
      amount: 100000,
      annualRate: 15,
      interestRate: 15,
      months: 24,
      termMonths: 24,
      startDate: '2025-02-01',
      endDate: '2027-01-01',
      monthlyPayment: 4847.05,
      monthlyPaymentWithTax: 5622.58,
      commissionAmount: 1800,
      commissionTax: 288,
      initialPayment: 2088,
      totalInterest: 16329.2,
      totalInterestTax: 2612.67,
      totalPayment: 121029.87,
      createdAt: '2025-02-01T14:15:00.000Z',
      updatedAt: '2025-02-01T14:15:00.000Z'
    },
    {
      id: 'test-loan-3',
      name: 'Crédito Hipotecario',
      principal: 1500000,
      amount: 1500000,
      annualRate: 10.5,
      interestRate: 10.5,
      months: 240,
      termMonths: 240,
      startDate: '2024-06-01',
      endDate: '2044-05-01',
      monthlyPayment: 16394.73,
      monthlyPaymentWithTax: 19017.89,
      commissionAmount: 27000,
      commissionTax: 4320,
      initialPayment: 31320,
      totalInterest: 2434735.2,
      totalInterestTax: 389557.63,
      totalPayment: 4354292.83,
      createdAt: '2024-06-01T09:00:00.000Z',
      updatedAt: '2024-06-01T09:00:00.000Z'
    }
  ];

  try {
    // Guardar en localStorage
    localStorage.setItem('prestamoBnk_loans', JSON.stringify(testLoans));
    
    console.log('✅ Datos de prueba creados exitosamente:');
    console.log(`   • ${testLoans.length} préstamos agregados`);
    testLoans.forEach((loan, index) => {
      console.log(`   ${index + 1}. ${loan.name} - $${loan.amount.toLocaleString('es-MX')}`);
    });
    
    console.log('\n📍 Para migrar los datos:');
    console.log('1. Ve al Dashboard y haz clic en "Migrar Datos"');
    console.log('2. O navega directamente a /migracion');
    console.log('3. Sigue las instrucciones en pantalla');
    
    // Recargar la página para que se muestre el banner de migración
    console.log('\n🔄 Recargando la página para mostrar el banner de migración...');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
    return {
      success: true,
      message: 'Datos de prueba creados exitosamente',
      count: testLoans.length,
      loans: testLoans
    };
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    return {
      success: false,
      error: error.message
    };
  }
})();
