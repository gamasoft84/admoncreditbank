// Script para eliminar todos los clientes
// Ejecutar con: node scripts/deleteAllClients.js

// Función auxiliar para hacer fetch (compatible con Node.js)
async function httpRequest(url, options = {}) {
  // Verificar si fetch está disponible globalmente
  if (typeof fetch === 'undefined') {
    // Importar fetch dinámicamente para versiones de Node.js que no lo tienen
    const { default: fetch } = await import('node-fetch');
    return fetch(url, options);
  }
  return fetch(url, options);
}

// Función para eliminar todos los clientes
async function eliminarTodosLosClientes() {
  console.log('🗑️ Eliminando todos los clientes existentes...');
  
  try {
    // Obtener todos los clientes
    const response = await httpRequest('http://localhost:3001/api/clients');
    if (!response.ok) {
      console.log('❌ Error obteniendo clientes existentes');
      return false;
    }
    
    const clientes = await response.json();
    
    if (clientes.length === 0) {
      console.log('ℹ️ No hay clientes para eliminar');
      return true;
    }
    
    console.log(`📊 Se encontraron ${clientes.length} clientes para eliminar`);
    
    let eliminados = 0;
    let errores = 0;
    
    // Eliminar cada cliente
    for (const cliente of clientes) {
      try {
        const deleteResponse = await httpRequest(`http://localhost:3001/api/clients/${cliente.id}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          console.log(`🗑️ Cliente eliminado: ${cliente.name} (ID: ${cliente.id})`);
          eliminados++;
        } else {
          console.log(`❌ Error eliminando ${cliente.name}`);
          errores++;
        }
      } catch (error) {
        console.log(`❌ Error eliminando ${cliente.name}: ${error.message}`);
        errores++;
      }
    }
    
    console.log(`\n📋 Eliminación completada: ${eliminados} eliminados, ${errores} errores`);
    
    if (errores === 0) {
      console.log('🎉 ¡Todos los clientes fueron eliminados exitosamente!');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error en la eliminación:', error.message);
    return false;
  }
}

// Ejecutar la eliminación
(async function() {
  console.log('🔄 Iniciando eliminación de todos los clientes...');
  
  try {
    const exitoso = await eliminarTodosLosClientes();
    
    if (exitoso) {
      console.log('\n✅ Proceso de eliminación completado');
      process.exit(0);
    } else {
      console.log('\n❌ Error en el proceso de eliminación');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error durante la eliminación:', error.message);
    process.exit(1);
  }
})();
