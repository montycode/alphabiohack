"use client";

import { useCallback, useEffect, useState } from "react";

import type { Specialty } from "@/types";

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/specialties");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al cargar especialidades");
      }

      setSpecialties(result.data);
      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching specialties:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSpecialtyById = useCallback(
    async (id: string): Promise<Specialty | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/specialties/${id}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Error al cargar especialidad");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error fetching specialty by id:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchSpecialties = useCallback(
    async (query: string): Promise<Specialty[]> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/specialties?search=${encodeURIComponent(query)}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Error al buscar especialidades");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error searching specialties:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar especialidades automáticamente al montar el componente
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  return {
    specialties,
    loading,
    error,
    fetchSpecialties,
    fetchSpecialtyById,
    searchSpecialties,
    refetch: fetchSpecialties,
  };
}
