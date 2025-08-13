import { supabase } from '../lib/supabase';
import { Database } from '../../supabase/supabase (7)';

type Mantenimiento = Database['public']['Tables']['mantenimientos']['Row'];
type MantenimientoInsert = Database['public']['Tables']['mantenimientos']['Insert'];
type MantenimientoUpdate = Database['public']['Tables']['mantenimientos']['Update'];

class MantenimientosService {
  async getAllMantenimientos() {
    try {
      const { data, error } = await supabase
        .from('vista_mantenimientos_completa')
        .select('*')
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching mantenimientos:', error);
      throw new Error('Error al cargar los mantenimientos');
    }
  }

  async getMantenimientoById(id: string) {
    try {
      const { data, error } = await supabase
        .from('vista_mantenimientos_completa')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching mantenimiento:', error);
      throw new Error('Error al cargar el mantenimiento');
    }
  }

  async createMantenimiento(mantenimiento: MantenimientoInsert) {
    try {
      // Check for demo session first
      const demoSession = localStorage.getItem('demo_session');
      let includeCreatedBy = false;
      let created_by;
      
      if (demoSession) {
        const parsed = JSON.parse(demoSession);
        created_by = parsed.user.id;
        includeCreatedBy = true;
      } else {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Try to get user profile, but handle RLS errors gracefully
            const { data: profile } = await supabase
              .from('usuarios')
              .select('id')
              .eq('auth_user_id', user.id)
              .single();
            if (profile?.id) {
              created_by = profile.id;
              includeCreatedBy = true;
            }
          }
        } catch (profileError: any) {
          if (profileError.code === '42P17' || profileError.message?.includes('infinite recursion')) {
            console.warn('RLS recursion detected when fetching user profile, omitting created_by field');
            includeCreatedBy = false;
          } else {
            throw profileError;
          }
        }
      }

      // Prepare insert payload, only include created_by if we successfully got it
      const insertPayload = includeCreatedBy 
        ? { ...mantenimiento, created_by }
        : { ...mantenimiento };

      const { data, error } = await supabase
        .from('mantenimientos')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.error('RLS recursion detected in createMantenimiento insert operation');
        throw new Error('Error de configuración del sistema. El mantenimiento no pudo ser creado debido a problemas de permisos.');
      }
      console.error('Error creating mantenimiento:', error);
      throw new Error('Error al crear el mantenimiento');
    }
  }

  async updateMantenimiento(id: string, mantenimiento: MantenimientoUpdate, currentUserId?: string) {
    try {
      const { data, error } = await supabase
        .from('mantenimientos')
        .update(mantenimiento)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating mantenimiento:', error);
      throw new Error('Error al actualizar el mantenimiento');
    }
  }

  async deleteMantenimiento(id: string) {
    try {
      const { error } = await supabase
        .from('mantenimientos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting mantenimiento:', error);
      throw new Error('Error al eliminar el mantenimiento');
    }
  }

  async getTecnicos() {
    try {
      const { data, error } = await supabase
        .from('tecnicos')
        .select('*')
        .eq('activo', true)
        .order('nombre_completo');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tecnicos:', error);
      throw new Error('Error al cargar los técnicos');
    }
  }

  async getTiposMantenimiento() {
    try {
      const { data, error } = await supabase
        .from('tipos_mantenimiento')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tipos mantenimiento:', error);
      throw new Error('Error al cargar los tipos de mantenimiento');
    }
  }

  async cambiarEstado(id: string, nuevoEstado: string) {
    try {
      const updateData: any = { estado: nuevoEstado };
      
      // Si se completa, agregar fecha de fin
      if (nuevoEstado === 'Completado') {
        updateData.fecha_fin_real = new Date().toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('mantenimientos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error changing estado:', error);
      throw new Error('Error al cambiar el estado');
    }
  }

  async searchMantenimientos(searchTerm: string, filters: any = {}) {
    try {
      let query = supabase
        .from('vista_mantenimientos_completa')
        .select('*');

      if (searchTerm) {
        query = query.or(`pieza_nombre.ilike.%${searchTerm}%,tecnico.ilike.%${searchTerm}%`);
      }

      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      if (filters.tipo_mantenimiento) {
        query = query.eq('tipo_mantenimiento', filters.tipo_mantenimiento);
      }

      if (filters.prioridad) {
        query = query.eq('prioridad', filters.prioridad);
      }

      const { data, error } = await query.order('fecha_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error searching mantenimientos:', error);
      throw new Error('Error al buscar mantenimientos');
    }
  }
}

export const mantenimientosService = new MantenimientosService();
