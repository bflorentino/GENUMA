import React, { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Colecciones from './components/Colecciones';
import Visitas from './components/Visitas';
import MantenimientoComponent from './components/Mantenimiento';
import Reportes from './components/Reportes'
import Configuracion from './components/Configuracion'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageAction, setPageAction] = useState<string | null>(null);

  const handlePageChange = (page: string, action?: string) => {
    setCurrentPage(page);
    setPageAction(action || null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'colecciones':
        return <Colecciones initialAction={pageAction} onActionComplete={() => setPageAction(null)} />;
      case 'visitas':
        return <Visitas initialAction={pageAction} onActionComplete={() => setPageAction(null)} />;
      case 'mantenimiento':
        return <MantenimientoComponent initialAction={pageAction} onActionComplete={() => setPageAction(null)} />;
      case 'reportes':
        return <Reportes />;
      case 'configuracion':
        return  <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <Layout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderPage()}
      </Layout>
    </ProtectedRoute>
  );
}

export default App;