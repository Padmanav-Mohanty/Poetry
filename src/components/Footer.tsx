import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-10 py-12"
      style={{ background: "var(--dark-bg)", borderTop: "1px solid #1E1A16" }}
    >
      <div className="font-display text-xl font-bold" style={{ color: "var(--paper)" }}>
        Verse<span style={{ color: "var(--amber)" }}>.</span>
      </div>

      <ul className="flex gap-8 list-none">
        {["About", "Guidelines", "Privacy", "Contact"].map((item) => (
          <li key={item}>
            <Link
              href="#"
              className="text-xs transition-colors"
              style={{ color: "#6A6560" }}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      <div className="text-xs" style={{ color: "#4A4540" }}>
        © 2026 Verse. Free to read, free to share.
      </div>
    </footer>
  )
}
