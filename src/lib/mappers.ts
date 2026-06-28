import { Poem, PoetryForm } from "@/types"

// Raw shape of a row coming back from the `poems` table / `approved_poems` view.
export interface PoemRow {
  id: string
  title: string
  author: string
  slug: string
  form: string
  language: string
  description: string
  content: string
  cover_color_1: string
  cover_color_2: string
  cover_color_3: string
  lines: number
  readers: number
  featured: boolean
  uploaded_at: string // ISO date string from Postgres
  status?: "pending" | "approved" | "rejected"
}

export interface PoetryFormRow {
  name: string
  icon: string
  count: string | number // COUNT(...) comes back as a string from pg by default
}

/** Maps a DB row onto the exact `Poem` shape the existing UI components expect. */
export function rowToPoem(row: PoemRow): Poem {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    slug: row.slug,
    form: row.form,
    language: row.language,
    description: row.description,
    coverColor: [row.cover_color_1, row.cover_color_2, row.cover_color_3],
    readers: row.readers,
    lines: row.lines,
    uploadedAt: typeof row.uploaded_at === "string" ? row.uploaded_at.slice(0, 10) : row.uploaded_at,
    content: row.content,
    featured: row.featured,
  }
}

export function rowToPoetryForm(row: PoetryFormRow): PoetryForm {
  return {
    name: row.name,
    icon: row.icon,
    count: typeof row.count === "string" ? parseInt(row.count, 10) : row.count,
  }
}
