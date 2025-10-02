import type { CreateServiceData, UpdateServiceData } from "@/types";

import { prisma } from "@/lib/prisma";

// Crear servicio
export const createService = async (data: CreateServiceData) => {
  try {
    const service = await prisma.service.create({
      data: {
        description: data.description,
        cost: data.cost,
        duration: data.duration,
        specialtyId: data.specialtyId,
      },
      include: {
        specialty: true,
      },
    });
    return service;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

// Crear múltiples servicios
export const createMultipleServices = async (
  servicesData: CreateServiceData[]
) => {
  try {
    const services = await prisma.service.createMany({
      data: servicesData,
    });
    return services;
  } catch (error) {
    console.error("Error creating multiple services:", error);
    throw error;
  }
};

// Obtener servicio por ID
export const getServiceById = async (id: string) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        specialty: true,
      },
    });
    return service;
  } catch (error) {
    console.error("Error getting service by id:", error);
    throw error;
  }
};

// Obtener todos los servicios
export const getAllServices = async () => {
  try {
    const services = await prisma.service.findMany({
      include: {
        specialty: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return services;
  } catch (error) {
    console.error("Error getting all services:", error);
    throw error;
  }
};

// Obtener servicios por especialidad
export const getServicesBySpecialty = async (specialtyId: string) => {
  try {
    const services = await prisma.service.findMany({
      where: { specialtyId },
      include: {
        specialty: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return services;
  } catch (error) {
    console.error("Error getting services by specialty:", error);
    throw error;
  }
};

// Buscar servicios por descripción
export const searchServicesByDescription = async (searchTerm: string) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      include: {
        specialty: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return services;
  } catch (error) {
    console.error("Error searching services by description:", error);
    throw error;
  }
};

// Buscar servicios por rango de precio
export const getServicesByPriceRange = async (
  minPrice: number,
  maxPrice: number
) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        cost: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      include: {
        specialty: true,
      },
      orderBy: { cost: "asc" },
    });
    return services;
  } catch (error) {
    console.error("Error getting services by price range:", error);
    throw error;
  }
};

// Buscar servicios por duración
export const getServicesByDuration = async (duration: number) => {
  try {
    const services = await prisma.service.findMany({
      where: { duration },
      include: {
        specialty: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return services;
  } catch (error) {
    console.error("Error getting services by duration:", error);
    throw error;
  }
};

// Buscar servicios por rango de duración
export const getServicesByDurationRange = async (
  minDuration: number,
  maxDuration: number
) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        duration: {
          gte: minDuration,
          lte: maxDuration,
        },
      },
      include: {
        specialty: true,
      },
      orderBy: { duration: "asc" },
    });
    return services;
  } catch (error) {
    console.error("Error getting services by duration range:", error);
    throw error;
  }
};

// Obtener servicios más populares (por precio)
export const getMostPopularServices = async (limit: number = 10) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        specialty: true,
      },
      orderBy: { cost: "asc" },
      take: limit,
    });
    return services;
  } catch (error) {
    console.error("Error getting most popular services:", error);
    throw error;
  }
};

// Obtener servicios más caros
export const getMostExpensiveServices = async (limit: number = 10) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        specialty: true,
      },
      orderBy: { cost: "desc" },
      take: limit,
    });
    return services;
  } catch (error) {
    console.error("Error getting most expensive services:", error);
    throw error;
  }
};

// Obtener servicios más baratos
export const getCheapestServices = async (limit: number = 10) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        specialty: true,
      },
      orderBy: { cost: "asc" },
      take: limit,
    });
    return services;
  } catch (error) {
    console.error("Error getting cheapest services:", error);
    throw error;
  }
};

// Actualizar servicio
export const updateService = async (id: string, data: UpdateServiceData) => {
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        description: data.description,
        cost: data.cost,
        duration: data.duration,
        specialtyId: data.specialtyId,
      },
      include: {
        specialty: true,
      },
    });
    return service;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

// Eliminar servicio
export const deleteService = async (id: string) => {
  try {
    const service = await prisma.service.delete({
      where: { id },
    });
    return service;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Eliminar servicios por especialidad
export const deleteServicesBySpecialty = async (specialtyId: string) => {
  try {
    const result = await prisma.service.deleteMany({
      where: { specialtyId },
    });
    return result;
  } catch (error) {
    console.error("Error deleting services by specialty:", error);
    throw error;
  }
};

// Obtener estadísticas de servicios
export const getServiceStats = async () => {
  try {
    const totalServices = await prisma.service.count();
    const averageCost = await prisma.service.aggregate({
      _avg: {
        cost: true,
      },
    });
    const averageDuration = await prisma.service.aggregate({
      _avg: {
        duration: true,
      },
    });
    const minCost = await prisma.service.aggregate({
      _min: {
        cost: true,
      },
    });
    const maxCost = await prisma.service.aggregate({
      _max: {
        cost: true,
      },
    });

    return {
      totalServices,
      averageCost: averageCost._avg.cost || 0,
      averageDuration: averageDuration._avg.duration || 0,
      minCost: minCost._min.cost || 0,
      maxCost: maxCost._max.cost || 0,
    };
  } catch (error) {
    console.error("Error getting service stats:", error);
    throw error;
  }
};

// Obtener estadísticas por especialidad
export const getServiceStatsBySpecialty = async (specialtyId: string) => {
  try {
    const services = await prisma.service.findMany({
      where: { specialtyId },
    });

    if (services.length === 0) {
      return {
        totalServices: 0,
        averageCost: 0,
        averageDuration: 0,
        minCost: 0,
        maxCost: 0,
      };
    }

    const totalCost = services.reduce((sum, service) => sum + service.cost, 0);
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0
    );
    const costs = services.map((service) => service.cost);

    return {
      totalServices: services.length,
      averageCost: totalCost / services.length,
      averageDuration: totalDuration / services.length,
      minCost: Math.min(...costs),
      maxCost: Math.max(...costs),
    };
  } catch (error) {
    console.error("Error getting service stats by specialty:", error);
    throw error;
  }
};

// Verificar si un servicio existe
export const serviceExists = async (
  description: string,
  specialtyId: string
) => {
  try {
    const count = await prisma.service.count({
      where: {
        description: {
          equals: description,
          mode: "insensitive",
        },
        specialtyId,
      },
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking if service exists:", error);
    throw error;
  }
};
