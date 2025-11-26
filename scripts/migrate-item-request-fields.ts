// scripts/migrate-item-request-fields.ts
import * as dotenv from "dotenv";
dotenv.config();
import { db } from "../server/db";
import { sql } from "drizzle-orm";

// This migration adds reject_reason, feedback, and pending_reason fields to item_requisition_lines table
// for enhanced item request handling with reject/feedback/pending workflows

export async function up() {
    await db.execute(sql`
    ALTER TABLE item_requisition_lines
    ADD COLUMN IF NOT EXISTS reject_reason TEXT,
    ADD COLUMN IF NOT EXISTS feedback TEXT,
    ADD COLUMN IF NOT EXISTS pending_reason TEXT;
  `);
}

export async function down() {
    await db.execute(sql`
    ALTER TABLE item_requisition_lines
    DROP COLUMN IF EXISTS reject_reason,
    DROP COLUMN IF EXISTS feedback,
    DROP COLUMN IF EXISTS pending_reason;
  `);
}

// Run migration
(async () => {
    try {
        console.log("Running item request fields migration...");
        await up();
        console.log("Migration completed.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
})();
