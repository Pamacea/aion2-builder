/**
 * Script de reset manuel de la base de données
 * Alternative à `prisma migrate reset` en cas de problèmes de lock
 * 
 * Usage: tsx scripts/reset-db-manual.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL_UNPOOLED ||
                        process.env.BAHIONDB_POSTGRES_URL_NON_POOLING ||
                        process.env.DATABASE_URL || 
                        process.env.BAHIONDB_POSTGRES_URL || 
                        "";

if (!connectionString) {
  console.error("❌ No database connection string found!");
  process.exit(1);
}

async function resetDatabase() {
  console.log("🔄 Starting manual database reset...");
  
  // Créer un client Prisma temporaire pour exécuter le SQL brut
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString });

  try {
    // Obtenir toutes les tables
    const result = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    const tables = result.rows.map(row => row.tablename);

    if (tables.length === 0) {
      console.log("ℹ️  No tables found, database is already empty");
      console.log("✅ Database is already reset!");
      return;
    }

    console.log(`📋 Found ${tables.length} tables to drop`);

    // Désactiver les contraintes de clé étrangère temporairement
    await pool.query("SET session_replication_role = 'replica';");

    // Supprimer toutes les tables
    for (const table of tables) {
      console.log(`🗑️  Dropping table: ${table}`);
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    }

    // Réactiver les contraintes
    await pool.query("SET session_replication_role = 'origin';");

    console.log("✅ All tables dropped successfully");
    console.log("✅ Database reset complete!");
    console.log("📝 Next steps:");
    console.log("   1. Run: pnpm db:migrate");
    console.log("   2. Run: pnpm db:seed");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error during database reset:", errorMessage);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
