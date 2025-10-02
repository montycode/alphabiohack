# 🌱 Database Seed

Este archivo contiene datos de ejemplo para poblar la base de datos de tu sistema de reservas.

## 📊 Datos incluidos

### 👥 Usuarios (8)

- **1 Administrador**: María González
- **3 Terapeutas**: Dr. Carlos Martínez, Dra. Ana López, Dr. Miguel Rodríguez
- **3 Pacientes**: Juan Pérez, María García, Carlos Silva
- **1 Usuario multi-rol**: Dr. Roberto Fernández (Admin + Therapist)

### 🏥 Ubicaciones (3)

- **Clínica Central**: Av. Principal 123, Ciudad Central
- **Sucursal Norte**: Calle Norte 456, Zona Norte
- **Centro de Salud Sur**: Plaza Sur 789, Distrito Sur

### 🕒 Horarios de Atención (18)

- **Lunes a Viernes**: 08:00 - 18:00
- **Sábados**: 09:00 - 13:00
- **Domingos**: Cerrado

### 🎯 Especialidades (5)

- Psicología Clínica
- Fisioterapia
- Terapia Ocupacional
- Logopedia
- Psicología Infantil

### 🛠️ Servicios (12)

- **Psicología Clínica**: Consulta inicial, terapia individual, terapia de pareja
- **Fisioterapia**: Evaluación, rehabilitación, terapia manual
- **Terapia Ocupacional**: Evaluación, sesión de terapia
- **Logopedia**: Evaluación del habla, terapia del habla
- **Psicología Infantil**: Evaluación infantil, terapia infantil

### 📅 Citas (7)

- **3 Citas completadas** (pasadas)
- **2 Citas confirmadas** (futuras con terapeuta asignado)
- **2 Citas pendientes** (futuras sin terapeuta asignado)

## 🚀 Comandos disponibles

```bash
# Ejecutar solo el seed
npm run db:seed

# Resetear la base de datos y ejecutar el seed
npm run db:reset
```

## 🔧 Configuración

El seed utiliza:

- **Prisma Client** para las operaciones de base de datos
- **TypeScript** con tsx para ejecución
- **PostgreSQL** como base de datos

## 📝 Notas importantes

- El seed **elimina todos los datos existentes** antes de crear los nuevos
- Las fechas de las citas se generan dinámicamente basadas en la fecha actual
- Los usuarios incluyen `supabaseId` de ejemplo para integración con Supabase
- Las ubicaciones incluyen coordenadas GPS de ejemplo (Ciudad de México)

## 🎨 Datos de ejemplo

### Credenciales de prueba:

- **Admin**: admin@booking-saas.com
- **Terapeuta**: dr.martinez@booking-saas.com
- **Paciente**: juan.perez@email.com

### Tipos de citas disponibles:

- DirectVisit (Visita directa)
- VideoCall (Videollamada)
- PhoneCall (Llamada telefónica)
- HomeVisit (Visita domiciliaria)

### Estados de citas:

- Pending (Pendiente)
- Confirmed (Confirmada)
- InProgress (En progreso)
- Completed (Completada)
- Cancelled (Cancelada)
- NoShow (No se presentó)
