"use client";

import { useEffect, useState } from "react";

import type { TherapistBooking } from "@/types";

export function useTherapistBookings() {
  const [bookings, setBookings] = useState<TherapistBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/therapists/bookings");

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
          setError(null);
        } else {
          setError("Error al cargar las citas");
          setBookings([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
  };
}
