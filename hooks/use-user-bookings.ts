"use client";

import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/constants";
import type { UserBooking } from "@/types";
import { UserRole } from "@prisma/client";
import { useUser } from "@/contexts/user-context";

export function useUserBookings() {
  const { prismaUser, isAuthenticated } = useUser();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !prismaUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Determinar si el usuario es terapeuta
        const isTherapist = prismaUser.role.includes(UserRole.Therapist);
        const apiEndpoint = isTherapist
          ? API_ENDPOINTS.THERAPISTS.BOOKINGS
          : API_ENDPOINTS.USER.BOOKINGS;

        const response = await fetch(apiEndpoint);

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
  }, [isAuthenticated, prismaUser]);

  return {
    bookings,
    loading,
    error,
    isTherapist: prismaUser?.role?.includes(UserRole.Therapist) || false,
  };
}
