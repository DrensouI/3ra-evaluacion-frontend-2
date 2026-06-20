import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import iconoEmpresa from '../assets/icono-empresa.png';
import './login.css';

/**
 * Componente Icon: SVG reutilizable para no repetir código iconográfico.
 */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    {children}
  </svg>
);

/**
 * Componente Login: Autenticación del usuario (OA 3.1).
 * 
 * Flujo:
 * 1. useState: Controla credenciales (correo, clave), estado de visibilidad de contraseña, errores
 * 2. useContext (useAuth): Accede a función login(), estado estaAutenticado, y errorLogin desde AuthContext
 * 3. useEffect: Si el usuario ya está autenticado, lo redirige al dashboard (ProtectedRoute)
 * 4. useNavigate: Navega al dashboard tras login exitoso
 * 
 * Validaciones en cliente:
 * - Correo debe tener formato válido (@y punto)
 * - Contraseña debe tener mínimo 4 caracteres
 * - Las credenciales se validan contra la lista en AuthContext
 * 
 * Tipado TypeScript:
 * - Credenciales: { correo: string, clave: string }
 * - Todos los handlerscon tipo React.FormEvent o React.ChangeEvent
 */
export default function Login() {
  // Estado controlado para el formulario de inicio de sesión
  const [credencialesUsuario, setCredencialesUsuario] = useState({ correo: 'admin@admin.com', clave: '123456' });

  // Controla si la contraseña se muestra como texto o como campo password
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  // Errores de validación local (tienen prioridad sobre error del contexto)
  const [errorValidacionLocal, setErrorValidacionLocal] = useState<string | null>(null);
  
  /**
   * useContext (hook custom useAuth):
   * - login(correo, clave): Función que valida credenciales contra USUARIOS_VALIDOS en AuthContext
   * - errorLogin: Error desde AuthContext si el login falla
   * - estaAutenticado: Flag booleano del contexto (true si hay sesión activa)
   */
  const { login, errorLogin, estaAutenticado } = useAuth();
  
  /**
   * useNavigate: Hook de react-router-dom para navegar sin recargar página
   */
  const navigate = useNavigate();
  
  /**
   * errorTexto: Prioriza error local (validación) sobre error del contexto
   */
  const errorTexto = errorValidacionLocal || errorLogin;

  /**
   * useEffect: Hook para efectos secundarios.
   * Dependencias: [estaAutenticado, navigate]
   * 
   * Lógica:
   * - Si el usuario ya está autenticado (sesión persiste en localStorage),
   *   lo redirige al dashboard sin mostrar login
   * - Esto cumple el criterio de "rutas protegidas" de la rúbrica
   */
  useEffect(() => { 
    if (estaAutenticado) navigate('/dashboard'); 
  }, [estaAutenticado, navigate]);

  /**
   * Maneja cambios en tiempo real de los inputs (controlled component).
   * Actualiza el estado credenciales conforme el usuario escribe.
   * Tipado con React.ChangeEvent<HTMLInputElement>
   */
  const manejarCambioInput = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) =>
    setCredencialesUsuario(prev => ({ ...prev, [name]: value }));

  /**
   * Valida y envía el formulario de login.
   * 
   * Validaciones en orden (early return pattern):
   * 1. Formato de correo (debe contener @ y .)
   * 2. Longitud de contraseña (mínimo 4 caracteres)
   * 3. Credenciales contra USUARIOS_VALIDOS (función login del contexto)
   */
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    const correoLimpio = credencialesUsuario.correo.trim();

    // Validación 1: formato básico de correo
    if (!correoLimpio.includes('@') || !correoLimpio.includes('.'))
      return setErrorValidacionLocal('Formato de correo electrónico inválido.');

    // Validación 2: longitud mínima de contraseña
    if (credencialesUsuario.clave.length < 4)
      return setErrorValidacionLocal('La contraseña debe contener al menos 4 caracteres.');

    // Validación 3: delega comprobación de credenciales al contexto
    if (login(correoLimpio, credencialesUsuario.clave)) {
      navigate('/dashboard');
    } else {
      setErrorValidacionLocal('Credenciales incorrectas. Verifique los datos.');
    }
  };

  return (
    <div id="pagina-login">
      <div className="hexacall-card">
        
        {/* ENCABEZADO: Logo y branding */}
        <div className="auth-brand">
          <div className="hexacall-logo">
            <img src={iconoEmpresa} alt="Hexacall Logo" />
          </div>
          <h1 className="hexacall-title">HEXACALL</h1>
          <p className="hexacall-subtitle">Portal de Acceso Interno</p>
        </div>

        {/* FORMULARIO CONTROLADO: Todos los inputs actualizan estado en tiempo real */}
        <form onSubmit={manejarEnvio}>
          
          {/* Campo Correo */}
          <div className="form-group">
            <label className="field-label">Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Icon><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>
              </span>
              {/* Input controlado: value y onChange gestionados por useState */}
              <input 
                name="correo" 
                type="email" 
                required 
                placeholder="admin@admin.com" 
                value={credencialesUsuario.correo} 
                onChange={manejarCambioInput} 
                className="hexacall-input" 
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label className="field-label">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Icon><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
              </span>
              {/* Input controlado con tipo dinámico (password o text según mostrarContrasena) */}
              <input
                name="clave"
                type={mostrarContrasena ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={credencialesUsuario.clave}
                onChange={manejarCambioInput}
                className="hexacall-input"
              />
              {/* Botón toggle: alterna visibilidad de contraseña */}
              <button type="button" className="toggle-password" onClick={() => setMostrarContrasena(prev => !prev)} title="Mostrar/ocultar contraseña">
                {mostrarContrasena ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Renderizado condicional: Muestra error si existe (validación fallida) */}
          {errorTexto && <div className="alert-box">{errorTexto}</div>}

          <button type="submit" className="hexacall-btn">Iniciar Sesión</button>
        </form>

      </div>
    </div>
  );
}