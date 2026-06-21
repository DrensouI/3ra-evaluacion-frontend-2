import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './componentes/Login';
import Dashboard from './componentes/Dashboard';
import ObrasYProyectos from './componentes/ObrasYProyectos';
import Reportes from './componentes/Reportes';
import { Almacenamiento } from './utils';
import { Obra, Personal, Reporte } from './types';
import SideBar from './componentes/sidebar';
import Empleados from './componentes/Personal';


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { estaAutenticado } = useAuth();
  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [obras, setObras] = useState<Obra[]>(Almacenamiento.obtenerObras());
  const [personal, setPersonal] = useState<Personal[]>(Almacenamiento.obtenerPersonal());
  const [reportes, setReportes] = useState<Reporte[]>(Almacenamiento.obtenerReportes());

  const guardarObras = (items: Obra[]) => {
    Almacenamiento.guardarObras(items);
    setObras(items);
  };

  const guardarPersonal = (items: Personal[]) => {
    Almacenamiento.guardarPersonal(items);
    setPersonal(items);
  };

  const guardarReportes = (items: Reporte[]) => {
    Almacenamiento.guardarReportes(items);
    setReportes(items);
  };

  const DashboardWrapper = () => {
    const navigate = useNavigate();
    const { logout, usuario } = useAuth();

    const alNavegarPestaña = (pestaña: string) => {
      if (pestaña === 'obras') return navigate('/obras');
      if (pestaña === 'reportes') return navigate('/reportes');
      return console.log('Navegar a pestaña', pestaña);
    };

    const cerrarSesion = () => {
      logout();
      navigate('/');
    };

    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ flex: 1 }}>
          <Dashboard
            obras={obras}
            personal={personal}
            reportes={reportes}
            alNavegarPestaña={alNavegarPestaña}
            logout={cerrarSesion}
            usuario={usuario}
          />
        </div>
      </div>
    );
  };

  const ObrasWrapper = () => {
    const { logout } = useAuth();
    const cerrarSesion = () => {
      logout();
      window.location.href = '/';
    };

    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ flex: 1 }}>
          <ObrasYProyectos obras={obras} guardarObras={guardarObras} />
        </div>
      </div>
    );
  };

  const ReportesWrapper = () => {
    const { logout } = useAuth();
    const cerrarSesion = () => {
      logout();
      window.location.href = '/';
    };

    return (
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ flex: 1 }}>
          <Reportes obras={obras} reportes={reportes} guardarReportes={guardarReportes} />
        </div>
      </div>
    );
  };

  return (
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
        <Route
          path="/obras"
          element={
            <ProtectedRoute>
              <ObrasWrapper />
            </ProtectedRoute>
          }
        />
        <Route
            path="/empleados"
            element={
              <ProtectedRoute>
                <div style={{ display: 'flex' }}>
                  <SideBar />
                  <div style={{ flex: 1 }}>
                    <Empleados 
                      obras={obras} 
                      personal={personal} 
                      guardarPersonal={guardarPersonal} 
                    />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <ReportesWrapper />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
