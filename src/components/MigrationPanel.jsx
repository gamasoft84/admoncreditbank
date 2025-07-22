import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const MigrationPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setMigrationResult(null);

    try {
      // Obtener datos de localStorage
      const localStorageLoans = localStorage.getItem('loans');
      if (!localStorageLoans) {
        setMigrationResult({
          success: false,
          message: 'No se encontraron préstamos en localStorage',
          details: { migrated: 0, skipped: 0, errors: 0 }
        });
        return;
      }

      const loans = JSON.parse(localStorageLoans);
      const results = {
        migrated: 0,
        skipped: 0,
        errors: 0,
        errorDetails: []
      };

      console.log(`🔄 Iniciando migración de ${loans.length} préstamos...`);

      // Migrar cada préstamo
      for (const loan of loans) {
        try {
          // Mapear datos para compatibilidad
          const mappedLoan = {
            ...loan,
            // Asegurar campos requeridos
            principal: loan.principal || loan.amount || 0,
            amount: loan.amount || loan.principal || 0,
            interestRate: loan.interestRate || loan.annualRate,
            termMonths: loan.termMonths || loan.months,
            monthlyPaymentWithTax: loan.monthlyPaymentWithTax || loan.monthlyPayment,
          };

          console.log('🔄 Migrando préstamo:', mappedLoan.name, 'Principal:', mappedLoan.principal, 'Amount:', mappedLoan.amount);
          
          const response = await fetch('http://localhost:3001/api/loans', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mappedLoan),
          });

          if (response.ok) {
            results.migrated++;
            console.log('✅ Migrado exitosamente:', mappedLoan.name);
          } else {
            const errorText = await response.text();
            console.log('❌ Error al migrar:', mappedLoan.name, errorText);
            results.errors++;
            results.errorDetails.push({
              loan: mappedLoan.name,
              error: errorText
            });
          }
        } catch (error) {
          console.error('❌ Error al procesar préstamo:', loan.name, error);
          results.errors++;
          results.errorDetails.push({
            loan: loan.name,
            error: error.message
          });
        }
      }

      setMigrationResult({
        success: results.migrated > 0,
        message: `Migración completada: ${results.migrated} migrados, ${results.errors} errores`,
        details: results
      });

    } catch (error) {
      console.error('❌ Error general en migración:', error);
      setMigrationResult({
        success: false,
        message: 'Error en el proceso de migración: ' + error.message,
        details: { migrated: 0, skipped: 0, errors: 1 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportLocalStorage = () => {
    const loans = localStorage.getItem('loans');
    if (!loans) {
      alert('No hay datos en localStorage para exportar');
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(loans);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `prestamos_localStorage_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const checkLocalStorageData = () => {
    const loans = localStorage.getItem('loans');
    if (loans) {
      const parsed = JSON.parse(loans);
      console.log('📊 Datos en localStorage:', parsed);
      console.log(`📊 Total de préstamos: ${parsed.length}`);
      parsed.forEach(loan => {
        console.log(`- ${loan.name}: principal=${loan.principal}, amount=${loan.amount}`);
      });
    } else {
      console.log('📊 No hay datos en localStorage');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2" />
          Panel de Migración Mejorado
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Debug: Verificar datos localStorage
          </h3>
          <p className="text-yellow-600 text-sm mb-3">
            Revisar los datos actuales en localStorage antes de migrar.
          </p>
          <button
            onClick={checkLocalStorageData}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Revisar datos (Ver consola)
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Migrar datos de localStorage a Base de Datos
          </h3>
          <p className="text-blue-600 text-sm mb-3">
            Transfiere todos los préstamos almacenados localmente a la base de datos SQLite.
          </p>
          <button
            onClick={handleMigration}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Migrando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Migración
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Exportar Backup de localStorage
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Descarga una copia de seguridad de tus datos actuales.
          </p>
          <button
            onClick={exportLocalStorage}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Backup
          </button>
        </div>

        {migrationResult && (
          <div className={`border rounded-lg p-4 ${
            migrationResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {migrationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <h4 className={`font-semibold ${
                migrationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                Resultado de la Migración
              </h4>
            </div>
            <p className={`text-sm mb-2 ${
              migrationResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {migrationResult.message}
            </p>
            {migrationResult.details && (
              <div className="text-sm text-gray-600">
                <p>• Migrados: {migrationResult.details.migrated}</p>
                <p>• Errores: {migrationResult.details.errors}</p>
                {migrationResult.details.errorDetails && migrationResult.details.errorDetails.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Detalles de errores:</p>
                    <ul className="list-disc list-inside ml-2">
                      {migrationResult.details.errorDetails.slice(0, 3).map((error, index) => (
                        <li key={index} className="text-red-600">
                          {error.loan}: {error.error.substring(0, 100)}...
                        </li>
                      ))}
                      {migrationResult.details.errorDetails.length > 3 && (
                        <li className="text-gray-500">
                          ... y {migrationResult.details.errorDetails.length - 3} errores más
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationPanel;
