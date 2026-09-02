import { NextResponse } from "next/server";
import {
  checkMatchesTableExists,
  ensureMatchesTable,
} from "@/lib/ensure-matches-table";

export async function POST() {
  try {
    const created = await ensureMatchesTable();
    const exists = created || (await checkMatchesTableExists());

    if (!exists) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not create matches table. Add SUPABASE_DB_PASSWORD to .env.local or run supabase/migrations/matches.sql in Supabase.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/setup-matches-table]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Setup failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const exists = await checkMatchesTableExists();
    return NextResponse.json({ ready: exists });
  } catch {
    return NextResponse.json({ ready: false });
  }
}
