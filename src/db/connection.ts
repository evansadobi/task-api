import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv"; // Uncomment this

// Load .env file
dotenv.config(); // Uncomment this

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Now this will be a string from your .env
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema });
