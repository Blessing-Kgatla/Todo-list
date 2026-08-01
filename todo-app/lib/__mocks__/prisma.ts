import { PrismaClient } from "@prisma/client";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

export const prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;