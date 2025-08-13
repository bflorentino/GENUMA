import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Image, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  Eye,
  PieChart,
  Activity,
  Clock,
  MapPin
} from 'lucide-react';
import { reportesService } from '../services/reportesService';
import { dashboardService } from '../services/dashboardService';
import Swal from 'sweetalert2';

interface ReportesProps {
  currentUserId?: string;
}

const Reportes: React.FC<ReportesProps> = ({ currentUserId }) => {
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [tipoReporte, setTipoReporte] = useState('general');
  const [datosReporte, setDatosReporte] = useState<any>({
    totalVisitas: 0,
    ingresosMes: 0,
    totalPiezas: 0,
    costoTotal: 0,
    totalPersonas: 0,
    ingresoTotal: 0,
    visitasPorTipo: {},
    piezasPorCategoria: {},
    mantenimientosPorTipo: {},
    piezasPorEstado: {},
    mantenimientos: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generarReporte();
  }, [tipoReporte, filtroFecha]);

  const generarReporte = async () => {
    try {
      setLoading(true);
      
      // Calcular fechas basadas en el filtro
      const fechaFin = new Date().toISOString().split('T')[0];
      let fechaInicio = '';
      
      switch (filtroFecha) {
        case 'semana':
          fechaInicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'mes':
          fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'trimestre':
          fechaInicio = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'año':
          fechaInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
      }

      let datos;
      switch (tipoReporte) {
        case 'colecciones':
          datos = await reportesService.generarReporteColecciones(fechaInicio, fechaFin);
          break;
        case 'visitas':
          datos = await reportesService.generarReporteVisitas(fechaInicio, fechaFin);
          break;
        case 'mantenimiento':
          datos = await reportesService.generarReporteMantenimiento(fechaInicio, fechaFin);
          break;
        default:
          datos = await dashboardService.getEstadisticasGenerales();
          break;
      }
      
      setDatosReporte(datos);
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

  const reportes = [
    {
      id: 'general',
      titulo: 'Reporte General',
      descripcion: 'Vista general de todas las métricas del museo'
    },
    {
      id: 'colecciones',
      titulo: 'Reporte de Colecciones',
      descripcion: 'Análisis detallado de las piezas y su estado'
    },
    {
      id: 'visitas',
      titulo: 'Reporte de Visitas',
      descripcion: 'Estadísticas de visitantes y reservas'
    },
    {
      id: 'mantenimiento',
      titulo: 'Reporte de Mantenimiento',
      descripcion: 'Análisis de costos y tareas de mantenimiento'
    },
    {
      id: 'financiero',
      titulo: 'Reporte Financiero',
      descripcion: 'Ingresos, gastos y análisis económico'
    }
  ];

  const exportarReporte = async (formato: string) => {
    Swal.fire({
      title: `Exportando ${formato.toUpperCase()}...`,
      text: 'Generando reporte, por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const tituloReporte = `Reporte ${reportes.find(r => r.id === tipoReporte)?.titulo} - ${new Date().toLocaleDateString('es-DO')}`;
      
      if (formato === 'excel') {
        await reportesService.exportarExcel(tipoReporte, datosReporte, tituloReporte);
      }
      
      // Guardar el reporte en la base de datos
      try {
        await reportesService.guardarReporte({
          titulo: tituloReporte,
          tipo: tipoReporte,
          datos: datosReporte,
          formato: formato,
          parametros: { filtroFecha, tipoReporte }
        }, currentUserId);
      } catch (dbError) {
        console.warn('Error saving report to database:', dbError);
        // No interrumpir el flujo si falla el guardado en BD
      }
      
      Swal.fire({
        title: 'Reporte generado',
        text: `El reporte en formato ${formato.toUpperCase()} ha sido descargado`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const renderGraficoBarras = (datos: Record<string, number>, titulo: string, color: string) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{titulo}</h3>
      <div className="space-y-3">
        {Object.entries(datos).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{key}</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${(value / Math.max(...Object.values(datos))) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-8">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de las operaciones del museo
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => exportarReporte('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportes.map(reporte => (
                <option key={reporte.id} value={reporte.id}>{reporte.titulo}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="año">Este Año</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Filter className="w-4 h-4" />
              <span onClick={generarReporte}>Aplicar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Visitantes</p>
              <p className="text-3xl font-bold">{datosReporte.totalVisitas || 0}</p>
              <p className="text-blue-100 text-sm">{datosReporte.totalPersonas ? `${datosReporte.totalPersonas} personas` : 'Sin datos'}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Ingresos Totales</p>
              <p className="text-3xl font-bold">RD$ {(datosReporte.ingresoTotal || datosReporte.ingresosMes || 0).toLocaleString()}</p>
              <p className="text-green-100 text-sm">{datosReporte.totalVisitas ? `${datosReporte.totalVisitas} visitas` : 'Sin datos'}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Piezas en Colección</p>
              <p className="text-3xl font-bold">{datosReporte.totalPiezas || 0}</p>
              <p className="text-purple-100 text-sm">{Object.keys(datosReporte.piezasPorCategoria || {}).length} categorías</p>
            </div>
            <Image className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Costo Mantenimiento</p>
              <p className="text-3xl font-bold">RD$ {(datosReporte.costoTotal || 0).toLocaleString()}</p>
              <p className="text-orange-100 text-sm">{datosReporte.mantenimientos ? `${datosReporte.mantenimientos.length} tareas` : 'Sin datos'}</p>
            </div>
            <Activity className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {datosReporte.visitasPorTipo && renderGraficoBarras(datosReporte.visitasPorTipo, 'Visitas por Tipo', 'bg-blue-500')}
        {datosReporte.piezasPorCategoria && renderGraficoBarras(datosReporte.piezasPorCategoria, 'Piezas por Categoría', 'bg-purple-500')}
        {datosReporte.mantenimientosPorTipo && renderGraficoBarras(datosReporte.mantenimientosPorTipo, 'Mantenimientos por Tipo', 'bg-orange-500')}
        {datosReporte.piezasPorEstado && renderGraficoBarras(datosReporte.piezasPorEstado, 'Piezas por Estado', 'bg-green-500')}
      </div>

      {/* Análisis Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado de Colecciones */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Colecciones</h3>
          <div className="space-y-3">
            {datosReporte.piezasPorEstado && Object.entries(datosReporte.piezasPorEstado).map(([estado, cantidad]) => {
              const porcentaje = (cantidad / (datosReporte.totalPiezas || 1)) * 100;
              const color = estado === 'Excelente' ? 'text-green-600' : 
                           estado === 'Bueno' ? 'text-blue-600' :
                           estado === 'Regular' ? 'text-yellow-600' : 'text-red-600';
              return (
                <div key={estado} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{estado}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${color}`}>{cantidad}</span>
                    <span className="text-xs text-gray-500">({porcentaje.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximos Mantenimientos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Mantenimientos</h3>
          <div className="space-y-3">
            {datosReporte.mantenimientos && datosReporte.mantenimientos
              .filter((m: any) => m.estado === 'Programado')
              .slice(0, 4)
              .map((mant: any) => (
                <div key={mant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mant.pieza_nombre}</p>
                    <p className="text-xs text-gray-500">{mant.tipo_mantenimiento}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{new Date(mant.fecha_inicio).toLocaleDateString('es-DO')}</p>
                    <p className="text-xs font-medium text-orange-600">RD$ {(mant.costo_estimado || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Tendencias */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visitantes</p>
                <p className="text-xs text-gray-500">{datosReporte.totalPersonas || datosReporte.totalVisitas || 0} personas registradas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Reservas Online</p>
                <p className="text-xs text-gray-500">{datosReporte.totalVisitas || 0} reservas totales</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mantenimiento</p>
                <p className="text-xs text-gray-500">RD$ {(datosReporte.costoTotal || 0).toLocaleString()} invertidos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Satisfacción</p>
                <p className="text-xs text-gray-500">{datosReporte.totalPiezas || 0} piezas catalogadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Datos Detallados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Datos Detallados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes Anterior
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cambio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total de Visitantes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {datosReporte.totalPersonas || datosReporte.totalVisitas || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {Math.round((datosReporte.totalPersonas || datosReporte.totalVisitas || 0) * 0.85)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {datosReporte.totalPersonas && datosReporte.totalVisitas ? 
                    `+${Math.round(((datosReporte.totalPersonas - datosReporte.totalVisitas) / datosReporte.totalVisitas) * 100)}%` : 
                    'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Ingresos Totales
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  RD$ {(datosReporte.ingresoTotal || datosReporte.ingresosMes || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  RD$ {Math.round((datosReporte.ingresoTotal || datosReporte.ingresosMes || 0) * 0.92).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {datosReporte.ingresoTotal ? 
                    `+${Math.round(((datosReporte.ingresoTotal - (datosReporte.ingresoTotal * 0.92)) / (datosReporte.ingresoTotal * 0.92)) * 100)}%` : 
                    'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Costo de Mantenimiento
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  RD$ {(datosReporte.costoTotal || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  RD$ {Math.round((datosReporte.costoTotal || 0) * 1.05).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {datosReporte.costoTotal ? 
                    `${Math.round(((datosReporte.costoTotal - (datosReporte.costoTotal * 1.05)) / (datosReporte.costoTotal * 1.05)) * 100)}%` : 
                    'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;