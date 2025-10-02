// Interfaz para crear un nuevo servicio
export interface CreateServiceData {
  description: string;
  cost: number;
  duration: number; // Duración en minutos
  specialtyId: string;
}

// Interfaz para actualizar un servicio existente
export interface UpdateServiceData {
  description?: string;
  cost?: number;
  duration?: number; // Duración en minutos
  specialtyId?: string;
}
