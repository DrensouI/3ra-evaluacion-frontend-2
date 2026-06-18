import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './componentes/Login';
import Dashboard from './componentes/Dashboard';
import { Almacenamiento } from './utils';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { estaAutenticado } = useAuth();
  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function DashboardWrapper() {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();
  const obras = Almacenamiento.obtenerObras();
  const personal = Almacenamiento.obtenerPersonal();
  const reportes = Almacenamiento.obtenerReportes();

  const alNavegarDetalle = (id: string) => {
    navigate('/dashboard');
  };
  const alNavegarPestaña = (pestaña: string) => {
    console.log('Navegar a pestaña', pestaña);
  };

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <Dashboard
      obras={obras}
      personal={personal}
      reportes={reportes}
      alNavegarDetalle={alNavegarDetalle}
      alNavegarPestaña={alNavegarPestaña}
      logout={cerrarSesion}
      usuario={usuario}
    />
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
