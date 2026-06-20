import { Obra, Personal, Reporte } from './types';

const CLAVE_OBRAS = 'hexacall_obras';
const CLAVE_PERSONAL = 'hexacall_personal';
const CLAVE_REPORTES = 'hexacall_reportes';
const CLAVE_SESION = 'hexacall_sesion';

export const Almacenamiento = {
  inicializar() {
    // Forzamos inicio vacío de personal para evitar cargas de datos heredados.
    if (localStorage.getItem(CLAVE_PERSONAL)) {
      localStorage.removeItem(CLAVE_PERSONAL);
    }
  },
  obtenerObras(): Obra[] {
    this.inicializar();
    try {
      return JSON.parse(localStorage.getItem(CLAVE_OBRAS) || '[]');
    } catch {
      return [];
    }
  },
  guardarObras(obras: Obra[]) {
    localStorage.setItem(CLAVE_OBRAS, JSON.stringify(obras));
  },
  obtenerPersonal(): Personal[] {
    this.inicializar();
    try {
      return JSON.parse(localStorage.getItem(CLAVE_PERSONAL) || '[]');
    } catch {
      return [];
    }
  },
  guardarPersonal(personal: Personal[]) {
    localStorage.setItem(CLAVE_PERSONAL, JSON.stringify(personal));
  },
  obtenerReportes(): Reporte[] {
    this.inicializar();
    try {
      return JSON.parse(localStorage.getItem(CLAVE_REPORTES) || '[]');
    } catch {
      return [];
    }
  },
  guardarReportes(reportes: Reporte[]) {
    localStorage.setItem(CLAVE_REPORTES, JSON.stringify(reportes));
  },
  obtenerSesionActiva(): string | null {
    return localStorage.getItem(CLAVE_SESION);
  },
  guardarSesionActiva(correo: string | null) {
    if (correo) {
      localStorage.setItem(CLAVE_SESION, correo);
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  },
};

export function formatearMoneda(monto?: number): string {
  if (monto === undefined || monto === null) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(monto);
}

// Sanitizar campo de texto para prevenir inyecciones HTML/Scripting
export function sanitizarTexto(entrada: string): string {
  if (!entrada) return '';
  return entrada
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
