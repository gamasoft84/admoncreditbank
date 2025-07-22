import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateCurrentBalance, generateLoanStats } from '../utils/financial';
import { loanAPI, checkAPIConnection } from '../services/apiService';

// Crear el contexto
const LoanContext = createContext();

// Estados de la aplicación
const initialState = {
  loans: [],
  currentLoan: null,
  loading: false,
  error: null,
  useAPI: false, // Flag para determinar si usar API o localStorage
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
  UPDATE_STATS: 'UPDATE_STATS',
  SET_API_MODE: 'SET_API_MODE'
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

    case LOAN_ACTIONS.SET_API_MODE:
      return {
        ...state,
        useAPI: action.payload
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

  // Inicializar conexión y cargar datos
  useEffect(() => {
    initializeDataSource();
  }, []);

  // Guardar préstamos en localStorage cuando cambien (solo si no usa API)
  useEffect(() => {
    if (state.loans.length > 0 && !state.useAPI) {
      saveLoansToStorage(state.loans);
    }
  }, [state.loans, state.useAPI]);

  // Inicializar fuente de datos (API o localStorage)
  const initializeDataSource = async () => {
    try {
      dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
      
      // Verificar si la API está disponible
      const apiAvailable = await checkAPIConnection();
      
      if (apiAvailable) {
        console.log('✅ API disponible, usando base de datos');
        dispatch({ type: LOAN_ACTIONS.SET_API_MODE, payload: true });
        await loadLoansFromAPI();
      } else {
        console.log('⚠️ API no disponible, usando localStorage');
        dispatch({ type: LOAN_ACTIONS.SET_API_MODE, payload: false });
        loadLoansFromStorage();
      }
    } catch (error) {
      console.error('Error inicializando fuente de datos:', error);
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al inicializar datos' });
      // Fallback a localStorage
      dispatch({ type: LOAN_ACTIONS.SET_API_MODE, payload: false });
      loadLoansFromStorage();
    }
  };

  // Cargar préstamos desde API
  const loadLoansFromAPI = async () => {
    try {
      const loans = await loanAPI.getAll();
      dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: loans });
    } catch (error) {
      console.error('Error cargando desde API:', error);
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: 'Error al cargar préstamos desde la base de datos' });
      // Fallback a localStorage
      dispatch({ type: LOAN_ACTIONS.SET_API_MODE, payload: false });
      loadLoansFromStorage();
    }
  };

  // Funciones para manejar localStorage
  const loadLoansFromStorage = () => {
    try {
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
    addLoan: async (loanData) => {
      try {
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
        
        if (state.useAPI) {
          // Usar API
          const newLoan = await loanAPI.create(loanData);
          dispatch({ type: LOAN_ACTIONS.ADD_LOAN, payload: newLoan });
        } else {
          // Usar localStorage
          const existingLoan = state.loans.find(loan => loan.name === loanData.name);
          if (existingLoan) {
            throw new Error('Ya existe un préstamo con ese nombre');
          }
          dispatch({ type: LOAN_ACTIONS.ADD_LOAN, payload: loanData });
        }
        
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        console.error('Error adding loan:', error);
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    // Actualizar préstamo existente
    updateLoan: async (loanData) => {
      try {
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
        
        if (state.useAPI) {
          // Usar API
          const updatedLoan = await loanAPI.update(loanData.id, loanData);
          dispatch({ type: LOAN_ACTIONS.UPDATE_LOAN, payload: updatedLoan });
        } else {
          // Usar localStorage
          const existingLoan = state.loans.find(loan => loan.id === loanData.id);
          if (!existingLoan) {
            throw new Error('Préstamo no encontrado');
          }
          dispatch({ type: LOAN_ACTIONS.UPDATE_LOAN, payload: loanData });
        }
        
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: 'Préstamo actualizado exitosamente' };
      } catch (error) {
        console.error('Error updating loan:', error);
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
      }
    },

    // Eliminar préstamo
    deleteLoan: async (loanId) => {
      try {
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
        
        if (state.useAPI) {
          // Usar API
          await loanAPI.delete(loanId);
          dispatch({ type: LOAN_ACTIONS.DELETE_LOAN, payload: loanId });
        } else {
          // Usar localStorage
          dispatch({ type: LOAN_ACTIONS.DELETE_LOAN, payload: loanId });
        }
        
        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: 'Préstamo eliminado exitosamente' };
      } catch (error) {
        console.error('Error deleting loan:', error);
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
      }
    },

    // Obtener préstamo por ID
    getLoanById: (loanId) => {
      return state.loans.find(loan => loan.id === loanId);
    },

    // Establecer préstamo actual
    setCurrentLoan: (loan) => {
      dispatch({ type: LOAN_ACTIONS.SET_CURRENT_LOAN, payload: loan });
    },

    // Obtener estadísticas actualizadas
    getUpdatedStats: () => {
      const stats = generateLoanStats(state.loans);
      dispatch({ type: LOAN_ACTIONS.UPDATE_STATS, payload: stats });
      return stats;
    },

    // Limpiar error
    clearError: () => {
      dispatch({ type: LOAN_ACTIONS.CLEAR_ERROR });
    },

    // Limpiar todos los préstamos (solo para testing)
    clearAllLoans: () => {
      if (confirm('¿Estás seguro de que quieres eliminar todos los préstamos?')) {
        dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: [] });
        if (!state.useAPI) {
          localStorage.removeItem('prestamoBnk_loans');
        }
      }
    },

    // Exportar préstamos
    exportLoans: () => {
      try {
        const dataStr = JSON.stringify(state.loans, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `prestamos_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return { success: true, message: 'Préstamos exportados exitosamente' };
      } catch (error) {
        console.error('Error exporting loans:', error);
        return { success: false, message: 'Error al exportar los préstamos' };
      }
    },

    // Importar préstamos
    importLoans: (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedLoans = JSON.parse(e.target.result);
            if (Array.isArray(importedLoans)) {
              dispatch({ type: LOAN_ACTIONS.LOAD_LOANS, payload: importedLoans });
              resolve({ success: true, message: `${importedLoans.length} préstamos importados exitosamente` });
            } else {
              resolve({ success: false, message: 'Formato de archivo inválido' });
            }
          } catch (error) {
            resolve({ success: false, message: 'Error al leer el archivo' });
          }
        };
        reader.readAsText(file);
      });
    },

    // Migrar datos de localStorage a API
    migrateToAPI: async () => {
      try {
        if (state.useAPI) {
          return { success: false, message: 'Ya estás usando la API' };
        }

        const localStorageLoans = JSON.parse(localStorage.getItem('prestamoBnk_loans') || '[]');
        
        if (localStorageLoans.length === 0) {
          return { success: false, message: 'No hay datos en localStorage para migrar' };
        }

        // Intentar conectar con API
        const apiAvailable = await checkAPIConnection();
        if (!apiAvailable) {
          return { success: false, message: 'API no disponible' };
        }

        dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
        
        // Migrar cada préstamo
        let migratedCount = 0;
        for (const loan of localStorageLoans) {
          try {
            await loanAPI.create(loan);
            migratedCount++;
          } catch (error) {
            console.error('Error migrando préstamo:', loan.name, error);
          }
        }

        // Cambiar a modo API y recargar datos
        dispatch({ type: LOAN_ACTIONS.SET_API_MODE, payload: true });
        await loadLoansFromAPI();
        
        return { 
          success: true, 
          message: `${migratedCount}/${localStorageLoans.length} préstamos migrados exitosamente` 
        };
      } catch (error) {
        console.error('Error durante migración:', error);
        dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
        return { success: false, message: error.message };
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

// Hook para usar el contexto
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan debe ser usado dentro de un LoanProvider');
  }
  return context;
};

export default LoanContext;
