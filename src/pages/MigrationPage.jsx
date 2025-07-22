import React from 'react';
import MigrationPanel from '../components/MigrationPanel';

const MigrationPage = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔄 Migración de Datos
        </h1>
        <p className="text-gray-600">
          Migra tus datos de localStorage a la base de datos SQLite para mayor seguridad y rendimiento.
        </p>
      </div>
      
      <MigrationPanel />
    </div>
  );
};

export default MigrationPage;
