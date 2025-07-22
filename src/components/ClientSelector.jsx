import React, { useState, useEffect } from 'react';
import { Search, Plus, User, X } from 'lucide-react';

const ClientSelector = ({ selectedClient, onClientSelect, onCreateClient, required = false }) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar clientes
  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.rfc && client.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client) => {
    onClientSelect(client);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onClientSelect(null);
  };

  const handleCreateNew = () => {
    setIsOpen(false);
    if (onCreateClient) {
      onCreateClient();
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cliente {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Cliente seleccionado */}
      {selectedClient ? (
        <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedClient.name}</p>
              {selectedClient.email && (
                <p className="text-sm text-gray-500">{selectedClient.email}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Botón para abrir selector */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-3 border border-gray-300 rounded-lg text-left text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <div className="flex items-center justify-between">
            <span>Seleccionar cliente...</span>
            <Search className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* Modal de selección */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seleccionar Cliente
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Búsqueda */}
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o RFC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de clientes */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Cargando clientes...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-4">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          {client.email && (
                            <p className="text-sm text-gray-500">{client.email}</p>
                          )}
                          {client.rfc && (
                            <p className="text-xs text-gray-400">RFC: {client.rfc}</p>
                          )}
                          {client.loans && client.loans.length > 0 && (
                            <p className="text-xs text-blue-600">
                              {client.loans.length} préstamo{client.loans.length !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleCreateNew}
                className="w-full flex items-center justify-center space-x-2 p-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Crear nuevo cliente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
