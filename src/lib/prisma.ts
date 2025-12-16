import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

// Récupérer la connection string - utiliser DATABASE_URL en priorité
// IMPORTANT: Ne PAS utiliser les URLs Prisma Accelerate (prisma:// ou prisma+postgres://)
// avec PrismaPg adapter - utiliser uniquement les URLs PostgreSQL directes
let connectionString = process.env.DATABASE_URL || 
                      process.env.BAHIONDB_POSTGRES_URL || 
                      "";

// Si l'URL ne contient pas de paramètres de pool, les ajouter pour améliorer la connexion
if (connectionString && (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://"))) {
  try {
    const url = new URL(connectionString);
    // Ajouter des paramètres de connexion pour améliorer la stabilité et augmenter les timeouts
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "5");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "15");
    }
    // Ajouter sslmode=require pour les connexions sécurisées
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }
    connectionString = url.toString();
  } catch (e) {
    // Si l'URL n'est pas valide, continuer avec l'URL originale
    console.warn("Could not parse database URL:", e);
  }
}

// Log en développement pour debug
if (!connectionString) {
  console.error("❌ No database connection string found!");
  console.error("Checked: DATABASE_URL, BAHIONDB_POSTGRES_URL");
  console.error("⚠️  Please set DATABASE_URL or BAHIONDB_POSTGRES_URL with a PostgreSQL URL (postgres:// or postgresql://)");
  console.error("⚠️  Do NOT use Prisma Accelerate URL (prisma://) - it's incompatible with PrismaPg adapter");
} else if (process.env.NODE_ENV === "development") {
  // En dev seulement, logger que la connexion est trouvée (sans l'URL complète pour la sécurité)
  const hasValue = connectionString.length > 0;
  console.log(hasValue ? "✅ Database connection string found" : "❌ Database connection string is empty");
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
