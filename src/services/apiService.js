// Configuración de la API
const API_BASE_URL = 'http://localhost:3001/api';

// Función auxiliar para hacer requests HTTP
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API Functions
export const loanAPI = {
  // Obtener todos los préstamos
  getAll: async () => {
    return await apiRequest('/loans');
  },

  // Obtener un préstamo por ID
  getById: async (id) => {
    return await apiRequest(`/loans/${id}`);
  },

  // Crear un nuevo préstamo
  create: async (loanData) => {
    return await apiRequest('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  },

  // Actualizar un préstamo
  update: async (id, loanData) => {
    return await apiRequest(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(loanData),
    });
  },

  // Eliminar un préstamo
  delete: async (id) => {
    return await apiRequest(`/loans/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener estadísticas
  getStats: async () => {
    return await apiRequest('/stats');
  },

  // Verificar estado de la API
  health: async () => {
    return await apiRequest('/health');
  }
};

// Función para verificar si la API está disponible
export const checkAPIConnection = async () => {
  try {
    await loanAPI.health();
    return true;
  } catch (error) {
    return false;
  }
};
