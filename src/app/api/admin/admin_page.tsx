"use client"

import { useEffect, useState, useCallback } from "react"
import { CheckCircle2, XCircle, Clock, BookOpen, User, Tag, Globe, ChevronDown, ChevronUp, RefreshCw, Loader2 } from "lucide-react"

interface Submission {
  id: string
  title: string
  author: string
  slug: string
  form: string
  language: string
  description: string
  content: string
  lines: number
  status: "pending" | "approved" | "rejected"
  submitter_email: string | null
  created_at: string
}

type FilterStatus = "pending" | "approved" | "rejected"

export default function AdminPage() {
  const [poems, setPoems] = useState<Submission[]>([])
  const [status, setStatus] = useState<FilterStatus>("pending")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null)

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchPoems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/poems?status=${status}`)
      const data = await res.json()
      setPoems(data.poems ?? [])
    } catch {
      showToast("Failed to load submissions.", true)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchPoems()
  }, [fetchPoems])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action)
    try {
      const res = await fetch("/api/admin/poems", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action,
          reason: action === "reject" ? rejectReason[id] ?? "" : undefined,
          reviewedBy: "admin",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error ?? "Action failed.", true)
        return
      }
      showToast(action === "approve" ? "✅ Poem approved!" : "Poem rejected.")
      setPoems((prev) => prev.filter((p) => p.id !== id))
      setExpanded(null)
    } catch {
      showToast("Network error.", true)
    } finally {
      setActionLoading(null)
    }
  }

  const counts: Record<FilterStatus, number | null> = { pending: null, approved: null, rejected: null }

  const statusColors: Record<FilterStatus, string> = {
    pending: "var(--amber)",
    approved: "#16a34a",
    rejected: "#dc2626",
  }

  const statusIcons = {
    pending: <Clock size={14} />,
    approved: <CheckCircle2 size={14} />,
    rejected: <XCircle size={14} />,
  }

  return (
    <div className="min-h-screen px-6 md:px-10 py-12" style={{ background: "var(--offwhite)" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] mb-2"
            style={{ color: "var(--amber)" }}
          >
            <span className="block w-3.5 h-px" style={{ background: "var(--amber)" }} />
            Admin
            <span className="block w-3.5 h-px" style={{ background: "var(--amber)" }} />
          </div>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
            Submission Review
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Review, approve, or reject poems submitted by readers.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["pending", "approved", "rejected"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setExpanded(null) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium capitalize transition-all"
              style={{
                background: status === s ? statusColors[s] : "white",
                color: status === s ? "white" : "var(--muted)",
                border: `1.5px solid ${status === s ? statusColors[s] : "var(--border)"}`,
              }}
            >
              {statusIcons[s]}
              {s}
            </button>
          ))}
          <button
            onClick={fetchPoems}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors"
            style={{ color: "var(--muted)", border: "1.5px solid var(--border)", background: "white" }}
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24" style={{ color: "var(--muted)" }}>
            <Loader2 size={24} className="animate-spin mr-3" />
            Loading submissions…
          </div>
        ) : poems.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "white" }}
          >
            <BookOpen size={36} className="mx-auto mb-3" style={{ color: "var(--border)" }} />
            <p className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>
              No {status} submissions
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {status === "pending" ? "All caught up — check back later." : `No poems have been ${status} yet.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {poems.map((poem) => {
              const isExpanded = expanded === poem.id
              const isActing = actionLoading?.startsWith(poem.id)
              return (
                <div
                  key={poem.id}
                  className="rounded-2xl border overflow-hidden transition-shadow"
                  style={{
                    borderColor: "var(--border)",
                    background: "white",
                    boxShadow: isExpanded ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
                  }}
                >
                  {/* Card header */}
                  <button
                    className="w-full text-left px-6 py-5 flex items-start gap-4"
                    onClick={() => setExpanded(isExpanded ? null : poem.id)}
                  >
                    {/* Amber accent bar */}
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: status === "pending" ? "var(--amber)" : statusColors[status] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-display text-lg font-bold leading-tight" style={{ color: "var(--ink)" }}>
                            {poem.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                              <User size={11} /> {poem.author}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                              <Tag size={11} /> {poem.form}
                            </span>
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                              <Globe size={11} /> {poem.language}
                            </span>
                            <span className="text-xs" style={{ color: "var(--muted)" }}>
                              {poem.lines} lines
                            </span>
                          </div>
                          {poem.submitter_email && (
                            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                              📧 {poem.submitter_email}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs" style={{ color: "var(--muted)" }}>
                            {new Date(poem.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {isExpanded ? <ChevronUp size={16} style={{ color: "var(--muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--muted)" }} />}
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2 font-serif-body" style={{ color: "var(--muted)" }}>
                        {poem.description}
                      </p>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t" style={{ borderColor: "var(--border)" }}>

                      {/* Description */}
                      <div className="mt-4 mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Description</p>
                        <p className="text-sm font-serif-body leading-relaxed" style={{ color: "var(--ink)" }}>{poem.description}</p>
                      </div>

                      {/* Poem content */}
                      <div
                        className="rounded-xl px-6 py-5 mb-5"
                        style={{ background: "var(--paper)", border: "1px solid var(--border)" }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>Poem</p>
                        <pre
                          className="font-serif-body text-sm leading-8 whitespace-pre-wrap"
                          style={{ color: "var(--ink)", fontFamily: "Lora, serif" }}
                        >
                          {poem.content}
                        </pre>
                      </div>

                      {/* Actions (only for pending) */}
                      {status === "pending" && (
                        <div className="flex flex-col gap-3">
                          {/* Reject reason input */}
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wide mb-1 block" style={{ color: "var(--muted)" }}>
                              Rejection reason <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Duplicate submission, doesn't meet guidelines…"
                              value={rejectReason[poem.id] ?? ""}
                              onChange={(e) => setRejectReason((prev) => ({ ...prev, [poem.id]: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                              style={{ borderColor: "var(--border)", color: "var(--ink)" }}
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAction(poem.id, "approve")}
                              disabled={!!isActing}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                              style={{ background: "#16a34a", color: "white" }}
                            >
                              {actionLoading === poem.id + "approve" ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={15} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(poem.id, "reject")}
                              disabled={!!isActing}
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                              style={{ background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca" }}
                            >
                              {actionLoading === poem.id + "reject" ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <XCircle size={15} />
                              )}
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status badge for non-pending */}
                      {status !== "pending" && (
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold capitalize"
                          style={{
                            background: status === "approved" ? "#f0fdf4" : "#fef2f2",
                            color: statusColors[status],
                          }}
                        >
                          {statusIcons[status]}
                          {status}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 right-8 max-w-xs px-6 py-4 rounded-lg text-sm font-medium z-50"
          style={{
            background: toast.error ? "#7A1F1F" : "#1E1A16",
            color: "var(--paper)",
            borderLeft: `4px solid ${toast.error ? "#E0716B" : "var(--amber)"}`,
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
