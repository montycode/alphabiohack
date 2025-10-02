# Dropzone Component

Este componente proporciona una interfaz de usuario para subir archivos a Supabase Storage con soporte para drag & drop, validación de archivos y preview de imágenes.

## Características

- ✅ **Drag & Drop**: Arrastra y suelta archivos directamente
- ✅ **Validación de archivos**: Tipos MIME y tamaño máximo
- ✅ **Preview de imágenes**: Vista previa automática para archivos de imagen
- ✅ **Múltiples archivos**: Soporte para subir varios archivos
- ✅ **Estados de carga**: Indicadores visuales durante la subida
- ✅ **Manejo de errores**: Mensajes de error claros
- ✅ **Internacionalización**: Soporte para múltiples idiomas

## Uso básico

```tsx
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { useSupabaseUpload } from "@/hooks";

const MyComponent = () => {
  const uploadProps = useSupabaseUpload({
    bucketName: "my-bucket",
    path: "uploads",
    allowedMimeTypes: ["image/*"],
    maxFiles: 5,
    maxFileSize: 4 * 1024 * 1024, // 4MB
  });

  return (
    <Dropzone {...uploadProps}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
```

## Configuración

### Buckets de Storage

```tsx
import {
  STORAGE_BUCKETS,
  STORAGE_PATHS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES,
} from "@/lib/config/storage";

const uploadProps = useSupabaseUpload({
  bucketName: STORAGE_BUCKETS.LOCATIONS,
  path: STORAGE_PATHS.LOCATION_LOGOS,
  allowedMimeTypes: ALLOWED_MIME_TYPES.IMAGES,
  maxFiles: 1,
  maxFileSize: MAX_FILE_SIZES.MEDIUM,
});
```

### Tipos de archivos permitidos

- `ALLOWED_MIME_TYPES.IMAGES`: JPEG, PNG, WebP, SVG
- `ALLOWED_MIME_TYPES.DOCUMENTS`: PDF, DOC, DOCX
- `ALLOWED_MIME_TYPES.ALL`: Todos los tipos de imagen y PDF

### Tamaños máximos

- `MAX_FILE_SIZES.SMALL`: 1MB
- `MAX_FILE_SIZES.MEDIUM`: 4MB
- `MAX_FILE_SIZES.LARGE`: 10MB
- `MAX_FILE_SIZES.XLARGE`: 50MB

## Ejemplo completo

```tsx
"use client";

import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { useSupabaseUpload } from "@/hooks";
import {
  STORAGE_BUCKETS,
  STORAGE_PATHS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES,
} from "@/lib/config/storage";

const ImageUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const uploadProps = useSupabaseUpload({
    bucketName: STORAGE_BUCKETS.LOCATIONS,
    path: STORAGE_PATHS.LOCATION_GALLERY,
    allowedMimeTypes: ALLOWED_MIME_TYPES.IMAGES,
    maxFiles: 10,
    maxFileSize: MAX_FILE_SIZES.MEDIUM,
  });

  const handleUpload = async () => {
    await uploadProps.onUpload();
    if (uploadProps.successes.length > 0) {
      setUploadedFiles((prev) => [...prev, ...uploadProps.successes]);
    }
  };

  return (
    <div className="space-y-4">
      <Dropzone {...uploadProps}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {uploadProps.files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploadProps.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploadProps.loading ? "Subiendo..." : "Subir archivos"}
        </button>
      )}
    </div>
  );
};
```

## Configuración de Supabase Storage

Asegúrate de tener configurados los buckets en Supabase:

1. Ve a tu proyecto de Supabase
2. Navega a Storage
3. Crea los buckets necesarios:

   - `locations` (para logos y galería de ubicaciones)
   - `avatars` (para avatares de usuarios)
   - `documents` (para documentos)

4. Configura las políticas RLS según sea necesario:

```sql
-- Ejemplo de política para el bucket locations
CREATE POLICY "Users can upload to locations bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'locations');

CREATE POLICY "Users can view locations files" ON storage.objects
FOR SELECT USING (bucket_id = 'locations');
```

## Troubleshooting

### Error: "Bucket not found"

- Verifica que el bucket existe en Supabase Storage
- Asegúrate de que el nombre del bucket coincida exactamente

### Error: "Permission denied"

- Verifica las políticas RLS del bucket
- Asegúrate de que el usuario autenticado tiene permisos

### Error: "File too large"

- Verifica el tamaño máximo configurado
- Ajusta `maxFileSize` si es necesario

### Error: "Invalid file type"

- Verifica los tipos MIME permitidos
- Ajusta `allowedMimeTypes` si es necesario
