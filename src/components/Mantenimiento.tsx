import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  DollarSign,
  Save,
  X,
  Edit3,
  Trash2,
  Play,
  Square
} from 'lucide-react';
import { mantenimientosService } from '../services/mantenimientosService';
import { piezasService } from '../services/piezasService';
import Swal from 'sweetalert2';

interface MantenimientoProps {
  initialAction?: string | null;
  onActionComplete?: () => void;
  currentUserId?: string;
}

const MantenimientoComponent: React.FC<MantenimientoProps> = ({ initialAction, onActionComplete, currentUserId }) => {
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [piezas, setPiezas] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [tiposMantenimiento, setTiposMantenimiento] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState<any | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formularioMantenimiento, setFormularioMantenimiento] = useState<any>({
    pieza_id: '',
    tipo_id: '',
    tecnico_id: '',
    fecha_inicio: '',
    fecha_fin_estimada: '',
    estado: 'Programado',
    costo_estimado: 0,
    descripcion: '',
    prioridad: 'Media'
  });

  useEffect(() => {
    loadData();
  }, []);

  // Efecto para manejar acciones iniciales
  React.useEffect(() => {
    if (initialAction === 'add') {
      abrirFormularioNuevo();
      onActionComplete?.();
    }
  }, [initialAction, onActionComplete]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mantenimientosData, piezasData, tecnicosData, tiposData] = await Promise.all([
        mantenimientosService.getAllMantenimientos(),
        piezasService.getAllPiezas(),
        mantenimientosService.getTecnicos(),
        mantenimientosService.getTiposMantenimiento()
      ]);
      
      setMantenimientos(mantenimientosData);
      setPiezas(piezasData);
      setTecnicos(tecnicosData);
      setTiposMantenimiento(tiposData);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const estados = ['Programado', 'En Proceso', 'Completado', 'Cancelado'];
  const prioridades = ['Alta', 'Media', 'Baja'];

  const mantenimientosFiltrados = mantenimientos.filter(mantenimiento => {
    const matchesSearch = mantenimiento.pieza_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mantenimiento.tecnico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filtroEstado || mantenimiento.estado === filtroEstado;
    const matchesTipo = !filtroTipo || mantenimiento.tipo_mantenimiento === filtroTipo;
    const matchesPrioridad = !filtroPrioridad || mantenimiento.prioridad === filtroPrioridad;
    
    return matchesSearch && matchesEstado && matchesTipo && matchesPrioridad;
  });

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Completado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'En Proceso': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Programado': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'Cancelado': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En Proceso': return 'bg-yellow-100 text-yellow-800';
      case 'Programado': return 'bg-blue-100 text-blue-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return 'text-red-600 bg-red-100';
      case 'Media': return 'text-yellow-600 bg-yellow-100';
      case 'Baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Restauración': return '🎨';
      case 'Limpieza': return '🧽';
      case 'Reparación': return '🔧';
      case 'Conservación': return '🛡️';
      default: return '🔧';
    }
  };

  const abrirFormularioNuevo = () => {
    setModoEdicion(false);
    setFormularioMantenimiento({
      pieza_id: '',
      tipo_id: tiposMantenimiento[0]?.id || '',
      tecnico_id: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin_estimada: '',
      estado: 'Programado',
      costo_estimado: 0,
      descripcion: '',
      prioridad: 'Media'
    });
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (mantenimiento: any) => {
    setModoEdicion(true);
    setFormularioMantenimiento({
      ...mantenimiento,
      fecha_inicio: mantenimiento.fecha_inicio?.split('T')[0] || '',
      fecha_fin_estimada: mantenimiento.fecha_fin_estimada?.split('T')[0] || ''
    });
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormularioMantenimiento({});
    setModoEdicion(false);
  };

  const abrirModal = (mantenimiento: any) => {
    setMantenimientoSeleccionado(mantenimiento);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMantenimientoSeleccionado(null);
    setMostrarModal(false);
  };

  const manejarCambioFormulario = (campo: string, valor: any) => {
    setFormularioMantenimiento(prev => {
      const updated = { ...prev, [campo]: valor };
      return updated;
    });
  };

  const guardarMantenimiento = async () => {
    if (!formularioMantenimiento.pieza_id || !formularioMantenimiento.tecnico_id || !formularioMantenimiento.descripcion) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor complete los campos obligatorios: Pieza, Técnico y Descripción',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      if (modoEdicion && formularioMantenimiento.id) {
        await mantenimientosService.updateMantenimiento(formularioMantenimiento.id, formularioMantenimiento, currentUserId);
      } else {
        await mantenimientosService.createMantenimiento(formularioMantenimiento, currentUserId);
      }

      Swal.fire({
        title: modoEdicion ? 'Mantenimiento actualizado' : 'Mantenimiento programado',
        text: modoEdicion ? 'La tarea ha sido actualizada exitosamente' : 'La nueva tarea ha sido programada',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      cerrarFormulario();
      loadData(); // Recargar datos
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const eliminarMantenimiento = async (id: string) => {
    Swal.fire({
      title: '¿Eliminar tarea?',
      text: '¿Está seguro de que desea eliminar esta tarea de mantenimiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await mantenimientosService.deleteMantenimiento(id);
          Swal.fire({
            title: 'Tarea eliminada',
            text: 'La tarea de mantenimiento ha sido eliminada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          loadData(); // Recargar datos
        } catch (error: any) {
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonColor: '#3b82f6'
          });
        }
      }
    });
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      await mantenimientosService.cambiarEstado(id, nuevoEstado);
      loadData(); // Recargar datos
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estadísticas
  const totalMantenimientos = mantenimientos.length;
  const enProceso = mantenimientos.filter(m => m.estado === 'En Proceso').length;
  const programados = mantenimientos.filter(m => m.estado === 'Programado').length;
  const completados = mantenimientos.filter(m => m.estado === 'Completado').length;
  const costoTotal = mantenimientos.reduce((sum, m) => sum + (m.costo_estimado || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mantenimiento</h1>
          <p className="text-gray-600 mt-1">
            Administra el mantenimiento y restauración de las piezas
          </p>
        </div>
        <button 
          onClick={abrirFormularioNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Mantenimiento</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{totalMantenimientos}</div>
          <div className="text-sm text-gray-500">Total de Tareas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{enProceso}</div>
          <div className="text-sm text-gray-500">En Proceso</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{programados}</div>
          <div className="text-sm text-gray-500">Programados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{completados}</div>
          <div className="text-sm text-gray-500">Completados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">RD$ {costoTotal.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Costo Total</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por pieza o técnico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            {tiposMantenimiento.map(tipo => (
              <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
            ))}
          </select>

          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las prioridades</option>
            {prioridades.map(prioridad => (
              <option key={prioridad} value={prioridad}>{prioridad}</option>
            ))}
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Más Filtros</span>
          </button>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mantenimientosFiltrados.map((mantenimiento) => (
          <div key={mantenimiento.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getTipoIcon(mantenimiento.tipo_mantenimiento)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{mantenimiento.pieza_nombre}</h3>
                    <p className="text-sm text-gray-500">{mantenimiento.tipo_mantenimiento}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(mantenimiento.prioridad)}`}>
                    {mantenimiento.prioridad}
                  </span>
                  <div className="flex items-center">
                    {getEstadoIcon(mantenimiento.estado)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(mantenimiento.estado)}`}>
                      {mantenimiento.estado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Técnico:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{mantenimiento.tecnico}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fecha inicio:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(mantenimiento.fecha_inicio).toLocaleDateString('es-DO')}
                  </span>
                </div>

                {mantenimiento.fecha_fin_real && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Fecha fin:</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(mantenimiento.fecha_fin_real).toLocaleDateString('es-DO')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Costo:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    RD$ {(mantenimiento.costo_estimado || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Descripción</h4>
                <p className="text-sm text-gray-700">{mantenimiento.descripcion}</p>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => abrirModal(mantenimiento)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Ver Detalles
                </button>
                <button 
                  onClick={() => abrirFormularioEdicion(mantenimiento)}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => eliminarMantenimiento(mantenimiento.id)}
                  className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {mantenimiento.estado === 'Programado' && (
                  <button 
                    onClick={() => cambiarEstado(mantenimiento.id, 'En Proceso')}
                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    title="Iniciar"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {mantenimiento.estado === 'En Proceso' && (
                  <button 
                    onClick={() => cambiarEstado(mantenimiento.id, 'Completado')}
                    className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
                    title="Completar"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalles */}
      {mostrarModal && mantenimientoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Mantenimiento</h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información General</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Pieza:</span>
                        <p className="font-medium text-gray-900">{mantenimientoSeleccionado.pieza_nombre}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <p className="font-medium text-gray-900 flex items-center">
                          <span className="mr-2 text-lg">{getTipoIcon(mantenimientoSeleccionado.tipo_mantenimiento)}</span>
                          {mantenimientoSeleccionado.tipo_mantenimiento}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Técnico:</span>
                        <p className="font-medium text-gray-900">{mantenimientoSeleccionado.tecnico}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Prioridad:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(mantenimientoSeleccionado.prioridad)}`}>
                          {mantenimientoSeleccionado.prioridad}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Estado y Fechas</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <div className="flex items-center mt-1">
                          {getEstadoIcon(mantenimientoSeleccionado.estado)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(mantenimientoSeleccionado.estado)}`}>
                            {mantenimientoSeleccionado.estado}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Fecha de Inicio:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(mantenimientoSeleccionado.fecha_inicio).toLocaleDateString('es-DO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      {mantenimientoSeleccionado.fecha_fin_real && (
                        <div>
                          <span className="text-gray-600">Fecha de Finalización:</span>
                          <p className="font-medium text-gray-900">
                            {new Date(mantenimientoSeleccionado.fecha_fin_real).toLocaleDateString('es-DO', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Costo:</span>
                        <p className="font-medium text-gray-900">RD$ {(mantenimientoSeleccionado.costo_estimado || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción del Trabajo</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {mantenimientoSeleccionado.descripcion}
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => {
                      cerrarModal();
                      abrirFormularioEdicion(mantenimientoSeleccionado);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  {mantenimientoSeleccionado.estado === 'Programado' && (
                    <button 
                      onClick={() => {
                        cambiarEstado(mantenimientoSeleccionado.id, 'En Proceso');
                        cerrarModal();
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Iniciar</span>
                    </button>
                  )}
                  {mantenimientoSeleccionado.estado === 'En Proceso' && (
                    <button 
                      onClick={() => {
                        cambiarEstado(mantenimientoSeleccionado.id, 'Completado');
                        cerrarModal();
                      }}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Completar</span>
                    </button>
                  )}
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Imprimir Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modoEdicion ? 'Editar Mantenimiento' : 'Programar Nuevo Mantenimiento'}
                </h2>
                <button
                  onClick={cerrarFormulario}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); guardarMantenimiento(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información de la Pieza */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de la Pieza</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pieza a Mantener *
                      </label>
                      <select
                        value={formularioMantenimiento.pieza_id || ''}
                        onChange={(e) => manejarCambioFormulario('pieza_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar pieza</option>
                        {piezas.map(pieza => (
                          <option key={pieza.id} value={pieza.id}>
                            {pieza.nombre} - {pieza.autor}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Mantenimiento
                      </label>
                      <select
                        value={formularioMantenimiento.tipo_id || ''}
                        onChange={(e) => manejarCambioFormulario('tipo_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {tiposMantenimiento.map(tipo => (
                          <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridad
                      </label>
                      <select
                        value={formularioMantenimiento.prioridad || 'Media'}
                        onChange={(e) => manejarCambioFormulario('prioridad', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {prioridades.map(prioridad => (
                          <option key={prioridad} value={prioridad}>{prioridad}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Información del Técnico y Fechas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Asignación y Fechas</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Técnico Asignado *
                      </label>
                      <select
                        value={formularioMantenimiento.tecnico_id || ''}
                        onChange={(e) => manejarCambioFormulario('tecnico_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar técnico</option>
                        {tecnicos.map(tecnico => (
                          <option key={tecnico.id} value={tecnico.id}>{tecnico.nombre_completo}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        value={formularioMantenimiento.fecha_inicio || ''}
                        onChange={(e) => manejarCambioFormulario('fecha_inicio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Finalización (Estimada)
                      </label>
                      <input
                        type="date"
                        value={formularioMantenimiento.fecha_fin_estimada || ''}
                        onChange={(e) => manejarCambioFormulario('fecha_fin_estimada', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Costo Estimado (RD$)
                      </label>
                      <input
                        type="number"
                        value={formularioMantenimiento.costo_estimado || 0}
                        onChange={(e) => manejarCambioFormulario('costo_estimado', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={formularioMantenimiento.estado || 'Programado'}
                        onChange={(e) => manejarCambioFormulario('estado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {estados.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Trabajo *
                  </label>
                  <textarea
                    value={formularioMantenimiento.descripcion || ''}
                    onChange={(e) => manejarCambioFormulario('descripcion', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe detalladamente el trabajo a realizar..."
                    required
                  />
                </div>

                {/* Botones */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{modoEdicion ? 'Actualizar' : 'Programar'} Mantenimiento</span>
                  </button>
                  <button
                    type="button"
                    onClick={cerrarFormulario}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MantenimientoComponent;