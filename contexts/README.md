# 🧙‍♂️ Booking Wizard Context - Simple

Un contexto simple para manejar los datos del formulario del booking wizard.

## 📁 Archivos

```
contexts/
├── booking-wizard-context.tsx    # Contexto principal
└── index.ts                      # Exportaciones

components/booking/
├── booking-wizard-with-context.tsx   # Wrapper con provider
└── booking-wizard-example.tsx        # Ejemplo de uso
```

## 🚀 Uso Básico

### 1. Envolver con el Provider

```tsx
import { BookingWizardProvider } from "@/contexts";

function App() {
  return (
    <BookingWizardProvider>
      <YourComponent />
    </BookingWizardProvider>
  );
}
```

### 2. Usar el contexto

```tsx
import { useBookingWizard } from "@/contexts";

function MyComponent() {
  const { formData, updateFormData } = useBookingWizard();

  const handleUpdate = () => {
    updateFormData({
      appointmentType: BookingType.VideoCall,
      locationId: "location-123",
    });
  };

  return (
    <div>
      <p>Tipo: {formData.appointmentType}</p>
      <button onClick={handleUpdate}>Actualizar</button>
    </div>
  );
}
```

## 📊 Estructura de Datos

```typescript
interface BookingFormData {
  appointmentType: BookingType;
  locationId: string | null;
  specialtyId: string | null;
  selectedServiceIds: string[];
  selectedDate: Date | null;
  selectedTime: string;
  therapistId: string | null;
  basicInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    givenConsent: boolean;
    bookingNotes: string;
  };
  status: BookingStatus;
}
```

## 🎯 Funciones Disponibles

- `formData`: Los datos actuales del formulario
- `updateFormData(updates)`: Actualiza los datos (merge parcial)
- `resetFormData()`: Resetea a los valores por defecto

## 💡 Ejemplos de Uso

### Actualizar campos individuales

```tsx
updateFormData({ appointmentType: BookingType.VideoCall });
updateFormData({ locationId: "location-123" });
```

### Actualizar basicInfo

```tsx
updateFormData({
  basicInfo: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@email.com",
  },
});
```

### Actualizar múltiples campos

```tsx
updateFormData({
  appointmentType: BookingType.DirectVisit,
  locationId: "location-456",
  selectedDate: new Date(),
  basicInfo: {
    firstName: "María",
    givenConsent: true,
  },
});
```

## ✨ Características

- **Merge inteligente**: Los objetos se fusionan correctamente
- **TypeScript**: Tipado completo
- **Valores por defecto**: Configuración inicial automática
- **Simple**: Solo lo esencial para manejar datos
