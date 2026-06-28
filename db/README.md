# Verse — Database Setup (Neon Postgres)

This app's poems used to live in a hardcoded array (`src/data/poems.ts`).
They now live in a real Postgres database hosted on [Neon](https://neon.tech),
and the app reads/writes that database instead. `src/data/poems.ts` is no
longer imported anywhere and can be deleted once you've confirmed the new
setup works end to end (it's left in place for reference/rollback).

## 1. Create a free Neon project

1. Go to https://console.neon.tech and sign up (no credit card required).
2. Create a new project — any name, any region close to you/your users.
3. On the project dashboard, click **Connect**, choose the `main` branch,
   the default role, and your database (usually `neondb`).
4. Copy the **pooled** connection string (hostname contains `-pooler`) —
   that's your `DATABASE_URL` for the running app.
5. Also note the **unpooled** string (no `-pooler`) — you'll use that one
   for running the schema/seed scripts below, since PgBouncer's transaction
   pooling mode can break multi-statement admin scripts.

## 2. Configure the app

```bash
cp .env.local.example .env.local
# edit .env.local and paste in your pooled connection string
```

## 3. Create the schema and load the seed data

You need `psql` installed locally (or use Neon's in-browser SQL Editor and
paste the file contents in instead).

```bash
# Use the UNPOOLED connection string for these two commands.
psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql
psql "$DATABASE_URL_UNPOOLED" -f db/seed.sql
```

`schema.sql` is safe to re-run (uses `IF NOT EXISTS` / `OR REPLACE`
everywhere). `seed.sql` is also safe to re-run — it uses
`ON CONFLICT (slug) DO NOTHING`, so re-running it won't create duplicates
of the 8 original poems.

## 4. Run the app

```bash
npm install   # picks up the new `pg` and `pdf-parse` dependencies
npm run dev
```

Visit `/library` — you should see the 8 original poems, now served from
Postgres. Visit `/upload`, submit a poem, then check it landed in the
`poems` table with `status = 'pending'`.

## What changed

| Area | Before | Now |
|---|---|---|
| Poem storage | Hardcoded array in `src/data/poems.ts` | `poems` table in Postgres |
| Homepage / `/poem/[slug]` | Imported the array directly (server component) | Server-fetches from Postgres via `src/lib/poems-server.ts` |
| `/library`, `/read/[slug]` | Imported the array directly (client component) | Client-fetches from `/api/poems`, `/api/forms`, `/api/poems/[slug]` |
| `/upload` | Fake submit — just showed a toast, never persisted anything | Real `POST /api/submit` — inserts into Postgres with `status = 'pending'` |
| Moderation | None — upload appeared to "publish" instantly | New poems sit as `pending` until approved via `PATCH /api/admin/poems` |

## Schema overview (`db/schema.sql`)

- **`poems`** — every poem that has ever existed or been submitted.
  - `status`: `pending` | `approved` | `rejected`. Only `approved` poems
    are ever shown on the public site.
  - `submission_mode`: `write` | `file` | `seed` — how it was submitted.
  - `cover_color_1/2/3` — maps 1:1 onto the `coverColor: [string,string,string]`
    tuple from the original `Poem` TypeScript type.
  - `uploaded_at` (DATE) is the public "published" date shown in the UI.
    `created_at` (TIMESTAMPTZ) is the real submission timestamp.
- **`poetry_forms`** — lookup table for Free Verse / Sonnet / Haiku / etc.
- **`poetry_forms_with_counts`** (view) — same as `poetry_forms`, but with
  a live `count` of *approved* poems in each form, so it never drifts out
  of sync the way a hardcoded `count` field would.
- **`approved_poems`** (view) — exactly what the public site should ever
  query: `SELECT * FROM poems WHERE status = 'approved'`.

## API routes added

- `GET /api/poems` — all approved poems (powers `/library`).
- `GET /api/poems/[slug]` — one approved poem by slug (powers `/read/[slug]`).
- `GET /api/forms` — poetry forms with live counts.
- `POST /api/submit` — submit a new poem (`multipart/form-data`: `title`,
  `author`, `form`, `language`, `description`, `mode`, `content` or `file`,
  optional `email`). Always inserts as `status = 'pending'`.
- `GET /api/admin/poems?status=pending` — list poems awaiting review.
- `PATCH /api/admin/poems` — approve or reject a poem:
  ```json
  { "id": "...", "action": "approve" }
  { "id": "...", "action": "reject", "reason": "..." }
  ```

### Securing the admin route

`/api/admin/poems` has **no authentication** yet — it's wide open. Before
deploying this anywhere public, add a check at the top of both handlers,
e.g.:

```ts
const token = req.headers.get("x-admin-token")
if (token !== process.env.ADMIN_TOKEN) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

...and set `ADMIN_TOKEN` as another environment variable. A real login
system (NextAuth, Clerk, etc.) would be a better long-term fix, but a
shared secret is enough to stop random visitors from approving/rejecting
poems in the meantime.

## File upload support

`/api/submit` extracts text server-side for `.txt` and `.pdf` files using
the `pdf-parse` package. **EPUB extraction is not implemented** — the
upload UI still lists EPUB as an option in the file picker's existing markup
constraints, but submitting one returns a clear error asking the person to
paste the text or use `.txt`/`.pdf` instead, rather than silently failing.

## Operational notes (Neon specifics)

- **Auto-suspend**: Neon's free tier suspends the compute after 5 minutes
  of inactivity. The first request after a quiet period will be slightly
  slower (cold start) — this is normal and not a bug.
- **Pooled vs. unpooled**: always use the pooled (`-pooler`) URL for the
  running app (many short-lived serverless connections); use the unpooled
  URL for one-off scripts/migrations.
- Both pages that read poem data (`/` and `/poem/[slug]`) are marked
  `export const dynamic = "force-dynamic"` so that newly-approved poems
  show up immediately without needing a rebuild/redeploy.
