// Configuración para buckets de Supabase Storage
export const STORAGE_BUCKETS = {
  LOCATIONS: "locations",
  AVATARS: "avatars",
  DOCUMENTS: "documents",
} as const;

// Configuración para paths dentro de los buckets
export const STORAGE_PATHS = {
  LOCATION_LOGOS: "logos",
  LOCATION_GALLERY: "gallery",
  USER_AVATARS: "avatars",
  USER_DOCUMENTS: "documents",
} as const;

// Configuración para tipos de archivos permitidos
export const ALLOWED_MIME_TYPES = {
  IMAGES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ] as string[],
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as string[],
  ALL: ["image/*", "application/pdf"] as string[],
} as const;

// Configuración para tamaños máximos de archivos
export const MAX_FILE_SIZES = {
  SMALL: 1024 * 1024, // 1MB
  MEDIUM: 4 * 1024 * 1024, // 4MB
  LARGE: 10 * 1024 * 1024, // 10MB
  XLARGE: 50 * 1024 * 1024, // 50MB
} as const;
