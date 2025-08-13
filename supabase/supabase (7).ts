export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      auditoria: {
        Row: {
          accion: string
          created_at: string | null
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          id: string
          ip_address: unknown | null
          registro_id: string
          tabla: string
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown | null
          registro_id: string
          tabla: string
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown | null
          registro_id?: string
          tabla?: string
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          color: string | null
          created_at: string | null
          descripcion: string | null
          icono: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracion: {
        Row: {
          categoria: string | null
          clave: string
          created_at: string | null
          descripcion: string | null
          editable: boolean | null
          id: string
          tipo: string | null
          updated_at: string | null
          valor: Json
        }
        Insert: {
          categoria?: string | null
          clave: string
          created_at?: string | null
          descripcion?: string | null
          editable?: boolean | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor: Json
        }
        Update: {
          categoria?: string | null
          clave?: string
          created_at?: string | null
          descripcion?: string | null
          editable?: boolean | null
          id?: string
          tipo?: string | null
          updated_at?: string | null
          valor?: Json
        }
        Relationships: []
      }
      estados_pieza: {
        Row: {
          color: string | null
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          requiere_atencion: boolean | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          requiere_atencion?: boolean | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          requiere_atencion?: boolean | null
        }
        Relationships: []
      }
      estados_visita: {
        Row: {
          color: string | null
          created_at: string | null
          descripcion: string | null
          es_final: boolean | null
          id: string
          nombre: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          es_final?: boolean | null
          id?: string
          nombre: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          es_final?: boolean | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      mantenimientos: {
        Row: {
          aprobado_at: string | null
          aprobado_por: string | null
          costo_estimado: number | null
          costo_real: number | null
          created_at: string | null
          created_by: string | null
          descripcion: string
          diagnostico: string | null
          documentos: string[] | null
          estado: string
          fecha_fin_estimada: string | null
          fecha_fin_real: string | null
          fecha_inicio: string
          fotos_antes: string[] | null
          fotos_despues: string[] | null
          fotos_durante: string[] | null
          horas_trabajadas: number | null
          id: string
          materiales_utilizados: string[] | null
          notas_tecnicas: string | null
          pieza_id: string | null
          prioridad: string
          requiere_aprobacion: boolean | null
          tecnico_id: string | null
          tipo_id: string | null
          tratamiento_aplicado: string | null
          updated_at: string | null
        }
        Insert: {
          aprobado_at?: string | null
          aprobado_por?: string | null
          costo_estimado?: number | null
          costo_real?: number | null
          created_at?: string | null
          created_by?: string | null
          descripcion: string
          diagnostico?: string | null
          documentos?: string[] | null
          estado: string
          fecha_fin_estimada?: string | null
          fecha_fin_real?: string | null
          fecha_inicio: string
          fotos_antes?: string[] | null
          fotos_despues?: string[] | null
          fotos_durante?: string[] | null
          horas_trabajadas?: number | null
          id?: string
          materiales_utilizados?: string[] | null
          notas_tecnicas?: string | null
          pieza_id?: string | null
          prioridad?: string
          requiere_aprobacion?: boolean | null
          tecnico_id?: string | null
          tipo_id?: string | null
          tratamiento_aplicado?: string | null
          updated_at?: string | null
        }
        Update: {
          aprobado_at?: string | null
          aprobado_por?: string | null
          costo_estimado?: number | null
          costo_real?: number | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string
          diagnostico?: string | null
          documentos?: string[] | null
          estado?: string
          fecha_fin_estimada?: string | null
          fecha_fin_real?: string | null
          fecha_inicio?: string
          fotos_antes?: string[] | null
          fotos_despues?: string[] | null
          fotos_durante?: string[] | null
          horas_trabajadas?: number | null
          id?: string
          materiales_utilizados?: string[] | null
          notas_tecnicas?: string | null
          pieza_id?: string | null
          prioridad?: string
          requiere_aprobacion?: boolean | null
          tecnico_id?: string | null
          tipo_id?: string | null
          tratamiento_aplicado?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mantenimientos_aprobado_por_fkey"
            columns: ["aprobado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_pieza_id_fkey"
            columns: ["pieza_id"]
            isOneToOne: false
            referencedRelation: "piezas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_pieza_id_fkey"
            columns: ["pieza_id"]
            isOneToOne: false
            referencedRelation: "vista_piezas_completa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "tecnicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mantenimientos_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_mantenimiento"
            referencedColumns: ["id"]
          },
        ]
      }
      piezas: {
        Row: {
          autor: string
          bibliografia: string | null
          categoria_id: string | null
          condiciones_especiales: string | null
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          dimensiones: string | null
          estado_id: string | null
          exposiciones_anteriores: string[] | null
          fecha_adquisicion: string | null
          fecha_creacion: string | null
          historia: string | null
          id: string
          imagen_url: string | null
          keywords: string[] | null
          material: string | null
          nombre: string
          numero_inventario: string | null
          peso: number | null
          procedencia: string | null
          publico: boolean | null
          ubicacion: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Insert: {
          autor: string
          bibliografia?: string | null
          categoria_id?: string | null
          condiciones_especiales?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          dimensiones?: string | null
          estado_id?: string | null
          exposiciones_anteriores?: string[] | null
          fecha_adquisicion?: string | null
          fecha_creacion?: string | null
          historia?: string | null
          id?: string
          imagen_url?: string | null
          keywords?: string[] | null
          material?: string | null
          nombre: string
          numero_inventario?: string | null
          peso?: number | null
          procedencia?: string | null
          publico?: boolean | null
          ubicacion?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Update: {
          autor?: string
          bibliografia?: string | null
          categoria_id?: string | null
          condiciones_especiales?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          dimensiones?: string | null
          estado_id?: string | null
          exposiciones_anteriores?: string[] | null
          fecha_adquisicion?: string | null
          fecha_creacion?: string | null
          historia?: string | null
          id?: string
          imagen_url?: string | null
          keywords?: string[] | null
          material?: string | null
          nombre?: string
          numero_inventario?: string | null
          peso?: number | null
          procedencia?: string | null
          publico?: boolean | null
          ubicacion?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "piezas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "piezas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "piezas_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_pieza"
            referencedColumns: ["id"]
          },
        ]
      }
      reportes: {
        Row: {
          archivo_url: string | null
          created_at: string | null
          datos: Json
          fecha_fin: string | null
          fecha_inicio: string | null
          formato: string | null
          generado_por: string | null
          id: string
          parametros: Json | null
          tipo: string
          titulo: string
        }
        Insert: {
          archivo_url?: string | null
          created_at?: string | null
          datos: Json
          fecha_fin?: string | null
          fecha_inicio?: string | null
          formato?: string | null
          generado_por?: string | null
          id?: string
          parametros?: Json | null
          tipo: string
          titulo: string
        }
        Update: {
          archivo_url?: string | null
          created_at?: string | null
          datos?: Json
          fecha_fin?: string | null
          fecha_inicio?: string | null
          formato?: string | null
          generado_por?: string | null
          id?: string
          parametros?: Json | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "reportes_generado_por_fkey"
            columns: ["generado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tecnicos: {
        Row: {
          activo: boolean | null
          certificaciones: string[] | null
          costo_hora: number | null
          created_at: string | null
          email: string | null
          especialidades: string[] | null
          id: string
          nombre_completo: string
          telefono: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          activo?: boolean | null
          certificaciones?: string[] | null
          costo_hora?: number | null
          created_at?: string | null
          email?: string | null
          especialidades?: string[] | null
          id?: string
          nombre_completo: string
          telefono?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          activo?: boolean | null
          certificaciones?: string[] | null
          costo_hora?: number | null
          created_at?: string | null
          email?: string | null
          especialidades?: string[] | null
          id?: string
          nombre_completo?: string
          telefono?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tecnicos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_mantenimiento: {
        Row: {
          costo_base: number | null
          created_at: string | null
          descripcion: string | null
          duracion_estimada_dias: number | null
          icono: string | null
          id: string
          nombre: string
        }
        Insert: {
          costo_base?: number | null
          created_at?: string | null
          descripcion?: string | null
          duracion_estimada_dias?: number | null
          icono?: string | null
          id?: string
          nombre: string
        }
        Update: {
          costo_base?: number | null
          created_at?: string | null
          descripcion?: string | null
          duracion_estimada_dias?: number | null
          icono?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      tipos_visita: {
        Row: {
          capacidad_maxima: number | null
          created_at: string | null
          descripcion: string | null
          icono: string | null
          id: string
          nombre: string
          precio: number | null
        }
        Insert: {
          capacidad_maxima?: number | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre: string
          precio?: number | null
        }
        Update: {
          capacidad_maxima?: number | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          precio?: number | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          activo: boolean | null
          auth_user_id: string | null
          configuracion: Json | null
          created_at: string | null
          email: string
          id: string
          nombre_completo: string
          rol: string
          telefono: string | null
          ultimo_acceso: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          auth_user_id?: string | null
          configuracion?: Json | null
          created_at?: string | null
          email: string
          id?: string
          nombre_completo: string
          rol: string
          telefono?: string | null
          ultimo_acceso?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          auth_user_id?: string | null
          configuracion?: Json | null
          created_at?: string | null
          email?: string
          id?: string
          nombre_completo?: string
          rol?: string
          telefono?: string | null
          ultimo_acceso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visitas: {
        Row: {
          codigo_confirmacion: string | null
          como_se_entero: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          created_by: string | null
          estado_id: string | null
          fecha_visita: string
          hora_visita: string
          id: string
          idioma_preferido: string | null
          metodo_pago: string | null
          necesidades_especiales: string | null
          numero_personas: number
          observaciones: string | null
          origen: string | null
          pagado: boolean | null
          precio_total: number | null
          tipo_visita_id: string | null
          updated_at: string | null
          visitante_email: string
          visitante_nombre: string
          visitante_telefono: string
        }
        Insert: {
          codigo_confirmacion?: string | null
          como_se_entero?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          estado_id?: string | null
          fecha_visita: string
          hora_visita: string
          id?: string
          idioma_preferido?: string | null
          metodo_pago?: string | null
          necesidades_especiales?: string | null
          numero_personas: number
          observaciones?: string | null
          origen?: string | null
          pagado?: boolean | null
          precio_total?: number | null
          tipo_visita_id?: string | null
          updated_at?: string | null
          visitante_email: string
          visitante_nombre: string
          visitante_telefono: string
        }
        Update: {
          codigo_confirmacion?: string | null
          como_se_entero?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          estado_id?: string | null
          fecha_visita?: string
          hora_visita?: string
          id?: string
          idioma_preferido?: string | null
          metodo_pago?: string | null
          necesidades_especiales?: string | null
          numero_personas?: number
          observaciones?: string | null
          origen?: string | null
          pagado?: boolean | null
          precio_total?: number | null
          tipo_visita_id?: string | null
          updated_at?: string | null
          visitante_email?: string
          visitante_nombre?: string
          visitante_telefono?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitas_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_visita"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitas_tipo_visita_id_fkey"
            columns: ["tipo_visita_id"]
            isOneToOne: false
            referencedRelation: "tipos_visita"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vista_mantenimientos_completa: {
        Row: {
          costo_estimado: number | null
          costo_real: number | null
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fecha_fin_estimada: string | null
          fecha_fin_real: string | null
          fecha_inicio: string | null
          horas_trabajadas: number | null
          id: string | null
          numero_inventario: string | null
          pieza_nombre: string | null
          prioridad: string | null
          tecnico: string | null
          tipo_mantenimiento: string | null
        }
        Relationships: []
      }
      vista_piezas_completa: {
        Row: {
          autor: string | null
          categoria: string | null
          created_at: string | null
          descripcion: string | null
          dimensiones: string | null
          estado: string | null
          estado_color: string | null
          fecha_adquisicion: string | null
          fecha_creacion: string | null
          id: string | null
          imagen_url: string | null
          material: string | null
          nombre: string | null
          numero_inventario: string | null
          procedencia: string | null
          publico: boolean | null
          requiere_atencion: boolean | null
          ubicacion: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Relationships: []
      }
      vista_visitas_completa: {
        Row: {
          codigo_confirmacion: string | null
          created_at: string | null
          estado: string | null
          estado_color: string | null
          fecha_visita: string | null
          hora_visita: string | null
          id: string | null
          numero_personas: number | null
          observaciones: string | null
          precio_total: number | null
          precio_unitario: number | null
          tipo_visita: string | null
          visitante_email: string | null
          visitante_nombre: string | null
          visitante_telefono: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generar_codigo_confirmacion: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      obtener_estadisticas_generales: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
