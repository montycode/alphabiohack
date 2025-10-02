# Feature Flags - Sistema de Control de Funcionalidades

## 📋 Descripción

El sistema de Feature Flags permite controlar qué funcionalidades están habilitadas o deshabilitadas en la aplicación de manera centralizada. Esto es especialmente útil para:

- **Controlar tipos de citas disponibles**
- **Habilitar/deshabilitar funcionalidades específicas**
- **Testing A/B**
- **Rollouts graduales**
- **Configuraciones por ambiente**

## 🚀 Uso Rápido

### 1. Habilitar/Deshabilitar Tipos de Citas

Edita el archivo `lib/config/features.ts`:

```typescript
export const featureFlags: FeatureFlags = {
  appointmentTypes: {
    IN_PERSON: true, // ✅ Citas presenciales habilitadas
    ONLINE: true, // ✅ Citas en línea habilitadas
    PHONE: true, // ✅ Citas por teléfono habilitadas
    HOME: false, // ❌ Visitas a domicilio deshabilitadas
    VIDEO: true, // ✅ Video llamadas habilitadas
  },
  // ... resto de configuración
};
```

### 2. Usar en Componentes

```typescript
import { useAppointmentTypes } from "@/hooks";

function MyComponent() {
  const { enabled, isEnabled } = useAppointmentTypes();

  // Verificar si un tipo específico está habilitado
  if (isEnabled("IN_PERSON")) {
    // Mostrar opción de cita presencial
  }

  // Obtener todos los tipos habilitados
  console.log(enabled); // ['IN_PERSON', 'ONLINE', 'PHONE', 'VIDEO']
}
```

## 🔧 Configuración Detallada

### Tipos de Citas Disponibles

| Tipo        | Descripción                      | Valor                   |
| ----------- | -------------------------------- | ----------------------- |
| `IN_PERSON` | Citas presenciales en clínica    | `BookingType.IN_PERSON` |
| `ONLINE`    | Citas en línea (video llamada)   | `BookingType.ONLINE`    |
| `PHONE`     | Citas por teléfono               | `BookingType.PHONE`     |
| `HOME`      | Visitas a domicilio              | `BookingType.HOME`      |
| `VIDEO`     | Video llamadas (alias de ONLINE) | `BookingType.VIDEO`     |

### Funcionalidades Adicionales

```typescript
features: {
  onlineBooking: true,        // Habilitar reservas en línea
  phoneBooking: true,         // Habilitar reservas por teléfono
  homeVisits: false,         // Habilitar visitas a domicilio
  videoCalls: true,          // Habilitar video llamadas
  clinicVisits: true,        // Habilitar visitas a clínica
}
```

### Configuraciones del Sistema

```typescript
settings: {
  maxAdvanceBookingDays: 30,    // Máximo días de anticipación
  minAdvanceBookingHours: 2,   // Mínimo horas de anticipación
  allowSameDayBooking: true,   // Permitir citas el mismo día
  requirePhoneVerification: false, // Requerir verificación telefónica
}
```

## 🌍 Configuraciones por Ambiente

### Desarrollo

```typescript
development: {
  appointmentTypes: {
    HOME: true, // Habilitar visitas a domicilio en desarrollo
  },
}
```

### Staging

```typescript
staging: {
  settings: {
    maxAdvanceBookingDays: 14, // Menos días en staging
  },
}
```

### Producción

```typescript
production: featureFlags, // Usar configuración por defecto
```

## 📚 Hooks Disponibles

### `useFeatureFlags()`

Hook principal que proporciona acceso a todas las configuraciones:

```typescript
const {
  flags, // Configuración completa
  enabledAppointmentTypes, // Tipos de citas habilitados
  isAppointmentTypeEnabled, // Función para verificar tipo específico
  isFeatureEnabled, // Función para verificar funcionalidad
  getSetting, // Función para obtener configuración
  canBookOnline, // Métodos de conveniencia
  canBookByPhone,
  canBookHomeVisits,
  canBookVideoCalls,
  canBookClinicVisits,
  maxAdvanceDays, // Configuraciones de tiempo
  minAdvanceHours,
  allowSameDay,
  requirePhoneVerification,
} = useFeatureFlags();
```

### `useAppointmentTypes()`

Hook específico para tipos de citas:

```typescript
const {
  enabled, // Array de tipos habilitados
  isEnabled, // Función para verificar si está habilitado
  count, // Cantidad de tipos habilitados
  hasMultiple, // Si hay múltiples tipos disponibles
} = useAppointmentTypes();
```

### `useBookingSettings()`

Hook para configuraciones de reservas:

```typescript
const {
  maxAdvanceDays,
  minAdvanceHours,
  allowSameDay,
  requirePhoneVerification,
  canBookToday, // Métodos de conveniencia
  canBookTomorrow,
  getMaxBookingDate, // Fecha máxima de reserva
  getMinBookingDate, // Fecha mínima de reserva
} = useBookingSettings();
```

## 🎯 Ejemplos de Uso

### Ejemplo 1: Mostrar solo tipos habilitados

```typescript
function AppointmentTypeSelector() {
  const { enabled } = useAppointmentTypes();

  return (
    <div>
      {enabled.map((type) => (
        <button key={type}>{type}</button>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Verificar funcionalidad específica

```typescript
function BookingForm() {
  const { canBookOnline, canBookHomeVisits } = useFeatureFlags();

  return (
    <div>
      {canBookOnline() && <OnlineBookingOption />}
      {canBookHomeVisits() && <HomeVisitOption />}
    </div>
  );
}
```

### Ejemplo 3: Usar configuraciones de tiempo

```typescript
function DatePicker() {
  const { getMaxBookingDate, getMinBookingDate } = useBookingSettings();

  return (
    <input
      type="date"
      min={getMinBookingDate().toISOString().split("T")[0]}
      max={getMaxBookingDate().toISOString().split("T")[0]}
    />
  );
}
```

## 🔄 Cambios Dinámicos

Para cambiar la configuración sin reiniciar la aplicación, puedes:

1. **Modificar el archivo de configuración** y guardar
2. **Usar variables de entorno** (próxima versión)
3. **API de configuración** (próxima versión)

## 🚨 Consideraciones Importantes

- **Los cambios requieren recarga** del componente para tomar efecto
- **Siempre proporciona valores por defecto** para evitar errores
- **Usa los hooks** en lugar de importar directamente la configuración
- **Mantén la configuración sincronizada** entre ambientes

## 📝 Próximas Mejoras

- [ ] Variables de entorno para configuración
- [ ] API REST para cambios dinámicos
- [ ] Panel de administración para feature flags
- [ ] Métricas y analytics de uso
- [ ] Rollback automático en caso de errores
