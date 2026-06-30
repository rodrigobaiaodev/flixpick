import { NextResponse } from "next/server";
import {
  checkUserListsTableExists,
  ensureUserListsTable,
} from "@/lib/ensure-user-lists-table";

export async function POST() {
  try {
    const created = await ensureUserListsTable();
    const exists = created || (await checkUserListsTableExists());

    if (!exists) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not create table automatically. Add SUPABASE_DB_PASSWORD to .env.local or run the SQL in Supabase Dashboard.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/setup-list-table]", error);
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
    const exists = await checkUserListsTableExists();
    return NextResponse.json({ ready: exists });
  } catch {
    return NextResponse.json({ ready: false });
  }
}
