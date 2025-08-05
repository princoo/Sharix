import { PrismaClient } from "@prisma/client";

declare global {
  // This will make `globalThis.prisma` typed
  var prisma: PrismaClient | undefined;
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
