# Configuración de Supabase Storage para Upload de Archivos

## Problema

Error: `Failed to upload: new row violates row-level security policy`

Este error ocurre porque los buckets de Supabase Storage no tienen las políticas RLS (Row Level Security) configuradas correctamente.

## Solución

### Paso 1: Ejecutar las políticas SQL

1. Ve a tu **Supabase Dashboard**
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `docs/supabase-storage-policies.sql`
4. Ejecuta el script completo

### Paso 2: Verificar que los buckets existen

En el **Storage** section de tu dashboard, deberías ver estos buckets:

- `locations` - Para logos y galería de ubicaciones
- `avatars` - Para avatares de usuarios
- `documents` - Para documentos de usuarios

### Paso 3: Verificar las políticas

En **Authentication > Policies**, deberías ver las políticas para `storage.objects`:

- `Allow authenticated users to upload to locations bucket`
- `Allow authenticated users to view locations files`
- `Allow authenticated users to update locations files`
- `Allow authenticated users to delete locations files`

Y similares para `avatars` y `documents`.

## Estructura de archivos esperada

```
storage/
├── locations/
│   ├── logos/
│   │   └── [archivos de logo]
│   └── gallery/
│       └── [archivos de galería]
├── avatars/
│   └── [archivos de avatar]
└── documents/
    └── [archivos de documentos]
```

## Configuración adicional (opcional)

### Buckets públicos vs privados

Si quieres que los archivos sean **públicos** (accesibles sin autenticación):

- Los buckets ya están configurados como públicos
- Las políticas públicas están incluidas en el script

Si quieres que los archivos sean **privados**:

- Ejecuta este comando adicional:

```sql
UPDATE storage.buckets
SET public = false
WHERE id IN ('locations', 'avatars', 'documents');
```

### Restricciones adicionales

Si quieres restricciones más específicas (por ejemplo, solo el propietario puede modificar sus archivos):

```sql
-- Política más restrictiva para locations
DROP POLICY IF EXISTS "Allow authenticated users to update locations files" ON storage.objects;
CREATE POLICY "Allow users to update their own location files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'locations' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'locations' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Troubleshooting

### Error: "bucket does not exist"

- Verifica que el bucket se creó correctamente
- Ejecuta el comando de creación del bucket manualmente

### Error: "policy already exists"

- Esto es normal si ejecutas el script múltiples veces
- Las políticas se actualizarán automáticamente

### Error: "permission denied"

- Verifica que el usuario esté autenticado
- Verifica que las políticas RLS estén habilitadas en `storage.objects`

### Error: "file too large"

- Verifica la configuración de `MAX_FILE_SIZES` en `lib/config/storage.ts`
- Ajusta las políticas si es necesario

## Verificación

Para verificar que todo funciona:

1. **Autentica un usuario** en tu aplicación
2. **Intenta subir un archivo** en el formulario de ubicaciones
3. **Verifica en Storage** que el archivo aparezca en `locations/logos/`
4. **Verifica que el logo se muestre** en el formulario

## Notas importantes

- Las políticas RLS son **obligatorias** en Supabase Storage
- Sin políticas correctas, **ningún upload funcionará**
- Las políticas se aplican a **todos los usuarios**, incluyendo administradores
- Siempre prueba con un usuario autenticado, no con el service role
