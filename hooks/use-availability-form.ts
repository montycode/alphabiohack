import type {
  AvailabilityFormData,
  DaySchedule,
  TimeSlot as TimeSlotType,
} from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { API_ENDPOINTS } from "@/constants";
import { DaysOfWeek } from "@prisma/client";
import { useAvailabilityOperations } from "./use-availability-operations";
import { useBusinessHours } from "./use-business-hours";

// UI (toasts) se maneja en los handlers/callers

export function useAvailabilityForm(locationId: string) {
  const {
    businessHours,
    loading: fetchLoading,
    refetch,
  } = useBusinessHours(locationId);
  const {
    deleteTimeSlot,
    loading: operationsLoading,
    error,
  } = useAvailabilityOperations();

  const [days, setDays] = useState<DaySchedule[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingSlots, setDeletingSlots] = useState<Set<string>>(new Set());
  const toggleTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Inicializar días de la semana
  useEffect(() => {
    if (!isInitialized) {
      const initialDays: DaySchedule[] = [
        DaysOfWeek.Monday,
        DaysOfWeek.Tuesday,
        DaysOfWeek.Wednesday,
        DaysOfWeek.Thursday,
        DaysOfWeek.Friday,
        DaysOfWeek.Saturday,
        DaysOfWeek.Sunday,
      ].map((day) => ({
        dayOfWeek: day,
        isEnabled: false,
        timeSlots: [],
        businessHoursId: undefined,
      }));
      setDays(initialDays);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Cargar horarios existentes
  useEffect(() => {
    if (businessHours && businessHours.length > 0 && !hasChanges) {
      const updatedDays = days.map((day) => {
        const dayHours = businessHours.find(
          (bh) => bh.dayOfWeek === day.dayOfWeek
        );

        const newDay = {
          ...day,
          isEnabled: dayHours ? dayHours.isActive : false,
          businessHoursId: dayHours?.id,
          timeSlots:
            dayHours?.timeSlots?.map((ts: TimeSlotType) => ({
              id: ts.id,
              startTime: ts.startTime,
              endTime: ts.endTime,
              isActive: ts.isActive,
              businessHoursId: ts.businessHoursId,
            })) || [],
        };

        return newDay;
      });

      setDays(updatedDays);
    }
  }, [businessHours, hasChanges]);

  // Cleanup timeouts al desmontar
  useEffect(() => {
    return () => {
      toggleTimeoutRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      toggleTimeoutRef.current.clear();
    };
  }, []);

  const handleToggleDay = useCallback(
    (dayOfWeek: DaysOfWeek, enabled: boolean) => {
      const dayKey = `${dayOfWeek}-${enabled}`;

      // Limpiar timeout anterior si existe
      const existingTimeout = toggleTimeoutRef.current.get(dayKey);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Crear nuevo timeout para debounce
      const timeoutId = setTimeout(() => {
        setDays((prevDays) =>
          prevDays.map((day) => {
            if (day.dayOfWeek === dayOfWeek) {
              const currentDay = day;

              const updatedDay = {
                ...day,
                isEnabled: enabled,
                timeSlots:
                  enabled ?
                    currentDay.timeSlots.length > 0 ?
                      currentDay.timeSlots
                    : []
                  : currentDay.isEnabled && !enabled ?
                    [] // Solo limpiar si se pasa de habilitado a deshabilitado
                  : currentDay.timeSlots, // Mantener slots si ya estaba deshabilitado
              };

              const action =
                enabled ? "Habilitando - manteniendo slots existentes"
                : currentDay.isEnabled && !enabled ?
                  "Deshabilitando - limpiando slots (cambio de estado)"
                : "Ya deshabilitado - manteniendo slots existentes";

              return updatedDay;
            }
            return day;
          })
        );
        setHasChanges(true);

        // Limpiar el timeout del mapa
        toggleTimeoutRef.current.delete(dayKey);
      }, 100); // Debounce de 100ms

      // Guardar el timeout en el mapa
      toggleTimeoutRef.current.set(dayKey, timeoutId);
    },
    [hasChanges]
  );

  const handleAddTimeSlot = (dayOfWeek: DaysOfWeek) => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek ?
          {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                startTime: "09:00",
                endTime: "17:00",
                isActive: true,
              },
            ],
          }
        : day
      )
    );
    setHasChanges(true);
  };

  const handleRemoveTimeSlot = async (
    dayOfWeek: DaysOfWeek,
    slotIndex: number
  ) => {
    const day = days.find((d) => d.dayOfWeek === dayOfWeek);
    const slot = day?.timeSlots[slotIndex];

    if (!slot) return;

    if (slot.id) {
      const slotKey = `${dayOfWeek}-${slotIndex}`;
      setDeletingSlots((prev) => new Set(prev).add(slotKey));

      try {
        await deleteTimeSlot(slot.id);
        setDays((prevDays) =>
          prevDays.map((day) =>
            day.dayOfWeek === dayOfWeek ?
              {
                ...day,
                timeSlots: day.timeSlots.filter(
                  (_, index) => index !== slotIndex
                ),
              }
            : day
          )
        );
        await refetch();
      } catch (err) {
        console.error("Error removing time slot:", err);
      } finally {
        setDeletingSlots((prev) => {
          const newSet = new Set(prev);
          newSet.delete(slotKey);
          return newSet;
        });
      }
    } else {
      setDays((prevDays) =>
        prevDays.map((day) =>
          day.dayOfWeek === dayOfWeek ?
            {
              ...day,
              timeSlots: day.timeSlots.filter(
                (_, index) => index !== slotIndex
              ),
            }
          : day
        )
      );
      setHasChanges(true);
    }
  };

  const handleTimeSlotChange = (
    dayOfWeek: DaysOfWeek,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const day = days.find((d) => d.dayOfWeek === dayOfWeek);
    const slot = day?.timeSlots[slotIndex];

    if (!slot) return;

    const updatedSlot = { ...slot, [field]: value };

    // Validar que el horario sea válido
    if (!isValidTimeSlot(updatedSlot.startTime, updatedSlot.endTime)) {
      return;
    }

    setDays((prevDays) =>
      prevDays.map((day) =>
        day.dayOfWeek === dayOfWeek ?
          {
            ...day,
            timeSlots: day.timeSlots.map((s, index) =>
              index === slotIndex ? updatedSlot : s
            ),
          }
        : day
      )
    );
    setHasChanges(true);
  };

  const handleSave = async (onSave?: (data: AvailabilityFormData) => void) => {
    setIsSaving(true);
    try {
      for (const day of days) {
        if (day.isEnabled) {
          let businessHoursId = day.businessHoursId;

          if (!businessHoursId) {
            const businessHoursData = {
              dayOfWeek: day.dayOfWeek,
              locationId,
              isActive: true,
            };

            const response = await fetch(
              API_ENDPOINTS.BUSINESS_HOURS.BY_LOCATION(locationId),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(businessHoursData),
              }
            );

            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || "Error creating business hours");
            }

            businessHoursId = result.data.id;
          } else {
            await fetch(API_ENDPOINTS.BUSINESS_HOURS.BY_ID(businessHoursId), {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isActive: true }),
            });
          }

          const updatedSlots: TimeSlotType[] = [];
          for (const slot of day.timeSlots) {
            if (slot.id) {
              await fetch(API_ENDPOINTS.TIME_SLOTS.BY_ID(slot.id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  isActive: slot.isActive ?? true,
                }),
              });
              updatedSlots.push(slot);
            } else {
              const slotData = {
                startTime: slot.startTime,
                endTime: slot.endTime,
                businessHoursId,
                isActive: slot.isActive ?? true,
              };

              const response = await fetch(API_ENDPOINTS.TIME_SLOTS.BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(slotData),
              });

              const result = await response.json();
              if (response.ok && result.data) {
                updatedSlots.push({
                  ...slot,
                  id: result.data.id,
                  businessHoursId: result.data.businessHoursId,
                });
              }
            }
          }

          setDays((prevDays) =>
            prevDays.map((d) =>
              d.dayOfWeek === day.dayOfWeek ?
                {
                  ...d,
                  businessHoursId,
                  timeSlots: updatedSlots,
                }
              : d
            )
          );
        } else if (day.businessHoursId) {
          await fetch(API_ENDPOINTS.BUSINESS_HOURS.BY_ID(day.businessHoursId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: false }),
          });
        }
      }

      setHasChanges(false);

      if (onSave) {
        const formData: AvailabilityFormData = {
          locationId,
          days,
        };
        onSave(formData);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    days,
    hasChanges,
    isSaving,
    deletingSlots,
    fetchLoading,
    operationsLoading,
    error,
    handleToggleDay,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleTimeSlotChange,
    handleSave,
  };
}

// Helper function
function isValidTimeSlot(startTime: string, endTime: string): boolean {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return start < end;
}
