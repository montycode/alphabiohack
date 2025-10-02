"use client";

import { useCallback, useEffect, useState } from "react";

import type { Service } from "@/types";

export function useServices(specialtyId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (specialtyId?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = specialtyId
        ? `/api/services?specialtyId=${specialtyId}`
        : "/api/services";

      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al cargar servicios");
      }

      setServices(result.data);
      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching services:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServiceById = useCallback(
    async (id: string): Promise<Service | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/services/${id}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Error al cargar servicio");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error fetching service by id:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchServices = useCallback(
    async (query: string): Promise<Service[]> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/services?search=${encodeURIComponent(query)}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Error al buscar servicios");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error searching services:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar servicios automáticamente cuando cambie la especialidad
  useEffect(() => {
    if (specialtyId) {
      fetchServices(specialtyId);
    } else {
      fetchServices();
    }
  }, [specialtyId, fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
    fetchServiceById,
    searchServices,
    refetch: () => fetchServices(specialtyId),
  };
}
