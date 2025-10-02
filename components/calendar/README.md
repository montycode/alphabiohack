# 📅 Componentes de Calendario

Sistema de calendario moderno y responsivo para mostrar eventos y citas médicas, construido con Shadcn/ui y optimizado para dispositivos móviles y desktop.

## 🎯 Características

### ✨ **Funcionalidades Principales**

- **Vista de Calendario**: Calendario mensual con eventos visuales
- **Vista de Lista**: Lista tradicional de citas (existente)
- **Switch de Vista**: Alternar entre calendario y lista
- **Eventos Interactivos**: Click en eventos para ver detalles
- **Dialog de Detalles**: Modal con información completa del evento
- **Responsive Design**: Optimizado para móvil y desktop

### 🎨 **Diseño y UX**

- **Mobile-First**: Diseño optimizado para dispositivos móviles
- **Shadcn/ui**: Componentes consistentes y modernos
- **Colores Semánticos**: Estados visuales claros (confirmado, pendiente, cancelado)
- **Iconografía**: Iconos intuitivos para diferentes tipos de eventos
- **Animaciones**: Transiciones suaves y feedback visual

## 🏗️ Arquitectura de Componentes

### 📦 **Componentes Principales**

#### `AppointmentsCalendar`

Calendario mensual con eventos visuales

```tsx
<AppointmentsCalendar
  events={events}
  onDateSelect={handleDateSelect}
  onEventClick={handleEventClick}
  onAddEvent={handleAddEvent}
/>
```

#### `EventList`

Lista de eventos para un día específico

```tsx
<EventList
  date={selectedDate}
  events={dayEvents}
  onEventClick={handleEventClick}
/>
```

#### `EventDetailsDialog`

Modal con detalles completos del evento

```tsx
<EventDetailsDialog
  event={selectedEvent}
  isOpen={isDialogOpen}
  onClose={handleClose}
  onEdit={handleEdit}
  onCancel={handleCancel}
/>
```

#### `CalendarView`

Componente principal que integra calendario y lista

```tsx
<CalendarView
  events={events}
  onEventClick={handleEventClick}
  onEventEdit={handleEventEdit}
  onEventCancel={handleEventCancel}
  onAddEvent={handleAddEvent}
/>
```

#### `ViewToggle`

Switch para alternar entre vista de lista y calendario

```tsx
<ViewToggle currentView={currentView} onViewChange={setCurrentView} />
```

## 📊 Tipos de Datos

### `CalendarEvent`

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "appointment" | "task" | "event";
  status?: "confirmed" | "pending" | "cancelled";
  color?: string;
  // Datos adicionales para appointments
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  location?: string;
  specialty?: string;
  service?: string;
  duration?: number;
  notes?: string;
}
```

## 🔧 Utilidades

### `convertBookingsToEvents`

Convierte datos de bookings a eventos del calendario

```typescript
const calendarEvents = convertBookingsToEvents(bookings);
```

### `getEventsForDate`

Obtiene eventos para una fecha específica

```typescript
const dayEvents = getEventsForDate(events, selectedDate);
```

### `getEventsForMonth`

Obtiene eventos para un mes específico

```typescript
const monthEvents = getEventsForMonth(events, currentDate);
```

## 🎨 Estados Visuales

### **Tipos de Eventos**

- 🏥 **Appointment**: Citas médicas (azul)
- ✅ **Task**: Tareas (verde)
- 📅 **Event**: Eventos generales (púrpura)

### **Estados de Cita**

- ✅ **Confirmed**: Confirmada (verde)
- ⏳ **Pending**: Pendiente (amarillo)
- ❌ **Cancelled**: Cancelada (rojo)

## 📱 Responsive Design

### **Mobile (< 768px)**

- Calendario en una columna
- Eventos apilados verticalmente
- Botones de acción optimizados para touch
- Texto oculto en botones del toggle

### **Desktop (≥ 768px)**

- Calendario en grid de 7 columnas
- Eventos con más información visible
- Hover states y animaciones
- Texto completo en botones del toggle

## 🔄 Integración con Appointments

### **Página de Appointments**

```tsx
// Switch entre vista de lista y calendario
<ViewToggle currentView={currentView} onViewChange={setCurrentView} />;

{
  currentView === "list" ? (
    <BookingsDataTable data={bookings} />
  ) : (
    <CalendarView events={calendarEvents} />
  );
}
```

### **Conversión de Datos**

```tsx
const calendarEvents = useMemo(() => {
  return convertBookingsToEvents(bookings);
}, [bookings]);
```

## 🚀 Uso Rápido

### **1. Importar Componentes**

```tsx
import { CalendarView, ViewToggle } from "@/components/calendar";
import { convertBookingsToEvents } from "@/lib/utils/calendar";
```

### **2. Configurar Estado**

```tsx
const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
const calendarEvents = useMemo(
  () => convertBookingsToEvents(bookings),
  [bookings]
);
```

### **3. Renderizar**

```tsx
<ViewToggle currentView={currentView} onViewChange={setCurrentView} />
<CalendarView events={calendarEvents} />
```

## 🎯 Beneficios

### **Para Usuarios**

- **Vista Visual**: Fácil identificación de fechas con eventos
- **Información Completa**: Detalles de citas en un solo lugar
- **Navegación Intuitiva**: Click para ver detalles, navegación por meses
- **Responsive**: Experiencia optimizada en cualquier dispositivo

### **Para Desarrolladores**

- **Componentes Modulares**: Fácil reutilización y mantenimiento
- **Tipos Seguros**: TypeScript para prevenir errores
- **Shadcn/ui**: Componentes consistentes y accesibles
- **Utilidades**: Funciones helper para manipulación de datos

## 🔮 Futuras Mejoras

- **Drag & Drop**: Arrastrar eventos entre fechas
- **Filtros**: Filtrar por tipo de evento, estado, especialidad
- **Vista Semanal**: Opción de vista semanal
- **Notificaciones**: Recordatorios de citas
- **Exportación**: Exportar calendario a PDF/ICS
- **Temas**: Modo oscuro y personalización de colores
