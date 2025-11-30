import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL!;

// Support both remote Turso (https://) and local SQLite (file:)
// Local files don't need auth tokens
const client = createClient(
  url.startsWith("file:") ? { url } : { url, authToken: process.env.TURSO_AUTH_TOKEN! }
);

const db = drizzle({ client });

export { db };
