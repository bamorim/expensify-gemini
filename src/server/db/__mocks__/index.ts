import { PrismaTestingHelper } from "@chax-at/transactional-prisma-testing";
import { PrismaClient } from "@prisma/client";
import { afterEach, beforeEach } from "vitest";

const originalPrismaClient = new PrismaClient();

const prismaTestingHelper = new PrismaTestingHelper(originalPrismaClient);
export const db = prismaTestingHelper.getProxyClient();

beforeEach(async () => {
  await prismaTestingHelper.startNewTransaction();
});

afterEach(() => {
  prismaTestingHelper?.rollbackCurrentTransaction();
});
