import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Ensure named export 'db' exists
export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db