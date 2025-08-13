import { supabase } from '../lib/supabase';
import { Database } from '../../supabase/supabase (7)';

type Visita = Database['public']['Tables']['visitas']['Row'];
type VisitaInsert = Database['public']['Tables']['visitas']['Insert'];
type VisitaUpdate = Database['public']['Tables']['visitas']['Update'];

class VisitasService {
  async getAllVisitas() {
    try {
      const { data, error } = await supabase
        .from('vista_visitas_completa')
        .select('*')
        .order('fecha_visita', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching visitas:', error);
      throw new Error('Error al cargar las visitas');
    }
  }

  async getVisitaById(id: string) {
    try {
      const { data, error } = await supabase
        .from('vista_visitas_completa')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching visita:', error);
      throw new Error('Error al cargar la visita');
    }
  }

  async createVisita(visita: VisitaInsert, currentUserId?: string) {
    try {
      // Use provided currentUserId or check demo session
      let insertPayload = { ...visita };
      
      if (currentUserId) {
        insertPayload.created_by = currentUserId;
      } else {
        const demoSession = localStorage.getItem('demo_session');
        if (demoSession) {
          const parsed = JSON.parse(demoSession);
          insertPayload.created_by = parsed.user.id;
        }
      }

      const { data, error } = await supabase
        .from('visitas')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating visita:', error);
      throw new Error('Error al crear la visita');
    }
  }

  async updateVisita(id: string, visita: VisitaUpdate) {
    try {
      const { data, error } = await supabase
        .from('visitas')
        .update(visita)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating visita:', error);
      throw new Error('Error al actualizar la visita');
    }
  }

  async deleteVisita(id: string) {
    try {
      const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting visita:', error);
      throw new Error('Error al eliminar la visita');
    }
  }

  async getTiposVisita() {
    try {
      const { data, error } = await supabase
        .from('tipos_visita')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tipos visita:', error);
      throw new Error('Error al cargar los tipos de visita');
    }
  }

  async getEstadosVisita() {
    try {
      const { data, error } = await supabase
        .from('estados_visita')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching estados visita:', error);
      throw new Error('Error al cargar los estados de visita');
    }
  }

  async confirmarVisita(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Get user profile
      const { data: profile } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      // Get "Confirmada" estado
      const { data: estado } = await supabase
        .from('estados_visita')
        .select('id')
        .eq('nombre', 'Confirmada')
        .single();

      const { data, error } = await supabase
        .from('visitas')
        .update({
          estado_id: estado?.id,
          confirmed_by: profile?.id,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error confirming visita:', error);
      throw new Error('Error al confirmar la visita');
    }
  }

  async cancelarVisita(id: string) {
    try {
      // Get "Cancelada" estado
      const { data: estado } = await supabase
        .from('estados_visita')
        .select('id')
        .eq('nombre', 'Cancelada')
        .single();

      const { data, error } = await supabase
        .from('visitas')
        .update({
          estado_id: estado?.id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error canceling visita:', error);
      throw new Error('Error al cancelar la visita');
    }
  }

  async searchVisitas(searchTerm: string, filters: any = {}) {
    try {
      let query = supabase
        .from('vista_visitas_completa')
        .select('*');

      if (searchTerm) {
        query = query.or(`visitante_nombre.ilike.%${searchTerm}%,visitante_email.ilike.%${searchTerm}%`);
      }

      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      if (filters.tipo_visita) {
        query = query.eq('tipo_visita', filters.tipo_visita);
      }

      const { data, error } = await query.order('fecha_visita', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error searching visitas:', error);
      throw new Error('Error al buscar visitas');
    }
  }
}

export const visitasService = new VisitasService();
