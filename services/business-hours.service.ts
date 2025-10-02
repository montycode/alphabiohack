import type {
  CreateBusinessHoursData,
  CreateTimeSlotData,
  UpdateBusinessHoursData,
} from "@/types";

import { DaysOfWeek } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Función auxiliar para convertir tiempo a minutos
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Crear horario de atención
export const createBusinessHours = async (data: CreateBusinessHoursData) => {
  try {
    // Reutiliza si existe por unique(locationId, dayOfWeek) y activa según data.isActive
    const existing = await prisma.businessHours.findFirst({
      where: { locationId: data.locationId, dayOfWeek: data.dayOfWeek },
      include: { location: true },
    });
    if (existing) {
      const ensureActive = data.isActive ?? true;
      if (existing.isActive !== ensureActive) {
        return await prisma.businessHours.update({
          where: { id: existing.id },
          data: { isActive: ensureActive },
          include: { location: true },
        });
      }
      return existing;
    }
    return await prisma.businessHours.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        locationId: data.locationId,
        isActive: data.isActive ?? true,
      },
      include: { location: true },
    });
  } catch (error) {
    console.error("Error creating business hours:", error);
    throw error;
  }
};

// Crear múltiples horarios para una ubicación
export const createMultipleBusinessHours = async (
  locationId: string,
  hoursData: Omit<CreateBusinessHoursData, "locationId">[]
) => {
  try {
    // Inserción idempotente: crea uno por uno reutilizando existentes
    const results = [] as Array<{ id: string }>;
    for (const hour of hoursData) {
      const created = await createBusinessHours({ ...hour, locationId });
      results.push({ id: created.id });
    }
    return { count: results.length };
  } catch (error) {
    console.error("Error creating multiple business hours:", error);
    throw error;
  }
};

// Obtener horario por ID
export const getBusinessHoursById = async (id: string) => {
  try {
    const businessHours = await prisma.businessHours.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });
    return businessHours;
  } catch (error) {
    console.error("Error getting business hours by id:", error);
    throw error;
  }
};

// Obtener todos los horarios de una ubicación
export const getBusinessHoursByLocation = async (locationId: string) => {
  try {
    const businessHours = await prisma.businessHours.findMany({
      where: { locationId },
      include: {
        location: true,
      },
      orderBy: { dayOfWeek: "asc" },
    });
    return businessHours;
  } catch (error) {
    console.error("Error getting business hours by location:", error);
    throw error;
  }
};

// Obtener horario por día de la semana y ubicación
export const getBusinessHoursByDayAndLocation = async (
  locationId: string,
  dayOfWeek: DaysOfWeek
) => {
  try {
    const businessHours = await prisma.businessHours.findFirst({
      where: {
        locationId,
        dayOfWeek,
      },
      include: {
        location: true,
      },
    });
    return businessHours;
  } catch (error) {
    console.error("Error getting business hours by day and location:", error);
    throw error;
  }
};

// Obtener todos los horarios
export const getAllBusinessHours = async () => {
  try {
    const businessHours = await prisma.businessHours.findMany({
      include: {
        location: true,
      },
      orderBy: [{ locationId: "asc" }, { dayOfWeek: "asc" }],
    });
    return businessHours;
  } catch (error) {
    console.error("Error getting all business hours:", error);
    throw error;
  }
};

// Verificar si una ubicación está abierta en un día y hora específicos
export const isLocationOpen = async (
  locationId: string,
  dayOfWeek: DaysOfWeek,
  time: string
) => {
  try {
    const businessHours = await prisma.businessHours.findFirst({
      where: {
        locationId,
        dayOfWeek,
        isActive: true,
      },
      include: {
        timeSlots: {
          where: { isActive: true },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!businessHours || !businessHours.timeSlots.length) return false;

    const requestedTime = timeToMinutes(time);

    // Verificar si el tiempo solicitado está dentro de algún slot de tiempo
    return businessHours.timeSlots.some((slot) => {
      const startTime = timeToMinutes(slot.startTime);
      const endTime = timeToMinutes(slot.endTime);
      return requestedTime >= startTime && requestedTime <= endTime;
    });
  } catch (error) {
    console.error("Error checking if location is open:", error);
    throw error;
  }
};

// Obtener horarios disponibles para un día específico
export const getAvailableHours = async (
  locationId: string,
  dayOfWeek: DaysOfWeek
) => {
  try {
    const businessHours = await prisma.businessHours.findFirst({
      where: {
        locationId,
        dayOfWeek,
      },
      include: {
        timeSlots: {
          where: { isActive: true },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!businessHours) return null;

    // Obtener el primer y último slot de tiempo
    const timeSlots = businessHours.timeSlots || [];
    if (timeSlots.length === 0) return null;

    const firstSlot = timeSlots[0];
    const lastSlot = timeSlots[timeSlots.length - 1];

    return {
      startTime: firstSlot.startTime,
      endTime: lastSlot.endTime,
      isOpen: true,
    };
  } catch (error) {
    console.error("Error getting available hours:", error);
    throw error;
  }
};

// Actualizar horario
export const updateBusinessHours = async (
  id: string,
  data: UpdateBusinessHoursData
) => {
  try {
    const businessHours = await prisma.businessHours.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        isActive: data.isActive,
      },
      include: {
        location: true,
      },
    });
    return businessHours;
  } catch (error) {
    console.error("Error updating business hours:", error);
    throw error;
  }
};

// Crear time slot idempotente (respeta unicidad)
export const createTimeSlot = async (data: CreateTimeSlotData) => {
  try {
    const existing = await prisma.timeSlot.findFirst({
      where: {
        businessHoursId: data.businessHoursId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
      include: {
        businessHours: { include: { location: true } },
      },
    });
    if (existing) return existing;

    return await prisma.timeSlot.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive ?? true,
        businessHoursId: data.businessHoursId,
      },
      include: {
        businessHours: { include: { location: true } },
      },
    });
  } catch (error) {
    console.error("Error creating time slot:", error);
    throw error;
  }
};

// Eliminar horario
export const deleteBusinessHours = async (id: string) => {
  try {
    const businessHours = await prisma.businessHours.delete({
      where: { id },
    });
    return businessHours;
  } catch (error) {
    console.error("Error deleting business hours:", error);
    throw error;
  }
};

// Eliminar todos los horarios de una ubicación
export const deleteBusinessHoursByLocation = async (locationId: string) => {
  try {
    const result = await prisma.businessHours.deleteMany({
      where: { locationId },
    });
    return result;
  } catch (error) {
    console.error("Error deleting business hours by location:", error);
    throw error;
  }
};

// Obtener horarios de la semana actual para una ubicación
export const getCurrentWeekHours = async (locationId: string) => {
  try {
    const businessHours = await prisma.businessHours.findMany({
      where: { locationId },
      orderBy: { dayOfWeek: "asc" },
    });

    // Crear un objeto con los horarios organizados por día
    const weekHours: Record<
      DaysOfWeek,
      { startTime: string; endTime: string } | null
    > = {
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      Saturday: null,
      Sunday: null,
    };

    businessHours.forEach((hour) => {
      // Verificamos si las propiedades existen antes de asignar
      weekHours[hour.dayOfWeek] = {
        startTime: (hour as any).startTime ?? "",
        endTime: (hour as any).endTime ?? "",
      };
    });

    return weekHours;
  } catch (error) {
    console.error("Error getting current week hours:", error);
    throw error;
  }
};
