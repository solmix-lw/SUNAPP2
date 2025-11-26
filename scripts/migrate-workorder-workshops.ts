// scripts/migrate-workorder-workshops.ts
import * as dotenv from "dotenv";
dotenv.config();
import { db } from "../server/db";
import { sql } from "drizzle-orm";

// This migration adds a JSONB column `workshops` to store per‑workshop status, timestamps, parts, employees, notes.
// It also adds a `sub_workorder_ids` JSONB array to link internal sub‑workorders.

export async function up() {
  await db.execute(sql`
    ALTER TABLE work_orders
    ADD COLUMN IF NOT EXISTS workshops JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS sub_workorder_ids JSONB DEFAULT '[]'::jsonb;
  `);
}

export async function down() {
  await db.execute(sql`
    ALTER TABLE work_orders
    DROP COLUMN IF EXISTS workshops,
    DROP COLUMN IF EXISTS sub_workorder_ids;
  `);
}

// Run migration
(async () => {
  try {
    console.log("Running work order workshop migration...");
    await up();
    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
