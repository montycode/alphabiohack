import type { ApiResponse, Service, ServiceStats } from "@/types/api";
import type { CreateServiceData, UpdateServiceData } from "@/types";

import { API_ENDPOINTS } from "@/constants";

// Cliente API para servicios
class ServicesApiClient {
  private baseUrl = API_ENDPOINTS.SERVICES.BASE;

  // Obtener todos los servicios
  async getAllServices(): Promise<Service[]> {
    const response = await fetch(this.baseUrl);
    const result: ApiResponse<Service[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al obtener servicios");
    }

    return result.data || [];
  }

  // Obtener servicios por especialidad
  async getServicesBySpecialty(specialtyId: string): Promise<Service[]> {
    const response = await fetch(
      API_ENDPOINTS.SERVICES.BY_SPECIALTY(specialtyId)
    );
    const result: ApiResponse<Service[]> = await response.json();

    if (!result.success) {
      throw new Error(
        result.error || "Error al obtener servicios de la especialidad"
      );
    }

    return result.data || [];
  }

  // Obtener servicio por ID
  async getServiceById(id: string): Promise<Service> {
    const response = await fetch(API_ENDPOINTS.SERVICES.BY_ID(id));
    const result: ApiResponse<Service> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al obtener servicio");
    }

    return result.data!;
  }

  // Crear servicio
  async createService(data: CreateServiceData): Promise<Service> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Service> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al crear servicio");
    }

    return result.data!;
  }

  // Actualizar servicio
  async updateService(id: string, data: UpdateServiceData): Promise<Service> {
    const response = await fetch(API_ENDPOINTS.SERVICES.BY_ID(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Service> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al actualizar servicio");
    }

    return result.data!;
  }

  // Eliminar servicio
  async deleteService(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.SERVICES.BY_ID(id), {
      method: "DELETE",
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al eliminar servicio");
    }
  }

  // Obtener estadísticas de servicios
  async getServiceStats(specialtyId?: string): Promise<ServiceStats> {
    const url = specialtyId
      ? `${API_ENDPOINTS.SERVICES.STATS}?specialtyId=${specialtyId}`
      : API_ENDPOINTS.SERVICES.STATS;

    const response = await fetch(url);
    const result: ApiResponse<ServiceStats> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Error al obtener estadísticas");
    }

    return result.data!;
  }
}

export const servicesApi = new ServicesApiClient();
