import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
    globalForPrisma.prisma ||
    new PrismaClient({
        errorFormat: "pretty",
        log: ["query", "info", "warn", "error"],
    });

if (import.meta.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
