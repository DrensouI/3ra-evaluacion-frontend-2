import React, { createContext, useContext, useState, useEffect } from 'react';
import { SesionUsuario } from '../types';

const CLAVE_SESION = 'hexacall_sesion';
const CLAVE_USUARIOS = 'hexacall_usuarios_registrados';

interface AuthContextType {
  usuario: SesionUsuario | null;
  estaAutenticado: boolean;
  login: (correo: string, clave: string) => boolean;
  logout: () => void;
  errorLogin: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciales registradas por defecto en el sistema
const USUARIOS_PREDEFINIDOS = [
  { correo: 'admin@admin.com', clave: '123456', nombre: 'Luis Alberto Rojas', rol: 'administrador' },
  { correo: 'soporte@hexacall.cl', clave: '654321', nombre: 'Alonso Ignacio Rojas', rol: 'soporte' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  // Carga inicial del estado desde localStorage
  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem(CLAVE_SESION);
      if (sesionGuardada) {
        setUsuario(JSON.parse(sesionGuardada) as SesionUsuario);
      }
    } catch (err: unknown) {
      console.error('Error al cargar sesión desde localStorage', err);
      try {
        localStorage.removeItem(CLAVE_SESION);
      } catch {}
    }
  }, []);

  const login = (correoInput: string, claveInput: string): boolean => {
    setErrorLogin(null);
    const correoNorm = correoInput.trim().toLowerCase();

    // Buscar en usuarios guardados en localStorage o predefinidos
    let listaUsuarios = USUARIOS_PREDEFINIDOS;
    try {
      const usuariosGuardadosRaw = localStorage.getItem(CLAVE_USUARIOS);
      if (usuariosGuardadosRaw) {
        const parsing: unknown = JSON.parse(usuariosGuardadosRaw);
        if (Array.isArray(parsing)) {
          // assume stored items have the same shape as predefined users
          listaUsuarios = [...USUARIOS_PREDEFINIDOS, ...(parsing as any[])];
        }
      }
    } catch (err: unknown) {
      console.error('Error parseando usuarios guardados', err);
    }

    const usuarioEncontrado = listaUsuarios.find(
      u => u.correo.toLowerCase() === correoNorm && u.clave === claveInput
    );

    if (usuarioEncontrado) {
      const datosSesion: SesionUsuario = {
        correo: usuarioEncontrado.correo,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol
      };

      localStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
      setUsuario(datosSesion);
      return true;
    } else {
      setErrorLogin('Credenciales inválidas. Correo o contraseña incorrectos.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
    setErrorLogin(null);
  };

  const estaAutenticado = usuario !== null;

  return (
    <AuthContext.Provider value={{ usuario, estaAutenticado, login, logout, errorLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
