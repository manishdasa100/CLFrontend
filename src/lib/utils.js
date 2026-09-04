export const textMapForProblemStatus = {
    ACC: "Solved",
    ATT: "Attempted",
    NATT: "Unattempted"
}

export const languageCodes = {
    java: "JAVA",
    python: "PYTHON",
    cpp:"CPP",
    c: "C",
    golang:"GO",
    javascript: "JAVASCRIPT",
    rust:"RUST"
}

// Base64 (UTF-8) → text, decoded through bytes so non-ASCII survives. Returns ""
// on malformed input instead of throwing: a bad payload from the judge or a
// truncated snippet must not take down the whole page.
export const decodeBase64Utf8 = (b64) => {
    if (!b64) return ""
    try {
        const bin = atob(b64)
        const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0))
        return new TextDecoder().decode(bytes)
    } catch {
        return ""
    }
}

export const formatFieldName = (field) => {
    if (field === undefined) return
    return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
}

export const percentisize = (num, deno) => {
    return ((num / deno) * 100).toFixed(0) + "%"
}

// The backend sends dateOfSubmission as a UTC instant (ISO-8601 with a Z suffix),
// e.g. "2026-07-03T13:55:29.296519Z". new Date() parses the offset natively, so the
// resulting instant is correct in any viewer timezone; it's then displayed in the
// viewer's own local timezone.
const parseInstant = (raw) => {
    if (!raw) return null
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : date
}

// Human-friendly elapsed time since a submission. Each tier is derived from the
// previous floor so boundaries (e.g. 12 months) never produce "0 years ago".
export const timeAgo = (raw) => {
    const date = parseInstant(raw)
    if (!date) return null

    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 5) return "just now"
    if (mins < 60) return `${mins} mins ago`

    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`

    const years = Math.floor(months / 12)
    return `${years} year${years === 1 ? "" : "s"} ago`
}

// Absolute submission time in the viewer's local timezone, e.g. "Jul 3, 2026 · 19:25".
export const formatSubmittedAt = (raw) => {
    const date = parseInstant(raw)
    if (!date) return ""
    const datePart = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    const timePart = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${datePart} · ${timePart}`
}

// Single source of truth for judge verdicts, shared across the problem and profile
// submission views. `tier` drives semantic color (pass=green, wrong=amber, error=red);
// `ran` mirrors the backend runSuccess flag.
// Tier → presentation, kept next to the tiers themselves so the problem page and
// the Houston hint log can't drift on what "wrong" or "error" looks like.
export const TIER_COLOR = { pass: "var(--easy)", wrong: "var(--medium)", error: "var(--hard)" }
export const TIER_VARIANT = { pass: "success", wrong: "warning", error: "danger" }

export const SUBMISSION_STATUS = {
    ACC: { label: "Accepted",              tier: "pass",  ran: true },
    WA:  { label: "Wrong Answer",          tier: "wrong", ran: true },
    TLE: { label: "Time Limit Exceeded",   tier: "wrong", ran: true },
    MLE: { label: "Memory Limit Exceeded", tier: "wrong", ran: true },
    OLE: { label: "Output Limit Exceeded", tier: "wrong", ran: true },
    CE:  { label: "Compilation Error",     tier: "error", ran: false },
    RE:  { label: "Runtime Error",         tier: "error", ran: false },
    IE:  { label: "Internal Error",        tier: "error", ran: false },
}