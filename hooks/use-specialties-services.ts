"use client";

import type { ServiceWithSpecialty, SpecialtyWithServices } from "@/types";
import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/constants";

export function useSpecialtiesAndServices() {
  const [specialtiesAndServices, setSpecialtiesAndServices] = useState<
    SpecialtyWithServices[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialtiesAndServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.SPECIALTIES_SERVICES.BASE);

        if (response.ok) {
          const data = await response.json();
          setSpecialtiesAndServices(data.specialtiesAndServices || []);
          setError(null);
        } else {
          setError("Error al cargar especialidades y servicios");
          setSpecialtiesAndServices([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setSpecialtiesAndServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialtiesAndServices();
  }, []);

  return {
    specialtiesAndServices: specialtiesAndServices,
    loading,
    error,
  };
}

export type { ServiceWithSpecialty, SpecialtyWithServices };
