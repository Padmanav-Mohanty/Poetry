/** Turns a poem title into a URL-safe slug, e.g. "What the River Keeps" -> "what-the-river-keeps" */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/'/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/** Counts non-empty lines, matching how `lines` was derived for the original seed poems. */
export function countLines(content: string): number {
  return content
    .split("\n")
    .filter((line) => line.trim().length > 0).length
}
