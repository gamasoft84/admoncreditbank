import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewLoan from './pages/NewLoan';
import LoanList from './pages/LoanList';
import LoanDetails from './pages/LoanDetails';
import EditLoan from './pages/EditLoan';
// import Settings from './pages/Settings';

function App() {
  return (
    <LoanProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nuevo" element={<NewLoan />} />
            <Route path="/prestamos" element={<LoanList />} />
            <Route path="/prestamo/:id" element={<LoanDetails />} />
            <Route path="/prestamo/:id/editar" element={<EditLoan />} />
            {/* <Route path="/configuracion" element={<Settings />} /> */}
            {/* Ruta 404 */}
            <Route path="*" element={
              <div className="card text-center py-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  Página no encontrada
                </h2>
                <p className="text-secondary-600 mb-6">
                  La página que buscas no existe o ha sido movida.
                </p>
                <a href="/" className="btn btn-primary">
                  Volver al Dashboard
                </a>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </LoanProvider>
  );
}

export default App;
