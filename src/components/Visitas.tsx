import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { visitasService } from '../services/visitasService';
import Swal from 'sweetalert2';

interface VisitasProps {
  initialAction?: string | null;
  onActionComplete?: () => void;
  currentUserId?: string;
}

const Visitas: React.FC<VisitasProps> = ({ initialAction, onActionComplete, currentUserId }) => {
  const [visitas, setVisitas] = useState<any[]>([]);
  const [tiposVisita, setTiposVisita] = useState<any[]>([]);
  const [estadosVisita, setEstadosVisita] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioVisita, setFormularioVisita] = useState({
    visitante_nombre: '',
    visitante_email: '',
    visitante_telefono: '',
    fecha_visita: new Date().toISOString().split('T')[0],
    hora_visita: '10:00',
    numero_personas: 1,
    tipo_visita_id: '',
    observaciones: ''
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
      const [visitasData, tiposData, estadosData] = await Promise.all([
        visitasService.getAllVisitas(),
        visitasService.getTiposVisita(),
        visitasService.getEstadosVisita()
      ]);
      
      setVisitas(visitasData);
      setTiposVisita(tiposData);
      setEstadosVisita(estadosData);
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

  const visitasFiltradas = visitas.filter(visita => {
    const matchesSearch = visita.visitante_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.visitante_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filtroEstado || visita.estado === filtroEstado;
    const matchesTipo = !filtroTipo || visita.tipo_visita === filtroTipo;
    
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pendiente': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Cancelada': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Completada': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Individual': return '👤';
      case 'Grupo': return '👥';
      case 'Estudiante': return '🎓';
      case 'Turista': return '🌍';
      default: return '👤';
    }
  };

  const abrirModal = (visita: any) => {
    setVisitaSeleccionada(visita);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setVisitaSeleccionada(null);
    setMostrarModal(false);
  };

  const cambiarEstadoVisita = async (id: string, nuevoEstado: string) => {
    const estadoTexto = nuevoEstado === 'Confirmada' ? 'confirmar' : 'cancelar';
    const estadoColor = nuevoEstado === 'Confirmada' ? '#10b981' : '#ef4444';
    
    Swal.fire({
      title: `¿${estadoTexto.charAt(0).toUpperCase() + estadoTexto.slice(1)} visita?`,
      text: `¿Está seguro de que desea ${estadoTexto} esta visita?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: estadoColor,
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Sí, ${estadoTexto}`,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (nuevoEstado === 'Confirmada') {
            await visitasService.confirmarVisita(id);
          } else {
            await visitasService.cancelarVisita(id);
          }
          
          Swal.fire({
            title: `Visita ${nuevoEstado.toLowerCase()}`,
            text: `La visita ha sido ${nuevoEstado.toLowerCase()} exitosamente`,
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

  const eliminarVisita = async (id: string) => {
    Swal.fire({
      title: '¿Eliminar visita?',
      text: '¿Está seguro de que desea eliminar esta visita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await visitasService.deleteVisita(id);
          Swal.fire({
            title: 'Visita eliminada',
            text: 'La visita ha sido eliminada exitosamente',
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

  const enviarRecordatorio = (visita: any) => {
    Swal.fire({
      title: 'Enviando recordatorio...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simular envío
    setTimeout(() => {
      Swal.fire({
        title: 'Recordatorio enviado',
        text: `Se ha enviado un recordatorio a ${visita.visitante_email}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1500);
  };

  // Estadísticas
  const totalVisitas = visitas.length;
  const visitasConfirmadas = visitas.filter(v => v.estado === 'Confirmada').length;
  const visitasPendientes = visitas.filter(v => v.estado === 'Pendiente').length;
  const visitasHoy = visitas.filter(v => v.fecha_visita === new Date().toISOString().split('T')[0]).length;

  const abrirFormularioNuevo = () => {
    setModoEdicion(false);
    setFormularioVisita({
      visitante_nombre: '',
      visitante_email: '',
      visitante_telefono: '',
      fecha_visita: new Date().toISOString().split('T')[0],
      hora_visita: '10:00',
      numero_personas: 1,
      tipo_visita_id: tiposVisita[0]?.id || '',
      observaciones: ''
    });
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (visita: any) => {
    setModoEdicion(true);
    
    // Buscar el ID del tipo de visita
    const tipoVisitaId = tiposVisita.find(tipo => tipo.nombre === visita.tipo_visita)?.id || '';
    
    setFormularioVisita({
      id: visita.id,
      visitante_nombre: visita.visitante_nombre,
      visitante_email: visita.visitante_email,
      visitante_telefono: visita.visitante_telefono,
      fecha_visita: visita.fecha_visita,
      hora_visita: visita.hora_visita,
      numero_personas: visita.numero_personas,
      tipo_visita_id: tipoVisitaId,
      observaciones: visita.observaciones || ''
    });
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormularioVisita({
      visitante_nombre: '',
      visitante_email: '',
      visitante_telefono: '',
      fecha_visita: new Date().toISOString().split('T')[0],
      hora_visita: '10:00',
      numero_personas: 1,
      tipo_visita_id: '',
      observaciones: ''
    });
    setModoEdicion(false);
  };

  const manejarCambioFormulario = (campo: string, valor: any) => {
    setFormularioVisita(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarVisita = async () => {
    if (!formularioVisita.visitante_nombre || !formularioVisita.visitante_email || !formularioVisita.visitante_telefono) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor complete los campos obligatorios: Visitante, Email y Teléfono',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      if (modoEdicion) {
        await visitasService.updateVisita(formularioVisita.id, formularioVisita);
        
        Swal.fire({
          title: 'Reserva actualizada',
          text: 'La reserva ha sido actualizada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await visitasService.createVisita(formularioVisita, currentUserId);
        
        Swal.fire({
          title: 'Reserva creada',
          text: 'La nueva reserva ha sido programada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Visitas</h1>
          <p className="text-gray-600 mt-1">
            Administra reservas y visitas al museo
          </p>
        </div>
        <button 
          onClick={abrirFormularioNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Reserva</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{totalVisitas}</div>
          <div className="text-sm text-gray-500">Total de Visitas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{visitasConfirmadas}</div>
          <div className="text-sm text-gray-500">Confirmadas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{visitasPendientes}</div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{visitasHoy}</div>
          <div className="text-sm text-gray-500">Visitas Hoy</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por visitante o email..."
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
            {estadosVisita.map(estado => (
              <option key={estado.id} value={estado.nombre}>{estado.nombre}</option>
            ))}
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            {tiposVisita.map(tipo => (
              <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
            ))}
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Filtrar por Fecha</span>
          </button>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitasFiltradas.map((visita) => (
                <tr key={visita.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{visita.visitante_nombre}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {visita.visitante_email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {visita.visitante_telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(visita.fecha_visita).toLocaleDateString('es-DO')}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {visita.hora_visita}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{getTipoIcon(visita.tipo_visita)}</span>
                      <span className="text-sm text-gray-900">{visita.tipo_visita}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {visita.numero_personas}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getEstadoIcon(visita.estado)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(visita.estado)}`}>
                        {visita.estado}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => abrirModal(visita)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => abrirFormularioEdicion(visita)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => eliminarVisita(visita.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {mostrarModal && visitaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalles de la Visita</h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Visitante</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <p className="font-medium text-gray-900">{visitaSeleccionada.visitante_nombre}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{visitaSeleccionada.visitante_email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>
                        <p className="font-medium text-gray-900">{visitaSeleccionada.visitante_telefono}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tipo de Visita:</span>
                        <p className="font-medium text-gray-900 flex items-center">
                          <span className="mr-2 text-lg">{getTipoIcon(visitaSeleccionada.tipo_visita)}</span>
                          {visitaSeleccionada.tipo_visita}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalles de la Reserva</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Fecha:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(visitaSeleccionada.fecha_visita).toLocaleDateString('es-DO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hora:</span>
                        <p className="font-medium text-gray-900">{visitaSeleccionada.hora_visita}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Número de Personas:</span>
                        <p className="font-medium text-gray-900">{visitaSeleccionada.numero_personas}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <div className="flex items-center mt-1">
                          {getEstadoIcon(visitaSeleccionada.estado)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(visitaSeleccionada.estado)}`}>
                            {visitaSeleccionada.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {visitaSeleccionada.observaciones && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {visitaSeleccionada.observaciones}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => cambiarEstadoVisita(visitaSeleccionada.id, 'Confirmada')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar</span>
                  </button>
                  <button 
                    onClick={() => cambiarEstadoVisita(visitaSeleccionada.id, 'Cancelada')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button 
                    onClick={() => {
                      cerrarModal();
                      abrirFormularioEdicion(visitaSeleccionada);
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => enviarRecordatorio(visitaSeleccionada)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Enviar Recordatorio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulario Nueva Reserva */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modoEdicion ? 'Editar Reserva' : 'Nueva Reserva'}
                </h2>
                <button
                  onClick={cerrarFormulario}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); guardarVisita(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Visitante *
                    </label>
                    <input
                      type="text"
                      value={formularioVisita.visitante_nombre}
                      onChange={(e) => manejarCambioFormulario('visitante_nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formularioVisita.visitante_email}
                      onChange={(e) => manejarCambioFormulario('visitante_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formularioVisita.visitante_telefono}
                      onChange={(e) => manejarCambioFormulario('visitante_telefono', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Visita
                    </label>
                    <select
                      value={formularioVisita.tipo_visita_id}
                      onChange={(e) => manejarCambioFormulario('tipo_visita_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {tiposVisita.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Visita
                    </label>
                    <input
                      type="date"
                      value={formularioVisita.fecha_visita}
                      onChange={(e) => manejarCambioFormulario('fecha_visita', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={formularioVisita.hora_visita}
                      onChange={(e) => manejarCambioFormulario('hora_visita', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Personas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formularioVisita.numero_personas}
                      onChange={(e) => manejarCambioFormulario('numero_personas', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    value={formularioVisita.observaciones}
                    onChange={(e) => manejarCambioFormulario('observaciones', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Información adicional sobre la visita..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{modoEdicion ? 'Actualizar' : 'Crear'} Reserva</span>
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

export default Visitas;