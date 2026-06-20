import React from 'react';
import { DashboardProps } from '../types';
import { formatearMoneda } from '../utils';
import './dashboard.css';

/**
 * Componente Icon: Renderiza SVGs reutilizables con tamaño dinámico.
 * Reduce duplicación de código SVG en toda la aplicación.
 */
const Icon = ({ children, w = "16" }: { children: React.ReactNode; w?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={w} height={w} aria-hidden>
    {children}
  </svg>
);

/**
 * Dashboard: Componente principal que exhibe indicadores clave (KPI).
 * 
 * Props:
 * - obras, personal, reportes: Datos cargados desde localStorage (gestionados en main.tsx)
 * - alNavegarPestaña: Callback para navegar entre módulos (obras, reportes, etc.)
 * - logout: Función del contexto de autenticación para cerrar sesión
 * - usuario: Datos del usuario autenticado desde AuthContext
 * 
 * Flujo:
 * 1. Calcula métricas derivadas (totales, presupuesto acumulado, reportes recientes)
 * 2. Renderiza 4 tarjetas principales con indicadores
 * 3. Muestra gráfico de distribución de estados de obras
 * 4. Lista últimos 3 reportes cargados
 * 5. Tabla con todas las obras para revisión rápida
 */
export default function Dashboard({ obras, personal, reportes, alNavegarPestaña, logout, usuario }: DashboardProps) {
  // Calcula el total de obras: usado para gráficos, totales y validación de datos vacíos
  const totalDeObras = obras.length;
  
  // Suma todos los presupuestos de las obras: indicador de inversión acumulada
  const presupuestoTotal = obras.reduce((s, o) => s + (o.presupuesto || 0), 0);
  
  // Obtiene los 3 reportes más recientes ordenados por fecha descendente
  // Se usa para mostrar historial de avances en el dashboard
  const reportesRecientes = reportes.length ? [...reportes].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3) : [];
  
  // Resumen de estados: agrupa obras por estado (en curso, pausada, finalizada)
  // Usado para calcular porcentajes en el gráfico de distribución
  const resumenEstados = ['en curso', 'pausada', 'finalizada'].map((etiqueta, i) => ({
    etiqueta,
    color: ['red', 'yellow', 'green'][i],
    cantidad: obras.filter(o => o.estado === etiqueta).length
  }));

  // Configuración de las 4 tarjetas principales KPI
  // Cada tarjeta es navegable (excepto presupuesto) y lleva a su módulo correspondiente
  const tarjetasInfo = [
    { id: 'obras', titulo: 'Obras Civiles', valor: totalDeObras, nota: 'Proyectos registrados', icono: <><rect x="2" y="10" width="20" height="12" rx="2" /><path d="m12 2 10 8H2Z" /></> },
    { id: 'personal', titulo: 'Personal', valor: personal.length, nota: 'Operarios activos', icono: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
    { id: 'reportes', titulo: 'Bitácora Diario', valor: reportes.length, nota: 'Informes de avance', icono: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></> },
    { id: 'presupuesto', titulo: 'Presupuesto Ejecutado', valor: formatearMoneda(presupuestoTotal), nota: 'Inversión acumulada', icono: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> }
  ];

  return (
    <div className="dashboard-page">
      {/* 1. CABECERA: Muestra información del usuario autenticado (desde AuthContext via props) */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard General</h1>
          <p className="dashboard-subtitle">Indicadores clave de rendimiento, estados de obras y reportes.</p>
        </div>
        <div className="dashboard-header-actions">
          {/* usuario viene del AuthContext, propagado desde main.tsx */}
          {usuario && (
            <div>
              <span className="user-chip-name">{usuario.nombre}</span>
              <span className="user-chip-role">{usuario.rol}</span>
            </div>
          )}
          <span className="dashboard-status-pill">Terminal Activa</span>
          {/* Logout: limpia contexto y localStorage, redirige a login (función del AuthContext) */}
          <button type="button" className="logout-button" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {/* 2. TARJETAS KPI: Renderiza 4 indicadores principales */}
      {/* Las tarjetas de obras, personal y reportes son navegables */}
      <section className="dashboard-cards">
        {tarjetasInfo.map(tarjeta => (
          <article 
            key={tarjeta.id} 
            className={`dashboard-card ${tarjeta.id === 'obras' ? 'dashboard-card-primary' : ''}`}
            onClick={() => tarjeta.id !== 'presupuesto' && alNavegarPestaña(tarjeta.id)}
            role={tarjeta.id !== 'presupuesto' ? "button" : undefined}
          >
            <div className="card-top-row">
              <h2 className="card-title">{tarjeta.titulo}</h2>
              <span className="dashboard-card-icon"><Icon>{tarjeta.icono}</Icon></span>
            </div>
            <div>
              <p className={`card-value ${tarjeta.id === 'presupuesto' ? 'card-value-large' : ''}`}>{tarjeta.valor}</p>
              <p className="card-note">{tarjeta.nota}</p>
            </div>
          </article>
        ))}
      </section>

      {/* 3. PANELES ANALÍTICOS: Gráfico de distribución de estados y lista de reportes recientes */}
      <section className="dashboard-panels">
        {/* PANEL IZQUIERDO: Gráfico horizontal de estados con porcentajes */}
        <div className="panel">
          <div className="panel-header">
            <div><p className="panel-label">Distribución de Estados</p><h2>Clasificación operacional de obras</h2></div>
          </div>
          {totalDeObras > 0 ? (
            <>
              {/* Barra de distribución: cada segmento representa el porcentaje de obras por estado */}
              <div className="distribution-bar">
                {resumenEstados.map(estado => {
                  const porcentaje = Math.round((estado.cantidad / totalDeObras) * 100) || 5;
                  return (
                    <div key={estado.color} className={`bar-segment bar-segment--${estado.color}`} style={{ width: `${porcentaje}%` }} title={`${estado.etiqueta}: ${estado.cantidad} (${porcentaje}%)`}>
                      {porcentaje > 15 && `${porcentaje}%`}
                    </div>
                  );
                })}
              </div>
              {/* Leyenda de conteos por estado */}
              <div className="distribution-legend">
                {resumenEstados.map(estado => (
                  <div key={estado.color} className={`legend-card legend-card--${estado.color}`}>
                    <div className="legend-value">{estado.cantidad}</div>
                    <div style={{ textTransform: 'capitalize' }}>{estado.etiqueta}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="dashboard-empty">No hay obras para graficar.</p>
          )}
        </div>

        {/* PANEL DERECHO: Últimos 3 reportes cargados (información de avance más reciente) */}
        <div className="panel">
          <div className="panel-header panel-header--compact">
            <div><p className="panel-label">Informes Recientes</p><h2>Últimos ingresos de terreno cargados</h2></div>
            <button type="button" className="link-button" onClick={() => alNavegarPestaña('reportes')}>Ver Todos</button>
          </div>
          {reportesRecientes.length ? (
            <div className="report-list">
              {reportesRecientes.map(reporte => (
                <div key={reporte.id} className="report-item" onClick={() => alNavegarPestaña('obras')}>
                  <div className="report-item-header">
                    <strong>{obras.find(o => o.id === reporte.obraId)?.nombre || 'Obra Desvinculada'}</strong>
                    <span className="report-date">
                      <Icon w="14">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </Icon>
                      {reporte.fecha}
                    </span>
                  </div>
                  <p>{reporte.descripcion}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-empty">No hay reportes cargados recientemente.</p>
          )}
        </div>
      </section>

      {/* 4. TABLA GENERAL: Listado de todas las obras para revisión rápida y acciones */}
      <section className="dashboard-table-section">
        <div className="section-header">
          <div><p className="panel-label">Obras y Proyectos Activos</p><h2>Bandeja general de revisión directa</h2></div>
          <button type="button" className="link-button" onClick={() => alNavegarPestaña('obras')}>Gestionar Proyectos</button>
        </div>
        <div className="table-card">
          {totalDeObras === 0 ? (
            <p className="dashboard-empty">No se encuentran obras ingresadas.</p>
          ) : (
            <table>
              <thead><tr><th>Proyecto</th><th>Estado</th><th>Ubicación</th><th>Presupuesto</th><th>Acciones</th></tr></thead>
              <tbody>
                {obras.map(obra => (
                  <tr key={obra.id}>
                    <td><strong>{obra.nombre}</strong></td>
                    {/* Estado se formatea removiendo espacios para generar clase CSS correcta (ej: "en curso" → "encurso") */}
                    <td><span className={`badge badge--${obra.estado.replace(' ', '')}`}>{obra.estado}</span></td>
                    <td>{obra.ubicacion || 'No informada'}</td>
                    <td>{obra.presupuesto ? formatearMoneda(obra.presupuesto) : 'S/P'}</td>
                    <td><button type="button" className="small-button" onClick={() => alNavegarPestaña('obras')}>Ver obra</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}