import { EventEmitter } from "events";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Mitigación: aumentar límite de listeners globales para evitar MaxListenersExceededWarning
// Nota: Esto no resuelve la causa raíz, pero evita el warning en entornos con muchas suscripciones implícitas a sockets
EventEmitter.defaultMaxListeners = Math.max(
  EventEmitter.defaultMaxListeners || 10,
  50
);

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
