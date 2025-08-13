import { supabase } from '../lib/supabase';
import { dummyData } from '../data/dummy';

interface EstadisticasDashboard {
  totalPiezas: number;
  piezasAtencion: number;
  visitasHoy: number;
  mantenimientosActivos: number;
  ingresosMes: number;
}

class DashboardService {
  async getEstadisticasGenerales() {
    // Check for demo session first
    if (this.isDemo()) {
      const stats = this.getFallbackEstadisticas();
      // Agregar datos adicionales para reportes
      return {
        ...stats,
        piezasPorCategoria: this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
          acc[item.nombre] = item.cantidad;
          return acc;
        }, {}),
        piezasPorEstado: {
          'Excelente': 2,
          'Bueno': 3,
          'Regular': 1,
          'Necesita Restauración': 1
        },
        mantenimientos: this.getFallbackMantenimientosActivos()
      };
    }

    try {
      const { data, error } = await supabase
        .rpc('obtener_estadisticas_generales');

      // Check for RLS recursion error
      if (error && (error.code === '42P17' || error.message?.includes('infinite recursion'))) {
        console.warn('RLS recursion detected in estadisticas, using fallback data');
        const stats = this.getFallbackEstadisticas();
        return {
          ...stats,
          piezasPorCategoria: this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
            acc[item.nombre] = item.cantidad;
            return acc;
          }, {}),
          piezasPorEstado: {
            'Excelente': 2,
            'Bueno': 3,
            'Regular': 1,
            'Necesita Restauración': 1
          },
          mantenimientos: this.getFallbackMantenimientosActivos()
        };
      }
      
      if (error) {
        console.error('Error fetching estadisticas:', error.message);
        const stats = this.getFallbackEstadisticas();
        return {
          ...stats,
          piezasPorCategoria: this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
            acc[item.nombre] = item.cantidad;
            return acc;
          }, {}),
          piezasPorEstado: {
            'Excelente': 2,
            'Bueno': 3,
            'Regular': 1,
            'Necesita Restauración': 1
          },
          mantenimientos: this.getFallbackMantenimientosActivos()
        };
      }

      const baseData = data || this.getFallbackEstadisticas();
      
      // Agregar datos adicionales si no están presentes
      if (!baseData.piezasPorCategoria) {
        baseData.piezasPorCategoria = this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
          acc[item.nombre] = item.cantidad;
          return acc;
        }, {});
      }
      
      if (!baseData.piezasPorEstado) {
        baseData.piezasPorEstado = {
          'Excelente': 2,
          'Bueno': 3,
          'Regular': 1,
          'Necesita Restauración': 1
        };
      }
      
      if (!baseData.mantenimientos) {
        baseData.mantenimientos = this.getFallbackMantenimientosActivos();
      }
      
      return baseData;
    } catch (error: any) {
      // Check for RLS recursion in catch block as well
      if (error.message?.includes('infinite recursion') || error.code === '42P17') {
        console.warn('RLS recursion detected in estadisticas, using fallback data');
        const stats = this.getFallbackEstadisticas();
        return {
          ...stats,
          piezasPorCategoria: this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
            acc[item.nombre] = item.cantidad;
            return acc;
          }, {}),
          piezasPorEstado: {
            'Excelente': 2,
            'Bueno': 3,
            'Regular': 1,
            'Necesita Restauración': 1
          },
          mantenimientos: this.getFallbackMantenimientosActivos()
        };
      }
      console.error('Error fetching estadisticas:', error.message);
      const stats = this.getFallbackEstadisticas();
      return {
        ...stats,
        piezasPorCategoria: this.getFallbackPiezasPorCategoria().reduce((acc: any, item) => {
          acc[item.nombre] = item.cantidad;
          return acc;
        }, {}),
        piezasPorEstado: {
          'Excelente': 2,
          'Bueno': 3,
          'Regular': 1,
          'Necesita Restauración': 1
        },
        mantenimientos: this.getFallbackMantenimientosActivos()
      };
    }
  }

  async getProximasVisitas() {
    try {
      const { data, error } = await supabase
        .from('vista_visitas_completa')
        .select('*')
        .eq('estado', 'Confirmada')
        .gte('fecha_visita', new Date().toISOString().split('T')[0])
        .order('fecha_visita', { ascending: true })
        .limit(5);

      if (error) {
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.warn('RLS recursion detected, using fallback data');
          return this.getFallbackProximasVisitas();
        }
        throw error;
      }

      return data || [];
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected, using fallback data');
        return this.getFallbackProximasVisitas();
      }
      console.error('Error fetching proximas visitas:', error);
      return this.getFallbackProximasVisitas();
    }
  }

  async getMantenimientosActivos() {
    try {
      const { data, error } = await supabase
        .from('vista_mantenimientos_completa')
        .select('*')
        .in('estado', ['Programado', 'En Proceso'])
        .order('fecha_inicio', { ascending: true })
        .limit(5);

      if (error) {
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.warn('RLS recursion detected, using fallback data');
          return this.getFallbackMantenimientosActivos();
        }
        throw error;
      }

      return data || [];
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected, using fallback data');
        return this.getFallbackMantenimientosActivos();
      }
      console.error('Error fetching mantenimientos activos:', error);
      return this.getFallbackMantenimientosActivos();
    }
  }

  private async getEstadisticasManual() {
    try {
      // Obtener total de piezas
      const { count: totalPiezas, error: errorPiezas } = await supabase
        .from('piezas')
        .select('*', { count: 'exact', head: true });

      if (errorPiezas && errorPiezas.code === '42P17') {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }

      // Obtener piezas que requieren atención
      const { count: piezasAtencion, error: errorAtencion } = await supabase
        .from('piezas')
        .select('*', { count: 'exact', head: true })
        .eq('estado_id', '1f48e486-0717-4d44-bcb6-ba958cf35503');

      if (errorAtencion && errorAtencion.code === '42P17') {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }

      // Obtener visitas de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const { count: visitasHoy, error: errorVisitas } = await supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true })
        .eq('fecha_visita', hoy);

      if (errorVisitas && errorVisitas.code === '42P17') {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }

      // Obtener mantenimientos activos
      const { count: mantenimientosActivos, error: errorMantenimientos } = await supabase
        .from('mantenimientos')
        .select('*', { count: 'exact', head: true })
        .in('estado', ['Programado', 'En Proceso']);

      if (errorMantenimientos && errorMantenimientos.code === '42P17') {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }

      // Calcular ingresos del mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const finMes = new Date();
      finMes.setMonth(finMes.getMonth() + 1);
      finMes.setDate(0);

      const { data: visitasMes, error: errorIngresos } = await supabase
        .from('visitas')
        .select('precio_total')
        .gte('fecha_visita', inicioMes.toISOString().split('T')[0])
        .lte('fecha_visita', finMes.toISOString().split('T')[0])
        .eq('pagado', true);

      if (errorIngresos && errorIngresos.code === '42P17') {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }

      const ingresosMes = visitasMes?.reduce((total, visita) => 
        total + (visita.precio_total || 0), 0) || 0;

      return {
        totalPiezas: totalPiezas || 0,
        piezasAtencion: piezasAtencion || 0,
        visitasHoy: visitasHoy || 0,
        mantenimientosActivos: mantenimientosActivos || 0,
        ingresosMes
      };
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected, using fallback statistics');
        return this.getFallbackEstadisticas();
      }
      console.error('Error fetching dashboard statistics:', error);
      return this.getFallbackEstadisticas();
    }
  }

  private isDemo(): boolean {
    return localStorage.getItem('demo_session') === 'true';
  }

  private getFallbackEstadisticas(): EstadisticasDashboard {
    return {
      totalPiezas: dummyData.piezas.length,
      piezasAtencion: dummyData.piezas.filter(p => 
        p.estado_id === '1f48e486-0717-4d44-bcb6-ba958cf35503'
      ).length,
      visitasHoy: dummyData.visitas.filter(v => 
        v.fecha_visita === new Date().toISOString().split('T')[0]
      ).length,
      mantenimientosActivos: dummyData.mantenimientos.filter(m => 
        ['Programado', 'En Proceso'].includes(m.estado)
      ).length,
      ingresosMes: 15750.00
    };
  }

  private getFallbackProximasVisitas() {
    const hoy = new Date().toISOString().split('T')[0];
    return dummyData.visitas
      .filter(v => v.fecha >= hoy && v.estado === 'Confirmada')
      .slice(0, 5);
  }

  private getFallbackMantenimientosActivos() {
    return dummyData.mantenimientos
      .filter(m => ['Programado', 'En Proceso'].includes(m.estado))
      .map(m => ({
        ...m,
        pieza_nombre: m.piezaNombre,
        tipo_mantenimiento: m.tipo,
        tecnico: m.tecnico,
        costo_estimado: m.costo
      }))
      .slice(0, 5);
  }

  async getPiezasPorCategoria() {
        // .eq('estado', 'Confirmada')
        // .gte('fecha_visita', new Date().toISOString().split('T')[0])
        // .order('fecha_visita', { ascending: true })
    try {
      const { data, error } = await supabase
        .from('piezas')
        .select(`
          categoria_id,
          categorias (
            nombre
          )
        `);

      if (error) {
        if (error.code === '42P17') {
          console.warn('RLS recursion detected, using fallback data');
          return this.getFallbackPiezasPorCategoria();
        }
        console.error('Error fetching piezas por categoria:', error.message);
        return [];
      }

      // Procesar datos para el gráfico
      const categorias: { [key: string]: number } = {};
      data?.forEach((pieza: any) => {
        const nombreCategoria = pieza.categorias?.nombre || 'Sin categoría';
        categorias[nombreCategoria] = (categorias[nombreCategoria] || 0) + 1;
      });

      return Object.entries(categorias).map(([nombre, cantidad]) => ({
        nombre,
        cantidad
      }));
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected, using fallback data');
        return this.getFallbackPiezasPorCategoria();
      }
      console.error('Error fetching piezas por categoria:', error);
      return this.getFallbackPiezasPorCategoria();
    }
  }

  private getFallbackPiezasPorCategoria() {
    const categorias: { [key: string]: number } = {};
    dummyData.piezas.forEach(pieza => {
      const categoria = dummyData.categorias.find(c => c.id === pieza.categoria_id);
      const nombreCategoria = categoria?.nombre || 'Sin categoría';
      categorias[nombreCategoria] = (categorias[nombreCategoria] || 0) + 1;
    });

    return Object.entries(categorias).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  }
}

export const dashboardService = new DashboardService();