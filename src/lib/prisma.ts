import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.BAHION_POSTGRES_URL || 
                    process.env.BAHIONDB_PRISMA_DATABASE_URL || 
                    process.env.DATABASE_URL || 
                    "",
});

export const prisma = new PrismaClient({ adapter });
