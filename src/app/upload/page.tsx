"use client"

import { useRef, useState } from "react"
import { UploadCloud, CheckCircle2, ArrowRight, PenLine } from "lucide-react"

const FORMS = [
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

export default function UploadPage() {
  const [mode, setMode] = useState<"write" | "file">("write")
  const [file, setFile] = useState<File | null>(null)
  const [poemText, setPoemText] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File | null) => {
    if (!f) return
    setFile(f)
  }

  const hasContent = mode === "write" ? poemText.trim().length > 0 : !!file

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setToast("🪶 Your poem has been submitted! It will appear in the anthology shortly.")
    setFile(null)
    setPoemText("")
    if (inputRef.current) inputRef.current.value = ""
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="px-6 md:px-10 py-20" style={{ background: "var(--offwhite)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] mb-2"
          style={{ color: "var(--amber)" }}
        >
          <span className="block w-3.5 h-px" style={{ background: "var(--amber)" }} />
          Share Your Work
          <span className="block w-3.5 h-px" style={{ background: "var(--amber)" }} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--ink)" }}>
          Publish Your Poem
        </h1>
        <p className="font-serif-body" style={{ color: "var(--muted)" }}>
          No gatekeepers. No algorithms. Just your words, your readers.
        </p>

        {/* Mode toggle */}
        <div
          className="inline-flex gap-1 border rounded-md p-1 mt-8"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={() => setMode("write")}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: mode === "write" ? "var(--amber)" : "transparent",
              color: mode === "write" ? "var(--dark-bg)" : "var(--muted)",
            }}
          >
            <PenLine size={14} />
            Write it here
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: mode === "file" ? "var(--amber)" : "transparent",
              color: mode === "file" ? "var(--dark-bg)" : "var(--muted)",
            }}
          >
            <UploadCloud size={14} />
            Upload a file
          </button>
        </div>

        {/* Write mode */}
        {mode === "write" && (
          <div className="mt-8 text-left">
            <label
              className="text-xs font-semibold uppercase tracking-wide mb-2 block"
              style={{ color: "var(--muted)" }}
            >
              Your poem
            </label>
            <textarea
              value={poemText}
              onChange={(e) => setPoemText(e.target.value)}
              placeholder={"Write or paste your poem here.\nLine breaks are preserved exactly as you type them."}
              className="w-full px-5 py-4 rounded-lg border text-sm outline-none font-serif-body resize-y"
              style={{
                borderColor: "var(--border)",
                color: "var(--ink)",
                minHeight: "220px",
                lineHeight: 1.8,
              }}
            />
          </div>
        )}

        {/* File mode */}
        {mode === "file" && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFile(e.dataTransfer.files[0] ?? null)
              }}
              className="relative border-2 border-dashed rounded-xl px-8 py-16 mt-8 bg-white transition-colors cursor-pointer"
              style={{
                borderColor: dragOver ? "var(--amber)" : "var(--border)",
                background: dragOver ? "#FEF9F0" : "white",
              }}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.epub,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: "#FEF3E0" }}
              >
                <UploadCloud size={28} style={{ color: "var(--amber)" }} />
              </div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                Drop your poem file here
              </h3>
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                or click to browse your files
              </p>
              <div className="text-xs tracking-wide" style={{ color: "#B0A89E" }}>
                PDF · EPUB · TXT — up to 50MB
              </div>
            </div>

            {file && (
              <div
                className="flex items-center gap-4 mt-4 rounded-lg px-6 py-4 text-left"
                style={{ background: "#F0FFF4", border: "1.5px solid #86EFAC" }}
              >
                <CheckCircle2 size={24} style={{ color: "#166534" }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#166534" }}>
                    {file.name}
                  </div>
                  <div className="text-xs" style={{ color: "#4ADE80" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {hasContent && (
          <form onSubmit={handleSubmit} className="mt-8 text-left">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Poem Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What the River Keeps"
                  className="px-4 py-2.5 rounded-md border text-sm outline-none"
                  style={{ borderColor: "var(--border)", color: "var(--ink)" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Poet Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name or pen name"
                  className="px-4 py-2.5 rounded-md border text-sm outline-none"
                  style={{ borderColor: "var(--border)", color: "var(--ink)" }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Form
                </label>
                <select
                  required
                  defaultValue=""
                  className="px-4 py-2.5 rounded-md border text-sm outline-none bg-white"
                  style={{ borderColor: "var(--border)", color: "var(--ink)" }}
                >
                  <option value="" disabled>
                    Select a form
                  </option>
                  {FORMS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Language
                </label>
                <select
                  defaultValue="English"
                  className="px-4 py-2.5 rounded-md border text-sm outline-none bg-white"
                  style={{ borderColor: "var(--border)", color: "var(--ink)" }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                Description
              </label>
              <textarea
                required
                placeholder="A short note about your poem — what inspired it, what it's about."
                className="px-4 py-3 rounded-md border text-sm outline-none min-h-[100px] resize-y"
                style={{ borderColor: "var(--border)", color: "var(--ink)" }}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded font-semibold text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--amber)", color: "var(--dark-bg)" }}
            >
              Publish to Verse
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      {toast && (
        <div
          className="fixed bottom-8 right-8 max-w-xs px-6 py-4 rounded-lg text-sm font-medium z-[500]"
          style={{
            background: "#1E1A16",
            color: "var(--paper)",
            borderLeft: "4px solid var(--amber)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
