/**
 * Ejemplo de configuración para el sistema de terapeuta único
 *
 * Este archivo muestra cómo configurar el sistema para que funcione
 * con un solo terapeuta, relacionando todas las citas a él automáticamente.
 */

// ========================================
// CONFIGURACIÓN PASO A PASO
// ========================================

/**
 * PASO 1: Habilitar el modo de terapeuta único
 *
 * En lib/config/features.ts, cambiar:
 *
 * therapist: {
 *   singleTherapistMode: true,  // ← Cambiar a true
 *   defaultTherapistId: "tu-therapist-id-real", // ← Usar ID real del terapeuta
 * }
 */

/**
 * PASO 2: Configurar los datos del terapeuta
 *
 * En constants/index.ts, actualizar DEFAULT_THERAPIST con los datos reales:
 */
export const EXAMPLE_THERAPIST_CONFIG = {
  id: "therapist-123", // ID real del terapeuta en la base de datos
  firstName: "Dr. María",
  lastName: "González",
  email: "maria.gonzalez@clinica.com",
  phone: "+1234567890",
  specialties: ["Psicología Clínica", "Terapia Familiar"],
  bio: "Psicóloga clínica especializada en terapia familiar y de parejas...",
  profileImage: "/images/therapist-profile.jpg",
  qualifications: [
    "Licenciatura en Psicología",
    "Maestría en Terapia Familiar",
    "Certificación en Terapia de Parejas",
  ],
  languages: ["Español", "Inglés"],
  experience: "8+ años",
  rating: 4.8,
  totalPatients: 300,
};

/**
 * PASO 3: Usar el hook en los componentes
 *
 * Ejemplo de uso en un componente:
 */
export const EXAMPLE_COMPONENT_USAGE = `
import { useTherapistConfig } from "@/hooks";

function MyComponent() {
  const { 
    isSingleTherapistMode, 
    defaultTherapist, 
    getTherapistIdForBooking,
    shouldShowTherapistSelector 
  } = useTherapistConfig();

  if (isSingleTherapistMode) {
    // Mostrar información del terapeuta único
    return (
      <div>
        <h2>{defaultTherapist?.firstName} {defaultTherapist?.lastName}</h2>
        <p>{defaultTherapist?.bio}</p>
        {/* Las citas se asignarán automáticamente a este terapeuta */}
      </div>
    );
  }

  // Mostrar selector de terapeutas
  return <TherapistSelector />;
}
`;

/**
 * PASO 4: Configuración automática en el contexto de booking
 *
 * El contexto de booking automáticamente:
 * - Asigna el therapistId cuando se crea una cita
 * - Usa el terapeuta por defecto si está en modo único
 * - Permite selección manual si está en modo multi-terapeuta
 */

// ========================================
// BENEFICIOS DEL SISTEMA
// ========================================

export const BENEFITS = {
  automaticAssignment:
    "Todas las citas se asignan automáticamente al terapeuta configurado",
  simplifiedUI: "No se muestra selector de terapeuta en la interfaz",
  consistentData:
    "Todos los datos de citas están relacionados al mismo terapeuta",
  easyConfiguration:
    "Un solo lugar para cambiar la configuración del terapeuta",
  flexibleSwitching: "Fácil cambiar entre modo único y multi-terapeuta",
};

// ========================================
// CASOS DE USO
// ========================================

export const USE_CASES = {
  singlePractitioner: "Psicólogo independiente que trabaja solo",
  smallClinic: "Clínica pequeña con un solo terapeuta principal",
  specializedService: "Servicio especializado con un terapeuta específico",
  testing: "Entorno de pruebas con datos consistentes",
};

// ========================================
// CONFIGURACIÓN POR AMBIENTE
// ========================================

export const ENVIRONMENT_CONFIGS = {
  development: {
    singleTherapistMode: true,
    defaultTherapistId: "dev-therapist-123",
    description: "Modo desarrollo con terapeuta de prueba",
  },

  staging: {
    singleTherapistMode: true,
    defaultTherapistId: "staging-therapist-456",
    description: "Modo staging con terapeuta de pruebas",
  },

  production: {
    singleTherapistMode: false, // O true según la configuración real
    defaultTherapistId: null,
    description: "Modo producción - configurar según necesidades",
  },
};
