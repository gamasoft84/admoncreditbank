// Script para eliminar y recargar clientes de prueba
// Ejecutar con: node scripts/resetClients.js

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
    return true;
  } catch (error) {
    console.log('❌ Error en la eliminación:', error.message);
    return false;
  }
}

// Función para crear clientes de prueba
async function crearClientesPrueba() {
  console.log('🔄 Creando clientes de prueba...');
  
  const clientesPrueba = [
    {
      name: "Ricardo Gama",
      email: "richardgama@yahoo.com.mx",
      phone: "55 1537 7335",
      rfc: "GAGR840523KL3",
      curp: "GAGR840523HMCMRC00",
      address: "Calle Juarez 5210"
    },
    {
      name: "Dafne Avila",
      email: "dafnefam@gmail.com",
      phone: "555-345-6789",
      rfc: "AIMD850917F14",
      curp: "AIMD850917MGRVRF13",
      address: "Av. Universidad 789, Col. Del Valle, CDMX, CP 03100"
    },
    {
      name: "BIENES RAICES S.A.",
      email: "bienes.raices@hotmail.com",
      phone: "555-456-7890",
      rfc: "",
      curp: "",
      address: "Blvd. Díaz Ordaz 321, Col. San Pedro, Monterrey, NL, CP 64650"
    }
  ];

  let created = 0;
  let errors = 0;

  for (const cliente of clientesPrueba) {
    try {
      const response = await httpRequest('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Cliente creado: ${cliente.name} (ID: ${result.id})`);
        created++;
      } else {
        const errorData = await response.json();
        console.log(`❌ Error creando ${cliente.name}: ${errorData.error}`);
        errors++;
      }
    } catch (error) {
      console.log(`❌ Error creando ${cliente.name}: ${error.message}`);
      errors++;
    }
  }

  console.log('\n=== RESUMEN ===');
  console.log(`✅ Clientes creados: ${created}`);
  console.log(`❌ Errores: ${errors}`);
  
  if (created > 0) {
    console.log('\n🎉 ¡Clientes de prueba creados exitosamente!');
    console.log('💡 Ahora puedes usar estos clientes al crear préstamos');
  }
  
  return created > 0;
}

// Función principal
async function resetClientes() {
  console.log('🔄 Iniciando proceso de reset de clientes...');
  
  try {
    // Primero eliminar todos los clientes existentes
    const eliminacionExitosa = await eliminarTodosLosClientes();
    
    if (!eliminacionExitosa) {
      console.log('❌ No se pudo completar la eliminación. Deteniendo el proceso.');
      process.exit(1);
    }
    
    // Pequeña pausa para asegurar que las eliminaciones se completaron
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Luego crear los nuevos clientes
    const creacionExitosa = await crearClientesPrueba();
    
    if (creacionExitosa) {
      console.log('\n🎉 ¡Reset de clientes completado exitosamente!');
      process.exit(0);
    } else {
      console.log('\n❌ Error en la creación de clientes');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error.message);
    process.exit(1);
  }
}

// Ejecutar el reset
resetClientes();
