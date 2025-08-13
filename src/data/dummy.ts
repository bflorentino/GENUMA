import { Pieza, Visita, Mantenimiento, Estadisticas } from '../types';

export const piezas: Pieza[] = [
  {
    id: '1',
    nombre: 'Retrato de Juana Saltitopa',
    autor: 'Yoryi Morel',
    fechaCreacion: '1940',
    categoria: 'Pintura',
    descripcion: 'Óleo sobre lienzo que representa a una figura femenina taína, símbolo de la resistencia indígena dominicana.',
    estado: 'Excelente',
    ubicacion: 'Sala Principal - Pared Norte',
    imagen: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '1985-03-15',
    valor: 150000,
    dimensiones: '80cm x 60cm',
    material: 'Óleo sobre lienzo',
    procedencia: 'Colección privada familia Morel'
  },
  {
    id: '2',
    nombre: 'Cerámica Taína Ceremonial',
    autor: 'Artesano Taíno',
    fechaCreacion: '1200-1500',
    categoria: 'Cerámica',
    descripcion: 'Vasija ceremonial utilizada en rituales religiosos por los pueblos taínos que habitaron la isla.',
    estado: 'Bueno',
    ubicacion: 'Vitrina 3 - Sala Precolombina',
    imagen: 'https://images.pexels.com/photos/7586656/pexels-photo-7586656.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '1978-11-20',
    valor: 75000,
    dimensiones: '25cm x 30cm',
    material: 'Cerámica',
    procedencia: 'Excavaciones arqueológicas Higüey'
  },
  {
    id: '3',
    nombre: 'Paisaje de Samaná',
    autor: 'Cándido Bidó',
    fechaCreacion: '1995',
    categoria: 'Pintura',
    descripcion: 'Paisaje tropical que captura la esencia de la península de Samaná con su característico estilo naif.',
    estado: 'Regular',
    ubicacion: 'Sala de Arte Contemporáneo',
    imagen: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '2001-06-10',
    valor: 200000,
    dimensiones: '100cm x 80cm',
    material: 'Acrílico sobre lienzo',
    procedencia: 'Donación del artista'
  },
  {
    id: '4',
    nombre: 'Máscara Ritual Taína',
    autor: 'Artesano Taíno',
    fechaCreacion: '1300-1400',
    categoria: 'Escultura',
    descripcion: 'Máscara ceremonial tallada en madera, utilizada en rituales de fertilidad y cosecha.',
    estado: 'Necesita Restauración',
    ubicacion: 'Almacén - Pendiente restauración',
    imagen: 'https://images.pexels.com/photos/8926553/pexels-photo-8926553.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '1982-04-18',
    valor: 120000,
    dimensiones: '30cm x 25cm x 15cm',
    material: 'Madera de caoba',
    procedencia: 'Colección arqueológica nacional'
  },
  {
    id: '5',
    nombre: 'Merengue en el Malecón',
    autor: 'Jaime Colson',
    fechaCreacion: '1960',
    categoria: 'Pintura',
    descripción: 'Escena costumbrista que retrata la vida nocturna dominicana en el Malecón de Santo Domingo.',
    estado: 'Excelente',
    ubicacion: 'Sala de Cultura Popular',
    imagen: 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '1987-09-12',  
    valor: 180000,
    dimensiones: '90cm x 70cm',
    material: 'Óleo sobre lienzo',
    procedencia: 'Adquisición directa del artista'
  },
  {
    id: '6',
    nombre: 'Collar de Caracolas Taíno',
    autor: 'Artesano Taíno',
    fechaCreacion: '1400-1500',
    categoria: 'Joyería',
    descripcion: 'Collar ceremonial elaborado con caracolas marinas, símbolo de estatus social en la cultura taína.',
    estado: 'Bueno',
    ubicacion: 'Vitrina 5 - Sala Precolombina',
    imagen: 'https://images.pexels.com/photos/8850421/pexels-photo-8850421.jpeg?auto=compress&cs=tinysrgb&w=300',
    fechaAdquisicion: '1990-02-28',
    valor: 85000,
    dimensiones: '60cm longitud',
    material: 'Caracolas marinas y fibras vegetales',
    procedencia: 'Donación coleccionista privado'
  }
];

export const visitas: Visita[] = [
  {
    id: '1',
    visitante: 'Ana María Rodríguez',
    email: 'ana.rodriguez@email.com',
    telefono: '809-555-0123',
    fecha: '2025-08-15',
    hora: '10:00',
    personas: 2,
    tipo: 'Individual',
    estado: 'Confirmada',
    observaciones: 'Interesada en arte precolombino'
  },
  {
    id: '2',
    visitante: 'Colegio San Patricio',
    email: 'excursiones@sanpatricio.edu.do',
    telefono: '809-555-0456',
    fecha: '2025-08-16',
    hora: '09:00',
    personas: 25,
    tipo: 'Estudiante',
    estado: 'Confirmada',
    observaciones: 'Estudiantes de 8vo grado - Tour educativo'
  },
  {
    id: '3',
    visitante: 'Carlos Fernández',
    email: 'carlos.fernandez@email.com',
    telefono: '809-555-0789',
    fecha: '2025-08-17',
    hora: '14:30',
    personas: 1,
    tipo: 'Turista',
    estado: 'Pendiente',
    observaciones: 'Visitante internacional - Requiere guía en inglés'
  },
  {
    id: '4',
    visitante: 'Familia Jiménez',
    email: 'familia.jimenez@email.com',
    telefono: '809-555-0321',
    fecha: '2025-08-18',
    hora: '11:00',
    personas: 4,
    tipo: 'Grupo',
    estado: 'Confirmada',
    observaciones: 'Celebración familiar - cumpleaños'
  },
  {
    id: '5',
    visitante: 'Universidad APEC',
    email: 'arte@unapec.edu.do',
    telefono: '809-555-0654',
    fecha: '2025-08-19',
    hora: '15:00',
    personas: 15,
    tipo: 'Estudiante',
    estado: 'Completada',
    observaciones: 'Estudiantes de Historia del Arte'
  }
];

