import { PrismaClient } from '@prisma/client';

// TODO: should this be memoized?
export const prisma = new PrismaClient();
