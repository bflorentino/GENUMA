import { supabase } from '../lib/supabase';
import { Database } from '../../supabase/supabase (7)';
import * as XLSX from 'xlsx';

type Reporte = Database['public']['Tables']['reportes']['Row'];
type ReporteInsert = Database['public']['Tables']['reportes']['Insert'];

class ReportesService {
  async generarReporteColecciones(fechaInicio?: string, fechaFin?: string) {
    try {
      let query = supabase.from('vista_piezas_completa').select('*');
      
      if (fechaInicio) {
        query = query.gte('created_at', fechaInicio);
      }
      if (fechaFin) {
        query = query.lte('created_at', fechaFin);
      }

      const { data: piezas, error } = await query;
      if (error) throw error;

      // Procesar datos para el reporte
      const piezasPorCategoria = piezas?.reduce((acc: any, pieza) => {
        acc[pieza.categoria || 'Sin categoría'] = (acc[pieza.categoria || 'Sin categoría'] || 0) + 1;
        return acc;
      }, {}) || {};

      const piezasPorEstado = piezas?.reduce((acc: any, pieza) => {
        acc[pieza.estado || 'Sin estado'] = (acc[pieza.estado || 'Sin estado'] || 0) + 1;
        return acc;
      }, {}) || {};

      const valorTotal = piezas?.reduce((sum, pieza) => sum + (pieza.valor_estimado || 0), 0) || 0;

      // Obtener mantenimientos para incluir en el reporte
      const { data: mantenimientos } = await supabase
        .from('vista_mantenimientos_completa')
        .select('*')
        .in('estado', ['Programado', 'En Proceso'])
        .order('fecha_inicio', { ascending: true });

      const reporteData = {
        resumen: {
          totalPiezas: piezas?.length || 0,
          valorTotal,
          fechaGeneracion: new Date().toISOString()
        },
        piezasPorCategoria,
        piezasPorEstado,
        piezas: piezas || [],
        mantenimientos: mantenimientos || []
      };

      return reporteData;
    } catch (error: any) {
      console.error('Error generating colecciones report:', error);
      throw new Error('Error al generar reporte de colecciones');
    }
  }

  async generarReporteVisitas(fechaInicio?: string, fechaFin?: string) {
    try {
      let query = supabase.from('vista_visitas_completa').select('*');
      
      if (fechaInicio) {
        query = query.gte('fecha_visita', fechaInicio);
      }
      if (fechaFin) {
        query = query.lte('fecha_visita', fechaFin);
      }

      const { data: visitas, error } = await query;
      if (error) throw error;

      // Procesar datos para el reporte
      const visitasPorTipo = visitas?.reduce((acc: any, visita) => {
        acc[visita.tipo_visita || 'Sin tipo'] = (acc[visita.tipo_visita || 'Sin tipo'] || 0) + 1;
        return acc;
      }, {}) || {};

      const visitasPorEstado = visitas?.reduce((acc: any, visita) => {
        acc[visita.estado || 'Sin estado'] = (acc[visita.estado || 'Sin estado'] || 0) + 1;
        return acc;
      }, {}) || {};

      const ingresoTotal = visitas?.reduce((sum, visita) => sum + (visita.precio_total || 0), 0) || 0;
      const totalPersonas = visitas?.reduce((sum, visita) => sum + (visita.numero_personas || 0), 0) || 0;

      const reporteData = {
        resumen: {
          totalVisitas: visitas?.length || 0,
          totalPersonas,
          ingresoTotal,
          fechaGeneracion: new Date().toISOString()
        },
        visitasPorTipo,
        visitasPorEstado,
        visitas: visitas || []
      };

      return reporteData;
    } catch (error: any) {
      console.error('Error generating visitas report:', error);
      throw new Error('Error al generar reporte de visitas');
    }
  }

  async generarReporteMantenimiento(fechaInicio?: string, fechaFin?: string) {
    try {
      let query = supabase.from('vista_mantenimientos_completa').select('*');
      
      if (fechaInicio) {
        query = query.gte('fecha_inicio', fechaInicio);
      }
      if (fechaFin) {
        query = query.lte('fecha_inicio', fechaFin);
      }

      const { data: mantenimientos, error } = await query;
      if (error) throw error;

      // Procesar datos para el reporte
      const mantenimientosPorTipo = mantenimientos?.reduce((acc: any, mant) => {
        acc[mant.tipo_mantenimiento || 'Sin tipo'] = (acc[mant.tipo_mantenimiento || 'Sin tipo'] || 0) + 1;
        return acc;
      }, {}) || {};

      const mantenimientosPorEstado = mantenimientos?.reduce((acc: any, mant) => {
        acc[mant.estado || 'Sin estado'] = (acc[mant.estado || 'Sin estado'] || 0) + 1;
        return acc;
      }, {}) || {};

      const costoTotal = mantenimientos?.reduce((sum, mant) => sum + (mant.costo_estimado || 0), 0) || 0;

      const reporteData = {
        resumen: {
          totalMantenimientos: mantenimientos?.length || 0,
          costoTotal,
          fechaGeneracion: new Date().toISOString()
        },
        mantenimientosPorTipo,
        mantenimientosPorEstado,
        mantenimientos: mantenimientos || []
      };

      return reporteData;
    } catch (error: any) {
      console.error('Error generating mantenimiento report:', error);
      throw new Error('Error al generar reporte de mantenimiento');
    }
  }

