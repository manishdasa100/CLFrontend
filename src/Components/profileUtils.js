/* utils.js — pure helpers + completeness logic (no JSX). */

export const LANG_LABELS = {
  java: "Java", javascript: "JavaScript", python: "Python",
  cpp: "C++", c: "C", go: "Go", rust: "Rust"
};
export const DEFAULT_DP_MARKER = "default_user_dp";

export function initialsOf(f, l) {
  return (((f || "")[0] || "") + ((l || "")[0] || "")).toUpperCase();
}
export function titleCase(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
export function langLabel(k) { return LANG_LABELS[k] || titleCase(k); }
export function isDefaultDp(url) { return !url || url.includes(DEFAULT_DP_MARKER); }
export function clone(o) { return JSON.parse(JSON.stringify(o)); }
export function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

/* Evaluate which "enrichable" fields are filled. Returns the percent of
   EMPTY fields; the completeness banner shows when emptyPercent > 30. */
export function evaluateCompleteness(p) {
  const checks = [
    { key: "profilePicture", label: "profile photo",  filled: !!p.profilePictureUrl && !p.profilePictureUrl.includes(DEFAULT_DP_MARKER) },
    { key: "occupation",     label: "occupation",      filled: !!(p.userOccupation && p.userOccupation.trim()) },
    { key: "location",       label: "location",        filled: !!(p.location && (p.location.city || p.location.country)) },
    { key: "school",         label: "school",          filled: !!(p.school && p.school.trim()) },
    { key: "skills",         label: "skills",          filled: Array.isArray(p.skillTags) && p.skillTags.length > 0 },
    { key: "experience",     label: "work experience", filled: Array.isArray(p.workExperience) && p.workExperience.length > 0 },
    { key: "github",         label: "GitHub",          filled: !!p.githubUrl },
    { key: "linkedin",       label: "LinkedIn",        filled: !!p.linkedinUrl },
    { key: "twitter",        label: "X / Twitter",     filled: !!p.twitterUrl }
  ];
  const total = checks.length;
  const filled = checks.filter(c => c.filled).length;
  const empty = total - filled;
  const emptyPercent = Math.round((empty / total) * 100);
  const filledPercent = 100 - emptyPercent;
  const missing = checks.filter(c => !c.filled).map(c => c.label);
  return { total, filled, empty, emptyPercent, filledPercent, missing, showBanner: emptyPercent > 30 };
}

/* Derive problem-progress rows from the two stat payloads. */
export function buildProgress(stats, counts) {
  const order = [["EASY", "Easy"], ["MEDIUM", "Medium"], ["HARD", "Hard"]];
  const rows = order.map(([k, label]) => ({
    label,
    solved: (stats?.solvedCountByDifficulty?.[k]) || 0,
    total: (counts?.[k]) || 0
  }));
  const solved = rows.reduce((a, r) => a + r.solved, 0);
  const total = rows.reduce((a, r) => a + r.total, 0);
  const langEntries = Object.entries(stats?.solvedCountByLanguage || {});
  const maxLang = langEntries.reduce((m, [, c]) => Math.max(m, c), 0) || 1;
  const langs = langEntries.map(([key, count]) => ({ key, count, pct: Math.round((count / maxLang) * 100) }));
  return { rows, solved, total, langs };
}

export function countBadges(groups) {
  return Object.values(groups || {}).reduce((a, arr) => a + (arr ? arr.length : 0), 0);
}

/* Normalize a draft before persisting (trim, drop empties, coerce years). */
export function sanitizeProfile(d) {
  const n = clone(d);
  n.skillTags = (n.skillTags || []).map(s => s.trim()).filter(Boolean);
  n.workExperience = (n.workExperience || []).filter(e => e.companySlug.name.trim() || e.jobTitle.trim());
  n.workExperience.forEach(e => {
    e.startYear = e.startYear ? Number(e.startYear) : "";
    e.endYear = e.endYear ? Number(e.endYear) : "";
  });
  ["githubUrl", "linkedinUrl", "twitterUrl"].forEach(k => { if (n[k] != null && !n[k].trim()) n[k] = null; });
  if (n.userOccupation != null && !n.userOccupation.trim()) n.userOccupation = null;
  if (n.school != null && !n.school.trim()) n.school = null;
  return n;
}
