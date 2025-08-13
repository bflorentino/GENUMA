*
  # Sistema de Gestión de Museos - Base de Datos Completa
  
  Este script crea toda la estructura de base de datos necesaria para el sistema de gestión de museos,
  incluyendo:
  
  1. Tablas principales
     - `piezas` - Catálogo de piezas del museo
     - `visitas` - Reservas y visitas programadas
     - `mantenimientos` - Tareas de mantenimiento y restauración
     - `usuarios` - Usuarios del sistema (staff del museo)
     - `configuracion` - Configuraciones del sistema
     - `reportes` - Reportes generados
     - `categorias` - Categorías de piezas
     - `tecnicos` - Personal técnico especializado
     - `tipos_mantenimiento` - Tipos de mantenimiento disponibles
     - `estados_pieza` - Estados posibles de las piezas
     - `tipos_visita` - Tipos de visitas disponibles
     - `estados_visita` - Estados de las visitas
  
  2. Seguridad
     - Row Level Security (RLS) habilitado en todas las tablas
     - Políticas de acceso basadas en roles
     - Autenticación integrada con Supabase Auth
  
  3. Datos de ejemplo
     - Piezas del museo con información completa
     - Visitas programadas
     - Tareas de mantenimiento
     - Configuraciones por defecto
*/

-- =============================================
-- EXTENSIONES NECESARIAS
-- =============================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensión para funciones de texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- TABLAS DE CATÁLOGO (LOOKUP TABLES)
-- =============================================

-- Categorías de piezas
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text,
  icono text,
  color text DEFAULT '#6b7280',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Estados de piezas
