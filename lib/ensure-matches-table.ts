import postgres from "postgres";
import { MATCHES_SETUP_SQL } from "@/lib/match-db";

let setupPromise: Promise<boolean> | null = null;

function getDatabaseUrl(): string | null {
  if (process.env.SUPABASE_DB_URL) {
    return process.env.SUPABASE_DB_URL;
  }

  const password = process.env.SUPABASE_DB_PASSWORD;
  const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/,
  )?.[1];

  if (!password || !ref) return null;

  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
}

export async function ensureMatchesTable(): Promise<boolean> {
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) return false;

    const sql = postgres(databaseUrl, {
      ssl: "require",
      max: 1,
      connect_timeout: 10,
    });

    try {
      await sql.unsafe(MATCHES_SETUP_SQL);
      return true;
    } catch (error) {
      console.error("[ensureMatchesTable]", error);
      return false;
    } finally {
      await sql.end({ timeout: 5 });
      setupPromise = null;
    }
  })();

  return setupPromise;
}

export async function checkMatchesTableExists(): Promise<boolean> {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return false;

  const sql = postgres(databaseUrl, {
    ssl: "require",
    max: 1,
    connect_timeout: 10,
  });

  try {
    const rows = await sql<{ exists: boolean }[]>`
      select exists (
        select 1
        from information_schema.tables
        where table_schema = 'public'
          and table_name = 'matches'
      ) as exists
    `;
    return rows[0]?.exists ?? false;
  } catch {
    return false;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
