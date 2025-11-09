import path from "node:path";
import type { PrismaConfig } from "prisma";
import "dotenv/config";

export default {
  schema: path.join("src", "prisma", "schema.prisma"),
} satisfies PrismaConfig;