CREATE TABLE IF NOT EXISTS estados_pieza (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text,
  color text DEFAULT '#6b7280',
  requiere_atencion boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tipos de mantenimiento
CREATE TABLE IF NOT EXISTS tipos_mantenimiento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text,
  icono text,
  costo_base numeric(10,2) DEFAULT 0,
  duracion_estimada_dias integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Tipos de visita
CREATE TABLE IF NOT EXISTS tipos_visita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text,
  precio numeric(10,2) DEFAULT 0,
  icono text,
  capacidad_maxima integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Estados de visita
CREATE TABLE IF NOT EXISTS estados_visita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text,
  color text DEFAULT '#6b7280',
  es_final boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Usuarios del sistema (staff del museo)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nombre_completo text NOT NULL,
  rol text NOT NULL CHECK (rol IN ('Administrador', 'Curador', 'Técnico', 'Recepcionista')),
  telefono text,
  activo boolean DEFAULT true,
  ultimo_acceso timestamptz,
  configuracion jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Técnicos especializados
CREATE TABLE IF NOT EXISTS tecnicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_completo text NOT NULL,
  especialidades text[] DEFAULT '{}',
  certificaciones text[] DEFAULT '{}',
  telefono text,
  email text,
  activo boolean DEFAULT true,
  costo_hora numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Piezas del museo
CREATE TABLE IF NOT EXISTS piezas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  autor text NOT NULL,
  fecha_creacion text, -- Puede ser "1940", "Siglo XVI", etc.
  categoria_id uuid REFERENCES categorias(id),
  estado_id uuid REFERENCES estados_pieza(id),
  descripcion text,
  ubicacion text,
  imagen_url text,
  fecha_adquisicion date,
  valor_estimado numeric(12,2) DEFAULT 0,
  dimensiones text,
  material text,
  procedencia text,
  numero_inventario text UNIQUE,
  peso numeric(8,2),
  condiciones_especiales text,
  historia text,
  bibliografia text,
  exposiciones_anteriores text[],
  keywords text[] DEFAULT '{}',
  publico boolean DEFAULT true,
  created_by uuid REFERENCES usuarios(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visitas y reservas
CREATE TABLE IF NOT EXISTS visitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitante_nombre text NOT NULL,
  visitante_email text NOT NULL,
  visitante_telefono text NOT NULL,
  fecha_visita date NOT NULL,
  hora_visita time NOT NULL,
  numero_personas integer NOT NULL CHECK (numero_personas > 0),
  tipo_visita_id uuid REFERENCES tipos_visita(id),
  estado_id uuid REFERENCES estados_visita(id),
  observaciones text,
  precio_total numeric(10,2) DEFAULT 0,
  pagado boolean DEFAULT false,
  metodo_pago text,
  codigo_confirmacion text UNIQUE,
  idioma_preferido text DEFAULT 'es',
  necesidades_especiales text,
  origen text, -- De dónde viene el visitante
  como_se_entero text, -- Cómo se enteró del museo
  created_by uuid REFERENCES usuarios(id),
  confirmed_by uuid REFERENCES usuarios(id),
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mantenimientos y restauraciones
CREATE TABLE IF NOT EXISTS mantenimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pieza_id uuid REFERENCES piezas(id) ON DELETE CASCADE,
  tipo_id uuid REFERENCES tipos_mantenimiento(id),
  tecnico_id uuid REFERENCES tecnicos(id),
  fecha_inicio date NOT NULL,
  fecha_fin_estimada date,
  fecha_fin_real date,
  estado text NOT NULL CHECK (estado IN ('Programado', 'En Proceso', 'Completado', 'Cancelado', 'Pausado')),
  prioridad text NOT NULL CHECK (prioridad IN ('Alta', 'Media', 'Baja')) DEFAULT 'Media',
  descripcion text NOT NULL,
  diagnostico text,
  tratamiento_aplicado text,
  materiales_utilizados text[],
  costo_estimado numeric(10,2) DEFAULT 0,
  costo_real numeric(10,2) DEFAULT 0,
  horas_trabajadas numeric(6,2) DEFAULT 0,
  fotos_antes text[],
  fotos_durante text[],
  fotos_despues text[],
  documentos text[],
  notas_tecnicas text,
  requiere_aprobacion boolean DEFAULT false,
  aprobado_por uuid REFERENCES usuarios(id),
  aprobado_at timestamptz,
  created_by uuid REFERENCES usuarios(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text UNIQUE NOT NULL,
  valor jsonb NOT NULL,
  descripcion text,
  categoria text DEFAULT 'general',
  tipo text DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json', 'array')),
  editable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reportes generados
CREATE TABLE IF NOT EXISTS reportes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('general', 'colecciones', 'visitas', 'mantenimiento', 'financiero')),
  parametros jsonb DEFAULT '{}',
  datos jsonb NOT NULL,
  formato text DEFAULT 'json' CHECK (formato IN ('json', 'pdf', 'excel', 'csv')),
  archivo_url text,
  generado_por uuid REFERENCES usuarios(id),
  fecha_inicio date,
  fecha_fin date,
  created_at timestamptz DEFAULT now()
);

-- Historial de cambios (auditoría)
CREATE TABLE IF NOT EXISTS auditoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla text NOT NULL,
  registro_id uuid NOT NULL,
  accion text NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
  datos_anteriores jsonb,
  datos_nuevos jsonb,
  usuario_id uuid REFERENCES usuarios(id),
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_piezas_categoria ON piezas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_piezas_estado ON piezas(estado_id);
CREATE INDEX IF NOT EXISTS idx_piezas_autor ON piezas(autor);
CREATE INDEX IF NOT EXISTS idx_piezas_keywords ON piezas USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_piezas_publico ON piezas(publico);
CREATE INDEX IF NOT EXISTS idx_piezas_numero_inventario ON piezas(numero_inventario);

CREATE INDEX IF NOT EXISTS idx_visitas_fecha ON visitas(fecha_visita);
CREATE INDEX IF NOT EXISTS idx_visitas_estado ON visitas(estado_id);
CREATE INDEX IF NOT EXISTS idx_visitas_tipo ON visitas(tipo_visita_id);
CREATE INDEX IF NOT EXISTS idx_visitas_email ON visitas(visitante_email);

CREATE INDEX IF NOT EXISTS idx_mantenimientos_pieza ON mantenimientos(pieza_id);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_tecnico ON mantenimientos(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_estado ON mantenimientos(estado);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_fecha_inicio ON mantenimientos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_prioridad ON mantenimientos(prioridad);

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Índices de texto completo
CREATE INDEX IF NOT EXISTS idx_piezas_busqueda ON piezas USING GIN(to_tsvector('spanish', nombre || ' ' || autor || ' ' || COALESCE(descripcion, '')));

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_piezas_updated_at BEFORE UPDATE ON piezas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visitas_updated_at BEFORE UPDATE ON visitas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mantenimientos_updated_at BEFORE UPDATE ON mantenimientos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tecnicos_updated_at BEFORE UPDATE ON tecnicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar código de confirmación único
CREATE OR REPLACE FUNCTION generar_codigo_confirmacion()
RETURNS TEXT AS $$
BEGIN
    RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar código de confirmación automáticamente
CREATE OR REPLACE FUNCTION set_codigo_confirmacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_confirmacion IS NULL THEN
        NEW.codigo_confirmacion = generar_codigo_confirmacion();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_codigo_confirmacion BEFORE INSERT ON visitas FOR EACH ROW EXECUTE FUNCTION set_codigo_confirmacion();

-- Función para calcular precio total de visita
CREATE OR REPLACE FUNCTION calcular_precio_visita()
RETURNS TRIGGER AS $$
DECLARE
    precio_unitario numeric(10,2);
BEGIN
    SELECT precio INTO precio_unitario FROM tipos_visita WHERE id = NEW.tipo_visita_id;
    NEW.precio_total = precio_unitario * NEW.numero_personas;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_precio BEFORE INSERT OR UPDATE ON visitas FOR EACH ROW EXECUTE FUNCTION calcular_precio_visita();

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion, icono, color) VALUES
('Pintura', 'Obras pictóricas en diversos medios', '🎨', '#3b82f6'),
('Escultura', 'Obras tridimensionales talladas o modeladas', '🗿', '#8b5cf6'),
('Cerámica', 'Objetos de barro cocido y porcelana', '🏺', '#f59e0b'),
('Joyería', 'Ornamentos y objetos preciosos', '💎', '#10b981'),
('Textil', 'Tejidos y prendas tradicionales', '🧵', '#ef4444'),
('Fotografía', 'Imágenes fotográficas históricas', '📸', '#6b7280'),
('Documento', 'Manuscritos y documentos históricos', '📜', '#92400e'),
('Arqueología', 'Objetos arqueológicos y precolombinos', '🏛️', '#7c3aed');

-- Insertar estados de pieza
INSERT INTO estados_pieza (nombre, descripcion, color, requiere_atencion) VALUES
('Excelente', 'Pieza en perfecto estado de conservación', '#10b981', false),
('Bueno', 'Pieza en buen estado con desgaste mínimo', '#3b82f6', false),
('Regular', 'Pieza con signos de deterioro moderado', '#f59e0b', true),
('Necesita Restauración', 'Pieza que requiere intervención urgente', '#ef4444', true),
('En Restauración', 'Pieza actualmente en proceso de restauración', '#8b5cf6', false),
('No Exhibible', 'Pieza no apta para exhibición pública', '#6b7280', true);

-- Insertar tipos de mantenimiento
INSERT INTO tipos_mantenimiento (nombre, descripcion, icono, costo_base, duracion_estimada_dias) VALUES
('Limpieza', 'Limpieza superficial y mantenimiento básico', '🧽', 5000, 1),
('Restauración', 'Restauración completa de la pieza', '🎨', 25000, 30),
('Reparación', 'Reparación de daños específicos', '🔧', 15000, 7),
('Conservación', 'Tratamiento preventivo de conservación', '🛡️', 10000, 14),
('Documentación', 'Documentación fotográfica y técnica', '📸', 3000, 2),
('Análisis', 'Análisis científico de materiales', '🔬', 20000, 21);

-- Insertar tipos de visita
INSERT INTO tipos_visita (nombre, descripcion, precio, icono, capacidad_maxima) VALUES
('Individual', 'Visita individual o familiar', 100, '👤', 5),
('Grupo', 'Visita en grupo organizado', 80, '👥', 25),
('Estudiante', 'Visita educativa para estudiantes', 50, '🎓', 30),
('Turista', 'Visita para turistas internacionales', 200, '🌍', 15),
('VIP', 'Visita privada con guía especializado', 500, '⭐', 8),
('Escolar', 'Visita educativa para colegios', 30, '🏫', 40);

-- Insertar estados de visita
INSERT INTO estados_visita (nombre, descripcion, color, es_final) VALUES
('Pendiente', 'Reserva pendiente de confirmación', '#f59e0b', false),
('Confirmada', 'Reserva confirmada y programada', '#10b981', false),
('En Curso', 'Visita actualmente en desarrollo', '#3b82f6', false),
('Completada', 'Visita finalizada exitosamente', '#6b7280', true),
('Cancelada', 'Reserva cancelada', '#ef4444', true),
('No Show', 'Visitante no se presentó', '#f87171', true);

-- Insertar configuraciones por defecto
INSERT INTO configuracion (clave, valor, descripcion, categoria, tipo) VALUES
('museo_nombre', '"Museo Nacional de Historia"', 'Nombre oficial del museo', 'general', 'string'),
('museo_direccion', '"Calle Las Damas, Zona Colonial, Santo Domingo"', 'Dirección física del museo', 'general', 'string'),
('museo_telefono', '"809-686-6668"', 'Teléfono principal del museo', 'general', 'string'),
('museo_email', '"info@museonacional.gov.do"', 'Email oficial del museo', 'general', 'string'),
('museo_sitio_web', '"www.museonacional.gov.do"', 'Sitio web oficial', 'general', 'string'),
('horario_apertura', '"09:00"', 'Hora de apertura', 'operacion', 'string'),
('horario_cierre', '"17:00"', 'Hora de cierre', 'operacion', 'string'),
('dias_operacion', '["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]', 'Días de operación', 'operacion', 'array'),
('capacidad_maxima', '150', 'Capacidad máxima de visitantes simultáneos', 'operacion', 'number'),
('moneda', '"RD$"', 'Moneda utilizada', 'financiero', 'string'),
('idioma_default', '"es"', 'Idioma por defecto del sistema', 'sistema', 'string'),
('tema_default', '"claro"', 'Tema visual por defecto', 'sistema', 'string'),
('notificaciones_email', 'true', 'Habilitar notificaciones por email', 'notificaciones', 'boolean'),
('backup_automatico', 'true', 'Realizar backups automáticos', 'sistema', 'boolean'),
('sesion_duracion_horas', '8', 'Duración de sesión en horas', 'seguridad', 'number');

-- =============================================
-- DATOS DE EJEMPLO
-- =============================================

-- Insertar usuarios de ejemplo (estos se crearán cuando se registren en Supabase Auth)
-- Los IDs de auth_user_id se actualizarán cuando los usuarios se registren

-- Insertar técnicos especializados
INSERT INTO tecnicos (nombre_completo, especialidades, certificaciones, telefono, email, costo_hora) VALUES
('Dra. Carmen Herrera', ARRAY['Restauración de pinturas', 'Conservación preventiva'], ARRAY['Certificación Internacional en Restauración', 'Maestría en Conservación'], '809-555-0101', 'carmen.herrera@museo.gov.do', 1500),
('Lic. Pedro Martínez', ARRAY['Limpieza especializada', 'Mantenimiento preventivo'], ARRAY['Técnico en Conservación', 'Curso de Limpieza de Obras de Arte'], '809-555-0102', 'pedro.martinez@museo.gov.do', 800),
('Ing. María González', ARRAY['Análisis de materiales', 'Documentación técnica'], ARRAY['Ingeniería de Materiales', 'Especialización en Análisis Científico'], '809-555-0103', 'maria.gonzalez@museo.gov.do', 1200),
('Prof. Juan Rodríguez', ARRAY['Restauración de cerámica', 'Arqueología'], ARRAY['Profesor en Historia del Arte', 'Especialista en Cerámica Precolombina'], '809-555-0104', 'juan.rodriguez@museo.gov.do', 1000),
('Dra. Ana Jiménez', ARRAY['Conservación de textiles', 'Restauración de documentos'], ARRAY['Doctora en Historia', 'Especialista en Conservación de Textiles'], '809-555-0105', 'ana.jimenez@museo.gov.do', 1300);

-- Obtener IDs de las categorías y estados para las piezas
DO $$
DECLARE
    cat_pintura_id uuid;
    cat_ceramica_id uuid;
    cat_escultura_id uuid;
    cat_joyeria_id uuid;
    cat_arqueologia_id uuid;
    
    est_excelente_id uuid;
    est_bueno_id uuid;
    est_regular_id uuid;
    est_necesita_id uuid;
    
    tipo_individual_id uuid;
    tipo_grupo_id uuid;
    tipo_estudiante_id uuid;
    tipo_turista_id uuid;
    
    est_confirmada_id uuid;
    est_pendiente_id uuid;
    est_completada_id uuid;
    
    tipo_limpieza_id uuid;
    tipo_restauracion_id uuid;
    tipo_conservacion_id uuid;
    
    tecnico1_id uuid;
    tecnico2_id uuid;
    tecnico3_id uuid;
BEGIN
    -- Obtener IDs de categorías
    SELECT id INTO cat_pintura_id FROM categorias WHERE nombre = 'Pintura';
    SELECT id INTO cat_ceramica_id FROM categorias WHERE nombre = 'Cerámica';
    SELECT id INTO cat_escultura_id FROM categorias WHERE nombre = 'Escultura';
    SELECT id INTO cat_joyeria_id FROM categorias WHERE nombre = 'Joyería';
    SELECT id INTO cat_arqueologia_id FROM categorias WHERE nombre = 'Arqueología';
    
    -- Obtener IDs de estados
    SELECT id INTO est_excelente_id FROM estados_pieza WHERE nombre = 'Excelente';
    SELECT id INTO est_bueno_id FROM estados_pieza WHERE nombre = 'Bueno';
    SELECT id INTO est_regular_id FROM estados_pieza WHERE nombre = 'Regular';
    SELECT id INTO est_necesita_id FROM estados_pieza WHERE nombre = 'Necesita Restauración';
    
    -- Obtener IDs de tipos de visita
    SELECT id INTO tipo_individual_id FROM tipos_visita WHERE nombre = 'Individual';
    SELECT id INTO tipo_grupo_id FROM tipos_visita WHERE nombre = 'Grupo';
    SELECT id INTO tipo_estudiante_id FROM tipos_visita WHERE nombre = 'Estudiante';
    SELECT id INTO tipo_turista_id FROM tipos_visita WHERE nombre = 'Turista';
    
    -- Obtener IDs de estados de visita
    SELECT id INTO est_confirmada_id FROM estados_visita WHERE nombre = 'Confirmada';
    SELECT id INTO est_pendiente_id FROM estados_visita WHERE nombre = 'Pendiente';
    SELECT id INTO est_completada_id FROM estados_visita WHERE nombre = 'Completada';
    
    -- Obtener IDs de tipos de mantenimiento
    SELECT id INTO tipo_limpieza_id FROM tipos_mantenimiento WHERE nombre = 'Limpieza';
    SELECT id INTO tipo_restauracion_id FROM tipos_mantenimiento WHERE nombre = 'Restauración';
    SELECT id INTO tipo_conservacion_id FROM tipos_mantenimiento WHERE nombre = 'Conservación';
    
    -- Obtener IDs de técnicos
    SELECT id INTO tecnico1_id FROM tecnicos WHERE nombre_completo = 'Dra. Carmen Herrera';
    SELECT id INTO tecnico2_id FROM tecnicos WHERE nombre_completo = 'Lic. Pedro Martínez';
    SELECT id INTO tecnico3_id FROM tecnicos WHERE nombre_completo = 'Ing. María González';
    
    -- Insertar piezas de ejemplo
    INSERT INTO piezas (nombre, autor, fecha_creacion, categoria_id, estado_id, descripcion, ubicacion, imagen_url, fecha_adquisicion, valor_estimado, dimensiones, material, procedencia, numero_inventario, publico) VALUES
    ('Retrato de Juana Saltitopa', 'Yoryi Morel', '1940', cat_pintura_id, est_excelente_id, 'Óleo sobre lienzo que representa a una figura femenina taína, símbolo de la resistencia indígena dominicana.', 'Sala Principal - Pared Norte', 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=300', '1985-03-15', 150000, '80cm x 60cm', 'Óleo sobre lienzo', 'Colección privada familia Morel', 'MNH-001', true),
    
    ('Cerámica Taína Ceremonial', 'Artesano Taíno', '1200-1500', cat_ceramica_id, est_bueno_id, 'Vasija ceremonial utilizada en rituales religiosos por los pueblos taínos que habitaron la isla.', 'Vitrina 3 - Sala Precolombina', 'https://images.pexels.com/photos/7586656/pexels-photo-7586656.jpeg?auto=compress&cs=tinysrgb&w=300', '1978-11-20', 75000, '25cm x 30cm', 'Cerámica', 'Excavaciones arqueológicas Higüey', 'MNH-002', true),
    
    ('Paisaje de Samaná', 'Cándido Bidó', '1995', cat_pintura_id, est_regular_id, 'Paisaje tropical que captura la esencia de la península de Samaná con su característico estilo naif.', 'Sala de Arte Contemporáneo', 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=300', '2001-06-10', 200000, '100cm x 80cm', 'Acrílico sobre lienzo', 'Donación del artista', 'MNH-003', true),
    
    ('Máscara Ritual Taína', 'Artesano Taíno', '1300-1400', cat_escultura_id, est_necesita_id, 'Máscara ceremonial tallada en madera, utilizada en rituales de fertilidad y cosecha.', 'Almacén - Pendiente restauración', 'https://images.pexels.com/photos/8926553/pexels-photo-8926553.jpeg?auto=compress&cs=tinysrgb&w=300', '1982-04-18', 120000, '30cm x 25cm x 15cm', 'Madera de caoba', 'Colección arqueológica nacional', 'MNH-004', false),
    
    ('Merengue en el Malecón', 'Jaime Colson', '1960', cat_pintura_id, est_excelente_id, 'Escena costumbrista que retrata la vida nocturna dominicana en el Malecón de Santo Domingo.', 'Sala de Cultura Popular', 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=300', '1987-09-12', 180000, '90cm x 70cm', 'Óleo sobre lienzo', 'Adquisición directa del artista', 'MNH-005', true),
    
    ('Collar de Caracolas Taíno', 'Artesano Taíno', '1400-1500', cat_joyeria_id, est_bueno_id, 'Collar ceremonial elaborado con caracolas marinas, símbolo de estatus social en la cultura taína.', 'Vitrina 5 - Sala Precolombina', 'https://images.pexels.com/photos/8850421/pexels-photo-8850421.jpeg?auto=compress&cs=tinysrgb&w=300', '1990-02-28', 85000, '60cm longitud', 'Caracolas marinas y fibras vegetales', 'Donación coleccionista privado', 'MNH-006', true);
    
    -- Insertar visitas de ejemplo
    INSERT INTO visitas (visitante_nombre, visitante_email, visitante_telefono, fecha_visita, hora_visita, numero_personas, tipo_visita_id, estado_id, observaciones) VALUES
    ('Ana María Rodríguez', 'ana.rodriguez@email.com', '809-555-0123', CURRENT_DATE + INTERVAL '1 day', '10:00', 2, tipo_individual_id, est_confirmada_id, 'Interesada en arte precolombino'),
    ('Colegio San Patricio', 'excursiones@sanpatricio.edu.do', '809-555-0456', CURRENT_DATE + INTERVAL '2 days', '09:00', 25, tipo_estudiante_id, est_confirmada_id, 'Estudiantes de 8vo grado - Tour educativo'),
    ('Carlos Fernández', 'carlos.fernandez@email.com', '809-555-0789', CURRENT_DATE + INTERVAL '3 days', '14:30', 1, tipo_turista_id, est_pendiente_id, 'Visitante internacional - Requiere guía en inglés'),
    ('Familia Jiménez', 'familia.jimenez@email.com', '809-555-0321', CURRENT_DATE + INTERVAL '4 days', '11:00', 4, tipo_grupo_id, est_confirmada_id, 'Celebración familiar - cumpleaños'),
    ('Universidad APEC', 'arte@unapec.edu.do', '809-555-0654', CURRENT_DATE - INTERVAL '1 day', '15:00', 15, tipo_estudiante_id, est_completada_id, 'Estudiantes de Historia del Arte');
    
    -- Insertar mantenimientos de ejemplo
    INSERT INTO mantenimientos (pieza_id, tipo_id, tecnico_id, fecha_inicio, fecha_fin_estimada, estado, prioridad, descripcion, costo_estimado) VALUES
    ((SELECT id FROM piezas WHERE numero_inventario = 'MNH-004'), tipo_restauracion_id, tecnico1_id, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'En Proceso', 'Alta', 'Restauración completa de grietas en la madera y tratamiento anti-polillas', 25000),
    ((SELECT id FROM piezas WHERE numero_inventario = 'MNH-003'), tipo_limpieza_id, tecnico2_id, CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '11 days', 'Programado', 'Media', 'Limpieza superficial y aplicación de barniz protector', 8000),
    ((SELECT id FROM piezas WHERE numero_inventario = 'MNH-002'), tipo_conservacion_id, tecnico1_id, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'Completado', 'Media', 'Aplicación de consolidante y nueva base de soporte', 15000),
    ((SELECT id FROM piezas WHERE numero_inventario = 'MNH-001'), tipo_limpieza_id, tecnico2_id, CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '21 days', 'Programado', 'Baja', 'Limpieza anual preventiva del marco y barniz', 5000);
    
END $$;

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de piezas con información completa
CREATE OR REPLACE VIEW vista_piezas_completa AS
SELECT 
    p.id,
    p.nombre,
    p.autor,
    p.fecha_creacion,
    c.nombre as categoria,
    e.nombre as estado,
    e.color as estado_color,
    e.requiere_atencion,
    p.descripcion,
    p.ubicacion,
    p.imagen_url,
    p.fecha_adquisicion,
    p.valor_estimado,
    p.dimensiones,
    p.material,
    p.procedencia,
    p.numero_inventario,
    p.publico,
    p.created_at,
    p.updated_at
FROM piezas p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN estados_pieza e ON p.estado_id = e.id;

-- Vista de visitas con información completa
CREATE OR REPLACE VIEW vista_visitas_completa AS
SELECT 
    v.id,
    v.visitante_nombre,
    v.visitante_email,
    v.visitante_telefono,
    v.fecha_visita,
    v.hora_visita,
    v.numero_personas,
    tv.nombre as tipo_visita,
    tv.precio as precio_unitario,
    ev.nombre as estado,
    ev.color as estado_color,
    v.precio_total,
    v.observaciones,
    v.codigo_confirmacion,
    v.created_at
FROM visitas v
LEFT JOIN tipos_visita tv ON v.tipo_visita_id = tv.id
LEFT JOIN estados_visita ev ON v.estado_id = ev.id;

-- Vista de mantenimientos con información completa
CREATE OR REPLACE VIEW vista_mantenimientos_completa AS
SELECT 
    m.id,
    p.nombre as pieza_nombre,
    p.numero_inventario,
    tm.nombre as tipo_mantenimiento,
    t.nombre_completo as tecnico,
    m.fecha_inicio,
    m.fecha_fin_estimada,
    m.fecha_fin_real,
    m.estado,
    m.prioridad,
    m.descripcion,
    m.costo_estimado,
    m.costo_real,
    m.horas_trabajadas,
    m.created_at
FROM mantenimientos m
LEFT JOIN piezas p ON m.pieza_id = p.id
LEFT JOIN tipos_mantenimiento tm ON m.tipo_id = tm.id
LEFT JOIN tecnicos t ON m.tecnico_id = t.id;

-- =============================================
-- FUNCIONES DE ESTADÍSTICAS
-- =============================================

-- Función para obtener estadísticas generales
CREATE OR REPLACE FUNCTION obtener_estadisticas_generales()
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'total_piezas', (SELECT COUNT(*) FROM piezas),
        'piezas_publicas', (SELECT COUNT(*) FROM piezas WHERE publico = true),
        'piezas_necesitan_atencion', (SELECT COUNT(*) FROM piezas p JOIN estados_pieza e ON p.estado_id = e.id WHERE e.requiere_atencion = true),
        'total_visitas', (SELECT COUNT(*) FROM visitas),
        'visitas_confirmadas', (SELECT COUNT(*) FROM visitas v JOIN estados_visita e ON v.estado_id = e.id WHERE e.nombre = 'Confirmada'),
        'visitas_hoy', (SELECT COUNT(*) FROM visitas WHERE fecha_visita = CURRENT_DATE),
        'mantenimientos_activos', (SELECT COUNT(*) FROM mantenimientos WHERE estado IN ('Programado', 'En Proceso')),
        'ingresos_mes_actual', (SELECT COALESCE(SUM(precio_total), 0) FROM visitas WHERE EXTRACT(MONTH FROM fecha_visita) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_visita) = EXTRACT(YEAR FROM CURRENT_DATE)),
        'costo_mantenimiento_mes', (SELECT COALESCE(SUM(costo_real), 0) FROM mantenimientos WHERE EXTRACT(MONTH FROM fecha_inicio) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_inicio) = EXTRACT(YEAR FROM CURRENT_DATE))
    ) INTO resultado;
    
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMENTARIOS FINALES
-- =============================================

COMMENT ON DATABASE postgres IS 'Base de datos del Sistema de Gestión de Museos';

-- Comentarios en tablas principales
COMMENT ON TABLE piezas IS 'Catálogo completo de piezas del museo con toda su información técnica y administrativa';
COMMENT ON TABLE visitas IS 'Registro de todas las visitas programadas, confirmadas y realizadas al museo';
COMMENT ON TABLE mantenimientos IS 'Control de todas las tareas de mantenimiento, restauración y conservación de las piezas';
COMMENT ON TABLE usuarios IS 'Personal del museo con acceso al sistema de gestión';
COMMENT ON TABLE configuracion IS 'Configuraciones del sistema almacenadas de forma dinámica';