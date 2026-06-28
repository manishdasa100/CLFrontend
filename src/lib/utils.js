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

export const formatFieldName = (field) => {
    if (field === undefined) return
    return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
}

export const percentisize = (num, deno) => {
    return ((num / deno) * 100).toFixed(0) + "%"
}

// The backend sends a zone-less Asia/Kolkata (IST, UTC+05:30) wall-clock timestamp
// with nanosecond precision, e.g. "2026-06-28T18:18:31.494364200". JS would read a
// zone-less string as the viewer's local time, so we anchor it to IST (fixed, no DST)
// and truncate the fraction to milliseconds before parsing.
const IST_OFFSET = "+05:30"

const parseIstTimestamp = (raw) => {
    if (!raw) return null
    const [datePart, timePart = "00:00:00"] = raw.split("T")
    const [clock, frac = ""] = timePart.split(".")
    const millis = frac.slice(0, 3).padEnd(3, "0")
    const date = new Date(`${datePart}T${clock}.${millis}${IST_OFFSET}`)
    return Number.isNaN(date.getTime()) ? null : date
}

// Human-friendly elapsed time since an IST submission timestamp. Each tier is derived
// from the previous floor so boundaries (e.g. 12 months) never produce "0 years ago".
export const timeAgo = (raw) => {
    const date = parseIstTimestamp(raw)
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

// Single source of truth for judge verdicts, shared across the problem and profile
// submission views. `tier` drives semantic color (pass=green, wrong=amber, error=red);
// `ran` mirrors the backend runSuccess flag.
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