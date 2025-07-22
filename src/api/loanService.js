import prisma from './database.js';

// Función para convertir BigInt a string para serialización JSON
const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

// Obtener todos los préstamos
export const getAllLoans = async () => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        schedule: {
          orderBy: { month: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: serializeBigInt(loans) };
  } catch (error) {
    console.error('Error obteniendo préstamos:', error);
    return { success: false, error: error.message };
  }
};

// Obtener un préstamo por ID
export const getLoanById = async (id) => {
  try {
    // Convertir ID a BigInt si es necesario
    const loanId = typeof id === 'string' ? BigInt(id) : BigInt(id);
    
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        schedule: {
          orderBy: { month: 'asc' }
        }
      }
    });
    
    if (!loan) {
      return { success: false, error: 'Préstamo no encontrado' };
    }
    
    return { success: true, data: serializeBigInt(loan) };
  } catch (error) {
    console.error('Error obteniendo préstamo:', error);
    return { success: false, error: error.message };
  }
};

// Crear un nuevo préstamo (con manejo de duplicados)
export const createLoan = async (loanData) => {
  try {
    const { schedule, ...loanInfo } = loanData;
    
    // Mapear campos para compatibilidad con localStorage
    const mappedLoanInfo = {
      ...loanInfo,
      // Asegurar que tanto principal como amount existan con valores válidos
      principal: loanInfo.principal || loanInfo.amount || 0,
      amount: loanInfo.amount || loanInfo.principal || 0,
      // Mapear campos opcionales para compatibilidad
      interestRate: loanInfo.interestRate || loanInfo.annualRate,
      termMonths: loanInfo.termMonths || loanInfo.months,
      monthlyPaymentWithTax: loanInfo.monthlyPaymentWithTax || loanInfo.monthlyPayment,
    };

    // Log para debugging
    console.log('🔍 Datos de entrada:', JSON.stringify(loanInfo, null, 2));
    console.log('🔍 Datos mapeados:', JSON.stringify(mappedLoanInfo, null, 2));

    // Verificar si ya existe un préstamo con este ID
    const existingLoan = await prisma.loan.findUnique({
      where: { id: loanInfo.id }
    });

    if (existingLoan) {
      console.log('⚠️ Préstamo ya existe, actualizando...', loanInfo.id);
      // Si ya existe, actualizarlo en lugar de crear uno nuevo
      return await updateLoan(loanInfo.id, loanData);
    }
    
    const newLoan = await prisma.loan.create({
      data: {
        ...mappedLoanInfo,
        schedule: {
          create: (schedule || []).map(payment => ({
            month: payment.month,
            paymentDate: payment.paymentDate || payment.date,
            date: payment.date || payment.paymentDate,
            payment: payment.payment,
            principal: payment.principal,
            interest: payment.interest,
            interestTax: payment.interestTax || payment.vatOnInterest || 0,
            vatOnInterest: payment.vatOnInterest || payment.interestTax || 0,
            commission: payment.commission || 0,
            commissionTax: payment.commissionTax || 0,
            balance: payment.balance,
            isInitialPayment: payment.isInitialPayment || false
          }))
        }
      },
      include: {
        schedule: {
          orderBy: { month: 'asc' }
        }
      }
    });
    
    return { success: true, data: serializeBigInt(newLoan) };
  } catch (error) {
    console.error('Error creando préstamo:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar un préstamo
export const updateLoan = async (id, loanData) => {
  try {
    const { schedule, ...loanInfo } = loanData;
    
    // Mapear campos para compatibilidad con localStorage
    const mappedLoanInfo = {
      ...loanInfo,
      // Asegurar que tanto principal como amount existan
      principal: loanInfo.principal || loanInfo.amount,
      amount: loanInfo.amount || loanInfo.principal,
      // Mapear campos opcionales para compatibilidad
      interestRate: loanInfo.interestRate || loanInfo.annualRate,
      termMonths: loanInfo.termMonths || loanInfo.months,
      monthlyPaymentWithTax: loanInfo.monthlyPaymentWithTax || loanInfo.monthlyPayment,
    };

    // Convertir ID a BigInt si es necesario
    const loanId = typeof id === 'string' ? BigInt(id) : BigInt(id);
    
    console.log('🔄 Actualizando préstamo:', loanId);
    
    // Eliminar el cronograma anterior
    await prisma.paymentSchedule.deleteMany({
      where: { loanId: loanId }
    });
    
    // Actualizar el préstamo y crear nuevo cronograma
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        ...mappedLoanInfo,
        schedule: schedule ? {
          create: schedule.map(payment => ({
            month: payment.month,
            paymentDate: payment.paymentDate || payment.date,
            date: payment.date || payment.paymentDate,
            payment: payment.payment,
            principal: payment.principal,
            interest: payment.interest,
            interestTax: payment.interestTax || payment.vatOnInterest || 0,
            vatOnInterest: payment.vatOnInterest || payment.interestTax || 0,
            commission: payment.commission || 0,
            commissionTax: payment.commissionTax || 0,
            balance: payment.balance,
            isInitialPayment: payment.isInitialPayment || false
          }))
        } : undefined
      },
      include: {
        schedule: {
          orderBy: { month: 'asc' }
        }
      }
    });
    
    return { success: true, data: serializeBigInt(updatedLoan) };
  } catch (error) {
    console.error('Error actualizando préstamo:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar un préstamo
export const deleteLoan = async (id) => {
  try {
    // Convertir ID a BigInt si es necesario
    const loanId = typeof id === 'string' ? BigInt(id) : BigInt(id);
    
    await prisma.loan.delete({
      where: { id: loanId }
    });
    
    return { success: true, message: 'Préstamo eliminado correctamente' };
  } catch (error) {
    console.error('Error eliminando préstamo:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas generales
export const getStats = async () => {
  try {
    const totalLoans = await prisma.loan.count();
    const totalAmount = await prisma.loan.aggregate({
      _sum: { amount: true }
    });
    const totalToPay = await prisma.loan.aggregate({
      _sum: { totalPayment: true }
    });
    
    return {
      success: true,
      data: {
        totalLoans,
        totalAmount: totalAmount._sum.amount || 0,
        totalToPay: totalToPay._sum.totalPayment || 0
      }
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return { success: false, error: error.message };
  }
};

// Función específica para migración con manejo inteligente de duplicados
export const migrateLoan = async (loanData) => {
  try {
    const { schedule, ...loanInfo } = loanData;
    
    // Verificar si ya existe
    const existingLoan = await prisma.loan.findUnique({
      where: { id: BigInt(loanInfo.id) }
    });

    if (existingLoan) {
      console.log('⚠️ Préstamo ya migrado, omitiendo:', loanInfo.name);
      return { 
        success: true, 
        data: serializeBigInt(existingLoan), 
        skipped: true, 
        message: 'Préstamo ya existe, se omitió la migración' 
      };
    }

    // Si no existe, crear nuevo préstamo
    console.log('✅ Migrando préstamo:', loanInfo.name);
    return await createLoan(loanData);
    
  } catch (error) {
    console.error('Error en migración:', error);
    return { success: false, error: error.message };
  }
};
