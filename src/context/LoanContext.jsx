import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateCurrentBalance, generateLoanStats } from '../utils/financial';

// Crear el contexto
const LoanContext = createContext();

// Estados de la aplicación
const initialState = {
  loans: [],
  currentLoan: null,
  loading: false,
  error: null,
  stats: {
    totalLoans: 0,
    totalAmount: 0,
    totalToPay: 0,
    totalPaid: 0,
    totalPending: 0,
    averageProgress: 0
  }
};

// Tipos de acciones
export const LOAN_ACTIONS = {
  LOAD_LOANS: 'LOAD_LOANS',
  ADD_LOAN: 'ADD_LOAN',
  UPDATE_LOAN: 'UPDATE_LOAN',
  DELETE_LOAN: 'DELETE_LOAN',
  SET_CURRENT_LOAN: 'SET_CURRENT_LOAN',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer para manejar el estado
const loanReducer = (state, action) => {
  switch (action.type) {
    case LOAN_ACTIONS.LOAD_LOANS:
      return {
        ...state,
        loans: action.payload,
        loading: false,
        stats: generateLoanStats(action.payload)
      };

    case LOAN_ACTIONS.ADD_LOAN:
      const newLoans = [...state.loans, action.payload];
      return {
        ...state,
        loans: newLoans,
        stats: generateLoanStats(newLoans)
      };

    case LOAN_ACTIONS.UPDATE_LOAN:
      const updatedLoans = state.loans.map(loan =>
        loan.id === action.payload.id ? action.payload : loan
      );
      return {
        ...state,
        loans: updatedLoans,
        stats: generateLoanStats(updatedLoans)
      };

    case LOAN_ACTIONS.DELETE_LOAN:
      const filteredLoans = state.loans.filter(loan => loan.id !== action.payload);
      return {
        ...state,
        loans: filteredLoans,
        stats: generateLoanStats(filteredLoans)
      };

    case LOAN_ACTIONS.SET_CURRENT_LOAN:
      return {
        ...state,
        currentLoan: action.payload
      };

    case LOAN_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case LOAN_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case LOAN_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case LOAN_ACTIONS.UPDATE_STATS:
      return {
        ...state,
        stats: generateLoanStats(state.loans)
      };

    default:
      return state;
  }
};

// Proveedor del contexto
export const LoanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  // Cargar préstamos del localStorage al iniciar
  useEffect(() => {
    loadLoansFromStorage();
  }, []);

  // Guardar préstamos en localStorage cuando cambien
  useEffect(() => {
    if (state.loans.length > 0) {
      saveLoansToStorage(state.loans);
    }
  }, [state.loans]);

  // Funciones para manejar localStorage
  const loadLoansFromStorage = () => {
    try {
      dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
      const saved = localStorage.getItem('prestamoBnk_loans');
      const loans = saved ? JSON.parse(saved) : [];
      dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: loans });
    } catch (error) {
      console.error('Error loading loans from storage:', error);
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al cargar los préstamos' });
    }
  };

  const saveLoansToStorage = (loans) => {
    try {
      localStorage.setItem('prestamoBnk_loans', JSON.stringify(loans));
    } catch (error) {
      console.error('Error saving loans to storage:', error);
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al guardar los préstamos' });
    }
  };

  // Acciones del contexto
  const actions = {
    // Agregar nuevo préstamo
    addLoan: (loanData) => {
      try {
        const existingLoan = state.loans.find(loan => loan.name === loanData.name);
        if (existingLoan) {
          throw new Error('Ya existe un préstamo con este nombre');
        }
        dispatch({ type: LOAN_ACTIONS.ADD_LOAN, payload: loanData });
        return { success: true, message: 'Préstamo agregado exitosamente' };
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
      }
    },

    // Actualizar préstamo existente
    updateLoan: (loanData) => {
      try {
        const existingLoan = state.loans.find(loan => loan.id === loanData.id);
        if (!existingLoan) {
          throw new Error('Préstamo no encontrado');
        }
        dispatch({ type: LOAN_ACTIONS.UPDATE_LOAN, payload: loanData });
        return { success: true, message: 'Préstamo actualizado exitosamente' };
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
      }
    },

    // Eliminar préstamo
    deleteLoan: (loanId) => {
      try {
        const existingLoan = state.loans.find(loan => loan.id === loanId);
        if (!existingLoan) {
          throw new Error('Préstamo no encontrado');
        }
        dispatch({ type: LOAN_ACTIONS.DELETE_LOAN, payload: loanId });
        return { success: true, message: 'Préstamo eliminado exitosamente' };
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
      }
    },

    // Obtener préstamo por ID
    getLoanById: (loanId) => {
      return state.loans.find(loan => loan.id === loanId) || null;
    },

    // Establecer préstamo actual
    setCurrentLoan: (loan) => {
      dispatch({ type: LOAN_ACTIONS.SET_CURRENT_LOAN, payload: loan });
    },

    // Obtener estadísticas actualizadas
    getUpdatedStats: () => {
      const loansWithCurrentBalance = state.loans.map(loan => ({
        ...loan,
        currentBalance: calculateCurrentBalance(loan)
      }));
      return generateLoanStats(loansWithCurrentBalance);
    },

    // Limpiar error
    clearError: () => {
      dispatch({ type: LOAN_ACTIONS.CLEAR_ERROR });
    },

    // Limpiar todos los préstamos
    clearAllLoans: () => {
      try {
        localStorage.removeItem('prestamoBnk_loans');
        dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: [] });
        return { success: true, message: 'Todos los préstamos han sido eliminados' };
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al limpiar los préstamos' });
        return { success: false, message: 'Error al limpiar los préstamos' };
      }
    },

    // Exportar préstamos
    exportLoans: () => {
      try {
        const dataStr = JSON.stringify(state.loans, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `prestamos_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return { success: true, message: 'Préstamos exportados exitosamente' };
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al exportar los préstamos' });
        return { success: false, message: 'Error al exportar los préstamos' };
      }
    },

    // Importar préstamos
    importLoans: (file) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedLoans = JSON.parse(e.target.result);
            if (Array.isArray(importedLoans)) {
              dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: importedLoans });
              return { success: true, message: 'Préstamos importados exitosamente' };
            } else {
              throw new Error('Formato de archivo inválido');
            }
          } catch (parseError) {
            dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al procesar el archivo' });
          }
        };
        reader.readAsText(file);
      } catch (error) {
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al importar los préstamos' });
        return { success: false, message: 'Error al importar los préstamos' };
      }
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan debe ser usado dentro de un LoanProvider');
  }
  return context;
};
