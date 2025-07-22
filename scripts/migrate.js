// Script de migración simple para ejecutar desde la consola del navegador
// Copialo y pegalo en la consola del navegador (F12 → Console)

(async function migrarDatos() {
  console.log('🔄 Iniciando migración de datos...');
  
  try {
    // 1. Verificar datos en localStorage
    const localData = localStorage.getItem('prestamoBnk_loans'); // Cambiado de 'prestamoBnk_loans' a 'prestamoBnk_loans'
    if (!localData) {
      console.log('❌ No hay datos en localStorage para migrar');
      console.log('💡 Intentando buscar con clave alternativa...');
      
      const altData = localStorage.getItem('prestamoBnk_loans');
      if (!altData) {
        console.log('❌ Tampoco se encontraron datos con clave alternativa');
        console.log('💡 Para crear datos de prueba, ejecuta el script createTestData.js');
        return;
      } else {
        console.log('✅ Encontrados datos con clave alternativa');
        localStorage.setItem('prestamoBnk_loans', altData); // Migrar datos a la clave correcta
      }
    }
    
    const finalData = localStorage.getItem('prestamoBnk_loans');
    const loans = JSON.parse(finalData);
    console.log(`📊 Encontrados ${loans.length} préstamos en localStorage`);
    
    // 2. Verificar API
    const apiCheck = await fetch('http://localhost:3001/api/health');
    if (!apiCheck.ok) {
      console.log('❌ API no disponible. Asegúrate de que el servidor esté ejecutándose.');
      console.log('💡 Ejecuta: npm run server');
      return;
    }
    
    console.log('✅ API disponible');
    
    // 3. Migrar cada préstamo
    let migrated = 0;
    let errors = 0;
    let skipped = 0;
    
    for (const loan of loans) {
      try {
        // Mapear datos para compatibilidad con el esquema de la BD
        const mappedLoan = {
          ...loan,
          // Asegurar compatibilidad de campos
          principal: loan.principal || loan.amount,
          amount: loan.amount || loan.principal,
          interestRate: loan.interestRate || loan.annualRate,
          termMonths: loan.termMonths || loan.months,
          monthlyPaymentWithTax: loan.monthlyPaymentWithTax || loan.monthlyPayment,
        };
        
        const response = await fetch('http://localhost:3001/api/migrate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedLoan)
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.skipped) {
            skipped++;
            console.log(`⏭️  Saltado: ${loan.name} (ya existe)`);
          } else {
            migrated++;
            console.log(`✅ Migrado: ${loan.name}`);
          }
        } else {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { error: errorText };
          }
          
          if (errorData.error && (errorData.error.includes('already exists') || errorData.error.includes('Unique constraint'))) {
            skipped++;
            console.log(`⏭️  Saltado: ${loan.name} (ya existe)`);
          } else {
            console.log(`❌ Error migrando ${loan.name}: ${errorData.error || errorText}`);
            errors++;
          }
        }
      } catch (error) {
        console.log(`❌ Error migrando ${loan.name}: ${error.message}`);
        errors++;
      }
    }
    
    // 4. Resumen
    console.log('\n=== RESUMEN DE MIGRACIÓN ===');
    console.log(`✅ Préstamos migrados: ${migrated}`);
    console.log(`⏭️  Préstamos saltados: ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    
    if (migrated > 0) {
      console.log('\n🎉 ¡Migración completada!');
      console.log('📍 Recarga la página para ver los datos en la base de datos');
      console.log('💡 Puedes limpiar localStorage después de verificar que todo esté bien');
      
      // Preguntar si quiere recargar
      if (confirm('¿Quieres recargar la página para ver los datos migrados?')) {
        window.location.reload();
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
})();

// También exponer funciones útiles
window.migrationUtils = {
  // Verificar datos en localStorage
  checkLocalStorage: () => {
    const data = localStorage.getItem('prestamoBnk_loans');
    const loans = data ? JSON.parse(data) : [];
    console.log(`localStorage: ${loans.length} préstamos`);
    return loans;
  },
  
  // Verificar API
  checkAPI: async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      console.log(`API: ${response.ok ? 'Disponible' : 'No disponible'}`);
      return response.ok;
    } catch (error) {
      console.log('API: No disponible');
      return false;
    }
  },
  
  // Limpiar localStorage (después de migración exitosa)
  clearLocalStorage: () => {
    if (confirm('⚠️ ¿Estás seguro de que quieres limpiar localStorage? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('prestamoBnk_loans');
      localStorage.removeItem('prestamoBnk_loans'); // También limpiar la clave alternativa
      console.log('✅ localStorage limpiado');
    }
  },
  
  // Crear backup
  createBackup: () => {
    const data = localStorage.getItem('prestamoBnk_loans');
    if (data) {
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);
      const filename = `prestamos_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', filename);
      link.click();
      
      console.log(`✅ Backup creado: ${filename}`);
    } else {
      console.log('❌ No hay datos para respaldar');
    }
  }
};

console.log('\n📚 Funciones disponibles:');
console.log('• migrationUtils.checkLocalStorage() - Verificar datos locales');
console.log('• migrationUtils.checkAPI() - Verificar API');  
console.log('• migrationUtils.createBackup() - Crear backup');
console.log('• migrationUtils.clearLocalStorage() - Limpiar datos locales');
