import Link from "next/link"
import { Feather } from "lucide-react"

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center justify-between px-6 md:px-10"
      style={{ background: "var(--dark-bg)", borderBottom: "1px solid #2A2520" }}
    >
      <Link
        href="/"
        className="font-display text-2xl font-bold flex items-center gap-2"
        style={{ color: "var(--paper)" }}
      >
        <Feather size={20} style={{ color: "var(--amber)" }} />
        Verse<span style={{ color: "var(--amber)" }}>.</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <Link
            href="/library"
            className="text-sm font-medium tracking-wide transition-colors"
            style={{ color: "#9A948E" }}
          >
            Library
          </Link>
        </li>
        <li>
          <Link
            href="/library?form=Sonnet"
            className="text-sm font-medium tracking-wide transition-colors"
            style={{ color: "#9A948E" }}
          >
            Forms
          </Link>
        </li>
        <li>
          <Link
            href="/upload"
            className="text-sm font-medium tracking-wide transition-colors"
            style={{ color: "#9A948E" }}
          >
            Upload
          </Link>
        </li>
      </ul>

      <Link
        href="/upload"
        className="px-5 py-2 rounded text-sm font-semibold transition-colors"
        style={{ background: "var(--amber)", color: "var(--dark-bg)" }}
      >
        Share a Poem
      </Link>
    </nav>
  )
}
