export interface Pieza {
  id: string;
  nombre: string;
  autor: string;
  fechaCreacion: string;
  categoria: string;
  descripcion: string;
  estado: 'Excelente' | 'Bueno' | 'Regular' | 'Necesita Restauración';
  ubicacion: string;
  imagen: string;
  fechaAdquisicion: string;
  valor: number;
  dimensiones: string;
  material: string;
  procedencia: string;
}

export interface Visita {
  id: string;
  visitante: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  personas: number;
  tipo: 'Individual' | 'Grupo' | 'Estudiante' | 'Turista';
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada';
  observaciones?: string;
}

export interface Mantenimiento {
  id: string;
  piezaId: string;
  piezaNombre: string;
  tipo: 'Limpieza' | 'Restauración' | 'Reparación' | 'Conservación';
  fechaInicio: string;
  fechaFin?: string;
  estado: 'Programado' | 'En Proceso' | 'Completado' | 'Cancelado';
  tecnico: string;
  costo: number;
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
}

export interface Estadisticas {
  totalPiezas: number;
  totalVisitas: number;
  visitasHoy: number;
  mantenimientosActivos: number;
  ingresosMes: number;
  piezasAtencion: number;
  costoTotal?: number;
  totalPersonas?: number;
  ingresoTotal?: number;
  visitasPorTipo?: { [key: string]: number };
  piezasPorCategoria?: { [key: string]: number };
  mantenimientosPorTipo?: { [key: string]: number };
  piezasPorEstado?: { [key: string]: number };
  mantenimientos?: any[];
}