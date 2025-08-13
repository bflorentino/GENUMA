import { supabase } from '../lib/supabase';
import { Database } from '../../supabase/supabase (7)';

type Pieza = Database['public']['Tables']['piezas']['Row'];
type PiezaInsert = Database['public']['Tables']['piezas']['Insert'];
type PiezaUpdate = Database['public']['Tables']['piezas']['Update'];

class PiezasService {
  async getAllPiezas() {
    try {
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        return [
          {
            id: 'pieza-1',
            nombre: 'La Gioconda',
            autor: 'Leonardo da Vinci',
            fecha_creacion: '1503-1519',
            categoria: 'Pintura',
            estado: 'Excelente',
            estado_color: '#10b981',
            requiere_atencion: false,
            descripcion: 'Famoso retrato renacentista',
            ubicacion: 'Sala Principal',
            imagen_url: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg',
            fecha_adquisicion: '2020-01-15',
            valor_estimado: 1000000,
            dimensiones: '77 cm × 53 cm',
            material: 'Óleo sobre tabla de álamo',
            procedencia: 'Francia',
            numero_inventario: 'INV-001',
            publico: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ];
      }

      const { data, error } = await supabase
        .from('vista_piezas_completa')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected in getAllPiezas, using fallback data');
        return [
          {
            id: 'pieza-1',
            nombre: 'La Gioconda',
            autor: 'Leonardo da Vinci',
            fecha_creacion: '1503-1519',
            categoria: 'Pintura',
            estado: 'Excelente',
            estado_color: '#10b981',
            requiere_atencion: false,
            descripcion: 'Famoso retrato renacentista',
            ubicacion: 'Sala Principal',
            imagen_url: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg',
            fecha_adquisicion: '2020-01-15',
            valor_estimado: 1000000,
            dimensiones: '77 cm × 53 cm',
            material: 'Óleo sobre tabla de álamo',
            procedencia: 'Francia',
            numero_inventario: 'INV-001',
            publico: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ];
      }
      console.error('Error fetching piezas:', error);
      throw new Error('Error al cargar las piezas');
    }
  }

  async getPiezaById(id: string) {
    try {
      const { data, error } = await supabase
        .from('vista_piezas_completa')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching pieza:', error);
      throw new Error('Error al cargar la pieza');
    }
  }

  async createPieza(pieza: PiezaInsert, currentUserId?: string) {
    try {
      let insertPayload = { ...pieza };

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
        .from('piezas')
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating pieza:', error);
      throw new Error('Error al crear la pieza');
    }
  }

  async updatePieza(id: string, pieza: PiezaUpdate) {
    try {
      const { data, error } = await supabase
        .from('piezas')
        .update(pieza)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating pieza:', error);
      throw new Error('Error al actualizar la pieza');
    }
  }

  async deletePieza(id: string) {
    try {
      const { error } = await supabase
        .from('piezas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting pieza:', error);
      throw new Error('Error al eliminar la pieza');
    }
  }

  async getCategorias() {
    try {
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        return [
          { id: 'cat-1', nombre: 'Pintura', descripcion: 'Obras pictóricas', color: '#3b82f6' },
          { id: 'cat-2', nombre: 'Escultura', descripcion: 'Obras escultóricas', color: '#10b981' },
          { id: 'cat-3', nombre: 'Cerámica', descripcion: 'Piezas cerámicas', color: '#f59e0b' },
          { id: 'cat-4', nombre: 'Textil', descripcion: 'Obras textiles', color: '#8b5cf6' },
          { id: 'cat-5', nombre: 'Arqueología', descripcion: 'Piezas arqueológicas', color: '#ef4444' }
        ];
      }

      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected in getCategorias, using fallback data');
        return [
          { id: 'cat-1', nombre: 'Pintura', descripcion: 'Obras pictóricas', color: '#3b82f6' },
          { id: 'cat-2', nombre: 'Escultura', descripcion: 'Obras escultóricas', color: '#10b981' },
          { id: 'cat-3', nombre: 'Cerámica', descripcion: 'Piezas cerámicas', color: '#f59e0b' },
          { id: 'cat-4', nombre: 'Textil', descripcion: 'Obras textiles', color: '#8b5cf6' },
          { id: 'cat-5', nombre: 'Arqueología', descripcion: 'Piezas arqueológicas', color: '#ef4444' }
        ];
      }
      console.error('Error fetching categorias:', error);
      throw new Error('Error al cargar las categorías');
    }
  }

  async getEstadosPieza() {
    try {
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        return [
          { id: 'est-1', nombre: 'Excelente', descripcion: 'Estado excelente', color: '#10b981', requiere_atencion: false },
          { id: 'est-2', nombre: 'Bueno', descripcion: 'Buen estado', color: '#3b82f6', requiere_atencion: false },
          { id: 'est-3', nombre: 'Regular', descripcion: 'Estado regular', color: '#f59e0b', requiere_atencion: true },
          { id: 'est-4', nombre: 'Malo', descripcion: 'Mal estado', color: '#ef4444', requiere_atencion: true },
          { id: 'est-5', nombre: 'Restauración', descripcion: 'En restauración', color: '#8b5cf6', requiere_atencion: true }
        ];
      }

      const { data, error } = await supabase
        .from('estados_pieza')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
        console.warn('RLS recursion detected in getEstadosPieza, using fallback data');
        return [
          { id: 'est-1', nombre: 'Excelente', descripcion: 'Estado excelente', color: '#10b981', requiere_atencion: false },
          { id: 'est-2', nombre: 'Bueno', descripcion: 'Buen estado', color: '#3b82f6', requiere_atencion: false },
          { id: 'est-3', nombre: 'Regular', descripcion: 'Estado regular', color: '#f59e0b', requiere_atencion: true },
          { id: 'est-4', nombre: 'Malo', descripcion: 'Mal estado', color: '#ef4444', requiere_atencion: true },
          { id: 'est-5', nombre: 'Restauración', descripcion: 'En restauración', color: '#8b5cf6', requiere_atencion: true }
        ];
      }
      console.error('Error fetching estados:', error);
      throw new Error('Error al cargar los estados');
    }
  }

  async searchPiezas(searchTerm: string, filters: any = {}) {
    try {
      let query = supabase.from('vista_piezas_completa').select('*');

      if (searchTerm) {
        query = query.or(`nombre.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%`);
      }

      if (filters.categoria) {
        query = query.eq('categoria', filters.categoria);
      }

      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error searching piezas:', error);
      throw new Error('Error al buscar piezas');
    }
  }
}

export const piezasService = new PiezasService();
