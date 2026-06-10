/* ProfileView.jsx — view-mode sections. */
import React, { useState } from "react";
import Icon from "../Components/Icon"
import Badge from "../Components/Badge";
import { initialsOf, titleCase, langLabel, isDefaultDp } from "./profileUtils";

/* ── completeness banner ─────────────────────────────────────── */
export function CompletenessBanner({ stats, onAction, onDismiss }) {
  const r = 24, C = 2 * Math.PI * r;
  const off = C * (1 - stats.filledPercent / 100);
  const missing = stats.missing.slice(0, 3).join(", ");
  const more = stats.missing.length > 3 ? ` +${stats.missing.length - 3} more` : "";
  return (
    <div className="pf-banner" role="region" aria-label="Profile completeness">
      <div className="pf-banner-ring">
        <svg viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--lemon)" strokeWidth="5"
                  strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
                  style={{ transition: "stroke-dashoffset .6s ease" }} />
        </svg>
        <div className="pf-banner-ring-num">{stats.filledPercent}%</div>
      </div>
      <div className="pf-banner-body">
        <div className="pf-banner-title">Your profile is {stats.filledPercent}% complete</div>
        <div className="pf-banner-sub">
          Add your <b>{missing}{more}</b> to help others discover you and boost your standing.
        </div>
      </div>
      <div className="pf-banner-cta">
        <button className="cl-btn cl-btn-primary cl-btn-sm" type="button" onClick={onAction}>
          <Icon name="edit" size={12} /> Complete profile
        </button>
      </div>
      <button className="pf-banner-close" type="button" aria-label="Dismiss" onClick={onDismiss}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

/* ── identity card (view) ────────────────────────────────────── */
function RankMark({ rank }) {
  const [ok, setOk] = useState(true);
  return (
    <span className="pf-rank-chip" title={`${rank.milestonePoints} pts`}>
      {rank.rankBadgeUrl && ok
        ? <img src={rank.rankBadgeUrl} alt="" onError={() => setOk(false)} />
        : <span className="pf-rank-chip-fallback">{rank.rankName.charAt(0)}</span>}
      <span className="pf-rank-chip-name">{rank.rankName}</span>
    </span>
  );
}

function Avatar({ url, first, last }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="pf-avatar">
      <div className="pf-avatar-inner">
        {url && ok && !isDefaultDp(url)
          ? <img src={url} alt="" onError={() => setOk(false)} />
          : initialsOf(first, last)}
      </div>
    </div>
  );
}

function ExperienceItem({ exp }) {
  const [ok, setOk] = useState(true);
  const co = exp.companySlug || {};
  return (
    <div className="pf-exp">
      <div className="pf-exp-logo">
        {co.companyLogoUri && ok
          ? <img src={co.companyLogoUri} alt="" onError={() => setOk(false)} />
          : <span className="pf-exp-logo-fallback">{(co.name || "?").charAt(0)}</span>}
      </div>
      <div className="pf-exp-body">
        <div className="pf-exp-title">{exp.jobTitle}</div>
        <div className="pf-exp-company">{co.name}</div>
        <div className="pf-exp-years">{exp.startYear} — {exp.endYear || "Present"}</div>
      </div>
    </div>
  );
}

function DetailRow({ icon, primary, secondary, empty }) {
  return (
    <div className="pf-detail-row">
      {icon && <div className="pf-detail-ico"><Icon name={icon} size={14} /></div>}
      <div className="pf-detail-main">
        {empty
          ? <span className="pf-none">{empty}</span>
          : <><div className="pf-detail-primary">{primary}</div>
              {secondary && <div className="pf-detail-secondary">{secondary}</div>}</>}
      </div>
    </div>
  );
}

