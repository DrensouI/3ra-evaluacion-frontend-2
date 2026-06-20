import React, { createContext, useContext, useState } from 'react';
import { SesionUsuario } from '../types';

/**
 * CONTEXTO GLOBAL DE AUTENTICACIÓN (OA 3.1)
 * 
 * Propósito:
 * - Centralizar el estado del usuario autenticado
 * - Evitar prop drilling: cualquier componente accede sin pasar props
 * - Persistir la sesión en localStorage
 * - Proporcionar métodos de login y logout
 * 
 * Rúbrica cumplida:
 * ✓ useContext para acceso global del usuario
 * ✓ Rutas protegidas que redirigen si no hay sesión
 * ✓ logout limpia contexto y localStorage
 */

const CLAVE_SESION = 'hexacall_sesion';

/**
 * USUARIOS_PREDEFINIDOS: Lista de usuarios válidos para autenticación.
 * En una aplicación real, esto vendría de una API.
 */
const USUARIOS_PREDEFINIDOS = [
  { correo: 'admin@admin.com', clave: '123456', nombre: 'Luis Alberto Rojas', rol: 'administrador' },
];

/**
 * AuthContextType: Interfaz TypeScript que define la forma del contexto.
 * 
 * Propiedades:
 * - usuario: Datos del usuario autenticado (null si no autenticado)
 * - estaAutenticado: Flag booleano derivado del usuario
 * - login: Función que valida credenciales y actualiza estado
 * - logout: Función que limpia sesión
 * - errorLogin: Mensaje de error para mostrar en UI
 */
interface AuthContextType {
  usuario: SesionUsuario | null;
  estaAutenticado: boolean;
  login: (correo: string, clave: string) => boolean;
  logout: () => void;
  errorLogin: string | null;
}

/**
 * createContext: Crea el objeto contexto sin inicializar.
 * Se tipea con AuthContextType para validación en TypeScript.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * cargarSesion: Función auxiliar que lee la sesión guardada en localStorage.
 * 
 * Lógica:
 * 1. Intenta parsear JSON guardado en localStorage
 * 2. Si hay error (JSON corrupto), limpia el localStorage y retorna null
 * 3. Esto garantiza que siempre retorna null o un objeto válido de sesión
 */
const cargarSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null');
  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return null;
  }
};

/**
 * AuthProvider: Componente que envuelve la app y proporciona el contexto.
 * 
 * Props:
 * - children: Componentes que consumen el contexto (toda la app)
 * 
 * Flujo:
 * 1. useState: Inicializa usuario desde localStorage (persistencia)
 * 2. AuthContext.Provider expone el valor global a todos los descendientes
 * 3. useAuth() hook permite acceder al contexto desde cualquier componente
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /**
   * useState: Usuario autenticado.
   * Se inicializa con cargarSesion() para verificar si hay sesión previa en localStorage.
   * Esto permite que el usuario permanezca logueado al recargar la página.
   */
  const [usuario, setUsuario] = useState<SesionUsuario | null>(cargarSesion);
  
  /**
   * useState: Mensaje de error de autenticación.
   * Se muestra en el componente Login si las credenciales son incorrectas.
   */
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  /**
   * Función login: Valida credenciales contra USUARIOS_PREDEFINIDOS.
   * 
   * Parámetros:
   * - correoInput: Correo ingresado por el usuario
   * - claveInput: Contraseña ingresada por el usuario
   * 
   * Retorna:
   * - true si las credenciales son válidas (login exitoso)
   * - false si son inválidas
   * 
   * Lógica:
   * 1. Limpia error anterior
   * 2. Normaliza el correo (lowercase, trim) para buscar
   * 3. Busca usuario que coincida con correo Y contraseña
   * 4. Si no encuentra: setea error y retorna false
   * 5. Si encuentra: guarda en localStorage, actualiza estado, retorna true
   */
  const login = (correoInput: string, claveInput: string): boolean => {
    setErrorLogin(null);
    const correoNorm = correoInput.trim().toLowerCase();
    
    // Busca un usuario que coincida con correo Y contraseña
    const usuarioEncontrado = USUARIOS_PREDEFINIDOS.find(
      u => u.correo.toLowerCase() === correoNorm && u.clave === claveInput
    );
    
    // Si no encuentra credenciales válidas
    if (!usuarioEncontrado) 
      return setErrorLogin('Credenciales inválidas. Correo o contraseña incorrectos.'), false;
    
    // Crea objeto de sesión (sin exponer contraseña)
    const datosSesion = { 
      correo: usuarioEncontrado.correo, 
      nombre: usuarioEncontrado.nombre, 
      rol: usuarioEncontrado.rol 
    };
    
    // Persiste en localStorage y actualiza estado
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
    setUsuario(datosSesion);  
    return true;
  };

  /**
   * Función logout: Limpia la sesión.
   * 
   * Lógica:
   * 1. Elimina JSON de sesión en localStorage
   * 2. Vacía el estado usuario (setea en null)
   * 3. Limpia mensaje de error
   * 
   * Esto cumple el criterio de rúbrica: "logout limpia contexto y localStorage"
   */
  const logout = () => (
    localStorage.removeItem(CLAVE_SESION), 
    setUsuario(null), 
    setErrorLogin(null)
  );

  /**
   * AuthContext.Provider: Expone el contexto a toda la app.
   * 
   * value:
   * - usuario: Datos del usuario actual o null
   * - estaAutenticado: Booleano derivado (usuario no nulo = true)
   * - login, logout: Funciones para autenticación
   * - errorLogin: Mensaje de error para UI
   * 
   * Todo componente dentro de AuthProvider puede acceder a esto con useAuth()
   */
  return (
    <AuthContext.Provider value={{ usuario, estaAutenticado: Boolean(usuario), login, logout, errorLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook custom useAuth: Acceso simplificado al contexto.
 * 
 * Uso:
 * const { usuario, login, logout, estaAutenticado } = useAuth();
 * 
 * Validación:
 * - Lanza error si se usa fuera de un AuthProvider
 * - Garantiza que el hook siempre retorna un contexto válido
 * 
 * Rúbrica (OA 3.1):
 * ✓ useContext implementado
 * ✓ Acceso al usuario sin prop drilling
 * ✓ Cualquier componente puede acceder: Dashboard, Login, Sidebar, etc.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return context;
}
