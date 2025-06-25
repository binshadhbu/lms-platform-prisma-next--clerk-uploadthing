import { PrismaClient } from './generated/prisma'
// import { withAccelerate } from '@prisma/extension-accelerate'

declare global{
    var prisma:PrismaClient | undefined;
};
export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}