import React, { useMemo, useState, useEffect } from 'react';
import { Almacenamiento } from '../utils';
import { Obra, Reporte } from '../types';
import './reportes.css';

export default function Reportes() {
  const obras = useMemo(() => Almacenamiento.obtenerObras(), []);
  const [reportes, setReportes] = useState<Reporte[]>(Almacenamiento.obtenerReportes());
  const [form, setForm] = useState({
    obraId: obras[0]?.id || '',
    fecha: new Date().toISOString().slice(0, 10),
    descripcion: '',
  });

  const obrasDisponibles = obras.length > 0;
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [successMensaje, setSuccessMensaje] = useState<string | null>(null);
  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Asegura que la fecha inicial no sea mayor que hoy
    setForm(prev => ({ ...prev, fecha: prev.fecha > hoy ? hoy : prev.fecha }));
  }, [hoy]);
  const reportesOrdenados = [...reportes].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const actualizarReportes = (reportesActualizados: Reporte[]) => {
    Almacenamiento.guardarReportes(reportesActualizados);
    setReportes(reportesActualizados);
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje(null);
    setSuccessMensaje(null);

    if (!obrasDisponibles) {
      setErrorMensaje('No hay obras disponibles para asociar el informe.');
      return;
    }

    try {
      if (!form.descripcion.trim()) {
        setErrorMensaje('Descripción requerida para el informe.');
        return;
      }

      if (form.fecha > hoy) {
        setErrorMensaje('La fecha no puede ser mayor que la de hoy.');
        return;
      }

      const nuevoReporte: Reporte = {
        id: `reporte-${Date.now()}`,
        obraId: form.obraId,
        fecha: form.fecha,
        descripcion: form.descripcion.trim(),
      };

      const nuevos = [nuevoReporte, ...reportes];
      try {
        Almacenamiento.guardarReportes(nuevos);
      } catch (err) {
        console.error('Error guardando en almacenamiento:', err);
        setErrorMensaje('Error al guardar el informe en almacenamiento.');
        return;
      }

      setReportes(nuevos);
      setForm({ obraId: obras[0]?.id || '', fecha: hoy, descripcion: '' });
      setSuccessMensaje('Informe creado correctamente.');
      window.setTimeout(() => setSuccessMensaje(null), 3000);
    } catch (err) {
      console.error('Error creando informe:', err);
      setErrorMensaje('Ocurrió un error inesperado al crear el informe.');
    }
  };

  const eliminarReporte = (id: string) => {
    setErrorMensaje(null);
    setSuccessMensaje(null);
    if (!confirm('¿Eliminar este informe?')) return;
    try {
      const filtrados = reportes.filter(reporte => reporte.id !== id);
      try {
        Almacenamiento.guardarReportes(filtrados);
      } catch (err) {
        console.error('Error guardando reportes tras eliminar:', err);
        setErrorMensaje('Error al eliminar el informe desde almacenamiento.');
        return;
      }
      setReportes(filtrados);
      setSuccessMensaje('Informe eliminado correctamente.');
      window.setTimeout(() => setSuccessMensaje(null), 2500);
    } catch (err) {
      console.error('Error eliminando informe:', err);
      setErrorMensaje('Ocurrió un error inesperado al eliminar el informe.');
    }
  };

  return (
    <main className="reportes-page" aria-labelledby="titulo-reportes">
      <header className="reportes-header">
        <div>
          <h1 id="titulo-reportes">Reportes de Obra</h1>
          <p>Registra avances diarios y consulta bitácoras asociadas a obras existentes.</p>
        </div>
      </header>

      <section className="reportes-paneles">
        <div className="reportes-creacion">
          <div className="reportes-creacion-top">
            <h2>Nuevo informe</h2>
            {!obrasDisponibles && (
              <div className="alert-box">No hay obras creadas. Crea una obra primero para generar un informe.</div>
            )}
            {errorMensaje && <div className="alert-box">{errorMensaje}</div>}
            {successMensaje && <div style={{ background: '#ecfdf5', color: '#065f46', padding: 10, borderRadius: 10, border: '1px solid #bbf7d0', fontWeight: 700, marginLeft: 8 }}>{successMensaje}</div>}
          </div>

          <form onSubmit={manejarEnvio} className="reportes-form">
            <label htmlFor="reporte-obra">Obra</label>
            <select
              id="reporte-obra"
              value={form.obraId}
              onChange={e => setForm(prev => ({ ...prev, obraId: e.target.value }))}
              disabled={!obrasDisponibles}
            >
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nombre}</option>
              ))}
            </select>

            <label htmlFor="reporte-fecha">Fecha</label>
            <input
              id="reporte-fecha"
              type="date"
              value={form.fecha}
              max={hoy}
              onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))}
              disabled={!obrasDisponibles}
            />

            <label htmlFor="reporte-descripcion">Descripción</label>
            <textarea
              id="reporte-descripcion"
              rows={5}
              placeholder="Describe los avances, hallazgos o novedades del día..."
              value={form.descripcion}
              onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
              disabled={!obrasDisponibles}
            />

            <button type="submit" className="btn-crear-reporte" disabled={!obrasDisponibles}>
              {obrasDisponibles ? 'Crear informe' : 'No hay obras para generar informes'}
            </button>
          </form>
        </div>

        <div className="reportes-listado">
          <div className="reportes-listado-header">
            <h2>Informes creados</h2>
            <span>{reportes.length} {reportes.length === 1 ? 'informe' : 'informes'}</span>
          </div>
          {reportesOrdenados.length === 0 ? (
            <p className="reportes-vacio">No se han registrado informes aún.</p>
          ) : (
            <div className="reportes-bloques">
              {reportesOrdenados.map(reporte => {
                const obra = obras.find(o => o.id === reporte.obraId);
                return (
                  <article key={reporte.id} className="reporte-card">
                    <div className="reporte-meta">
                      <strong>{obra?.nombre || 'Obra eliminada'}</strong>
                      <span>{reporte.fecha}</span>
                    </div>
                    <p>{reporte.descripcion}</p>
                    <button type="button" className="btn-eliminar-reporte" onClick={() => eliminarReporte(reporte.id)}>
                      Eliminar
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
