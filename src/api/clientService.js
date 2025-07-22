import prisma from './database.js';

// Función para convertir BigInt a string para serialización JSON
const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

// Obtener todos los clientes
export const getAllClients = async () => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        loans: {
          select: {
            id: true,
            name: true,
            principal: true,
            createdAt: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: serializeBigInt(clients) };
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return { success: false, error: error.message };
  }
};

// Obtener cliente por ID
export const getClientById = async (id) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        loans: {
          include: {
            schedule: {
              orderBy: { month: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!client) {
      return { success: false, error: 'Cliente no encontrado' };
    }
    
    return { success: true, data: serializeBigInt(client) };
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    return { success: false, error: error.message };
  }
};

// Crear nuevo cliente
export const createClient = async (clientData) => {
  try {
    const newClient = await prisma.client.create({
      data: {
        name: clientData.name,
        email: clientData.email || null,
        phone: clientData.phone || null,
        rfc: clientData.rfc || null,
        curp: clientData.curp || null,
        address: clientData.address || null
      }
    });
    
    return { success: true, data: serializeBigInt(newClient) };
  } catch (error) {
    console.error('Error creando cliente:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar cliente
export const updateClient = async (id, clientData) => {
  try {
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name: clientData.name,
        email: clientData.email || null,
        phone: clientData.phone || null,
        rfc: clientData.rfc || null,
        curp: clientData.curp || null,
        address: clientData.address || null
      }
    });
    
    return { success: true, data: serializeBigInt(updatedClient) };
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar cliente
export const deleteClient = async (id) => {
  try {
    // Verificar si el cliente tiene préstamos
    const clientWithLoans = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: { loans: true }
    });
    
    if (clientWithLoans && clientWithLoans.loans.length > 0) {
      return { 
        success: false, 
        error: 'No se puede eliminar el cliente porque tiene préstamos asociados' 
      };
    }
    
    await prisma.client.delete({
      where: { id: parseInt(id) }
    });
    
    return { success: true, message: 'Cliente eliminado correctamente' };
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    return { success: false, error: error.message };
  }
};

// Buscar clientes por nombre
export const searchClients = async (searchTerm) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      include: {
        loans: {
          select: {
            id: true,
            name: true,
            principal: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return { success: true, data: serializeBigInt(clients) };
  } catch (error) {
    console.error('Error buscando clientes:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas de clientes
export const getClientStats = async () => {
  try {
    const totalClients = await prisma.client.count();
    const clientsWithLoans = await prisma.client.count({
      where: {
        loans: {
          some: {}
        }
      }
    });
    
    return {
      success: true,
      data: {
        totalClients,
        clientsWithLoans,
        clientsWithoutLoans: totalClients - clientsWithLoans
      }
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de clientes:', error);
    return { success: false, error: error.message };
  }
};
