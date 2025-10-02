// Interfaz para crear una nueva especialidad
export interface CreateSpecialtyData {
  name: string;
  description?: string;
}

// Interfaz para actualizar una especialidad existente
export interface UpdateSpecialtyData {
  name?: string;
  description?: string;
}
