import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Mail,
  Clock,
  MapPin,
  Phone,
  Save,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';
import Swal from 'sweetalert2';

const Configuracion: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = useState('general');
  const [configuracion, setConfiguracion] = useState({
    // Configuración General
    nombreMuseo: 'Museo Nacional de Historia',
    descripcion: 'Museo dedicado a preservar y exhibir el patrimonio cultural dominicano',
    direccion: 'Calle Las Damas, Zona Colonial, Santo Domingo',
    telefono: '809-686-6668',
    email: 'info@museonacional.gov.do',
    sitioWeb: 'www.museonacional.gov.do',
    horarioApertura: '09:00',
    horarioCierre: '17:00',
    diasOperacion: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
    capacidadMaxima: 150,
    
    // Configuración de Precios
    precioGeneral: 100,
    precioEstudiante: 50,
    precioTurista: 200,
    precioGrupo: 80,
    
    // Configuración de Usuario
    nombreUsuario: 'María González',
    emailUsuario: 'maria.gonzalez@museonacional.gov.do',
    rol: 'Administrador',
    
    // Configuración de Notificaciones
    notificacionesEmail: true,
    notificacionesReservas: true,
    notificacionesMantenimiento: true,
    notificacionesReportes: false,
    
    // Configuración de Seguridad
    autenticacionDosFactor: false,
    sesionExpira: 8,
    intentosLogin: 3,
    
    // Configuración de Apariencia
    tema: 'claro',
    idioma: 'es',
    formatoFecha: 'DD/MM/YYYY',
    moneda: 'RD$'
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const secciones = [
    { id: 'general', titulo: 'General', icono: Settings },
    { id: 'usuario', titulo: 'Perfil de Usuario', icono: User },
    { id: 'precios', titulo: 'Precios y Tarifas', icono: Database },
    { id: 'notificaciones', titulo: 'Notificaciones', icono: Bell },
    { id: 'seguridad', titulo: 'Seguridad', icono: Shield },
    { id: 'apariencia', titulo: 'Apariencia', icono: Palette },
    { id: 'backup', titulo: 'Respaldo y Datos', icono: Download }
  ];

  const manejarCambio = (campo: string, valor: any) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const manejarCambioDias = (dia: string) => {
    setConfiguracion(prev => ({
      ...prev,
      diasOperacion: prev.diasOperacion.includes(dia)
        ? prev.diasOperacion.filter(d => d !== dia)
        : [...prev.diasOperacion, dia]
    }));
  };

  const guardarConfiguracion = () => {
    Swal.fire({
      title: 'Configuración guardada',
      text: 'Los cambios han sido guardados exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const cambiarPassword = () => {
    if (passwordNueva !== confirmarPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    if (passwordNueva.length < 8) {
      Swal.fire({
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres',
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    Swal.fire({
      title: 'Contraseña actualizada',
      text: 'Su contraseña ha sido cambiada exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    
    setPasswordActual('');
    setPasswordNueva('');
    setConfirmarPassword('');
  };

  const exportarDatos = () => {
    Swal.fire({
      title: 'Exportando datos...',
      text: 'Por favor espere mientras se genera el archivo',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire({
        title: 'Exportación completada',
        text: 'Los datos han sido exportados exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, 2000);
  };

  const importarDatos = () => {
    Swal.fire({
      title: 'Importar datos',
      text: 'Seleccione el archivo de respaldo para importar',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Seleccionar archivo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Función en desarrollo',
          text: 'Esta funcionalidad estará disponible próximamente',
          icon: 'info',
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  };

  const renderSeccionGeneral = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Museo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Museo
            </label>
            <input
              type="text"
              value={configuracion.nombreMuseo}
              onChange={(e) => manejarCambio('nombreMuseo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={configuracion.telefono}
              onChange={(e) => manejarCambio('telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={configuracion.email}
              onChange={(e) => manejarCambio('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio Web
            </label>
            <input
              type="url"
              value={configuracion.sitioWeb}
              onChange={(e) => manejarCambio('sitioWeb', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <textarea
            value={configuracion.direccion}
            onChange={(e) => manejarCambio('direccion', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={configuracion.descripcion}
            onChange={(e) => manejarCambio('descripcion', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de Operación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Apertura
            </label>
            <input
              type="time"
              value={configuracion.horarioApertura}
              onChange={(e) => manejarCambio('horarioApertura', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Cierre
            </label>
            <input
              type="time"
              value={configuracion.horarioCierre}
              onChange={(e) => manejarCambio('horarioCierre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad Máxima
            </label>
            <input
              type="number"
              value={configuracion.capacidadMaxima}
              onChange={(e) => manejarCambio('capacidadMaxima', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Días de Operación
          </label>
          <div className="flex flex-wrap gap-2">
            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
              <label key={dia} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={configuracion.diasOperacion.includes(dia)}
                  onChange={() => manejarCambioDias(dia)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{dia}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionPrecios = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarifas de Entrada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio General (RD$)
            </label>
            <input
              type="number"
              value={configuracion.precioGeneral}
              onChange={(e) => manejarCambio('precioGeneral', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Estudiante (RD$)
            </label>
            <input
              type="number"
              value={configuracion.precioEstudiante}
              onChange={(e) => manejarCambio('precioEstudiante', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Turista (RD$)
            </label>
            <input
              type="number"
              value={configuracion.precioTurista}
              onChange={(e) => manejarCambio('precioTurista', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Grupo (RD$)
            </label>
            <input
              type="number"
              value={configuracion.precioGrupo}
              onChange={(e) => manejarCambio('precioGrupo', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionUsuario = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              value={configuracion.nombreUsuario}
              onChange={(e) => manejarCambio('nombreUsuario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={configuracion.emailUsuario}
              onChange={(e) => manejarCambio('emailUsuario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={configuracion.rol}
              onChange={(e) => manejarCambio('rol', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Administrador">Administrador</option>
              <option value="Curador">Curador</option>
              <option value="Técnico">Técnico</option>
              <option value="Recepcionista">Recepcionista</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {mostrarPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={cambiarPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );

  const renderSeccionNotificaciones = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Notificaciones</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={configuracion.notificacionesEmail}
              onChange={(e) => manejarCambio('notificacionesEmail', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Notificaciones por Email</span>
              <p className="text-xs text-gray-500">Recibir notificaciones generales por correo electrónico</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={configuracion.notificacionesReservas}
              onChange={(e) => manejarCambio('notificacionesReservas', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Nuevas Reservas</span>
              <p className="text-xs text-gray-500">Notificar cuando se realicen nuevas reservas</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={configuracion.notificacionesMantenimiento}
              onChange={(e) => manejarCambio('notificacionesMantenimiento', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Mantenimiento Programado</span>
              <p className="text-xs text-gray-500">Recordatorios de tareas de mantenimiento</p>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={configuracion.notificacionesReportes}
              onChange={(e) => manejarCambio('notificacionesReportes', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Reportes Automáticos</span>
              <p className="text-xs text-gray-500">Recibir reportes mensuales automáticamente</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSeccionSeguridad = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={configuracion.autenticacionDosFactor}
              onChange={(e) => manejarCambio('autenticacionDosFactor', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</span>
              <p className="text-xs text-gray-500">Agregar una capa extra de seguridad al inicio de sesión</p>
            </div>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiración de Sesión (horas)
              </label>
              <input
                type="number"
                value={configuracion.sesionExpira}
                onChange={(e) => manejarCambio('sesionExpira', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intentos de Login Permitidos
              </label>
              <input
                type="number"
                value={configuracion.intentosLogin}
                onChange={(e) => manejarCambio('intentosLogin', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionApariencia = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Apariencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={configuracion.tema}
              onChange={(e) => manejarCambio('tema', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="claro">Claro</option>
              <option value="oscuro">Oscuro</option>
              <option value="automatico">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idioma
            </label>
            <select
              value={configuracion.idioma}
              onChange={(e) => manejarCambio('idioma', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato de Fecha
            </label>
            <select
              value={configuracion.formatoFecha}
              onChange={(e) => manejarCambio('formatoFecha', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <select
              value={configuracion.moneda}
              onChange={(e) => manejarCambio('moneda', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="RD$">Peso Dominicano (RD$)</option>
              <option value="USD">Dólar Americano (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionBackup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Respaldo y Restauración</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Exportar Datos</h4>
            <p className="text-sm text-blue-700 mb-3">
              Descarga una copia de seguridad de todos los datos del museo
            </p>
            <button
              onClick={exportarDatos}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Datos</span>
            </button>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Importar Datos</h4>
            <p className="text-sm text-green-700 mb-3">
              Restaura datos desde un archivo de respaldo
            </p>
            <button
              onClick={importarDatos}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Importar Datos</span>
            </button>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-900 mb-2">Zona de Peligro</h4>
            <p className="text-sm text-red-700 mb-3">
              Estas acciones son irreversibles. Procede con precaución.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Resetear Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'general': return renderSeccionGeneral();
      case 'usuario': return renderSeccionUsuario();
      case 'precios': return renderSeccionPrecios();
      case 'notificaciones': return renderSeccionNotificaciones();
      case 'seguridad': return renderSeccionSeguridad();
      case 'apariencia': return renderSeccionApariencia();
      case 'backup': return renderSeccionBackup();
      default: return renderSeccionGeneral();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">
            Personaliza y configura el sistema según las necesidades del museo
          </p>
        </div>
        <button 
          onClick={guardarConfiguracion}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {secciones.map((seccion) => {
                const Icon = seccion.icono;
                return (
                  <button
                    key={seccion.id}
                    onClick={() => setSeccionActiva(seccion.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      seccionActiva === seccion.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{seccion.titulo}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderContenido()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;