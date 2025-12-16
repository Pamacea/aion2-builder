import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

// Récupérer la connection string avec priorité
let connectionString = process.env.BAHION_POSTGRES_URL || 
                      process.env.BAHIONDB_PRISMA_DATABASE_URL || 
                      process.env.DATABASE_URL || 
                      "";

// Si l'URL ne contient pas de paramètres de pool, les ajouter pour améliorer la connexion
if (connectionString && connectionString.startsWith("postgresql://")) {
  const url = new URL(connectionString);
  // Ajouter des paramètres de connexion pour améliorer la stabilité
  if (!url.searchParams.has("connection_limit")) {
    url.searchParams.set("connection_limit", "10");
  }
  if (!url.searchParams.has("pool_timeout")) {
    url.searchParams.set("pool_timeout", "20");
  }
  if (!url.searchParams.has("connect_timeout")) {
    url.searchParams.set("connect_timeout", "10");
  }
  connectionString = url.toString();
}

// Log en développement pour debug
if (process.env.NODE_ENV === "development" && !connectionString) {
  console.warn("⚠️  No database connection string found. Using fallback.");
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
