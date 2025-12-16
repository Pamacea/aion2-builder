/**
 * Script pour libérer les locks de migration Prisma
 * Utilisez ce script si vous avez des problèmes de timeout lors des migrations
 * 
 * Usage: tsx scripts/release-lock.ts
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

async function releaseLock() {
  console.log("🔓 Attempting to release Prisma migration locks...");
  
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString });

  try {
    // Le lock ID utilisé par Prisma est calculé à partir du nom de la base de données
    // Prisma utilise: SELECT pg_advisory_lock(72707369) (valeur exemple)
    // Nous allons libérer tous les advisory locks actifs
    
    // Obtenir tous les locks actifs
    const locksResult = await pool.query(`
      SELECT 
        pid,
        locktype,
        objid,
        mode,
        granted
      FROM pg_locks
      WHERE locktype = 'advisory'
    `);

    if (locksResult.rows.length === 0) {
      console.log("ℹ️  No advisory locks found. Database is ready for migrations.");
      return;
    }

    console.log(`📋 Found ${locksResult.rows.length} advisory lock(s)`);

    // Libérer tous les advisory locks pour cette session
    // Note: On ne peut libérer que nos propres locks, pas ceux d'autres sessions
    await pool.query(`SELECT pg_advisory_unlock_all();`);
    
    console.log("✅ Attempted to release advisory locks");
    console.log("⚠️  If locks persist, they may belong to another active connection.");
    console.log("⚠️  Try closing Prisma Studio, other database connections, or wait a few minutes.");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error releasing locks:", errorMessage);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

releaseLock();
