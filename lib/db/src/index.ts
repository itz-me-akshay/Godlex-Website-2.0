import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("J.A.R.V.I.S. Alert: DATABASE_URL is missing. Database operations will fail until provisioned.");
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

export * from "./schema";
