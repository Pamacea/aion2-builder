import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

// Récupérer la connection string - utiliser DATABASE_URL en priorité
// IMPORTANT: Ne PAS utiliser les URLs Prisma Accelerate (prisma:// ou prisma+postgres://)
// avec PrismaPg adapter - utiliser uniquement les URLs PostgreSQL directes
// En développement, privilégier l'URL non-poolée pour une meilleure latence
let connectionString = process.env.NODE_ENV === "development"
  ? (process.env.DATABASE_URL_UNPOOLED || 
     process.env.BAHIONDB_POSTGRES_URL_NON_POOLING || 
     process.env.DATABASE_URL || 
     process.env.BAHIONDB_POSTGRES_URL || 
     "")
  : (process.env.DATABASE_URL || 
     process.env.BAHIONDB_POSTGRES_URL || 
     "");

// Si l'URL ne contient pas de paramètres de pool, les ajouter pour améliorer la connexion
if (connectionString && (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://"))) {
  try {
    const url = new URL(connectionString);
    // En développement, utiliser des paramètres plus agressifs pour réduire la latence
    const isDev = process.env.NODE_ENV === "development";
    
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", isDev ? "10" : "5"); // Plus de connexions en dev
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", isDev ? "10" : "30"); // Timeout plus court en dev
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", isDev ? "5" : "15"); // Connexion plus rapide en dev
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
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"], // Désactiver "query" en prod pour de meilleures perfs
  // Optimisation: désactiver le middleware inutile pour améliorer les performances
  errorFormat: 'minimal',
});
