import Link from "next/link"
import { Poem } from "@/types"

export default function PoemCard({ poem }: { poem: Poem }) {
  const [c1, c2, c3] = poem.coverColor

  return (
    <Link
      href={`/poem/${poem.slug}`}
      className="group flex-shrink-0 w-[180px] block"
    >
      <div
        className="relative w-[180px] h-[260px] rounded-[4px_10px_10px_4px] overflow-hidden mb-4 transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
          boxShadow: "6px 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-3"
          style={{ background: "rgba(0,0,0,0.25)" }}
        />
        <div className="flex flex-col items-center justify-center text-center h-full px-6">
          <p
            className="font-display text-sm font-bold leading-snug mb-2"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {poem.title}
          </p>
          <p
            className="text-[0.65rem] italic"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {poem.author}
          </p>
        </div>
      </div>

      <h4 className="font-display text-[0.95rem] font-bold leading-snug mb-1" style={{ color: "var(--card-fg, var(--ink))" }}>
        {poem.title}
      </h4>
      <div className="text-xs mb-2" style={{ color: "var(--card-muted, var(--muted))" }}>
        {poem.author}
      </div>
      <span
        className="inline-block text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm"
        style={{ background: "rgba(200,131,42,0.15)", color: "var(--amber)" }}
      >
        {poem.form}
      </span>
    </Link>
  )
}
