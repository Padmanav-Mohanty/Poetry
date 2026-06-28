import { query, queryOne } from "@/lib/db"
import { rowToPoem, rowToPoetryForm, PoemRow, PoetryFormRow } from "@/lib/mappers"
import { Poem, PoetryForm } from "@/types"

/** All approved poems, newest first — used by the homepage and /library. */
export async function getApprovedPoems(): Promise<Poem[]> {
  const rows = await query<PoemRow>(`SELECT * FROM approved_poems`)
  return rows.map(rowToPoem)
}

/** A single approved poem by slug, or null if it doesn't exist / isn't approved. */
export async function getApprovedPoemBySlug(slug: string): Promise<Poem | null> {
  const row = await queryOne<PoemRow>(
    `SELECT * FROM approved_poems WHERE slug = $1`,
    [slug]
  )
  return row ? rowToPoem(row) : null
}

/** Poetry forms with live counts of approved poems. */
export async function getPoetryForms(): Promise<PoetryForm[]> {
  const rows = await query<PoetryFormRow>(
    `SELECT name, icon, count FROM poetry_forms_with_counts ORDER BY sort_order`
  )
  return rows.map(rowToPoetryForm)
}
