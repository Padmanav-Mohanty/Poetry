import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"

// NOTE: This route has no auth on it yet. Before deploying publicly, gate it
// behind a real admin check (e.g. a session check, or a shared secret header
// like `x-admin-token`) — see db/README.md "Securing the admin route".

// GET /api/admin/poems?status=pending
// Lists poems by moderation status (defaults to "pending") for review.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") ?? "pending"

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 })
  }

  try {
    const rows = await query(
      `SELECT id, title, author, slug, form, language, description, content,
              lines, status, submission_mode, source_filename, submitter_email,
              created_at
       FROM poems
       WHERE status = $1
       ORDER BY created_at ASC`,
      [status]
    )
    return NextResponse.json({ poems: rows })
  } catch (err) {
    console.error("GET /api/admin/poems failed:", err)
    return NextResponse.json({ error: "Failed to load poems" }, { status: 500 })
  }
}

// PATCH /api/admin/poems
// Body: { id: string, action: "approve" | "reject", reason?: string, reviewedBy?: string }
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, action, reason, reviewedBy } = body as {
      id?: string
      action?: "approve" | "reject"
      reason?: string
      reviewedBy?: string
    }

    if (!id || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Body must include id and action ('approve' | 'reject')." },
        { status: 400 }
      )
    }

    const newStatus = action === "approve" ? "approved" : "rejected"

    const row = await queryOne(
      `UPDATE poems
       SET status = $1,
           reviewed_at = now(),
           reviewed_by = $2,
           rejection_reason = $3
       WHERE id = $4
       RETURNING id, slug, status`,
      [newStatus, reviewedBy ?? null, action === "reject" ? reason ?? null : null, id]
    )

    if (!row) {
      return NextResponse.json({ error: "Poem not found" }, { status: 404 })
    }

    return NextResponse.json({ poem: row })
  } catch (err) {
    console.error("PATCH /api/admin/poems failed:", err)
    return NextResponse.json({ error: "Failed to update poem" }, { status: 500 })
  }
}
