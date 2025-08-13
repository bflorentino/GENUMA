import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Image, AlertTriangle, Calendar, DollarSign, Eye, PenTool as Tool } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

interface DashboardProps {
  onPageChange?: (page: string, action?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [estadisticas, setEstadisticas] = useState<any>({});
  const [proximasVisitas, setProximasVisitas] = useState<any[]>([]);
  const [mantenimientosActivos, setMantenimientosActivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, visitas, mantenimientos] = await Promise.all([
        dashboardService.getEstadisticasGenerales(),
        dashboardService.getProximasVisitas(3),
        dashboardService.getMantenimientosActivos(3)
      ]);
      
      setEstadisticas(stats);
      setProximasVisitas(visitas);
      setMantenimientosActivos(mantenimientos);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total de Piezas',
      value: estadisticas.totalPiezas,
      icon: Image,
      color: 'bg-blue-500',
      change: '+2 este mes'
    },
    {
      title: 'Visitas Totales',
      value: estadisticas.totalVisitas,
      icon: Users,
      color: 'bg-green-500',
      change: '+15 esta semana'
    },
    {
      title: 'Visitas Hoy',
      value: estadisticas.visitasHoy,
      icon: Eye,
      color: 'bg-purple-500',
      change: 'Objetivo: 20'
    },
    {
      title: 'Mantenimientos Pendientes',
      value: estadisticas.mantenimientosPendientes,
      icon: Tool,
      color: 'bg-orange-500',
      change: '2 programados'
    },
    {
      title: 'Ingresos del Mes',
      value: `RD$ ${(estadisticas.ingresosMes || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+12% vs mes anterior'
    },
    {
      title: 'Piezas Necesitan Atención',
      value: estadisticas.piezasNecesitanMantenimiento,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: 'Revisar prioridad'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen general del museo - {new Date().toLocaleDateString('es-DO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Sistema Operativo
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.change}</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas Visitas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Próximas Visitas</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {proximasVisitas.map((visita) => (
              <div key={visita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{visita.visitante_nombre}</div>
                  <div className="text-sm text-gray-500">
                    {visita.fecha_visita} - {visita.hora_visita} | {visita.numero_personas} personas
                  </div>
                  <div className="text-sm text-blue-600 font-medium">{visita.tipo_visita}</div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {visita.estado}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mantenimientos Activos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mantenimientos Activos</h2>
            <Tool className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mantenimientosActivos.map((mantenimiento) => (
              <div key={mantenimiento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{mantenimiento.pieza_nombre}</div>
                  <div className="text-sm text-gray-500">
                    {mantenimiento.tipo_mantenimiento} - {mantenimiento.tecnico}
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    Prioridad: {mantenimiento.prioridad}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mantenimiento.estado === 'En Proceso' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {mantenimiento.estado}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    RD$ {(mantenimiento.costo_estimado || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onPageChange?.('colecciones', 'add')}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Añadir Pieza</div>
              <div className="text-sm text-gray-500">Nueva a la colección</div>
            </div>
          </button>
          
          <button 
            onClick={() => onPageChange?.('visitas', 'add')}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Nueva Reserva</div>
              <div className="text-sm text-gray-500">Programar visita</div>
            </div>
          </button>
          
          <button 
            onClick={() => onPageChange?.('mantenimiento', 'add')}
            className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Tool className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Programar Mantenimiento</div>
              <div className="text-sm text-gray-500">Nueva tarea</div>
            </div>
          </button>
          
          <button 
            onClick={() => onPageChange?.('reportes')}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Ver Reportes</div>
              <div className="text-sm text-gray-500">Análisis detallado</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;