export function IdentityCard({ p }) {
  const loc = p.location ? [p.location.city, p.location.country].filter(Boolean).join(", ") : "";
  const hasSocial = p.githubUrl || p.linkedinUrl || p.twitterUrl;
  return (
    <aside className="pf-id">
      <div className="pf-cover">
        <span className="pf-cover-badge"><Icon name="medal" size={12} style={{ color: "var(--lemon)" }} /> {p.rank.rankName}</span>
      </div>
      <div className="pf-id-body">
        <div className="pf-avatar-wrap">
          <Avatar url={p.profilePictureUrl} first={p.firstName} last={p.lastName} />
        </div>

        <div className="pf-name-row">
          <div style={{ minWidth: 0 }}>
            <h1 className="pf-name">{p.firstName} {p.lastName}</h1>
            <div className="pf-handle">@{p.username}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {p.userOccupation && <span className="pf-occ"><Icon name="briefcase" size={12} /> {p.userOccupation}</span>}
          <RankMark rank={p.rank} />
        </div>

        <div className="pf-divider" />

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="pin" size={12} /> Location</span></div>
          <DetailRow primary={loc} empty={loc ? null : "No location set"} />
        </div>

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="briefcase" size={12} /> Experience</span></div>
          {p.workExperience && p.workExperience.length
            ? p.workExperience.map((e, i) => <ExperienceItem key={i} exp={e} />)
            : <span className="pf-none">No experience added</span>}
        </div>

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="graduation" size={12} /> Education</span></div>
          <DetailRow primary={p.school} empty={p.school ? null : "No school added"} />
        </div>

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="target" size={12} /> Skills</span></div>
          {p.skillTags && p.skillTags.length ? (
            <div className="pf-skills">
              {p.skillTags.map(s => <span key={s} className="pf-skill"><span className="pf-skill-dot" /> {s}</span>)}
            </div>
          ) : <span className="pf-none">No skills added</span>}
        </div>

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="globe" size={12} /> Connect</span></div>
          <div className="pf-socials">
            {p.githubUrl && <a className="pf-social is-github" href={p.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" size={17} /></a>}
            {p.linkedinUrl && <a className="pf-social is-linkedin" href={p.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>}
            {p.twitterUrl && <a className="pf-social is-twitter" href={p.twitterUrl} target="_blank" rel="noreferrer" aria-label="X"><Icon name="twitter" size={14} /></a>}
            {p.email && <a className="pf-social is-mail" href={`mailto:${p.email}`} aria-label="Email"><Icon name="mail" size={15} /></a>}
            {!hasSocial && !p.email && <span className="pf-none">No links added</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── metric cards ────────────────────────────────────────────── */
function MetricCard({ value, suffix, label, icon, accent }) {
  return (
    <div className="pf-metric" style={{ "--metric-accent": accent }}>
      <div className="pf-metric-value">{value}{suffix && <small>{suffix}</small>}</div>
      <div className="pf-metric-label"><span className="pf-metric-ico"><Icon name={icon} size={13} /></span> {label}</div>
    </div>
  );
}

export function MetricRow({ p, solved, total, listCount, badgeCount }) {
  return (
    <div className="pf-metrics">
      <MetricCard value={p.score} label="Score" icon="fire" accent="var(--lemon)" />
      <MetricCard value={solved} suffix={`/ ${total}`} label="Problems solved" icon="target" accent="var(--cyan)" />
      <MetricCard value={listCount} label="Lists curated" icon="list" accent="#A78BFA" />
      <MetricCard value={badgeCount} label="Badges earned" icon="medal" accent="var(--easy)" />
    </div>
  );
}

/* ── problem progress ────────────────────────────────────────── */
const DIFF_COLOR = { Easy: "var(--easy)", Medium: "var(--medium)", Hard: "var(--hard)" };

function ProgressDonut({ rows, solved }) {
  const r = 54, C = 2 * Math.PI * r, seg = C / 3, gap = 7;
  return (
    <svg width="142" height="142" viewBox="0 0 142 142" style={{ display: "block", flexShrink: 0 }}>
      {rows.map((row, i) => (
        <circle key={"t" + i} cx="71" cy="71" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="11"
                strokeLinecap="round" strokeDasharray={`${seg - gap} ${C}`} strokeDashoffset={`-${seg * i + gap / 2}`}
                transform="rotate(-90 71 71)" />
      ))}
      {rows.map((row, i) => {
        const pct = row.total > 0 ? row.solved / row.total : 0;
        return (
          <circle key={"f" + i} cx="71" cy="71" r={r} fill="none" stroke={DIFF_COLOR[row.label]} strokeWidth="11"
                  strokeLinecap="round" strokeDasharray={`${(seg - gap) * pct} ${C}`} strokeDashoffset={`-${seg * i + gap / 2}`}
                  transform="rotate(-90 71 71)" style={{ transition: "stroke-dasharray .7s ease" }} />
        );
      })}
      <text x="71" y="69" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="30" fontWeight="600">{solved}</text>
      <text x="71" y="88" textAnchor="middle" fill="#6B7385" fontFamily="JetBrains Mono" fontSize="9.5" letterSpacing=".18em">SOLVED</text>
    </svg>
  );
}

export function ProgressCard({ rows, solved, total, langs }) {
  return (
    <div className="pf-card">
      <div className="pf-card-head">
        <div>
          <div className="pf-card-title"><span className="pf-titledot" /> Problem progress</div>
          <div className="pf-card-sub">Solved across difficulty tiers</div>
        </div>
        <span className="cl-chip cl-chip-cyan">{solved} / {total} solved</span>
      </div>
      <div className="pf-progress">
        <ProgressDonut rows={rows} solved={solved} />
        <div className="pf-progress-stats">
          {rows.map(row => {
            const pct = row.total > 0 ? (row.solved / row.total) * 100 : 0;
            return (
              <div className="pf-diff-row" key={row.label}>
                <span className="pf-diff-swatch" style={{ background: DIFF_COLOR[row.label] }} />
                <span className="pf-diff-label">{row.label}</span>
                <div className="pf-diff-bar"><div className="pf-diff-fill" style={{ width: `${pct}%`, background: DIFF_COLOR[row.label] }} /></div>
                <span className="pf-diff-counts">{row.solved}<span className="total">/{row.total}</span></span>
              </div>
            );
          })}
        </div>
      </div>
      {langs.length > 0 && (
        <div className="pf-progress-foot">
          <span className="cl-mono" style={{ fontSize: 11, color: "var(--text-mute)", letterSpacing: ".1em", textTransform: "uppercase" }}>Languages</span>
          {langs.map(l => (
            <span className="pf-lang-chip" key={l.key}>
              {langLabel(l.key)}
              <span className="pf-lang-bar"><i style={{ width: `${l.pct}%` }} /></span>
              <span style={{ color: "var(--text-mute)" }}>{l.count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── earned badges (uses <Badge>) ────────────────────────────── */
export function EarnedBadges({ groups, totalEarned }) {
  const entries = Object.entries(groups || {});
  return (
    <div className="pf-card" style={{ overflow: "visible" }}>
      <div className="pf-card-head">
        <div>
          <div className="pf-card-title"><span className="pf-titledot" style={{ background: "var(--lemon)" }} /> Earned badges</div>
          <div className="pf-card-sub">Achievements unlocked across the arena</div>
        </div>
        <span className="cl-chip cl-chip-lemon">{totalEarned} earned</span>
      </div>
      <div className="pf-badges-wrap">
        {entries.length === 0 ? (
          <div className="pf-badge-empty">
            <div className="pf-badge-empty-title">No badges yet</div>
            <div className="pf-badge-empty-sub">Solve problems, keep streaks, and join contests to start collecting badges.</div>
          </div>
        ) : entries.map(([group, badges]) => (
          <div className="pf-badge-group" key={group}>
            <div className="pf-badge-group-label">{group}</div>
            <div className="pf-badge-row">
              {badges.map((b, i) => (
                <Badge key={i} imageUrl={b.imageUrl} name={b.name} description={b.description} size={66} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── lists ───────────────────────────────────────────────────── */
export function ListsCard({ lists }) {
  return (
    <div className="pf-card">
      <div className="pf-card-head">
        <div>
          <div className="pf-card-title"><span className="pf-titledot" style={{ background: "#A78BFA" }} /> Problem lists</div>
          <div className="pf-card-sub">Curated collections & interview prep</div>
        </div>
        <span className="cl-chip cl-mono">{lists.length}</span>
      </div>
      <div className="pf-lists">
        {lists.length === 0 && <span className="pf-none">No problem lists created</span>}
        {lists.map(l => (
          <div className="pf-list-card" key={l.id}>
            <div className="pf-list-top">
              <div className="pf-list-name">{l.name}</div>
              {l.isPinned && <span className="pf-pin"><Icon name="pin2" size={14} /></span>}
            </div>
            <div className="pf-list-desc">{l.description || "—"}</div>
            <div className="pf-list-foot">
              <span className="pf-list-count"><Icon name="list" size={12} /> {l.totalProblems} {l.totalProblems === 1 ? "problem" : "problems"}</span>
              <span style={{ flex: 1 }} />
              <span className={"pf-vis " + (l.isPublic ? "pf-vis-public" : "pf-vis-private")}>
                {l.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── recent submissions ──────────────────────────────────────── */
const STATUS_META = {
  AC:  { label: "Accepted",     cls: "pf-status-ac" },
  WA:  { label: "Wrong Answer", cls: "pf-status-wa" },
  TLE: { label: "Time Limit",   cls: "pf-status-tle" }
};
export function SubmissionsCard({ rows }) {
  return (
    <div className="pf-card">
      <div className="pf-card-head">
        <div>
          <div className="pf-card-title"><span className="pf-titledot" style={{ background: "var(--easy)" }} /> Recent submissions</div>
          <div className="pf-card-sub">Latest attempts in the arena</div>
        </div>
        <a href="#" className="cl-btn cl-btn-ghost cl-btn-sm">View all <Icon name="arrowRight" size={11} /></a>
      </div>
      <table className="pf-subs">
        <thead>
          <tr>
            <th style={{ width: 150 }}>Status</th>
            <th>Problem</th>
            <th style={{ width: 100 }}>Difficulty</th>
            <th style={{ width: 90 }}>Language</th>
            <th style={{ width: 120, textAlign: "right" }}>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const s = STATUS_META[r.status] || STATUS_META.AC;
            return (
              <tr key={i}>
                <td><span className={`pf-status ${s.cls}`}><span className="pf-status-dot" /> {s.label}</span></td>
                <td><a href="#" className="pf-sub-title">{r.id}. {r.title}</a></td>
                <td><span className={`cl-chip cl-chip-${r.diff} cl-chip-dot`}>{titleCase(r.diff)}</span></td>
                <td><span className="pf-sub-lang">{r.lang}</span></td>
                <td style={{ textAlign: "right" }}><span className="pf-sub-time">{r.when}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
