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

/* Build a minimal PATCH payload — only fields the user actually changed.
   Returns { payload, locationWarning }.
   locationWarning is true when the user filled only one of city/country. */
export function buildProfileUpdatePayload(original, cleaned) {
  const payload = {};

  // userOccupation: null when cleared
  const origOcc = original.userOccupation || null;
  const newOcc  = cleaned.userOccupation  || null;
  if (origOcc !== newOcc) payload.userOccupation = newOcc;

  // school, github, linkedin, twitter: "" (not null) when cleared
  for (const key of ['school', 'githubUrl', 'linkedinUrl', 'twitterUrl']) {
    const origVal = original[key] || "";
    const newVal  = cleaned[key]  || "";
    if (origVal !== newVal) payload[key] = newVal;
  }

  // skillTags
  const origTags = JSON.stringify(original.skillTags || []);
  const newTags  = JSON.stringify(cleaned.skillTags  || []);
  if (origTags !== newTags) payload.skillTags = cleaned.skillTags || [];

  // location: partial fill → warning; both empty → { city: "", country: "" }
  const origCity    = (original.location?.city    || "").trim();
  const origCountry = (original.location?.country || "").trim();
  const newCity     = (cleaned.location?.city     || "").trim();
  const newCountry  = (cleaned.location?.country  || "").trim();

  let locationWarning = false;
  if (origCity !== newCity || origCountry !== newCountry) {
    if ((newCity && !newCountry) || (!newCity && newCountry)) {
      locationWarning = true;
    } else {
      payload.location = { city: newCity || null, country: newCountry || null };
    }
  }

  // workExperience: original (GET) has nested company; cleaned (draft) has flat companyName
  const toFlat = (getCompanyName) => (e) => ({
    companyName: (getCompanyName(e) || "").trim(),
    jobTitle:    (e.jobTitle  || "").trim(),
    startYear:   e.startYear ? Number(e.startYear) : null,
    endYear:     e.endYear   ? Number(e.endYear)   : null,
  });
  const origExpStr = JSON.stringify((original.workExperience || []).map(toFlat(e => e.company?.name)));
  const newExpStr  = JSON.stringify((cleaned.workExperience  || []).map(toFlat(e => e.companyName)));
  if (origExpStr !== newExpStr) payload.workExperience = (cleaned.workExperience || []).map(toFlat(e => e.companyName));

  return { payload, locationWarning };
}

/* Normalize a draft before persisting (trim, drop empties, coerce years). */
export function sanitizeProfile(d) {
  const n = clone(d);
  n.skillTags = (n.skillTags || []).map(s => s.trim()).filter(Boolean);
  n.workExperience = (n.workExperience || []).filter(e => (e.companyName || "").trim() || (e.jobTitle || "").trim());
  n.workExperience.forEach(e => {
    e.startYear = e.startYear ? Number(e.startYear) : "";
    e.endYear = e.endYear ? Number(e.endYear) : "";
  });
  ["githubUrl", "linkedinUrl", "twitterUrl"].forEach(k => { if (n[k] != null && !n[k].trim()) n[k] = null; });
  if (n.userOccupation != null && !n.userOccupation.trim()) n.userOccupation = null;
  if (n.school != null && !n.school.trim()) n.school = null;
  return n;
}
