import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { rowToPoetryForm, PoetryFormRow } from "@/lib/mappers"

// GET /api/forms
// Returns poetry forms with live counts of approved poems in each form.
export async function GET() {
  try {
    const rows = await query<PoetryFormRow>(
      `SELECT name, icon, count FROM poetry_forms_with_counts ORDER BY sort_order`
    )
    const forms = rows.map(rowToPoetryForm)
    return NextResponse.json({ forms })
  } catch (err) {
    console.error("GET /api/forms failed:", err)
    return NextResponse.json(
      { error: "Failed to load poetry forms" },
      { status: 500 }
    )
  }
}
