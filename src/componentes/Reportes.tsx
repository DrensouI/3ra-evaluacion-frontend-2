import React, { useState, FormEvent } from 'react';
import { Obra, Reporte } from '../types';
import './reportes.css';

// Obtiene la fecha actual formateada (YYYY-MM-DD) para validar que no se ingresen reportes futuros
const hoy = new Date().toISOString().slice(0, 10);

type ReportesProps = { obras: Obra[]; reportes: Reporte[]; guardarReportes: (reportes: Reporte[]) => void };

/**
 * Componente Reportes: Módulo de CRUD para reportes/bitácoras diarias.
 * 
 * Funcionalidades:
 * - useState: Controla el formulario, estado de edición, validaciones de error/éxito
 * - Crear: Nuevo reporte con obra, fecha y descripción
 * - Leer: Lista ordenada por fecha (más recientes primero)
 * - Actualizar: Edita un reporte existente
 * - Eliminar: Elimina reporte con confirmación
 * 
 * Validaciones:
 * - Obra es obligatoria y debe existir
 * - Descripción es obligatoria y no puede estar vacía
 * - La fecha no puede ser mayor al día actual (validación de negocio)
 * 
 * Persistencia: Los datos se guardan en localStorage a través de guardarReportes()
 */
export default function Reportes({ obras, reportes, guardarReportes }: ReportesProps) {
  // useState: Gestiona qué reporte se está editando (null si es creación, id si es edición)
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // useState: Formulario controlado con obraId, fecha y descripción
  const [form, setForm] = useState({ obraId: obras[0]?.id || '', fecha: hoy, descripcion: '' });
  
  // useState: Maneja mensajes de validación (error en rojo, éxito en verde)
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null);
  
  // Variables computadas para renderizado condicional
  const obrasDisponibles = obras.length > 0;
  const esEdicion = Boolean(editandoId);

  // Ordena reportes por fecha descendente (más recientes primero)
  const ordenar = (items: Reporte[]) => [...items].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Función auxiliar: limpia el formulario y el estado de edición
  const limpiar = () => {
    setForm({ obraId: obras[0]?.id || '', fecha: hoy, descripcion: '' });
    setEditandoId(null);
    setMensaje(null);
  };

  // Maneja la sumisión del formulario: valida y guarda o actualiza el reporte
  const manejarEnvio = (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    // Validación 1: Debe haber al menos una obra para asociar el reporte
    if (!obrasDisponibles) return setMensaje({ tipo: 'error', texto: 'No hay obras disponibles para asociar el informe.' });
    
    // Validación 2: Descripción es obligatoria y no puede ser solo espacios
    if (!form.descripcion.trim()) return setMensaje({ tipo: 'error', texto: 'Descripción requerida para el informe.' });
    
    // Validación 3: La fecha no puede ser en el futuro (restricción de negocio)
    if (form.fecha > hoy) return setMensaje({ tipo: 'error', texto: 'La fecha no puede ser mayor que la de hoy.' });

    // Crea el objeto Reporte con tipos validados (TypeScript)
    const datos: Reporte = { 
      id: editandoId || `reporte-${Date.now()}`, 
      obraId: form.obraId, 
      fecha: form.fecha, 
      descripcion: form.descripcion.trim() 
    };
    
    // Lógica de CRUD: si esEdicion, actualiza el reporte; si no, lo agrega al inicio
    const actualizados = editandoId 
      ? reportes.map(r => r.id === editandoId ? datos : r) 
      : [datos, ...reportes];

    try {
      // Persiste los datos en localStorage a través de la función prop
      guardarReportes(actualizados);
      setMensaje({ tipo: 'success', texto: esEdicion ? 'Informe actualizado correctamente.' : 'Informe creado correctamente.' });
      limpiar();
      // Auto-oculta el mensaje después de 3 segundos
      window.setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: 'error', texto: 'Ocurrió un error inesperado al guardar el informe.' });
    }
  };

  // Elimina un reporte con confirmación del usuario
  const eliminarReporte = (id: string) => {
    if (!confirm('¿Eliminar este informe?')) return;
    try {
      guardarReportes(reportes.filter(r => r.id !== id));
      setMensaje({ tipo: 'success', texto: 'Informe eliminado correctamente.' });
      if (editandoId === id) limpiar(); // Si estaba editando, limpia el formulario
      window.setTimeout(() => setMensaje(null), 2500);
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: 'error', texto: 'Ocurrió un error inesperado al eliminar el informe.' });
    }
  };

  // Inicia modo edición: carga el reporte en el formulario y scroll al top
  const iniciarEdicion = (reporte: Reporte) => {
    setEditandoId(reporte.id);
    setForm({ obraId: reporte.obraId, fecha: reporte.fecha, descripcion: reporte.descripcion });
    setMensaje(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* PANEL IZQUIERDO: Formulario de creación/edición de reportes */}
        <div className="reportes-creacion">
          <div className="reportes-creacion-top">
            <h2>{esEdicion ? 'Editar informe' : 'Nuevo informe'}</h2>
            {/* Alerta si no hay obras: el usuario debe crear obras primero */}
            {!obrasDisponibles && <div className="alert-box">No hay obras creadas. Crea una obra primero para generar un informe.</div>}
            {/* Renderiza mensajes de error (rojo) o éxito (verde) desde useState */}
            {mensaje && <div className={`alert-box ${mensaje.tipo === 'success' ? 'alert-success' : ''}`}>{mensaje.texto}</div>}
          </div>

          {/* Formulario controlado con useState: todos los campos actualizan el estado en tiempo real */}
          <form onSubmit={manejarEnvio} className="reportes-form">
            <label htmlFor="reporte-obra">Obra</label>
            <select id="reporte-obra" value={form.obraId} onChange={e => setForm(prev => ({ ...prev, obraId: e.target.value }))} disabled={!obrasDisponibles}>
              {obras.map(obra => (<option key={obra.id} value={obra.id}>{obra.nombre}</option>))}
            </select>

            <label htmlFor="reporte-fecha">Fecha</label>
            <input id="reporte-fecha" type="date" value={form.fecha} max={hoy} onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))} disabled={!obrasDisponibles} />

            <label htmlFor="reporte-descripcion">Descripción</label>
            <textarea id="reporte-descripcion" rows={5} placeholder="Describe los avances, hallazgos o novedades del día..." value={form.descripcion} onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))} disabled={!obrasDisponibles} />

            <div className="reportes-form-actions">
              <button type="submit" className="btn-crear-reporte" disabled={!obrasDisponibles}>{esEdicion ? 'Guardar cambios' : 'Crear informe'}</button>
              {esEdicion && <button type="button" className="btn-cancelar-edicion" onClick={limpiar}>Cancelar edición</button>}
            </div>
          </form>
        </div>

        {/* PANEL DERECHO: Listado de reportes con acciones CRUD */}
        <div className="reportes-listado">
          <div className="reportes-listado-header">
            <h2>Informes creados</h2>
            <span>{reportes.length} {reportes.length === 1 ? 'informe' : 'informes'}</span>
          </div>
          {ordenar(reportes).length === 0 ? (
            <p className="reportes-vacio">No se han registrado informes aún.</p>
          ) : (
            <div className="reportes-bloques">
              {/* Mapea reportes ordenados por fecha (más recientes primero) */}
              {ordenar(reportes).map(reporte => {
                // Busca la obra asociada al reporte (puede estar eliminada)
                const obra = obras.find(o => o.id === reporte.obraId);
                return (
                  <article key={reporte.id} className="reporte-card">
                    <div className="reporte-meta">
                      <strong>{obra?.nombre || 'Obra eliminada'}</strong>
                      <span>{reporte.fecha}</span>
                    </div>
                    <p>{reporte.descripcion}</p>
                    {/* Botones de CRUD: editar abre el formulario, eliminar pide confirmación */}
                    <div className="reporte-acciones">
                      <button type="button" className="btn-editar-reporte" onClick={() => iniciarEdicion(reporte)}>Editar</button>
                      <button type="button" className="btn-eliminar-reporte" onClick={() => eliminarReporte(reporte.id)}>Eliminar</button>
                    </div>
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
