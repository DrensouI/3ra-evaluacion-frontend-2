import React, { useState, useRef } from 'react';
import { Obra, EstadoObra } from '../types';
import { Almacenamiento, formatearMoneda } from '../utils';
import './obras-proyectos.css';

export default function ObrasYProyectos() {
  const [obras, setObras] = useState<Obra[]>(Almacenamiento.obtenerObras());
  const [mostrar, setMostrar] = useState(false);
  const [editando, setEditando] = useState<Obra | null>(null);
  const [form, setForm] = useState({ nombre: '', ubicacion: '', estado: 'en curso' as EstadoObra, presupuesto: '' });
  const nombreInputRef = useRef<HTMLInputElement>(null);

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return alert('Nombre requerido');
    
    const presupuesto = form.presupuesto ? parseFloat(form.presupuesto) : 0;
    if (presupuesto < 0) return alert('Presupuesto no puede ser negativo');
    
    const actualizado = editando
      ? obras.map(o => o.id === editando.id ? { ...o, ...form, presupuesto } : o)
      : [...obras, { id: `obra-${Date.now()}`, ...form, presupuesto }];
    
    Almacenamiento.guardarObras(actualizado);
    setObras(actualizado);
    setForm({ nombre: '', ubicacion: '', estado: 'en curso', presupuesto: '' });
    setMostrar(false);
    setEditando(null);
  };

  const cerrarModal = () => { setMostrar(false); setEditando(null); };

  const eliminar = (id: string) => {
    if (confirm('¿Eliminar?')) {
      const actualizado = obras.filter(o => o.id !== id);
      Almacenamiento.guardarObras(actualizado);
      setObras(actualizado);
    }
  };

  const cambiarEstado = (id: string, estado: EstadoObra) => {
    const actualizado = obras.map(o => o.id === id ? { ...o, estado } : o);
    Almacenamiento.guardarObras(actualizado);
    setObras(actualizado);
  };

  const abrirEditar = (o: Obra) => {
    setEditando(o);
    setForm({ nombre: o.nombre, ubicacion: o.ubicacion || '', estado: o.estado, presupuesto: o.presupuesto?.toString() || '' });
    setMostrar(true);
    setTimeout(() => nombreInputRef.current?.focus(), 100);
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: '', ubicacion: '', estado: 'en curso', presupuesto: '' });
    setMostrar(true);
    setTimeout(() => nombreInputRef.current?.focus(), 100);
  };

  const stats = [
    { label: 'Total', val: obras.length },
    { label: 'En Curso', val: obras.filter(o => o.estado === 'en curso').length, cls: 'stat-curso' },
    { label: 'Pausadas', val: obras.filter(o => o.estado === 'pausada').length, cls: 'stat-pausada' },
    { label: 'Finalizadas', val: obras.filter(o => o.estado === 'finalizada').length, cls: 'stat-finalizada' },
    { label: 'Presupuesto', val: formatearMoneda(obras.reduce((s, o) => s + (o.presupuesto || 0), 0)) },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && mostrar) cerrarModal();
  };

  return (
    <main className="obras-container" aria-labelledby="obras-title">
      <div className="obras-header">
        <div>
          <h1 id="obras-title">Obras y Proyectos</h1>
          <p id="obras-summary">Control global de obras de desarrollo, estados o presupuestos.</p>
        </div>
        <button className="btn-crear" onClick={abrirCrear} title="Crear nueva obra (Alt+N)" aria-label="Crear nueva obra">
          + Registrar
        </button>
      </div>

      <div className="stats" role="region" aria-label="Estadísticas de obras">
        {stats.map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-label">{s.label}</div>
            <div className={`stat-val ${s.cls || ''}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <section className="lista" aria-labelledby="lista-obras-title">
        <h2 id="lista-obras-title">Listado de Obras</h2>
        {obras.length === 0 ? (
          <p className="vacio">No hay obras registradas.</p>
        ) : (
          <div className="grid">
            {obras.map(o => (
              <div key={o.id} className="tarjeta" tabIndex={0} role="article" aria-labelledby={`obra-${o.id}-titulo`}>
                <h3 id={`obra-${o.id}-titulo`}>{o.nombre}</h3>
                <span className={`estado ${o.estado.replace(' ', '-')}`}>{o.estado}</span>
                {o.ubicacion && <p className="ubicacion" title={o.ubicacion}>📍 {o.ubicacion}</p>}
                {o.presupuesto && <p className="presupuesto">💰 {formatearMoneda(o.presupuesto)}</p>}
                <div className="acciones">
                  <select 
                    value={o.estado} 
                    onChange={e => cambiarEstado(o.id, e.target.value as EstadoObra)} 
                    className="select"
                    aria-label={`Cambiar estado de ${o.nombre}`}
                  >
                    <option value="en curso">En Curso</option>
                    <option value="pausada">Pausada</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                  <button className="btn btn-edit" onClick={() => abrirEditar(o)} title="Editar obra" aria-label={`Editar obra ${o.nombre}`}>✎</button>
                  <button className="btn btn-del" onClick={() => eliminar(o.id)} title="Eliminar obra" aria-label={`Eliminar obra ${o.nombre}`}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {mostrar && (
        <div className="modal" onClick={cerrarModal} role="presentation">
          <div className="modal-box" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
            <div className="modal-top">
              <h2 id="modal-title">{editando ? 'Editar' : 'Nueva Obra'}</h2>
              <button className="btn-x" onClick={cerrarModal} type="button" title="Cerrar (Esc)" aria-label="Cerrar diálogo">✕</button>
            </div>
            <p id="modal-description" className="sr-only">Formulario para crear o editar una obra.</p>
            <form onSubmit={guardar} onKeyDown={handleKeyDown} aria-label="Formulario de obra">
              <label>Nombre * <input type="text" ref={nombreInputRef} required aria-required="true" placeholder="Obra" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></label>
              <label>Ubicación <input type="text" placeholder="Ubicación" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} /></label>
              <label>Estado <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value as EstadoObra})}><option value="en curso">En Curso</option><option value="pausada">Pausada</option><option value="finalizada">Finalizada</option></select></label>
              <label>Presupuesto <input type="number" min="0" placeholder="0" value={form.presupuesto} onChange={e => setForm({...form, presupuesto: e.target.value})} /></label>
              <div className="form-btns">
                <button type="button" onClick={cerrarModal}>Cancelar</button>
                <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
