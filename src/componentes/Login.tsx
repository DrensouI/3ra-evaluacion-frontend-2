import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, errorLogin } = useAuth();
  const [correo, setCorreo] = useState('admin@admin.com');
  const [clave, setClave] = useState('123456');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    
    const correoProcesado = correo.trim();
    if (!correoProcesado.includes('@') || !correoProcesado.includes('.')) {
      setErrorLocal('Por favor ingrese un formato de correo electrónico válido.');
      return;
    }
    if (clave.length < 4) {
      setErrorLocal('La contraseña debe contener al menos 4 caracteres.');
      return;
    }

    const exito = login(correoProcesado, clave);
    if (exito) {
      navigate('/dashboard');
    } else {
      setErrorLocal('Credenciales incorrectas. Verifique los datos de ingreso.');
    }
  };

  return (
    <div id="pagina-login" className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4">
      {/* Patrón de fondo con CSS nativo usando sutil color rojo */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#dc2626 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      ></div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-150 z-10 transition-all duration-300 transform hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-6">
          {/* SVG Logotipo HardHat hecho a mano en ROJO */}
          <div className="w-14 h-14 bg-red-650 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-red-600/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-7 h-7 text-white"
            >
              <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4z" />
              <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
              <path d="M4 11V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-850 tracking-tight">ObrasPro</h1>
          <p className="text-red-600 text-[10px] mt-0.5 font-extrabold uppercase tracking-widest">Portal de Acceso Interno</p>
        </div>

        <form onSubmit={manejarEnvio} id="formulario-login" className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Correo Electrónico</label>
            <div className="relative">
              {/* Mail SVG Icon */}
              <div className="absolute left-3 top-2.5 text-slate-400 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input 
                id="correo-login" 
                type="email" 
                required 
                placeholder="admin@admin.com" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-xl outline-none text-xs text-slate-700 font-semibold transition-colors duration-150" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contraseña</label>
            <div className="relative">
              {/* Lock SVG Icon */}
              <div className="absolute left-3 top-2.5 text-slate-400 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input 
                id="clave-login" 
                type={mostrarClave ? 'text' : 'password'} 
                required 
                placeholder="••••••••" 
                value={clave} 
                onChange={(e) => setClave(e.target.value)} 
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-xl outline-none text-xs text-slate-700 font-semibold transition-colors duration-150" 
              />
              <button 
                type="button" 
                onClick={() => setMostrarClave(!mostrarClave)} 
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-650 cursor-pointer flex items-center justify-center focus:outline-none"
              >
                {mostrarClave ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {(errorLocal || errorLogin) && (
            <div id="error-login" className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 font-semibold flex items-center gap-1.5 duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-red-650 inline-block shrink-0"></span>
              {errorLocal || errorLogin}
            </div>
          )}

          <button 
            id="boton-instancia-login" 
            type="submit" 
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/10 hover:shadow-red-600/20 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 leading-relaxed font-semibold">
          Credenciales válidas de prueba:<br/>
          <span className="font-mono text-slate-600 font-bold bg-slate-50 px-1 py-0.5 rounded">admin@admin.com</span> / <span className="font-mono text-slate-600 font-bold bg-slate-50 px-1 py-0.5 rounded">123456</span><br/>
          <span className="font-mono text-slate-600 font-bold bg-slate-50 px-1 py-0.5 rounded">soporte@obraspro.cl</span> / <span className="font-mono text-slate-600 font-bold bg-slate-50 px-1 py-0.5 rounded">654321</span>
        </div>
      </div>
    </div>
  );
}
