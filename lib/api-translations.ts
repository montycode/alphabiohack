/**
 * Traducciones para API Routes
 *
 * Este archivo contiene las traducciones para las respuestas de las API routes
 * ya que no pueden usar los hooks de next-intl directamente.
 */

export const API_TRANSLATIONS = {
  es: {
    contact: {
      success: "Mensaje enviado correctamente. Te responderemos pronto.",
      error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
      validation: {
        required: "El nombre, email y mensaje son obligatorios",
        invalidEmail: "El formato del email no es válido",
      },
      serverError:
        "Error interno del servidor. Por favor, inténtalo más tarde.",
    },
    booking: {
      success: "Reserva creada exitosamente",
      error: "Error al crear la reserva",
      validation: {
        required: "Todos los campos son obligatorios",
        invalidDate: "La fecha seleccionada no es válida",
        pastDate: "No puedes reservar en una fecha pasada",
      },
    },
    auth: {
      success: "Operación completada exitosamente",
      error: "Error de autenticación",
      validation: {
        invalidCredentials: "Credenciales inválidas",
        emailRequired: "El email es obligatorio",
        passwordRequired: "La contraseña es obligatoria",
      },
    },
  },
  en: {
    contact: {
      success: "Message sent successfully. We'll get back to you soon!",
      error: "Error sending message. Please try again.",
      validation: {
        required: "Name, email, and message are required",
        invalidEmail: "Invalid email format",
      },
      serverError: "Internal server error. Please try again later.",
    },
    booking: {
      success: "Booking created successfully",
      error: "Error creating booking",
      validation: {
        required: "All fields are required",
        invalidDate: "The selected date is not valid",
        pastDate: "You cannot book in a past date",
      },
    },
    auth: {
      success: "Operation completed successfully",
      error: "Authentication error",
      validation: {
        invalidCredentials: "Invalid credentials",
        emailRequired: "Email is required",
        passwordRequired: "Password is required",
      },
    },
  },
} as const;

export type SupportedLocale = keyof typeof API_TRANSLATIONS;
export type TranslationKey = "contact" | "booking" | "auth";

/**
 * Función helper para obtener traducciones en API routes
 */
export function getApiTranslation(
  locale: string = "es",
  category: TranslationKey,
  key: string
): string {
  // Normalizar el idioma para manejar es-MX, es-ES, etc.
  const normalizedLocale = locale.startsWith("en") ? "en" : "es";
  const translations = API_TRANSLATIONS[normalizedLocale];

  // Navegar por el objeto de traducciones usando notación de puntos
  const keys = key.split(".");
  let result: unknown = translations[category] as unknown;

  for (const k of keys) {
    if (
      result &&
      typeof result === "object" &&
      k in (result as Record<string, unknown>)
    ) {
      result = (result as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${category}.${key}`);
      return key; // Retornar la clave si no se encuentra la traducción
    }
  }

  return typeof result === "string" ? result : key;
}

/**
 * Función helper para respuestas de API con i18n
 */
export function createApiResponse(
  success: boolean,
  messageKey: string,
  category: TranslationKey,
  locale: string = "es",
  data?: unknown,
  status: number = 200
) {
  const message = getApiTranslation(locale, category, messageKey);

  return {
    success,
    message,
    ...(typeof data !== "undefined" ? { data } : {}),
    status,
  };
}
