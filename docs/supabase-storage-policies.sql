-- Políticas RLS para Supabase Storage
-- Ejecutar estos comandos en el SQL Editor de Supabase Dashboard

-- 1. Crear el bucket 'locations' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('locations', 'locations', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear el bucket 'avatars' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Crear el bucket 'documents' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Políticas para el bucket 'locations'
-- Permitir a usuarios autenticados subir archivos
CREATE POLICY "Allow authenticated users to upload to locations bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'locations');

-- Permitir a usuarios autenticados ver archivos
CREATE POLICY "Allow authenticated users to view locations files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'locations');

-- Permitir a usuarios autenticados actualizar sus propios archivos
CREATE POLICY "Allow authenticated users to update locations files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'locations')
WITH CHECK (bucket_id = 'locations');

-- Permitir a usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Allow authenticated users to delete locations files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'locations');

-- 5. Políticas para el bucket 'avatars'
-- Permitir a usuarios autenticados subir avatares
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Permitir a usuarios autenticados ver avatares
CREATE POLICY "Allow authenticated users to view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- Permitir a usuarios autenticados actualizar avatares
CREATE POLICY "Allow authenticated users to update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Permitir a usuarios autenticados eliminar avatares
CREATE POLICY "Allow authenticated users to delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- 6. Políticas para el bucket 'documents'
-- Permitir a usuarios autenticados subir documentos
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Permitir a usuarios autenticados ver documentos
CREATE POLICY "Allow authenticated users to view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Permitir a usuarios autenticados actualizar documentos
CREATE POLICY "Allow authenticated users to update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Permitir a usuarios autenticados eliminar documentos
CREATE POLICY "Allow authenticated users to delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- 7. Políticas públicas para lectura (opcional)
-- Si quieres que los archivos sean públicos para lectura
CREATE POLICY "Allow public read access to locations"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'locations');

CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'avatars');

CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'documents');
