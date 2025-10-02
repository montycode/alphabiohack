"use client";

import {
  getDefaultTherapistId,
  hasDefaultTherapist,
  isSingleTherapistModeEnabled,
} from "@/lib/config/features";

import { DEFAULT_THERAPIST } from "@/constants";

/**
 * Hook para acceder a la configuración del terapeuta
 *
 * Proporciona información sobre el modo de terapeuta único y
 * los datos del terapeuta por defecto cuando está habilitado.
 */
export function useTherapistConfig() {
  const isSingleMode = isSingleTherapistModeEnabled();
  const defaultTherapistId = getDefaultTherapistId();
  const hasDefault = hasDefaultTherapist();

  return {
    // Estado del modo de terapeuta único
    isSingleTherapistMode: isSingleMode,

    // ID del terapeuta por defecto
    defaultTherapistId,

    // Si hay un terapeuta por defecto configurado
    hasDefaultTherapist: hasDefault,

    // Datos del terapeuta por defecto (solo si está habilitado)
    defaultTherapist: isSingleMode ? DEFAULT_THERAPIST : null,

    // Función para obtener el ID del terapeuta a usar en las citas
    getTherapistIdForBooking: (): string | null => {
      if (isSingleMode && defaultTherapistId) {
        return defaultTherapistId;
      }
      return null; // En modo multi-terapeuta, se selecciona dinámicamente
    },

    // Función para verificar si se debe mostrar selector de terapeuta
    shouldShowTherapistSelector: (): boolean => {
      return !isSingleMode;
    },
  };
}

/**
 * Tipo para los datos del terapeuta por defecto
 */
export type DefaultTherapist = typeof DEFAULT_THERAPIST;
