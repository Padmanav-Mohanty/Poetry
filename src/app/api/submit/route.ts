import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { slugify, countLines } from "@/lib/slugify"

const ALLOWED_FORMS = [
  "Free Verse",
  "Sonnet",
  "Haiku",
  "Villanelle",
  "Ode",
  "Ghazal",
  "Limerick",
  "Blank Verse",
  "Other",
]

const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Other"]

// A small rotating palette so submitted poems still get a nice cover gradient
// without the submitter having to pick colors.
const COVER_PALETTES: [string, string, string][] = [
  ["#8B4513", "#C0702A", "#6B3410"],
  ["#2D5016", "#4A7C25", "#1A3009"],
  ["#5c1a1a", "#8f2a2a", "#400d0d"],
  ["#1a1a3a", "#2a2a6f", "#0d0d2a"],
  ["#1a2e3a", "#2a4f6f", "#0d1f2a"],
  ["#4a3010", "#7a5020", "#2a1a08"],
  ["#2a2a2a", "#4a4a4a", "#1a1a1a"],
]

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  if (name.endsWith(".txt")) {
    return buffer.toString("utf-8")
  }

  if (name.endsWith(".pdf")) {
    // Lazy import so the (heavier) pdf parser is only loaded when needed.
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text
  }

  if (name.endsWith(".epub")) {
    throw new Error(
      "EPUB text extraction isn't supported yet — please paste your poem text directly or upload a .txt/.pdf file."
    )
  }

  throw new Error("Unsupported file type. Please upload a .txt or .pdf file.")
}

// POST /api/submit
// Accepts multipart/form-data with fields: title, author, form, language,
// description, mode ("write" | "file"), content (if mode=write),
// file (if mode=file), email (optional).
//
// New poems are inserted with status = 'pending' and do NOT appear on the
// public site until a moderator approves them (see /api/admin/poems).
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = (formData.get("title") as string | null)?.trim()
    const author = (formData.get("author") as string | null)?.trim()
    const form = (formData.get("form") as string | null)?.trim()
    const language = ((formData.get("language") as string | null)?.trim()) || "English"
    const description = (formData.get("description") as string | null)?.trim()
    const mode = (formData.get("mode") as string | null) ?? "write"
    const email = (formData.get("email") as string | null)?.trim() || null

    if (!title || !author || !form || !description) {
      return NextResponse.json(
        { error: "title, author, form, and description are all required." },
        { status: 400 }
      )
    }

    if (!ALLOWED_FORMS.includes(form)) {
      return NextResponse.json({ error: `Unknown form: ${form}` }, { status: 400 })
    }

    if (!LANGUAGES.includes(language)) {
      return NextResponse.json({ error: `Unknown language: ${language}` }, { status: 400 })
    }

    let content: string
    let sourceFilename: string | null = null

    if (mode === "file") {
      const file = formData.get("file") as File | null
      if (!file) {
        return NextResponse.json({ error: "No file was uploaded." }, { status: 400 })
      }
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "File exceeds the 50MB limit." }, { status: 400 })
      }
      try {
        content = (await extractTextFromFile(file)).trim()
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to read the uploaded file."
        return NextResponse.json({ error: message }, { status: 400 })
      }
      sourceFilename = file.name
    } else {
      content = ((formData.get("content") as string | null) ?? "").trim()
    }

    if (!content) {
      return NextResponse.json(
        { error: "Poem content is empty — nothing to submit." },
        { status: 400 }
      )
    }

    // `form` here is a special, non-bundled TS keyword-free identifier name —
    // unrelated to the lookup table column also named `form`. Custom forms
    // ("Other") still need a row in poetry_forms to satisfy the FK.
    if (form === "Other") {
      await query(
        `INSERT INTO poetry_forms (name, icon, sort_order)
         VALUES ('Other', '📝', 999)
         ON CONFLICT (name) DO NOTHING`
      )
    }

    const baseSlug = slugify(title) || "untitled-poem"
    let slug = baseSlug
    let suffix = 1
    // Ensure slug uniqueness even across pending/rejected poems.
    while (await queryOne(`SELECT 1 FROM poems WHERE slug = $1`, [slug])) {
      slug = `${baseSlug}-${++suffix}`
    }

    const palette = COVER_PALETTES[Math.floor(Math.random() * COVER_PALETTES.length)]
    const lines = countLines(content)

    const row = await queryOne(
      `INSERT INTO poems (
         title, author, slug, form, language, description, content,
         cover_color_1, cover_color_2, cover_color_3,
         lines, readers, status, submission_mode, source_filename, submitter_email
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,'pending',$12,$13,$14)
       RETURNING id, slug, status`,
      [
        title,
        author,
        slug,
        form,
        language,
        description,
        content,
        palette[0],
        palette[1],
        palette[2],
        lines,
        mode === "file" ? "file" : "write",
        sourceFilename,
        email,
      ]
    )

    return NextResponse.json(
      {
        message:
          "Your poem has been submitted and is awaiting review. It will appear in the anthology once approved.",
        poem: row,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("POST /api/submit failed:", err)
    return NextResponse.json(
      { error: "Something went wrong while submitting your poem." },
      { status: 500 }
    )
  }
}