export const mantenimientos: Mantenimiento[] = [
  {
    id: '1',
    piezaId: '4',
    piezaNombre: 'Máscara Ritual Taína',
    tipo: 'Restauración',
    fechaInicio: '2024-01-10',
    fechaFin: '2024-02-15',
    estado: 'En Proceso',
    tecnico: 'Dra. Carmen Herrera',
    costo: 25000,
    descripcion: 'Restauración completa de grietas en la madera y tratamiento anti-polillas',
    prioridad: 'Alta'
  },
  {
    id: '2',
    piezaId: '3',
    piezaNombre: 'Paisaje de Samaná',
    tipo: 'Limpieza',
    fechaInicio: '2024-01-20',
    estado: 'Programado',
    tecnico: 'Lic. Pedro Martínez',
    costo: 8000,
    descripcion: 'Limpieza superficial y aplicación de barniz protector',
    prioridad: 'Media'
  },
  {
    id: '3',
    piezaId: '2',
    piezaNombre: 'Cerámica Taína Ceremonial',
    tipo: 'Conservación',
    fechaInicio: '2024-01-05',
    fechaFin: '2024-01-12',
    estado: 'Completado',
    tecnico: 'Dra. Carmen Herrera',
    costo: 15000,
    descripcion: 'Aplicación de consolidante y nueva base de soporte',
    prioridad: 'Media'
  },
  {
    id: '4',
    piezaId: '1',
    piezaNombre: 'Retrato de Juana Saltitopa',
    tipo: 'Limpieza',
    fechaInicio: '2024-02-01',
    estado: 'Programado',
    tecnico: 'Lic. Pedro Martínez',
    costo: 5000,
    descripcion: 'Limpieza anual preventiva del marco y barniz',
    prioridad: 'Baja'
  }
];

export const estadisticas: Estadisticas = {
  totalPiezas: 6,
  totalVisitas: 85,
  visitasHoy: 12,
  mantenimientosPendientes: 2,
  ingresosMes: 75000,
  piezasNecesitanMantenimiento: 1
};

// Categorías dummy para fallback
export const categorias = [
  { id: '1', nombre: 'Pintura', descripcion: 'Obras pictóricas', color: '#3b82f6' },
  { id: '2', nombre: 'Cerámica', descripcion: 'Piezas cerámicas', color: '#ef4444' },
  { id: '3', nombre: 'Escultura', descripcion: 'Obras escultóricas', color: '#10b981' },
  { id: '4', nombre: 'Joyería', descripcion: 'Piezas de joyería', color: '#f59e0b' }
];

// Estados de pieza dummy para fallback
export const estadosPieza = [
  { id: '1', nombre: 'Excelente', color: '#10b981', requiere_atencion: false },
  { id: '2', nombre: 'Bueno', color: '#3b82f6', requiere_atencion: false },
  { id: '3', nombre: 'Regular', color: '#f59e0b', requiere_atencion: true },
  { id: '4', nombre: 'Necesita Restauración', color: '#ef4444', requiere_atencion: true }
];

// Tipos de visita dummy para fallback
export const tiposVisita = [
  { id: '1', nombre: 'Individual', precio: 200, capacidad_maxima: 5 },
  { id: '2', nombre: 'Grupo', precio: 150, capacidad_maxima: 20 },
  { id: '3', nombre: 'Estudiante', precio: 100, capacidad_maxima: 30 },
  { id: '4', nombre: 'Turista', precio: 300, capacidad_maxima: 10 }
];

// Estados de visita dummy para fallback
export const estadosVisita = [
  { id: '1', nombre: 'Pendiente', color: '#f59e0b', es_final: false },
  { id: '2', nombre: 'Confirmada', color: '#10b981', es_final: false },
  { id: '3', nombre: 'Completada', color: '#3b82f6', es_final: true },
  { id: '4', nombre: 'Cancelada', color: '#ef4444', es_final: true }
];

// Tipos de mantenimiento dummy para fallback
export const tiposMantenimiento = [
  { id: '1', nombre: 'Restauración', costo_base: 25000, duracion_estimada_dias: 30 },
  { id: '2', nombre: 'Limpieza', costo_base: 5000, duracion_estimada_dias: 3 },
  { id: '3', nombre: 'Conservación', costo_base: 15000, duracion_estimada_dias: 14 }
];

// Técnicos dummy para fallback
export const tecnicos = [
  { id: '1', nombre_completo: 'Dra. Carmen Herrera', especialidades: ['Restauración', 'Conservación'], activo: true },
  { id: '2', nombre_completo: 'Lic. Pedro Martínez', especialidades: ['Limpieza', 'Mantenimiento'], activo: true }
];

// Objeto consolidado con todos los datos dummy
export const dummyData = {
  piezas,
  visitas,
  mantenimientos,
  estadisticas,
  categorias,
  estadosPieza,
  tiposVisita,
  estadosVisita,
  tiposMantenimiento,
  tecnicos
};