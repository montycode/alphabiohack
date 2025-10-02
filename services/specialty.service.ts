import type { CreateSpecialtyData, UpdateSpecialtyData } from "@/types";

import { prisma } from "@/lib/prisma";

// Crear especialidad
export const createSpecialty = async (data: CreateSpecialtyData) => {
  try {
    const specialty = await prisma.specialty.create({
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        services: true,
      },
    });
    return specialty;
  } catch (error) {
    console.error("Error creating specialty:", error);
    throw error;
  }
};

// Obtener especialidad por ID
export const getSpecialtyById = async (id: string) => {
  try {
    const specialty = await prisma.specialty.findUnique({
      where: { id },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return specialty;
  } catch (error) {
    console.error("Error getting specialty by id:", error);
    throw error;
  }
};

// Obtener especialidad por nombre
export const getSpecialtyByName = async (name: string) => {
  try {
    const specialty = await prisma.specialty.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return specialty;
  } catch (error) {
    console.error("Error getting specialty by name:", error);
    throw error;
  }
};

// Obtener todas las especialidades
export const getAllSpecialties = async () => {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return specialties;
  } catch (error) {
    console.error("Error getting all specialties:", error);
    throw error;
  }
};

// Buscar especialidades por nombre
export const searchSpecialtiesByName = async (searchTerm: string) => {
  try {
    const specialties = await prisma.specialty.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return specialties;
  } catch (error) {
    console.error("Error searching specialties:", error);
    throw error;
  }
};

// Obtener especialidades con servicios
export const getSpecialtiesWithServices = async () => {
  try {
    const specialties = await prisma.specialty.findMany({
      where: {
        services: {
          some: {},
        },
      },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return specialties;
  } catch (error) {
    console.error("Error getting specialties with services:", error);
    throw error;
  }
};

// Obtener especialidades populares (con más servicios)
export const getPopularSpecialties = async (limit: number = 10) => {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        services: true,
        _count: {
          select: {
            services: true,
          },
        },
      },
      orderBy: {
        services: {
          _count: "desc",
        },
      },
      take: limit,
    });
    return specialties;
  } catch (error) {
    console.error("Error getting popular specialties:", error);
    throw error;
  }
};

// Actualizar especialidad
export const updateSpecialty = async (
  id: string,
  data: UpdateSpecialtyData
) => {
  try {
    const specialty = await prisma.specialty.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        services: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return specialty;
  } catch (error) {
    console.error("Error updating specialty:", error);
    throw error;
  }
};

// Eliminar especialidad
export const deleteSpecialty = async (id: string) => {
  try {
    const specialty = await prisma.specialty.delete({
      where: { id },
    });
    return specialty;
  } catch (error) {
    console.error("Error deleting specialty:", error);
    throw error;
  }
};

// Obtener estadísticas de especialidad
export const getSpecialtyStats = async (id: string) => {
  try {
    const specialty = await prisma.specialty.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!specialty) return null;

    const totalServices = specialty.services.length;
    const totalCost = specialty.services.reduce(
      (sum, service) => sum + service.cost,
      0
    );
    const averageCost = totalServices > 0 ? totalCost / totalServices : 0;
    const totalDuration = specialty.services.reduce(
      (sum, service) => sum + service.duration,
      0
    );
    const averageDuration =
      totalServices > 0 ? totalDuration / totalServices : 0;

    return {
      ...specialty,
      stats: {
        totalServices,
        totalCost,
        averageCost,
        totalDuration,
        averageDuration,
      },
    };
  } catch (error) {
    console.error("Error getting specialty stats:", error);
    throw error;
  }
};

// Verificar si una especialidad existe
export const specialtyExists = async (name: string) => {
  try {
    const count = await prisma.specialty.count({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking if specialty exists:", error);
    throw error;
  }
};
