import {
  seedDefaultBookings,
  seedDefaultBusinessHours,
  seedDefaultLocations,
  seedDefaultServices,
  seedDefaultSpecialties,
  seedDefaultUsers,
} from "@/prisma/seeds";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await seedDefaultUsers(prisma);
  const locations = await seedDefaultLocations(prisma);
  await seedDefaultBusinessHours(prisma, locations);
  const specialties = await seedDefaultSpecialties(prisma);
  const services = await seedDefaultServices(prisma, specialties);
  await seedDefaultBookings(prisma, { users, locations, services });
}

main()
  .catch((error) => {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
