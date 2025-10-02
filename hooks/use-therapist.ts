"use client";

import { useCallback, useEffect, useState } from "react";

import type { Therapist } from "@/types";

export function useTherapist(therapistId?: string) {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTherapist = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/therapists/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al cargar terapeuta");
      }

      setTherapist(result.data);
      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching therapist:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTherapistById = useCallback(
    async (id: string): Promise<Therapist | null> => {
      return await fetchTherapist(id);
    },
    [fetchTherapist]
  );

  // Cargar terapeuta automáticamente si se proporciona un ID
  useEffect(() => {
    if (therapistId) {
      fetchTherapist(therapistId);
    }
  }, [therapistId, fetchTherapist]);

  return {
    therapist,
    loading,
    error,
    fetchTherapist,
    fetchTherapistById,
    refetch: () =>
      therapistId ? fetchTherapist(therapistId) : Promise.resolve(null),
  };
}
