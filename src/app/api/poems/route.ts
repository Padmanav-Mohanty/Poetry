import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { rowToPoem, PoemRow } from "@/lib/mappers"

// GET /api/poems
// Returns all approved poems — the public anthology. This is what powers
// the homepage and the /library page.
export async function GET() {
  try {
    const rows = await query<PoemRow>(`SELECT * FROM approved_poems`)
    const poems = rows.map(rowToPoem)
    return NextResponse.json({ poems })
  } catch (err) {
    console.error("GET /api/poems failed:", err)
    return NextResponse.json(
      { error: "Failed to load poems" },
      { status: 500 }
    )
  }
}
