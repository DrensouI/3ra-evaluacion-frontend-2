import { Obra, Personal, Reporte } from './types';

const CLAVE_OBRAS = 'hexacall_obras';
const CLAVE_PERSONAL = 'hexacall_personal';
const CLAVE_REPORTES = 'hexacall_reportes';
const CLAVE_SESION = 'hexacall_sesion';

export const Almacenamiento = {
  inicializar() {
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
      //  Si ya se habian guardado datos en la tabla actica del localStorage se muestran
      const datosActivos = localStorage.getItem(CLAVE_PERSONAL);
      if (datosActivos) {
        return JSON.parse(datosActivos);
      }
      
      //  En el caso que este vacia, se rescata los datos de los 5 trabajadores predeterminados hacia la tabla activa que se utilizara
      const datosPorDefecto = localStorage.getItem('obraspro_personal') || '[]';
      return JSON.parse(datosPorDefecto);
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
