# Dropzone Internacionalizado

## ✅ **Implementación completada**

El componente `Dropzone` ahora está completamente internacionalizado usando `next-intl`.

### **🌍 Idiomas soportados:**

- **Español (es-MX)**
- **Inglés (en-US)**

### **📝 Textos traducidos:**

#### **Estados de upload:**

- `uploading` - "Subiendo..." / "Uploading..."
- `successfullyUploaded` - "Subido exitosamente" / "Successfully uploaded"
- `uploadingFile` - "Subiendo archivo..." / "Uploading file..."
- `failedToUpload` - "Error al subir:" / "Failed to upload:"

#### **Interfaz de usuario:**

- `uploadFiles` - "Subir archivos" / "Upload files"
- `uploadFile` - "Subir" / "Upload"
- `file` - "archivo" / "file"
- `files` - "archivos" / "files"

#### **Instrucciones:**

- `dragAndDropOr` - "Arrastra y suelta o" / "Drag and drop or"
- `selectFile` - "selecciona archivo" / "select file"
- `selectFiles` - "selecciona archivos" / "select files"
- `toUpload` - "para subir" / "to upload"

#### **Validaciones:**

- `fileLargerThan` - "El archivo es más grande que" / "File is larger than"
- `size` - "Tamaño:" / "Size:"
- `maximumFileSize` - "Tamaño máximo de archivo:" / "Maximum file size:"
- `youMayUploadOnly` - "Solo puedes subir hasta" / "You may upload only up to"
- `filesPleaseRemove` - "archivos, por favor elimina" / "files, please remove"

### **🔧 Uso:**

El componente funciona automáticamente con el idioma actual del usuario:

```tsx
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";

// En tu componente
<Dropzone {...logoUpload} className="max-w-md">
  <DropzoneEmptyState />
  <DropzoneContent />
</Dropzone>;
```

### **🎯 Características:**

✅ **Detección automática de idioma** - Usa el locale actual del usuario
✅ **Textos contextuales** - Mensajes diferentes según el estado
✅ **Validaciones traducidas** - Errores de tamaño y tipo en el idioma correcto
✅ **Instrucciones claras** - Drag & drop y click to upload en español/inglés
✅ **Estados de carga** - Indicadores de progreso traducidos

### **📱 Ejemplos de uso:**

#### **Español:**

- "Arrastra y suelta o selecciona archivo para subir"
- "Subiendo archivo..."
- "Subido exitosamente"
- "El archivo es más grande que 4 MB (Tamaño: 5.2 MB)"

#### **Inglés:**

- "Drag and drop or select file to upload"
- "Uploading file..."
- "Successfully uploaded"
- "File is larger than 4 MB (Size: 5.2 MB)"

### **🔄 Cambios realizados:**

1. **Import agregado**: `useTranslations` de `next-intl`
2. **Traducciones agregadas**: Namespace `Dropzone` en ambos idiomas
3. **Componentes actualizados**:
   - `DropzoneContent` - Estados de upload y validaciones
   - `DropzoneEmptyState` - Instrucciones de uso
4. **Textos reemplazados**: Todos los strings hardcodeados por `t('key')`

### **✨ Resultado:**

El Dropzone ahora se adapta automáticamente al idioma del usuario, proporcionando una experiencia completamente localizada para el upload de archivos.
