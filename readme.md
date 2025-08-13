## 👨‍💻 Créditos

**Desarrollado por:**

- **NASSER EMIL ISSA TAVARES** (24-0742)
- **BRYAN XAVIER FLORENTINO MONTERO** (24-0462)
- **JOSE JACOBO RESTREPO CEBALLOS** (23-0335)

# GEMUNA - Sistema de Gestión de Museos Nacional

Un sistema completo de gestión para museos desarrollado con React, TypeScript y Supabase, diseñado para administrar colecciones, visitas, mantenimiento y generar reportes detallados.

## 🏛️ Características Principales

### 📚 Gestión de Colecciones

- Catálogo completo de piezas del museo
- Información detallada de cada pieza (autor, fecha, categoría, estado, etc.)
- Sistema de categorización y estados
- Generación de códigos QR para cada pieza
- Búsqueda y filtrado avanzado
- Gestión de imágenes y documentación

### 📅 Sistema de Visitas

- Reservas y programación de visitas
- Diferentes tipos de visitas (Individual, Grupo, Estudiante, Turista)
- Gestión de estados de visitas
- Confirmación automática con códigos únicos
- Cálculo automático de precios
- Seguimiento de visitantes y estadísticas

### 🔧 Mantenimiento y Restauración

- Programación de tareas de mantenimiento
- Asignación de técnicos especializados
- Seguimiento de costos y tiempos
- Estados de mantenimiento (Programado, En Proceso, Completado)
- Gestión de prioridades
- Historial completo de intervenciones

### 📊 Reportes y Análisis

- Reportes generales del museo
- Análisis de colecciones por categoría y estado
- Estadísticas de visitas y ingresos
- Reportes de mantenimiento y costos
- Exportación a Excel
- Gráficos y visualizaciones

### ⚙️ Configuración del Sistema

- Configuración general del museo
- Gestión de usuarios y roles
- Configuración de precios y tarifas
- Preferencias de notificaciones
- Configuración de seguridad
- Respaldo y restauración de datos

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Iconos**: Lucide React
- **Exportación**: XLSX para reportes Excel
- **QR Codes**: qrcode library
- **Alertas**: SweetAlert2
- **Build Tool**: Vite

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (para producción)

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd gemuna
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus credenciales de Supabase:

   ```
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 🗄️ Base de Datos

El sistema utiliza Supabase con PostgreSQL. La estructura incluye:

- **Tablas principales**: piezas, visitas, mantenimientos, usuarios
- **Tablas de catálogo**: categorias, estados_pieza, tipos_visita, etc.
- **Vistas**: vistas optimizadas para consultas complejas
- **Funciones**: lógica de negocio en PostgreSQL
- **Triggers**: automatización de procesos

### Configuración de la Base de Datos

1. Crear un nuevo proyecto en Supabase
2. Ejecutar el script SQL ubicado en `supabase/database-script.sql`
3. Configurar las políticas de Row Level Security (RLS)
4. Insertar datos de ejemplo si es necesario

## Autenticación

El sistema incluye:

- Autenticación con email y contraseña
- Modo demo para pruebas
- Gestión de sesiones
- Perfiles de usuario personalizados

### Credenciales Demo

- **Administrador**: admin@museo.gov.do / password123
- **Curador**: curador@museo.gov.do / password123
- **Técnico**: tecnico@museo.gov.do / password123

## 📱 Características Adicionales

- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **PWA Ready**: Preparado para funcionar como aplicación web progresiva
- **Offline Support**: Funcionalidad básica sin conexión
- **Exportación de Datos**: Reportes en Excel
- **Códigos QR**: Para información rápida de piezas
- **Búsqueda Avanzada**: Filtros múltiples y búsqueda de texto completo

## 🚀 Despliegue

### Netlify (Recomendado)

```bash
npm run build
# Subir la carpeta dist/ a Netlify
```

### Vercel

```bash
npm run build
vercel --prod
```

### Servidor Propio

```bash
npm run build
# Servir la carpeta dist/ con nginx, apache, etc.
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## Soporte

Para soporte técnico o consultas sobre el sistema, contactar a través de:

- Issues en GitHub
- Email del equipo de desarrollo

## Actualizaciones

El sistema se actualiza regularmente con nuevas características y mejoras. Consultar el changelog para ver las últimas actualizaciones.

---

**GEMUNA** - Preservando el patrimonio cultural a través de la tecnología 🏛️