  async guardarReporte(reporte: ReporteInsert, currentUserId?: string) {
    try {
      // Use provided currentUserId or check demo session
      let insertPayload = { ...reporte };
      
      if (currentUserId) {
        insertPayload.generado_por = currentUserId;
      } else {
        const demoSession = localStorage.getItem('demo_session');
        if (demoSession) {
          const parsed = JSON.parse(demoSession);
          insertPayload.generado_por = parsed.user.id;
      }
      }
    
      const { data, error } = await supabase
        .from('reportes')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error saving reporte:', error);
      throw new Error('Error al guardar el reporte');
    }
  }

  async getReportes() {
    try {
      const { data, error } = await supabase
        .from('reportes')
        .select(`
          *,
          generado_por:usuarios(nombre_completo)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching reportes:', error);
      throw new Error('Error al cargar los reportes');
    }
  }


  async exportarExcel(tipoReporte: string, datosReporte: any, titulo: string) {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Hoja de resumen
      if (datosReporte.resumen) {
        const resumenData = Object.entries(datosReporte.resumen)
          .filter(([key]) => key !== 'fechaGeneracion')
          .map(([key, value]) => ({
            'Métrica': this.formatLabel(key),
            'Valor': this.formatValue(key, value)
          }));
        
        const resumenWS = XLSX.utils.json_to_sheet(resumenData);
        XLSX.utils.book_append_sheet(workbook, resumenWS, 'Resumen');
      }
      
      // Hojas específicas según el tipo de reporte
      if (tipoReporte === 'colecciones') {
        this.addColeccionesDataToExcel(workbook, datosReporte);
      } else if (tipoReporte === 'visitas') {
        this.addVisitasDataToExcel(workbook, datosReporte);
      } else if (tipoReporte === 'mantenimiento') {
        this.addMantenimientoDataToExcel(workbook, datosReporte);
      } else {
        this.addGeneralDataToExcel(workbook, datosReporte);
      }
      
      // Descargar el archivo Excel
      const fileName = `${titulo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      return fileName;
    } catch (error: any) {
      console.error('Error generating Excel:', error);
      throw new Error('Error al generar el reporte Excel');
    }
  }







  private addGeneralDataToExcel(workbook: any, datosReporte: any) {
    // Agregar datos generales combinados
    if (datosReporte.piezasPorCategoria) {
      const categoriaData = Object.entries(datosReporte.piezasPorCategoria).map(([categoria, cantidad]) => ({
        'Categoría': categoria,
        'Cantidad': cantidad
      }));
      const categoriaWS = XLSX.utils.json_to_sheet(categoriaData);
      XLSX.utils.book_append_sheet(workbook, categoriaWS, 'Por Categoría');
    }

    if (datosReporte.piezasPorEstado) {
      const estadoData = Object.entries(datosReporte.piezasPorEstado).map(([estado, cantidad]) => ({
        'Estado': estado,
        'Cantidad': cantidad
      }));
      const estadoWS = XLSX.utils.json_to_sheet(estadoData);
      XLSX.utils.book_append_sheet(workbook, estadoWS, 'Por Estado');
    }

    if (datosReporte.visitasPorTipo) {
      const tipoData = Object.entries(datosReporte.visitasPorTipo).map(([tipo, cantidad]) => ({
        'Tipo de Visita': tipo,
        'Cantidad': cantidad
      }));
      const tipoWS = XLSX.utils.json_to_sheet(tipoData);
      XLSX.utils.book_append_sheet(workbook, tipoWS, 'Visitas por Tipo');
    }

    if (datosReporte.mantenimientosPorTipo) {
      const mantData = Object.entries(datosReporte.mantenimientosPorTipo).map(([tipo, cantidad]) => ({
        'Tipo de Mantenimiento': tipo,
        'Cantidad': cantidad
      }));
      const mantWS = XLSX.utils.json_to_sheet(mantData);
      XLSX.utils.book_append_sheet(workbook, mantWS, 'Mantenimientos');
    }
  }

  private formatLabel(key: string): string {
    const labels: Record<string, string> = {
      totalPiezas: 'Total de Piezas',
      totalVisitas: 'Total de Visitas',
      totalPersonas: 'Total de Personas',
      ingresoTotal: 'Ingreso Total',
      costoTotal: 'Costo Total',
      totalMantenimientos: 'Total de Mantenimientos',
      fechaGeneracion: 'Fecha de Generación'
    };
    return labels[key] || key;
  }

  private formatValue(key: string, value: any): string {
    if (key.includes('Total') || key.includes('ingreso') || key.includes('costo')) {
      return `RD$ ${Number(value).toLocaleString()}`;
    }
    if (key === 'fechaGeneracion') {
      return new Date(value).toLocaleDateString('es-DO');
    }
    return value?.toString() || '';
  }
}

export const reportesService = new ReportesService();