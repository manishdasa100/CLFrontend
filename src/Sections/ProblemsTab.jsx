import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "../Components/Icon";
import Spinner from "../Components/Spinner";
import MultiSelect from "../Components/MultiSelect";
import ProblemOfTheDayCard from "../Components/ProblemOfTheDayCard";
import { useARandomProblemId, useProblemsData, useAllTopics, useAllCompanies, useUserStreak, useUserSubmissionStatus, useProblemCounts } from "../services/queries";
import { formatFieldName } from "../lib/utils";
import "../styles/arena.css";

const ProblemsTab = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());

  const { data: topicsList = [] } = useAllTopics();
  const { data: companiesList = [] } = useAllCompanies();

  const difficultySet = useMemo(() => difficulty === "all" ? new Set() : new Set([difficulty.toUpperCase()]), [difficulty]);
  const statusSet = useMemo(() => {
    if (status === "all") return new Set();
    const map = { solved: "ACC", attempted: "ATT", todo: "NATT" };
    return new Set([map[status]]);
  }, [status]);

  const { isLoading, isFetching, data: problemsList, error } = useProblemsData(page, rowsPerPage, {
    difficulty: difficultySet, topics: selectedTopics, companies: selectedCompanies,
  });

  // getARandomProblemId returns null when the catalog is empty — don't navigate to /null.
  const { isLoading: loadingRand, isFetching: fetchingRand, refetch: pickRandom } = useARandomProblemId((id) => { if (id != null) navigate(`${id}`); });

  const totalPages = useMemo(() => Math.max(1, Math.ceil((problemsList?.total ?? 0) / rowsPerPage)), [problemsList?.total, rowsPerPage]);
  const rowStatusClass = (s) => s === "ACC" ? "solved" : s === "ATT" ? "attempted" : "none";

  if (error) {
    return (
      <div className="cl-container" style={{ paddingBottom: 40 }}>
        <div className="cl-card" style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
          We couldn't load the problem list. Try again in a moment.
        </div>
      </div>
    );
  }

  const rows = problemsList?.entities ?? [];

  return (
    <div className="cl-container" style={{ paddingBottom: 40 }}>
      <ArenaHeader />
      <div className="cl-card">
        <div className="cl-card-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="cl-card-title">Problems</h2>
              <span className="cl-chip cl-chip-cyan">{problemsList?.total ?? 0} total</span>
            </div>
            <div className="cl-card-sub">Filter, pick, solve. Or try a random one.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={() => { setDifficulty("all"); setStatus("all"); setSelectedTopics(new Set()); setSelectedCompanies(new Set()); setPage(1); }}>
              <Icon name="reset" size={12} /> Reset
            </button>
            <button className="cl-btn cl-btn-cyan cl-btn-sm" disabled={loadingRand || fetchingRand || (problemsList?.total ?? 0) < 1} onClick={pickRandom}>
              <Icon name="dice" size={13} /> {loadingRand || fetchingRand ? "Picking…" : "Pick one"}
            </button>
          </div>
        </div>

        <div style={{ padding: "14px 22px", display: "flex", gap: 10, borderBottom: "1px solid var(--stroke)", alignItems: "center", flexWrap: "wrap" }}>
          <span className="cl-picker-label" style={{ marginRight: 4 }}>Filters</span>
          <Picker label="Difficulty" value={difficulty} onChange={(v) => { setDifficulty(v); setPage(1); }} options={[
            { v: "all", l: "All" }, { v: "easy", l: "Easy" }, { v: "medium", l: "Medium" }, { v: "hard", l: "Hard" },
          ]} />
          <Picker label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
            { v: "all", l: "All" }, { v: "solved", l: "Solved" }, { v: "attempted", l: "Attempted" }, { v: "todo", l: "Todo" },
          ]} />
          <MultiSelect
            label="Topic"
            selected={selectedTopics}
            onChange={(s) => { setSelectedTopics(s); setPage(1); }}
            options={topicsList.map((t) => ({ v: t.slug, l: t.name }))}
          />
          <MultiSelect
            label="Company"
            selected={selectedCompanies}
            onChange={(s) => { setSelectedCompanies(s); setPage(1); }}
            options={companiesList.map((c) => ({ v: c.slug, l: c.name }))}
          />
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-mute)" }} className="cl-mono">
            Page {page} / {totalPages}
          </div>
        </div>

        <table className="cl-tbl cl-tbl-problems">
          <thead>
            {/* Column widths live in tokens.css, not inline: an inline `width`
                out-specifies the media queries that shed columns on narrow screens. */}
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Acceptance</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading || isFetching) && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 48 }}><Spinner size={20} label="Loading problems" /></td></tr>
            )}
            {!(isLoading || isFetching) && rows.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-mute)" }}>No problems match. Try loosening a filter.</td></tr>
            )}
            {!(isLoading || isFetching) && rows.map((p) => {
              const s = rowStatusClass(p.userSubmissionStatus);
              const diff = String(p.difficulty || "").toLowerCase();
              return (
                <tr key={p.id} onClick={() => navigate(`${p.id}`)}>
                  <td className="cl-mono cl-text-mute">{String(p.id)}</td>
                  {/* The title is a real link so the row is reachable by keyboard and
                      openable in a new tab; the row click stays as a mouse shortcut. */}
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>
                    <Link to={`${p.id}`} className="cl-tbl-link" onClick={(e) => e.stopPropagation()}>{p.title}</Link>
                  </td>
                  <td>
                    {(() => {
                      const pct = p.submissionCount > 0 ? (p.acceptedCount / p.submissionCount) * 100 : 0;
                      return (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div className="cl-bar" style={{ width: 120 }}><div className="cl-bar-fill" style={{ width: `${pct}%` }} /></div>
                          <span className="cl-mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{pct.toFixed(1)}%</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td><span className={`cl-chip cl-chip-${diff}`}>{formatFieldName(p.difficulty)}</span></td>
                  <td>{p.topics?.[0] && <span className="cl-chip">{p.topics[0]}</span>}</td>
                  <td>
                    {/* The chip modifiers already are these colours; the inline
                        overrides here were a weaker copy of them plus a border
                        that .cl-chip no longer draws. */}
                    {s === "solved" && <span className="cl-chip cl-chip-success"><Icon name="check" size={11} />Solved</span>}
                    {s === "attempted" && <span className="cl-chip cl-chip-dot cl-chip-warning">Tried</span>}
                    {s === "none" && <span style={{ color: "var(--text-mute)" }}>-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--stroke)", flexWrap: "wrap", gap: 12 }}>
          <div className="cl-picker" style={{ width: "auto" }}>
            <span className="cl-picker-label">Rows</span>
            <select
              className="cl-input"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              style={{ width: "auto", height: 28, fontSize: 12, padding: "0 24px 0 6px", border: "none", background: "rgba(255,255,255,0.09)", borderRadius: 6 }}
            >
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="cl-btn cl-btn-icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><Icon name="chevronLeft" size={14} /></button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const n = i + 1;
              return (
                // Cyan, not a neutral fill: --surface-hi is exactly what an icon
                // button now shows on hover, so a neutral current-page marker
                // would be indistinguishable from whichever one you're pointing at.
                <button key={n} className="cl-btn cl-btn-icon" onClick={() => setPage(n)}
                  style={{ background: page === n ? "rgba(34,211,238,0.18)" : undefined, color: page === n ? "var(--cyan)" : undefined }}>{n}</button>
              );
            })}
            <button className="cl-btn cl-btn-icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><Icon name="chevronRight" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArenaHeader = () => (
  <div className="cl-arena-cards" style={{ marginBottom: 24 }}>
    <ProblemOfTheDayCard />
    <StreakCard />
    <ProgressCard />
  </div>
);

/* The API sends plain calendar days ("2026-07-27") with no timezone, and
   `new Date()` reads a bare date string as UTC midnight — which renders as the
   26th for every user west of Greenwich. Build it in local time instead. */
const parseApiDay = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
/* "Jul 1 '25", not "Jul 1, 2025". The long form pushed the Best-run value past
   its column on a 3-digit streak and truncated to "Jul 1,…" — a date cut before
   the part that disambiguates it is worse than no date. */
const fmtDay = (d) => {
  const s = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.getFullYear() === new Date().getFullYear()
    ? s
    : `${s} '${String(d.getFullYear()).slice(-2)}`;
};
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const StreakCard = () => {
  const { data, isLoading, isError, error, refetch } = useUserStreak();
  const streak = data?.streakDays ?? 0;
  const best = data?.highestStreakDays ?? 0;
  const bestDay = parseApiDay(data?.highestStreakDate);
  const lastDay = parseApiDay(data?.lastSubmissionDate);
  const badge = data?.highestStreakBadge;
  const nextAt = data?.nextBadgeThreshold ?? null;

  const daysSince = lastDay ? Math.round((startOfToday() - lastDay.getTime()) / 86400000) : null;

  /* Solved yesterday but not today is the only state this card wants you to act
     on, so it's the only one that gets a pill colour and a pulse.
     `broken` is deliberately not the same as "streak is 0": someone who has never
     solved anything hasn't broken anything, and colouring their first visit's
     zero in --hard would greet a new user with a failure. */
  const state =
    streak > 0 && daysSince === 1 ? { label: "Solve today", tone: "risk", broken: false }
      : streak > 0 ? { label: "Active", tone: "on", broken: false }
        : lastDay ? { label: "Streak broken", tone: "off", broken: true }
          : { label: "Not started", tone: "off", broken: false };

  const lastValue =
    !lastDay ? "—"
      : daysSince === 0 ? "Today"
        : daysSince === 1 ? "Yesterday"
          : fmtDay(lastDay);

  const bestValue = best > 0
    ? `${plural(best, "day")}${bestDay ? ` · ${fmtDay(bestDay)}` : ""}`
    : "—";

  const toGo = nextAt == null ? null : Math.max(nextAt - streak, 0);

  /* No `error.response` means axios never heard back at all — offline, DNS,
     timeout. That's a different instruction from a server that answered badly:
     one says check your connection, the other says try again in a moment.
     401 never reaches here; the axios interceptor redirects to login. */
  const offline = isError && !error?.response;

  return (
    <div className="cl-card sk">
      {/* The heading renders in every branch — it used to live inside the
          loaded branch only, so a bare "Loading…" appeared in an unlabelled box.
          It used to sit in a .sk-head flex row opposite the state pill; the
          state has moved down to the count it describes, so there is nothing
          left to lay out beside it. */}
      <h2 className="cl-card-title-sm">Your streak</h2>

      {isLoading ? (
        <div className="sk-loading">Loading your streak…</div>
      ) : isError ? (
        /* role="status" rather than "alert": it announces politely on arrival
           without interrupting whatever a screen-reader user is already reading.
           Nothing here was their fault and nothing is urgent. */
        <div className="sk-error" role="status">
          <Icon name="warn" size={16} className="sk-error-icon" />
          <div className="sk-error-title">
            {offline ? "You’re offline" : "Couldn’t load your streak"}
          </div>
          {/* The reassurance is the point. The old zero state made people think
              they'd lost the streak; say plainly that they haven't. */}
          <div className="sk-error-sub">
            {offline
              ? "Your streak is safe — we just can’t reach it."
              : "Your streak is safe. Try again in a moment."}
          </div>
          {/* No disabled-while-fetching guard, deliberately: react-query flips
              status back to `loading` on refetch when there's no cached data, so
              this whole branch unmounts on click and "Loading your streak…"
              takes over. The button can't be double-fired because it's gone —
              verified at 1 request per click. */}
          <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={() => refetch()}>
            <Icon name="reset" size={12} /> Try again
          </button>
        </div>
      ) : (
        <>
          <div className="sk-marquee">
            {/* The count and its condition are one object, so they share one
                element. The state used to live in the card's top-right corner,
                diagonally opposite the number it qualifies — a reader had to
                carry "Solve today" across the card to apply it to a "7".
                No digit-count shrink: the column is `auto`, so a 3-digit streak
                takes the width it needs instead of stealing it from the facts,
                which are anchored to the opposite edge and don't move. */}
            <div className="sk-count">
              <span className={`sk-num${streak === 0 ? " is-zero" : ""}`}>{streak}</span>
              <span className="sk-unit">{streak === 1 ? "day" : "days"}</span>
              {/* The broken state swaps the dot for a snapped chain. It's the one
                  state whose meaning the dot couldn't carry: "Streak broken" and
                  "Not started" share the `off` tone, so they rendered identically
                  even though one is a loss and the other is a blank slate.
                  This is also what `state.broken` is for — it had gone unread. */}
              <span className={`sk-state sk-state-${state.tone}`}>
                {state.broken
                  ? <Icon name="linkBroken" size={12} className="sk-state-icon" />
                  : <i className="sk-dot" aria-hidden="true" />}
                {state.label}
              </span>
            </div>
            {/* "Last solved" is back from the shortened "Solved". It was cut
                because the label and value shared a line and the longest label
                set the column; stacked, the label costs the value nothing, so
                the row can say what it means again. */}
            {/* Each pair wrapped in a div — HTML5 allows it inside <dl>, and it
                keeps the label bound to its value now that both stack. */}
            <dl className="sk-facts">
              <div><dt>Last solved</dt><dd>{lastValue}</dd></div>
              <div><dt>Best</dt><dd>{bestValue}</dd></div>
            </dl>
          </div>

          {/* A hairline above, not a filled well around: this row was a recessed
              panel inside the card, which is the card-in-card shape. The rule
              groups it just as well and hands the badge artwork back the card's
              own background. */}
          <div className="sk-foot">
            {badge?.imageUrl
              ? <img className="sk-badge" src={badge.imageUrl} alt="" />
              : <span className="sk-badge-none" aria-hidden="true"><Icon name="trophy" size={17} /></span>}
            <div className="sk-next-body">
              <div className="sk-next-name">{badge?.name || "No badge yet"}</div>
              {/* "Earned ·" is doing real work. This row shows a badge the user
                  already has (highestStreakBadge) next to a countdown to one
                  they don't (nextBadgeThreshold) — two tenses, one row, and
                  every reader took the name on the left to BE the next badge.
                  The API returns no name or image for the next badge, only its
                  threshold, so the row can't be rewritten to be about it; the
                  fix is to mark the left side as past. The badge's own
                  description still says what earned it. */}
              <div className="sk-next-sub">
                {badge ? `Earned · ${badge.description}` : "Start a streak to earn one"}
              </div>
            </div>
            {nextAt != null && (
              <div className="sk-next-go">
                <div className="sk-go-label">Next badge</div>
                <div className="sk-go-val">{toGo === 0 ? "Unlocked" : `in ${plural(toGo, "day")}`}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const ProgressCard = () => {
  /* Only the submission status is fatal. Without it there is no solved data at
     all and the card can say nothing; without the catalog counts there are still
     the user's own numbers, just no denominators to put them over — which is the
     `countsUsable === false` path this component already degrades into. So a
     failed `problem/counts` quietly loses the "of 340" and the "/ 120"s, and a
     failed `user/submission-status` is what raises the error state. */
  const { data: statusData, isLoading: loadingStatus, isError, error, refetch } = useUserSubmissionStatus();
  const { data: countsData, isLoading: loadingCounts } = useProblemCounts();
  const isLoading = loadingStatus || loadingCounts;

  /* No `error.response` means axios never heard back — offline, DNS, timeout.
     Different instruction from a server that answered badly. Same split as the
     two cards beside it. */
  const offline = isError && !error?.response;

  const solved = { easy: statusData?.solvedCountByDifficulty?.EASY ?? 0, medium: statusData?.solvedCountByDifficulty?.MEDIUM ?? 0, hard: statusData?.solvedCountByDifficulty?.HARD ?? 0 };
  const total  = { easy: countsData?.EASY ?? 0, medium: countsData?.MEDIUM ?? 0, hard: countsData?.HARD ?? 0 };

  const totalSolved = solved.easy + solved.medium + solved.hard;
  const totalAll    = total.easy + total.medium + total.hard;

  // `problem/counts` and `user/submission-status` are separate endpoints and can
  // disagree — a solved problem may no longer be in the listed catalog. That made
  // solved > total and rendered "300% · Excellent". When the two disagree the
  // denominator isn't trustworthy, so we show the raw counts and skip the score
  // rather than assert a number we can't stand behind.
  const countsUsable = totalAll > 0 && totalSolved <= totalAll;
  const denom = Math.max(totalAll, totalSolved);
  const share = (n) => (denom > 0 ? (n / denom) * 100 : 0);
  const pct = Math.round(share(totalSolved));

  /* The quality ladder ("Beginner" → "Excellent") used to lead this card at
     22px/700, above the percentage it was derived from at 22px/400 — an
     adjective outranking the number it describes. It's gone rather than
     demoted: it was a pure function of `pct`, which is still on the card, so it
     carried nothing new; and a ladder whose bottom rung labels the reader
     "Beginner" is the intimidating difficulty wall this product exists to
     lower. */

  const segments = [
    { key: "easy",   color: "var(--easy)",   label: "Easy",   count: solved.easy,   total: total.easy,   pct: share(solved.easy) },
    { key: "medium", color: "var(--medium)", label: "Medium", count: solved.medium, total: total.medium, pct: share(solved.medium) },
    { key: "hard",   color: "var(--hard)",   label: "Hard",   count: solved.hard,   total: total.hard,   pct: share(solved.hard) },
  ];
  /* Per-row, not `countsUsable`. That flag only compares the two endpoints in
     aggregate, so a catalog that has lost three Easy problems can still leave
     solved.easy above total.easy while the totals agree overall — and "52 / 30"
     is a worse answer than no denominator at all. */
  const hasDenom = (seg) => seg.total > 0 && seg.total >= seg.count;

  return (
    <div className="cl-card pg">
      {/* "Your progress", parallel with "Your streak" beside it. It was
          "Progress score" over a label reading "Solve Quality" over a bare
          percentage — three names for one idea, and none of them a score. */}
      <h2 className="cl-card-title-sm">Your progress</h2>
      {isLoading ? (
        <div className="pg-loading">Loading your progress…</div>
      ) : isError ? (
        /* The card used to have no error branch at all: a failed fetch left
           `solved` at its 0/0/0 default and the card rendered a full, confident
           "you have solved nothing". That is the most harmful thing this card
           can say, and it said it silently. role="status" announces politely;
           the sub-line's job is the reassurance, same as the streak card's. */
        <div className="pg-error" role="status">
          <Icon name="warn" size={16} className="pg-error-icon" />
          <div className="pg-error-title">
            {offline ? "You’re offline" : "Couldn’t load your progress"}
          </div>
          <div className="pg-error-sub">
            {offline
              ? "Everything you’ve solved is safe — we just can’t reach it."
              : "Everything you’ve solved is safe. Try again in a moment."}
          </div>
          <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={() => refetch()}>
            <Icon name="reset" size={12} /> Try again
          </button>
        </div>
      ) : (
        <>
          <div className="pg-lead">
            <span className="pg-num">{totalSolved}</span>
            <span className="pg-unit">solved</span>
            {countsUsable && <span className="pg-share">{pct}% of {totalAll}</span>}
          </div>

          {/* aria-hidden: the ledger under it states every number this encodes,
              so announcing the bar too would read the card's data out twice.
              It's also what let the `title` tooltips go — they carried the only
              per-segment counts the old card had, and no keyboard or touch user
              could reach them. */}
          <div className="pg-bar" aria-hidden="true">
            {segments.filter((seg) => seg.pct > 0).map((seg) => (
              <span key={seg.key} className="pg-bar-seg" style={{ width: `${seg.pct}%`, background: seg.color }} />
            ))}
          </div>

          <dl className="pg-ledger">
            {segments.map((seg) => (
              <div key={seg.key}>
                <dt>
                  <i className="pg-swatch" style={{ background: seg.color }} aria-hidden="true" />
                  {seg.label}
                </dt>
                <dd>
                  {seg.count}
                  {hasDenom(seg) && <span className="pg-of"> / {seg.total}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </div>
  );
};

const Picker = ({ label, value, onChange, options }) => (
  <div className="cl-picker">
    <span className="cl-picker-label">{label}</span>
    <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} aria-pressed={value === o.v}
          style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, color: value === o.v ? "var(--text)" : "var(--text-dim)", background: value === o.v ? "rgba(255,255,255,0.11)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          {o.l}
        </button>
      ))}
    </div>
  </div>
);


export default ProblemsTab;
