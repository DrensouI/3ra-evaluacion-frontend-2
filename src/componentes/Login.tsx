import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    {children}
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ correo: 'admin@admin.com', clave: '123456' });
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, errorLogin, estaAutenticado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (estaAutenticado) navigate('/dashboard');
  }, [estaAutenticado, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const correoTrim = form.correo.trim();
    if (!correoTrim.includes('@') || !correoTrim.includes('.')) return setError('Por favor ingrese un formato de correo electrónico válido.');
    if (form.clave.length < 4) return setError('La contraseña debe contener al menos 4 caracteres.');

    if (login(correoTrim, form.clave)) {
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifique los datos de ingreso.');
    }
  };

  return (
    <div id="pagina-login">
      <div className="hexacall-card">
        <div className="auth-brand">
          <div className="hexacall-logo">
            <Icon>
              <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4z" />
              <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
              <path d="M4 11V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </Icon>
          </div>
          <h1 className="hexacall-title">HEXACALL</h1>
          <p className="hexacall-subtitle">Portal de Acceso Interno</p>
        </div>

        <form onSubmit={manejarEnvio} id="formulario-login">
          <div className="form-group">
            <label className="field-label" htmlFor="correo-login">Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Icon>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </Icon>
              </span>
              <input
                id="correo-login"
                name="correo"
                type="email"
                required
                placeholder="admin@admin.com"
                value={form.correo}
                onChange={handleChange}
                className="hexacall-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="clave-login">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Icon>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
              </span>
              <input
                id="clave-login"
                name="clave"
                type={mostrarClave ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.clave}
                onChange={handleChange}
                className="hexacall-input"
              />
              <button type="button" className="toggle-password" onClick={() => setMostrarClave((prev) => !prev)}>
                {mostrarClave ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {(error || errorLogin) && <div className="alert-box">{error || errorLogin}</div>}

          <button id="boton-instancia-login" type="submit" className="hexacall-btn">Iniciar Sesión</button>
        </form>

        <div className="hexacall-footer">
          Credenciales válidas de prueba:
          <div className="cred-badge">admin@admin.com</div> / 123456
          <div className="cred-badge">soporte@hexacall.cl</div> / 654321
        </div>
      </div>
    </div>
  );
}
