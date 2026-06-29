/* ProfileView.jsx — view-mode sections. */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Components/Icon"
import Badge from "../Components/Badge";
import { initialsOf, titleCase, langLabel, isDefaultDp } from "./profileUtils";
import { timeAgo, SUBMISSION_STATUS } from "../lib/utils";
import { useRecentSubmissions } from "../services/queries";

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
function RankBadge({ rank }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="pf-rank-badge" tabIndex={0} role="img" aria-label={`Rank: ${rank.rankName}`}>
      {rank.rankBadgeUrl && ok
        ? <img src={rank.rankBadgeUrl} alt="" onError={() => setOk(false)} />
        : <span className="pf-rank-badge-fallback">{rank.rankName.charAt(0)}</span>}
      <div className="pf-rank-tip" role="tooltip">
        Rank: {rank.rankName}
        <span className="pf-rank-tip-arrow" aria-hidden="true" />
      </div>
    </div>
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

/* chronological order — earliest role first; ongoing roles (no end year) sort last on ties */
function sortExperiences(exps) {
  return [...exps].sort((a, b) => {
    const sa = Number(a.startYear) || 0;
    const sb = Number(b.startYear) || 0;
    if (sa !== sb) return sa - sb;
    const ea = a.endYear ? Number(a.endYear) : Infinity;
    const eb = b.endYear ? Number(b.endYear) : Infinity;
    return ea - eb;
  });
}

function ExperienceItem({ exp }) {
  const [ok, setOk] = useState(true);
  const co = exp.company || {};
  return (
    <div className="pf-exp">
      <div className="pf-exp-logo">
        {co.companyLogoUri && ok
          ? <img src={co.companyLogoUri} alt="" loading="lazy" onError={() => setOk(false)} />
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
      <div className="pf-cover" />
      <div className="pf-id-body">
        <div className="pf-avatar-wrap">
          <Avatar url={p.profilePictureUrl} first={p.firstName} last={p.lastName} />
        </div>

        <div className="pf-name-row">
          <div style={{ minWidth: 0 }}>
            <h1 className="pf-name">{p.firstName} {p.lastName}</h1>
            <div className="pf-handle">@{p.username}</div>
          </div>
          {p.rank && <RankBadge rank={p.rank} />}
        </div>

        {p.userOccupation && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span className="pf-occ"><Icon name="briefcase" size={12} /> {p.userOccupation}</span>
          </div>
        )}

        <div className="pf-divider" />

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="pin" size={12} /> Location</span></div>
          <DetailRow primary={loc} empty={loc ? null : "No location set"} />
        </div>

        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="briefcase" size={12} /> Experience</span></div>
          {p.workExperience && p.workExperience.length
            ? sortExperiences(p.workExperience).map((e, i) => <ExperienceItem key={i} exp={e} />)
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
export function EarnedBadges({ groups, totalEarned, isOwner }) {
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
            {isOwner && <div className="pf-badge-empty-sub">Solve problems, keep streaks, and join contests to start collecting badges.</div>}
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
  const navigate = useNavigate();
  // pinned lists first; stable sort keeps the rest in their original order
  const sortedLists = [...lists].sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned));
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
        {sortedLists.map(l => (
          <div
            className="pf-list-card"
            key={l.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/lists/${l.creator}/${encodeURIComponent(l.name)}`)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/lists/${l.creator}/${encodeURIComponent(l.name)}`); } }}
          >
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
const SUB_TIER_CLASS = { pass: "pf-status-pass", wrong: "pf-status-wrong", error: "pf-status-error" };

export function SubmissionsCard({ username, isOwner }) {
  // limit 6 by default; "View all" refetches the full history without a limit.
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  // collapse back to the default 6 when switching to a different profile
  useEffect(() => { setShowAll(false); }, [username]);
  const { data: rows = [], isLoading, isError, isFetching, refetch } = useRecentSubmissions(username, showAll ? undefined : 6);

  return (
    <div className="pf-card">
      <div className="pf-card-head">
        <div>
          <div className="pf-card-title"><span className="pf-titledot" style={{ background: "var(--easy)" }} /> Recent submissions</div>
          <div className="pf-card-sub">Your latest attempts in the arena</div>
        </div>
        {!isError && rows.length > 0 && (showAll ? (
          <button className="cl-btn cl-btn-ghost cl-btn-sm" type="button" onClick={() => setShowAll(false)} disabled={isFetching}>
            {isFetching ? "Loading…" : "Show less"}
          </button>
        ) : rows.length >= 6 ? (
          <button className="cl-btn cl-btn-ghost cl-btn-sm" type="button" onClick={() => setShowAll(true)} disabled={isFetching}>
            {isFetching ? "Loading…" : <>View all <Icon name="arrowRight" size={11} /></>}
          </button>
        ) : null)}
      </div>

      {isLoading ? (
        <div className="pf-subs-msg">Loading recent submissions…</div>
      ) : isError ? (
        <div className="pf-subs-msg">
          Couldn’t load your submissions.
          <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={() => refetch()} style={{ marginLeft: 10 }}>
            <Icon name="reset" size={12} /> Try again
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="pf-subs-empty">
          <div className="pf-subs-empty-title">No submissions yet</div>
          {isOwner && <div className="pf-subs-empty-sub">Solve a problem in the arena and your attempts will show up here.</div>}
        </div>
      ) : (
        <table className="pf-subs">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Status</th>
              <th>Problem</th>
              <th style={{ width: 100 }}>Difficulty</th>
              <th style={{ width: 96 }}>Language</th>
              <th style={{ width: 120, textAlign: "right" }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const meta = SUBMISSION_STATUS[r.status] || { label: r.status, tier: "error" };
              const prob = r.problemData || {};
              const pid = prob.id ?? r.problemId;
              const diff = (prob.difficulty || "").toLowerCase();
              const open = () => r.submissionId && navigate(`/submission/${r.submissionId}`);
              return (
                <tr
                  key={r.submissionId ?? i}
                  className="pf-sub-row"
                  role="button"
                  tabIndex={0}
                  onClick={open}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
                >
                  <td><span className={`pf-status ${SUB_TIER_CLASS[meta.tier]}`}><span className="pf-status-dot" /> {meta.label}</span></td>
                  <td><span className="pf-sub-title">{pid != null ? `${pid}. ` : ""}{prob.title}</span></td>
                  <td>{diff && <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{titleCase(prob.difficulty)}</span>}</td>
                  <td><span className="pf-sub-lang">{langLabel((r.language || "").toLowerCase())}</span></td>
                  <td style={{ textAlign: "right" }}><span className="pf-sub-time">{timeAgo(r.dateOfSubmission)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
