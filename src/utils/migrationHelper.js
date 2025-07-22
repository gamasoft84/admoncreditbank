// Utilidad para migrar datos de localStorage a la base de datos SQLite
import { loanAPI, checkAPIConnection } from '../services/apiService';

export class MigrationHelper {
  static STORAGE_KEY = 'prestamoBnk_loans';

  /**
   * Verificar si hay datos en localStorage para migrar
   */
  static checkLocalStorageData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const loans = data ? JSON.parse(data) : [];
      
      return {
        hasData: loans.length > 0,
        count: loans.length,
        loans: loans
      };
    } catch (error) {
      console.error('Error al verificar localStorage:', error);
      return {
        hasData: false,
        count: 0,
        loans: [],
        error: error.message
      };
    }
  }

  /**
   * Verificar el estado de la API
   */
  static async checkAPIStatus() {
    try {
      const isAvailable = await checkAPIConnection();
      
      if (isAvailable) {
        // También obtener préstamos existentes en la BD
        const existingLoans = await loanAPI.getAll();
        return {
          available: true,
          existingCount: existingLoans.length,
          existingLoans: existingLoans
        };
      }
      
      return {
        available: false,
        error: 'API no disponible'
      };
    } catch (error) {
      console.error('Error al verificar API:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }

  /**
   * Migrar datos específicos de localStorage a la API
   */
  static async migrateData(options = {}) {
    const { 
      overwriteExisting = false, 
      onProgress = null,
      dryRun = false 
    } = options;

    try {
      // 1. Verificar localStorage
      const localData = this.checkLocalStorageData();
      if (!localData.hasData) {
        return {
          success: false,
          message: 'No hay datos en localStorage para migrar',
          details: localData
        };
      }

      // 2. Verificar API
      const apiStatus = await this.checkAPIStatus();
      if (!apiStatus.available) {
        return {
          success: false,
          message: 'API no está disponible',
          details: apiStatus
        };
      }

      console.log(`📊 Iniciando migración:`);
      console.log(`   • Préstamos en localStorage: ${localData.count}`);
      console.log(`   • Préstamos en base de datos: ${apiStatus.existingCount}`);
      
      if (dryRun) {
        return {
          success: true,
          message: 'Simulación completada',
          details: {
            localStorageCount: localData.count,
            databaseCount: apiStatus.existingCount,
            wouldMigrate: localData.loans.map(loan => ({
              id: loan.id,
              name: loan.name,
              amount: loan.amount
            }))
          }
        };
      }

      // 3. Procesar migración
      const results = {
        migrated: 0,
        skipped: 0,
        errors: [],
        details: []
      };

      for (let i = 0; i < localData.loans.length; i++) {
        const loan = localData.loans[i];
        
        try {
          // Verificar si ya existe en la BD
          const existingLoan = apiStatus.existingLoans.find(
            dbLoan => dbLoan.id === loan.id || dbLoan.name === loan.name
          );

          if (existingLoan && !overwriteExisting) {
            results.skipped++;
            results.details.push({
              loan: loan.name,
              action: 'skipped',
              reason: 'Ya existe en la base de datos'
            });
            console.log(`⏭️  Saltando: ${loan.name} (ya existe)`);
          } else {
            // Crear nuevo préstamo en la BD
            const migratedLoan = await loanAPI.create(loan);
            results.migrated++;
            results.details.push({
              loan: loan.name,
              action: 'migrated',
              id: migratedLoan.id
            });
            console.log(`✅ Migrado: ${loan.name}`);
          }

          // Callback de progreso
          if (onProgress) {
            onProgress({
              current: i + 1,
              total: localData.loans.length,
              loan: loan.name,
              migrated: results.migrated,
              skipped: results.skipped
            });
          }

        } catch (error) {
          console.error(`❌ Error migrando ${loan.name}:`, error);
          results.errors.push({
            loan: loan.name,
            error: error.message
          });
        }
      }

      // 4. Resumen final
      const message = `Migración completada: ${results.migrated} migrados, ${results.skipped} saltados, ${results.errors.length} errores`;
      
      return {
        success: results.migrated > 0 || results.errors.length === 0,
        message,
        details: results
      };

    } catch (error) {
      console.error('Error durante la migración:', error);
      return {
        success: false,
        message: `Error durante la migración: ${error.message}`,
        error: error
      };
    }
  }

  /**
   * Crear backup del localStorage antes de migrar
   */
  static createBackup() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `${this.STORAGE_KEY}_backup_${timestamp}`;
        localStorage.setItem(backupKey, data);
        
        // También crear backup como archivo descargable
        const dataStr = JSON.stringify(JSON.parse(data), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `prestamos_backup_${timestamp}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return {
          success: true,
          message: 'Backup creado exitosamente',
          backupKey,
          filename: exportFileDefaultName
        };
      }
      
      return {
        success: false,
        message: 'No hay datos para respaldar'
      };
    } catch (error) {
      console.error('Error creando backup:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Limpiar localStorage después de migración exitosa
   */
  static cleanupAfterMigration(confirm = false) {
    if (!confirm) {
      console.warn('⚠️  Para limpiar localStorage, debe confirmar explícitamente');
      return {
        success: false,
        message: 'Confirmación requerida para limpiar localStorage'
      };
    }

    try {
      // Crear un último backup antes de limpiar
      const backup = this.createBackup();
      
      // Limpiar el localStorage
      localStorage.removeItem(this.STORAGE_KEY);
      
      return {
        success: true,
        message: 'localStorage limpiado exitosamente',
        backup: backup
      };
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Obtener resumen del estado actual
   */
  static async getStatus() {
    const localData = this.checkLocalStorageData();
    const apiStatus = await this.checkAPIStatus();
    
    return {
      localStorage: localData,
      api: apiStatus,
      needsMigration: localData.hasData && apiStatus.available,
      timestamp: new Date().toISOString()
    };
  }
}

export default MigrationHelper;
