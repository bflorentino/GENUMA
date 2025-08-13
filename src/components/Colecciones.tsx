import React, { useState } from 'react';
import { useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Ruler,
  Package,
  Save,
  X,
  Download
} from 'lucide-react';
import { piezasService } from '../services/piezasService';
import Swal from 'sweetalert2';

interface ColeccionesProps {
  initialAction?: string | null;
  onActionComplete?: () => void;
  currentUserId?: string;
}

const Colecciones: React.FC<ColeccionesProps> = ({ initialAction, onActionComplete, currentUserId }) => {
  const [piezas, setPiezas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<any | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [formularioPieza, setFormularioPieza] = useState<any>({
    nombre: '',
    autor: '',
    fecha_creacion: '',
    categoria_id: '',
    descripcion: '',
    estado_id: '',
    ubicacion: '',
    imagen_url: '',
    fecha_adquisicion: '',
    valor_estimado: 0,
    dimensiones: '',
    material: '',
    procedencia: ''
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
      const [piezasData, categoriasData, estadosData] = await Promise.all([
        piezasService.getAllPiezas(),
        piezasService.getCategorias(),
        piezasService.getEstadosPieza()
      ]);
      
      setPiezas(piezasData);
      setCategorias(categoriasData);
      setEstados(estadosData);
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

  const piezasFiltradas = piezas.filter(pieza => {
    const matchesSearch = pieza.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pieza.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filtroCategoria || pieza.categoria === filtroCategoria;
    const matchesEstado = !filtroEstado || pieza.estado === filtroEstado;
    
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const getEstadoColor = (requiereAtencion: boolean) => {
    return requiereAtencion 
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';
  };

  const abrirModal = (pieza: any) => {
    setPiezaSeleccionada(pieza);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setPiezaSeleccionada(null);
    setMostrarModal(false);
    setQrCodeUrl('');
  };

  const abrirFormularioNuevo = () => {
    setModoEdicion(false);
    setFormularioPieza({
      nombre: '',
      autor: '',
      fecha_creacion: '',
      categoria_id: '',
      descripcion: '',
      estado_id: estados[0]?.id || '',
      ubicacion: '',
      imagen_url: '',
      fecha_adquisicion: new Date().toISOString().split('T')[0],
      valor_estimado: 0,
      dimensiones: '',
      material: '',
      procedencia: ''
    });
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (pieza: any) => {
    setModoEdicion(true);
    
    // Buscar los IDs correspondientes para categoria y estado
    const categoriaId = categorias.find(cat => cat.nombre === pieza.categoria)?.id || '';
    const estadoId = estados.find(est => est.nombre === pieza.estado)?.id || '';
    
    // Destructurar para omitir campos que no existen en la tabla piezas
    const { categoria, estado, estado_color, requiere_atencion, ...piezaData } = pieza;
    
    setFormularioPieza({
      ...piezaData,
      fecha_adquisicion: pieza.fecha_adquisicion?.split('T')[0] || '',
      categoria_id: categoriaId,
      estado_id: estadoId
    });
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setFormularioPieza({});
    setModoEdicion(false);
  };

  const manejarCambioFormulario = (campo: string, valor: any) => {
    setFormularioPieza(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarPieza = async () => {
    if (!formularioPieza.nombre || !formularioPieza.autor || !formularioPieza.categoria_id) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor complete los campos obligatorios: Nombre, Autor y Categoría',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      if (modoEdicion && formularioPieza.id) {
        await piezasService.updatePieza(formularioPieza.id, formularioPieza, currentUserId);
      } else {
        await piezasService.createPieza(formularioPieza, currentUserId);
      }

      Swal.fire({
        title: modoEdicion ? 'Pieza actualizada' : 'Pieza agregada',
        text: modoEdicion ? 'La pieza ha sido actualizada exitosamente' : 'La nueva pieza ha sido agregada al catálogo',
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

  const eliminarPieza = async (id: string) => {
    Swal.fire({
      title: '¿Eliminar pieza?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await piezasService.deletePieza(id);
          Swal.fire({
            title: 'Pieza eliminada',
            text: 'La pieza ha sido eliminada del catálogo',
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

  const generarQR = async (pieza: any) => {
    try {
      // Crear información de la pieza para el QR
      const piezaInfo = {
        id: pieza.id,
        nombre: pieza.nombre,
        autor: pieza.autor,
        categoria: pieza.categoria,
        ubicacion: pieza.ubicacion,
        fecha_creacion: pieza.fecha_creacion,
        url: `${window.location.origin}?pieza=${pieza.id}`
      };
      
      // Generar QR code como data URL
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(piezaInfo), {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generando QR:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo generar el código QR',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const descargarQR = () => {
    if (!qrCodeUrl || !piezaSeleccionada) return;
    
    const link = document.createElement('a');
    link.download = `QR_${piezaSeleccionada.nombre.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    Swal.fire({
      title: 'QR Descargado',
      text: 'El código QR ha sido descargado exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Colecciones</h1>
          <p className="text-gray-600 mt-1">
            Administra y cataloga las piezas del museo
          </p>
        </div>
        <button 
          onClick={abrirFormularioNuevo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Pieza</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado.id} value={estado.nombre}>{estado.nombre}</option>
            ))}
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtros Avanzados</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{piezas.length}</div>
          <div className="text-sm text-gray-500">Total de Piezas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{piezas.filter(p => p.estado === 'Excelente').length}</div>
          <div className="text-sm text-gray-500">En Buen Estado</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{piezas.filter(p => p.requiere_atencion).length}</div>
          <div className="text-sm text-gray-500">Necesita Restauración</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{categorias.length}</div>
          <div className="text-sm text-gray-500">Categorías</div>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {piezasFiltradas.map((pieza) => (
          <div key={pieza.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-12">
              <img 
                src={pieza.imagen_url || 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                alt={pieza.nombre}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{pieza.nombre}</h3>
                  <p className="text-sm text-gray-600">{pieza.autor} • {pieza.fecha_creacion}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pieza.requiere_atencion)}`}>
                  {pieza.estado}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="w-4 h-4 mr-2" />
                  {pieza.categoria}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {pieza.ubicacion}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 mr-2" />
                  RD$ {(pieza.valor_estimado || 0).toLocaleString()}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {pieza.descripcion}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => abrirModal(pieza)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalles</span>
                </button>
                <button 
                  onClick={() => abrirFormularioEdicion(pieza)}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => eliminarPieza(pieza.id)}
                  className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalles */}
      {mostrarModal && piezaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{piezaSeleccionada.nombre}</h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={piezaSeleccionada.imagen_url || 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                    alt={piezaSeleccionada.nombre}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autor:</span>
                        <span className="font-medium">{piezaSeleccionada.autor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Creación:</span>
                        <span className="font-medium">{piezaSeleccionada.fecha_creacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoría:</span>
                        <span className="font-medium">{piezaSeleccionada.categoria}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(piezaSeleccionada.requiere_atencion)}`}>
                          {piezaSeleccionada.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Técnicos</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensiones:</span>
                        <span className="font-medium">{piezaSeleccionada.dimensiones}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{piezaSeleccionada.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación:</span>
                        <span className="font-medium">{piezaSeleccionada.ubicacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium">RD$ {(piezaSeleccionada.valor_estimado || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Procedencia</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Adquisición:</span>
                        <span className="font-medium">{piezaSeleccionada.fecha_adquisicion ? new Date(piezaSeleccionada.fecha_adquisicion).toLocaleDateString('es-DO') : 'No especificada'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Procedencia:</span>
                        <p className="font-medium mt-1">{piezaSeleccionada.procedencia}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700">{piezaSeleccionada.descripcion}</p>
              </div>

              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={() => {
                    cerrarModal();
                    abrirFormularioEdicion(piezaSeleccionada);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => generarQR(piezaSeleccionada)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <span>📱</span>
                  <span>Generar QR</span>
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Imprimir Ficha
                </button>
                <button 
                  onClick={descargarQR}
                  disabled={!qrCodeUrl}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    qrCodeUrl 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar QR</span>
                </button>
              </div>

              {/* QR Code Display */}
              {qrCodeUrl && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Código QR</h3>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Código QR de la pieza" 
                      className="w-32 h-32 border border-gray-200 rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Este código QR contiene la información básica de la pieza y un enlace para acceder a sus detalles.
                      </p>
                      <p className="text-xs text-gray-500">
                        Escanea con cualquier lector de códigos QR para ver la información de la pieza.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modoEdicion ? 'Editar Pieza' : 'Añadir Nueva Pieza'}
                </h2>
                <button
                  onClick={cerrarFormulario}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); guardarPieza(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Pieza *
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.nombre || ''}
                        onChange={(e) => manejarCambioFormulario('nombre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autor *
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.autor || ''}
                        onChange={(e) => manejarCambioFormulario('autor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Creación
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.fecha_creacion || ''}
                        onChange={(e) => manejarCambioFormulario('fecha_creacion', e.target.value)}
                        placeholder="Ej: 1940, Siglo XVI, 1200-1500"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría *
                      </label>
                      <select
                        value={formularioPieza.categoria_id || ''}
                        onChange={(e) => manejarCambioFormulario('categoria_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={formularioPieza.estado_id || ''}
                        onChange={(e) => manejarCambioFormulario('estado_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {estados.map(estado => (
                          <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Detalles Técnicos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Detalles Técnicos</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dimensiones
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.dimensiones || ''}
                        onChange={(e) => manejarCambioFormulario('dimensiones', e.target.value)}
                        placeholder="Ej: 80cm x 60cm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.material || ''}
                        onChange={(e) => manejarCambioFormulario('material', e.target.value)}
                        placeholder="Ej: Óleo sobre lienzo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={formularioPieza.ubicacion || ''}
                        onChange={(e) => manejarCambioFormulario('ubicacion', e.target.value)}
                        placeholder="Ej: Sala Principal - Pared Norte"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor (RD$)
                      </label>
                      <input
                        type="number"
                        value={formularioPieza.valor_estimado || 0}
                        onChange={(e) => manejarCambioFormulario('valor_estimado', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Adquisición
                      </label>
                      <input
                        type="date"
                        value={formularioPieza.fecha_adquisicion || ''}
                        onChange={(e) => manejarCambioFormulario('fecha_adquisicion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción y Procedencia */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formularioPieza.descripcion || ''}
                      onChange={(e) => manejarCambioFormulario('descripcion', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción detallada de la pieza..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Procedencia
                    </label>
                    <textarea
                      value={formularioPieza.procedencia || ''}
                      onChange={(e) => manejarCambioFormulario('procedencia', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Origen y historia de adquisición..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      value={formularioPieza.imagen_url || ''}
                      onChange={(e) => manejarCambioFormulario('imagen_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{modoEdicion ? 'Actualizar' : 'Guardar'} Pieza</span>
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

export default Colecciones;