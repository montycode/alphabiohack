# Página de Gestión de Especialidades Médicas

## 🏥 Descripción

Esta página permite gestionar las especialidades médicas y sus servicios asociados de manera completa y eficiente. Implementa una arquitectura moderna con componentes presentacionales, optimización de rendimiento y una excelente experiencia de usuario.

## ✨ Características Principales

### 🎯 Funcionalidades Core

- **Gestión Completa de Especialidades**: Crear, editar, eliminar y visualizar especialidades médicas
- **Gestión de Servicios**: Agregar, modificar y eliminar servicios dentro de cada especialidad
- **Eliminación en Cascada**: Al eliminar una especialidad, se eliminan automáticamente todos sus servicios
- **Búsqueda Inteligente**: Buscar por nombre de especialidad, descripción o servicios
- **Estadísticas en Tiempo Real**: Métricas de especialidades, servicios y costos

### 🚀 Optimizaciones de Rendimiento

- **useTransition**: Manejo de estados de carga sin bloqueo de la UI
- **useMemo**: Memoización de cálculos costosos y componentes
- **Contexto Simplificado**: Data provider eficiente usando servicios existentes
- **Servicios Reutilizables**: Aprovecha las funciones CRUD ya definidas

### 📱 Diseño Responsive

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Grid Adaptativo**: Layouts que se adaptan a diferentes tamaños de pantalla
- **Componentes Modulares**: Componentes reutilizables y bien estructurados
- **UX Intuitiva**: Navegación clara y acciones obvias

## 🏗️ Arquitectura

### Componentes Presentacionales

- `SpecialtyCard`: Tarjeta individual de especialidad
- `ServiceCard`: Tarjeta individual de servicio
- `SpecialtyList`: Lista de especialidades con skeleton loading
- `ServiceList`: Lista de servicios con skeleton loading
- `StatsCard`: Tarjeta de estadísticas reutilizable

### Formularios

- `SpecialtyForm`: Formulario para crear/editar especialidades
- `ServiceForm`: Formulario para crear/editar servicios
- `DeleteConfirmDialog`: Diálogo de confirmación para eliminaciones

### Contexto de Estado

- `SpecialtiesProvider`: Data provider simplificado usando clientes API del lado del cliente
- `useSpecialties`: Hook personalizado para acceder al estado y acciones CRUD

### Clientes API

- `specialtiesApi`: Cliente para operaciones CRUD de especialidades
- `servicesApi`: Cliente para operaciones CRUD de servicios
- Endpoints centralizados en `/constants` para evitar magic strings

## 🔧 Tecnologías Utilizadas

- **React 19**: Hooks modernos (useTransition)
- **TypeScript**: Tipado fuerte y autocompletado
- **shadcn/ui**: Componentes de UI modernos y accesibles
- **React Hook Form**: Manejo eficiente de formularios
- **Zod**: Validación de esquemas
- **Sonner**: Notificaciones toast elegantes
- **Tailwind CSS**: Estilos utilitarios y responsive design

## 📊 Características de UX/UI

### Estados de Carga

- Skeleton loaders para mejor percepción de velocidad
- Estados de carga optimistas
- Feedback visual inmediato

### Navegación

- Breadcrumbs para navegación contextual
- Botones de acción claros y accesibles
- Confirmaciones para acciones destructivas

### Responsive Design

- Grid adaptativo (1 columna móvil, 2 tablet, 3 desktop)
- Botones que se adaptan al tamaño de pantalla
- Formularios optimizados para móvil

## 🎨 Componentes Reutilizables

### StatsCard

```tsx
<StatsCard
  title="Total Especialidades"
  value={stats.totalSpecialties}
  icon={Stethoscope}
  description="Descripción opcional"
/>
```

### SpecialtyCard

```tsx
<SpecialtyCard
  specialty={specialty}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewServices={handleViewServices}
  onAddService={handleAddService}
  isPending={isPending}
/>
```

## 🔄 Flujo de Datos

1. **Carga Inicial**: `refreshSpecialties()` → `specialtiesApi.getSpecialtiesWithServices()`
2. **Acciones CRUD**: Contexto → Clientes API → Endpoints `/api/specialties` y `/api/services`
3. **Actualización de Estado**: Estado local se actualiza tras operaciones exitosas
4. **Feedback**: Notificaciones toast informan del resultado

## 🛡️ Manejo de Errores

- Validación en tiempo real con Zod
- Manejo de errores de red con fallbacks
- Notificaciones toast para feedback inmediato
- Mensajes de error claros y accionables

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` - 1 columna, botones full-width
- **Tablet**: `768px - 1024px` - 2 columnas
- **Desktop**: `> 1024px` - 3 columnas, layout completo

## 🎯 Próximas Mejoras

- [ ] Filtros avanzados por precio y duración
- [ ] Exportación de datos a CSV/PDF
- [ ] Drag & drop para reordenar servicios
- [ ] Modo offline con sincronización
- [ ] Temas personalizables
- [ ] Accesibilidad mejorada (ARIA labels)

## 🚀 Uso

```tsx
import { SpecialtiesProvider } from "@/contexts/specialties-context";
import { SpecialtiesPage } from "@/components/specialties/specialties-page";

export default function Specialties() {
  return (
    <SpecialtiesProvider>
      <SpecialtiesPage />
    </SpecialtiesProvider>
  );
}
```

La página está completamente funcional y lista para usar, con todas las características solicitadas implementadas siguiendo las mejores prácticas de React y diseño moderno.
