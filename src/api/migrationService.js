import { createLoan } from './loanService.js';

// Función para migrar datos de localStorage a la base de datos
export const migrateFromLocalStorage = async (localStorageData) => {
  try {
    console.log('🚀 Iniciando migración de datos...');
    
    if (!localStorageData || localStorageData.length === 0) {
      console.log('ℹ️ No hay datos para migrar');
      return { success: true, migrated: 0 };
    }
    
    let migratedCount = 0;
    const errors = [];
    
    for (const loan of localStorageData) {
      try {
        // Transformar datos para compatibilidad con Prisma
        const transformedLoan = {
          name: loan.name,
          principal: loan.principal || loan.amount,
          amount: loan.amount || loan.principal,
          annualRate: loan.annualRate || loan.interestRate,
          interestRate: loan.interestRate || loan.annualRate,
          months: loan.months || loan.termMonths,
          termMonths: loan.termMonths || loan.months,
          startDate: loan.startDate || loan.createdAt,
          endDate: loan.endDate,
          monthlyPayment: loan.monthlyPayment,
          monthlyPaymentWithTax: loan.monthlyPaymentWithTax,
          commissionAmount: loan.commissionAmount,
          commissionTax: loan.commissionTax,
          initialPayment: loan.initialPayment,
          totalInterest: loan.totalInterest,
          totalInterestTax: loan.totalInterestTax,
          totalPayment: loan.totalPayment,
          schedule: loan.schedule || []
        };
        
        const result = await createLoan(transformedLoan);
        
        if (result.success) {
          migratedCount++;
          console.log(`✅ Migrado: ${loan.name}`);
        } else {
          errors.push(`Error migrando ${loan.name}: ${result.error}`);
          console.error(`❌ Error migrando ${loan.name}:`, result.error);
        }
      } catch (error) {
        errors.push(`Error migrando ${loan.name}: ${error.message}`);
        console.error(`❌ Error migrando ${loan.name}:`, error);
      }
    }
    
    console.log(`🎉 Migración completada: ${migratedCount}/${localStorageData.length} préstamos migrados`);
    
    return {
      success: true,
      migrated: migratedCount,
      total: localStorageData.length,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para verificar si ya existen datos en la base de datos
export const checkExistingData = async () => {
  try {
    const { getAllLoans } = await import('./loanService.js');
    const result = await getAllLoans();
    
    if (result.success) {
      return result.data.length > 0;
    }
    return false;
  } catch (error) {
    console.error('Error verificando datos existentes:', error);
    return false;
  }
};
