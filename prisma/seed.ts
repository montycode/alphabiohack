import {
  BookingStatus,
  BookingType,
  DaysOfWeek,
  PrismaClient,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Datos existentes eliminados");

  // Crear usuarios
  const users = await Promise.all([
    // Administradores
    prisma.user.create({
      data: {
        email: "admin@booking-saas.com",
        supabaseId: "admin-supabase-id-1",
        firstname: "María",
        lastname: "González",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        role: [UserRole.Admin],
      },
    }),
    // Terapeutas
    prisma.user.create({
      data: {
        email: "dr.martinez@booking-saas.com",
        supabaseId: "therapist-supabase-id-1",
        firstname: "Carlos",
        lastname: "Martínez",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
        role: [UserRole.Therapist],
      },
    }),
    prisma.user.create({
      data: {
        email: "dra.lopez@booking-saas.com",
        supabaseId: "therapist-supabase-id-2",
        firstname: "Ana",
        lastname: "López",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
        role: [UserRole.Therapist],
      },
    }),
    prisma.user.create({
      data: {
        email: "dr.rodriguez@booking-saas.com",
        supabaseId: "therapist-supabase-id-3",
        firstname: "Miguel",
        lastname: "Rodríguez",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150",
        role: [UserRole.Therapist],
      },
    }),
    // Pacientes
    prisma.user.create({
      data: {
        email: "juan.perez@email.com",
        supabaseId: "patient-supabase-id-1",
        firstname: "Juan",
        lastname: "Pérez",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: [UserRole.Patient],
      },
    }),
    prisma.user.create({
      data: {
        email: "maria.garcia@email.com",
        supabaseId: "patient-supabase-id-2",
        firstname: "María",
        lastname: "García",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: [UserRole.Patient],
      },
    }),
    prisma.user.create({
      data: {
        email: "carlos.silva@email.com",
        supabaseId: "patient-supabase-id-3",
        firstname: "Carlos",
        lastname: "Silva",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: [UserRole.Patient],
      },
    }),
    // Usuario con múltiples roles
    prisma.user.create({
      data: {
        email: "dr.admin@booking-saas.com",
        supabaseId: "multi-role-supabase-id-1",
        firstname: "Roberto",
        lastname: "Fernández",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        role: [UserRole.Admin, UserRole.Therapist],
      },
    }),
  ]);

  console.log("👥 Usuarios creados:", users.length);

  // Crear ubicaciones
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        title: "Clínica Central",
        address: "Av. Principal 123, Ciudad Central",
        description:
          "Nuestra clínica principal con todas las especialidades disponibles",
        logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200",
        lat: 19.4326,
        lon: -99.1332,
      },
    }),
    prisma.location.create({
      data: {
        title: "Sucursal Norte",
        address: "Calle Norte 456, Zona Norte",
        description: "Sucursal especializada en terapias de rehabilitación",
        logo: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200",
        lat: 19.4526,
        lon: -99.1532,
      },
    }),
    prisma.location.create({
      data: {
        title: "Centro de Salud Sur",
        address: "Plaza Sur 789, Distrito Sur",
        description: "Centro moderno con tecnología de última generación",
        logo: "https://images.unsplash.com/photo-1519494026892-80bbd4d4f457?w=200",
        lat: 19.4126,
        lon: -99.1132,
      },
    }),
  ]);

  console.log("🏥 Ubicaciones creadas:", locations.length);

  // Crear horarios de atención para cada ubicación
  const businessHours = [];
  const daysOfWeek = [
    DaysOfWeek.Monday,
    DaysOfWeek.Tuesday,
    DaysOfWeek.Wednesday,
    DaysOfWeek.Thursday,
    DaysOfWeek.Friday,
    DaysOfWeek.Saturday,
    DaysOfWeek.Sunday,
  ];

  for (const location of locations) {
    for (const day of daysOfWeek) {
      if (day === DaysOfWeek.Sunday) {
        // Domingo cerrado
        continue;
      } else if (day === DaysOfWeek.Saturday) {
        // Sábado medio día
        businessHours.push(
          prisma.businessHours.create({
            data: {
              dayOfWeek: day,
              locationId: location.id,
            },
          })
        );
      } else {
        // Lunes a Viernes horario completo
        businessHours.push(
          prisma.businessHours.create({
            data: {
              dayOfWeek: day,
              locationId: location.id,
            },
          })
        );
      }
    }
  }

  await Promise.all(businessHours);
  console.log("🕒 Horarios de atención creados:", businessHours.length);

  // Crear especialidades
  const specialties = await Promise.all([
    prisma.specialty.create({
      data: {
        name: "Psicología Clínica",
        description: "Tratamiento de trastornos mentales y emocionales",
      },
    }),
    prisma.specialty.create({
      data: {
        name: "Fisioterapia",
        description: "Rehabilitación física y tratamiento de lesiones",
      },
    }),
    prisma.specialty.create({
      data: {
        name: "Terapia Ocupacional",
        description: "Mejora de habilidades funcionales y ocupacionales",
      },
    }),
    prisma.specialty.create({
      data: {
        name: "Logopedia",
        description: "Tratamiento de trastornos del habla y lenguaje",
      },
    }),
    prisma.specialty.create({
      data: {
        name: "Psicología Infantil",
        description: "Atención psicológica especializada en niños",
      },
    }),
  ]);

  console.log("🎯 Especialidades creadas:", specialties.length);

  // Crear servicios para cada especialidad
  const services = [];

  // Servicios de Psicología Clínica
  services.push(
    prisma.service.create({
      data: {
        description: "Consulta inicial de evaluación psicológica",
        cost: 80.0,
        duration: 60,
        specialtyId: specialties[0].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de terapia individual",
        cost: 60.0,
        duration: 50,
        specialtyId: specialties[0].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de terapia de pareja",
        cost: 90.0,
        duration: 60,
        specialtyId: specialties[0].id,
      },
    })
  );

  // Servicios de Fisioterapia
  services.push(
    prisma.service.create({
      data: {
        description: "Evaluación fisioterapéutica",
        cost: 70.0,
        duration: 45,
        specialtyId: specialties[1].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de rehabilitación",
        cost: 50.0,
        duration: 30,
        specialtyId: specialties[1].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Terapia manual",
        cost: 65.0,
        duration: 40,
        specialtyId: specialties[1].id,
      },
    })
  );

  // Servicios de Terapia Ocupacional
  services.push(
    prisma.service.create({
      data: {
        description: "Evaluación ocupacional",
        cost: 75.0,
        duration: 60,
        specialtyId: specialties[2].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de terapia ocupacional",
        cost: 55.0,
        duration: 45,
        specialtyId: specialties[2].id,
      },
    })
  );

  // Servicios de Logopedia
  services.push(
    prisma.service.create({
      data: {
        description: "Evaluación del habla",
        cost: 60.0,
        duration: 45,
        specialtyId: specialties[3].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de terapia del habla",
        cost: 45.0,
        duration: 30,
        specialtyId: specialties[3].id,
      },
    })
  );

  // Servicios de Psicología Infantil
  services.push(
    prisma.service.create({
      data: {
        description: "Evaluación psicológica infantil",
        cost: 85.0,
        duration: 60,
        specialtyId: specialties[4].id,
      },
    }),
    prisma.service.create({
      data: {
        description: "Sesión de terapia infantil",
        cost: 65.0,
        duration: 45,
        specialtyId: specialties[4].id,
      },
    })
  );

  await Promise.all(services);
  console.log("🛠️ Servicios creados:", services.length);

  // Crear citas de ejemplo
  const bookings = [];
  const now = new Date();

  // Citas pasadas
  const pastDate1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás
  const pastDate2 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 días atrás

  // Citas futuras
  const futureDate1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 días adelante
  const futureDate2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 días adelante
  const futureDate3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días adelante

  // Citas con terapeutas asignados
  bookings.push(
    prisma.booking.create({
      data: {
        bookingType: BookingType.DirectVisit,
        locationId: locations[0].id,
        firstname: "Juan",
        lastname: "Pérez",
        phone: "+52 55 1234 5678",
        email: "juan.perez@email.com",
        givenConsent: true,
        therapistId: users[1].id, // Dr. Martínez
        patientId: users[4].id, // Juan Pérez
        bookingNotes: "Primera consulta para evaluación psicológica",
        bookingSchedule: new Date(
          pastDate1.getFullYear(),
          pastDate1.getMonth(),
          pastDate1.getDate(),
          10,
          0
        ),
        status: BookingStatus.Completed,
      },
    }),
    prisma.booking.create({
      data: {
        bookingType: BookingType.VideoCall,
        locationId: locations[0].id,
        firstname: "María",
        lastname: "García",
        phone: "+52 55 2345 6789",
        email: "maria.garcia@email.com",
        givenConsent: true,
        therapistId: users[2].id, // Dra. López
        patientId: users[5].id, // María García
        bookingNotes: "Sesión de seguimiento",
        bookingSchedule: new Date(
          pastDate2.getFullYear(),
          pastDate2.getMonth(),
          pastDate2.getDate(),
          14,
          30
        ),
        status: BookingStatus.Completed,
      },
    }),
    prisma.booking.create({
      data: {
        bookingType: BookingType.DirectVisit,
        locationId: locations[1].id,
        firstname: "Carlos",
        lastname: "Silva",
        phone: "+52 55 3456 7890",
        email: "carlos.silva@email.com",
        givenConsent: true,
        therapistId: users[3].id, // Dr. Rodríguez
        patientId: users[6].id, // Carlos Silva
        bookingNotes: "Consulta de fisioterapia",
        bookingSchedule: new Date(
          futureDate1.getFullYear(),
          futureDate1.getMonth(),
          futureDate1.getDate(),
          9,
          0
        ),
        status: BookingStatus.Confirmed,
      },
    }),
    prisma.booking.create({
      data: {
        bookingType: BookingType.PhoneCall,
        locationId: locations[0].id,
        firstname: "Ana",
        lastname: "Martínez",
        phone: "+52 55 4567 8901",
        email: "ana.martinez@email.com",
        givenConsent: true,
        therapistId: users[1].id, // Dr. Martínez
        bookingNotes: "Consulta telefónica de seguimiento",
        bookingSchedule: new Date(
          futureDate2.getFullYear(),
          futureDate2.getMonth(),
          futureDate2.getDate(),
          16,
          0
        ),
        status: BookingStatus.Confirmed,
      },
    }),
    prisma.booking.create({
      data: {
        bookingType: BookingType.HomeVisit,
        locationId: locations[2].id,
        firstname: "Roberto",
        lastname: "Fernández",
        phone: "+52 55 5678 9012",
        email: "roberto.fernandez@email.com",
        givenConsent: true,
        therapistId: users[2].id, // Dra. López
        bookingNotes: "Visita domiciliaria para terapia ocupacional",
        bookingSchedule: new Date(
          futureDate3.getFullYear(),
          futureDate3.getMonth(),
          futureDate3.getDate(),
          11,
          30
        ),
        status: BookingStatus.Pending,
      },
    })
  );

  // Citas sin terapeuta asignado (pendientes)
  bookings.push(
    prisma.booking.create({
      data: {
        bookingType: BookingType.DirectVisit,
        locationId: locations[0].id,
        firstname: "Laura",
        lastname: "Hernández",
        phone: "+52 55 6789 0123",
        email: "laura.hernandez@email.com",
        givenConsent: true,
        bookingNotes: "Necesita evaluación psicológica infantil",
        bookingSchedule: new Date(
          futureDate1.getFullYear(),
          futureDate1.getMonth(),
          futureDate1.getDate(),
          15,
          0
        ),
        status: BookingStatus.Pending,
      },
    }),
    prisma.booking.create({
      data: {
        bookingType: BookingType.VideoCall,
        locationId: locations[1].id,
        firstname: "Pedro",
        lastname: "González",
        phone: "+52 55 7890 1234",
        email: "pedro.gonzalez@email.com",
        givenConsent: true,
        bookingNotes: "Consulta de logopedia",
        bookingSchedule: new Date(
          futureDate2.getFullYear(),
          futureDate2.getMonth(),
          futureDate2.getDate(),
          10,
          30
        ),
        status: BookingStatus.Pending,
      },
    })
  );

  await Promise.all(bookings);
  console.log("📅 Citas creadas:", bookings.length);

  console.log("✅ Seed completado exitosamente!");
  console.log("\n📊 Resumen de datos creados:");
  console.log(`👥 Usuarios: ${users.length}`);
  console.log(`🏥 Ubicaciones: ${locations.length}`);
  console.log(`🕒 Horarios: ${businessHours.length}`);
  console.log(`🎯 Especialidades: ${specialties.length}`);
  console.log(`🛠️ Servicios: ${services.length}`);
  console.log(`📅 Citas: ${bookings.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
