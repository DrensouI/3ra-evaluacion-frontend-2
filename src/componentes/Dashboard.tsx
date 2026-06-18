import React from 'react';
import { DashboardProps } from '../types';
import { formatearMoneda } from '../utils';
import './dashboard.css';

const IconoCasa = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden>
    <rect x="2" y="10" width="20" height="12" rx="2" />
    <path d="m12 2 10 8H2Z" />
  </svg>
);

const IconoPersonas = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconoDocumento = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const IconoDolar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconoCalendario = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function obtenerClaseBadge(estado: string): string {
  if (estado === 'en curso') return 'badge badge--encurso';
  if (estado === 'pausada') return 'badge badge--pausada';
  return 'badge badge--finalizada';
}

export default function Dashboard({
  obras,
  personal,
  reportes,
  alNavegarDetalle,
  alNavegarPestaña,
  logout,
  usuario,
}: DashboardProps) {
  const totalObras = obras.length;
  const totalPersonal = personal.length;
  const totalReportes = reportes.length;

  const enCursoCount = obras.filter((o) => o.estado === 'en curso').length;
  const pausadasCount = obras.filter((o) => o.estado === 'pausada').length;
  const finalizadasCount = obras.filter((o) => o.estado === 'finalizada').length;

  const totalPresupuesto = obras.reduce((acc, o) => acc + (o.presupuesto || 0), 0);

  const pctEnCurso = totalObras > 0 ? Math.round((enCursoCount / totalObras) * 100) : 0;
  const pctPausadas = totalObras > 0 ? Math.round((pausadasCount / totalObras) * 100) : 0;
  const pctFinalizadas = totalObras > 0 ? Math.round((finalizadasCount / totalObras) * 100) : 0;

  const reportesRecientes = [...reportes]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard General</h1>
          <p className="dashboard-subtitle">
            Indicadores clave de rendimiento, estados de obras y reportes.
          </p>
        </div>
        <div className="dashboard-header-actions">
          {usuario && (
            <div>
              <span className="user-chip-name">{usuario.nombre}</span>
              <span className="user-chip-role">{usuario.rol}</span>
            </div>
          )}
          <span className="dashboard-status-pill">Terminal Activa</span>
          <button type="button" className="logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-cards">
        <article
          className="dashboard-card dashboard-card-primary"
          onClick={() => alNavegarPestaña('obras')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && alNavegarPestaña('obras')}
        >
          <div className="card-top-row">
            <h2 className="card-title">Obras Civiles</h2>
            <span className="dashboard-card-icon"><IconoCasa /></span>
          </div>
          <div>
            <p className="card-value">{totalObras}</p>
            <p className="card-note">Proyectos registrados</p>
          </div>
        </article>

        <article
          className="dashboard-card"
          onClick={() => alNavegarPestaña('personal')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && alNavegarPestaña('personal')}
        >
          <div className="card-top-row">
            <h2 className="card-title">Personal</h2>
            <span className="dashboard-card-icon"><IconoPersonas /></span>
          </div>
          <div>
            <p className="card-value">{totalPersonal}</p>
            <p className="card-note">Operarios activos</p>
          </div>
        </article>

        <article
          className="dashboard-card"
          onClick={() => alNavegarPestaña('reportes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && alNavegarPestaña('reportes')}
        >
          <div className="card-top-row">
            <h2 className="card-title">Bitácora Diario</h2>
            <span className="dashboard-card-icon"><IconoDocumento /></span>
          </div>
          <div>
            <p className="card-value">{totalReportes}</p>
            <p className="card-note">Informes de avance</p>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="card-top-row">
            <h2 className="card-title">Presupuesto Ejecutado</h2>
            <span className="dashboard-card-icon"><IconoDolar /></span>
          </div>
          <div>
            <p className="card-value" style={{ fontSize: '1.75rem' }}>{formatearMoneda(totalPresupuesto)}</p>
            <p className="card-note">Inversión acumulada</p>
          </div>
        </article>
      </section>

      <section className="dashboard-panels">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Distribución de Estados</p>
              <h2>Clasificación operacional de obras</h2>
            </div>
          </div>

          {totalObras === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>
              No hay obras para graficar.
            </p>
          ) : (
            <>
              <div className="distribution-bar">
                <div
                  className="bar-segment bar-segment--red"
                  style={{ width: `${pctEnCurso || 5}%` }}
                  title={`En curso: ${enCursoCount} (${pctEnCurso}%)`}
                >
                  {pctEnCurso > 15 ? `${pctEnCurso}%` : ''}
                </div>
                <div
                  className="bar-segment bar-segment--yellow"
                  style={{ width: `${pctPausadas || 5}%` }}
                  title={`Pausadas: ${pausadasCount} (${pctPausadas}%)`}
                >
                  {pctPausadas > 15 ? `${pctPausadas}%` : ''}
                </div>
                <div
                  className="bar-segment bar-segment--green"
                  style={{ width: `${pctFinalizadas || 5}%` }}
                  title={`Finalizadas: ${finalizadasCount} (${pctFinalizadas}%)`}
                >
                  {pctFinalizadas > 15 ? `${pctFinalizadas}%` : ''}
                </div>
              </div>

              <div className="distribution-legend">
                <div className="legend-card legend-card--red">
                  <div className="legend-value">{enCursoCount}</div>
                  <div>En Curso</div>
                </div>
                <div className="legend-card legend-card--yellow">
                  <div className="legend-value">{pausadasCount}</div>
                  <div>Pausada</div>
                </div>
                <div className="legend-card legend-card--green">
                  <div className="legend-value">{finalizadasCount}</div>
                  <div>Finalizada</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel-header panel-header--compact">
            <div>
              <p className="panel-label">Informes Recientes</p>
              <h2>Últimos ingresos de terreno cargados</h2>
            </div>
            <button type="button" className="link-button" onClick={() => alNavegarPestaña('reportes')}>
              Ver Todos
            </button>
          </div>

          {reportesRecientes.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
              No hay reportes de bitácoras cargados recientemente.
            </p>
          ) : (
            <div className="report-list">
              {reportesRecientes.map((r) => {
                const obraAsoc = obras.find((o) => o.id === r.obraId);
                return (
                  <div
                    key={r.id}
                    className="report-item"
                    onClick={() => alNavegarDetalle(r.obraId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && alNavegarDetalle(r.obraId)}
                  >
                    <div className="report-item-header">
                      <strong>{obraAsoc ? obraAsoc.nombre : 'Obra Desvinculada'}</strong>
                      <span className="report-date">
                        <IconoCalendario />
                        {r.fecha}
                      </span>
                    </div>
                    <p>{r.descripcion}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-table-section">
        <div className="section-header">
          <div>
            <p className="panel-label">Obras y Proyectos Activos</p>
            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Bandeja general de revisión directa</h2>
          </div>
          <button type="button" className="link-button" onClick={() => alNavegarPestaña('obras')}>
            Gestionar Proyectos
          </button>
        </div>

        <div className="table-card">
          {obras.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
              No se encuentran obras ingresadas en la consola.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>Presupuesto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {obras.map((obra) => (
                  <tr key={obra.id}>
                    <td><strong>{obra.nombre}</strong></td>
                    <td>
                      <span className={obtenerClaseBadge(obra.estado)}>{obra.estado}</span>
                    </td>
                    <td>{obra.ubicacion || 'No informada'}</td>
                    <td>{obra.presupuesto ? formatearMoneda(obra.presupuesto) : 'S/P'}</td>
                    <td>
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => alNavegarDetalle(obra.id)}
                      >
                        Inspeccionar
                      </button>
                    </td>
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
