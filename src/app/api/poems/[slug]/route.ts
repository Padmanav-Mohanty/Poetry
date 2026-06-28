import { NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import { rowToPoem, PoemRow } from "@/lib/mappers"

// GET /api/poems/[slug]
// Returns a single approved poem by slug. Used by /poem/[slug] and /read/[slug].
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const row = await queryOne<PoemRow>(
      `SELECT * FROM approved_poems WHERE slug = $1`,
      [params.slug]
    )

    if (!row) {
      return NextResponse.json({ error: "Poem not found" }, { status: 404 })
    }

    return NextResponse.json({ poem: rowToPoem(row) })
  } catch (err) {
    console.error(`GET /api/poems/${params.slug} failed:`, err)
    return NextResponse.json(
      { error: "Failed to load poem" },
      { status: 500 }
    )
  }
}
