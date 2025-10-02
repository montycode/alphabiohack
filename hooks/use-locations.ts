"use client";

import { useCallback, useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/constants";
import type { Location } from "@/types";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // almacena errorCode cuando exista

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.LOCATIONS.BASE);
      const result = await response.json();

      if (!response.ok) {
        const code: string | undefined = result?.errorCode;
        setError(code || "internal_error");
        return [] as Location[];
      }

      setLocations(result.data);
      return result.data as Location[];
    } catch (err) {
      const code =
        (err as { errorCode?: string })?.errorCode || "internal_error";
      setError(code);
      console.error("Error fetching locations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocationById = useCallback(
    async (id: string): Promise<Location | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.LOCATIONS.BY_ID(id));
        const result = await response.json();

        if (!response.ok) {
          const code: string | undefined = result?.errorCode;
          setError(code || "internal_error");
          return null;
        }

        return result.data as Location;
      } catch (err) {
        const code =
          (err as { errorCode?: string })?.errorCode || "internal_error";
        setError(code);
        console.error("Error fetching location by id:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchLocations = useCallback(
    async (query: string): Promise<Location[]> => {
      try {
        setLoading(true);
        setError(null);

        // El endpoint soporta ?title o ?address; usamos title por defecto
        const url = `${API_ENDPOINTS.LOCATIONS.BASE}?title=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          const code: string | undefined = result?.errorCode;
          setError(code || "internal_error");
          return [] as Location[];
        }

        return result.data as Location[];
      } catch (err) {
        const code =
          (err as { errorCode?: string })?.errorCode || "internal_error";
        setError(code);
        console.error("Error searching locations:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLocationsNearby = useCallback(
    async (
      lat: number,
      lon: number,
      radius: number = 10
    ): Promise<Location[]> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          API_ENDPOINTS.LOCATIONS.NEARBY(lat, lon, radius)
        );
        const result = await response.json();

        if (!response.ok) {
          const code: string | undefined = result?.errorCode;
          setError(code || "internal_error");
          return [] as Location[];
        }

        return result.data as Location[];
      } catch (err) {
        const code =
          (err as { errorCode?: string })?.errorCode || "internal_error";
        setError(code);
        console.error("Error fetching nearby locations:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cargar ubicaciones automáticamente al montar el componente
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    fetchLocations,
    fetchLocationById,
    searchLocations,
    getLocationsNearby,
    refetch: fetchLocations,
  };
}
