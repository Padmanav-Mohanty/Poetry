import { Pool, types } from "pg"

// By default, node-postgres parses the DATE type (OID 1082) into a JS Date
// object in the *local* timezone of the server process. For a date-only
// column like `uploaded_at`, that round-trip can shift the calendar day
// depending on the server's TZ — e.g. a `DATE '2026-05-02'` can come back
// as April 1st in a UTC-negative timezone. Since we only ever want the
// plain "YYYY-MM-DD" string (and do our own formatting in the UI), we
// disable that conversion here and keep the raw text Postgres sends back.
const PG_DATE_OID = 1082
types.setTypeParser(PG_DATE_OID, (value: string) => value)

// Reuse a single pool across hot-reloads in dev and across serverless
// invocations where possible (Next.js + Neon best practice).
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local — see db/README.md for the Neon connection string format."
    )
  }

  // Neon always requires SSL, and its connection strings always include
  // `sslmode=require`. We also check for the neon.tech hostname as a
  // fallback in case a connection string is passed without that param.
  const needsSsl =
    connectionString.includes("sslmode=require") ||
    connectionString.includes("sslmode=verify-full") ||
    connectionString.includes(".neon.tech")

  return new Pool({
    connectionString,
    // `rejectUnauthorized: false` matches sslmode=require semantics (encrypt
    // but don't verify the CA chain). For stricter verification, use
    // sslmode=verify-full in the connection string and supply a CA bundle.
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool()
  }
  return global.__pgPool
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool()
  const result = await pool.query(text, params)
  return result.rows as T[]
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
