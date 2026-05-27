import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import Icon from "../Components/Icon";
import MultiSelect from "../Components/MultiSelect";
import ProblemOfTheDayCard from "../Components/ProblemOfTheDayCard";
import Badge from "../Components/Badge";
import { useARandomProblemId, useProblemsData, useAllTopics, useAllCompanies, useUserStreak, useUserSubmissionStatus, useProblemCounts } from "../services/queries";
import { formatFieldName } from "../lib/utils";

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

  const { isLoading: loadingRand, isFetching: fetchingRand, refetch: pickRandom } = useARandomProblemId((id) => navigate(`${id}`));

  const totalPages = useMemo(() => Math.max(1, Math.ceil((problemsList?.total ?? 0) / rowsPerPage)), [problemsList?.total, rowsPerPage]);
  const rowStatusClass = (s) => s === "ACC" ? "solved" : s === "ATT" ? "attempted" : "none";

  if (error) {
    return (
      <div className="cl-container" style={{ paddingBottom: 40 }}>
        <div className="cl-card" style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>Something went wrong.</div>
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
              <div className="cl-card-title">Problems</div>
              <span className="cl-chip cl-chip-cyan">{problemsList?.total ?? 0} total</span>
            </div>
            <div className="cl-card-sub">Filter, pick, solve. Or try a random one.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={() => { setDifficulty("all"); setStatus("all"); setSelectedTopics(new Set()); setSelectedCompanies(new Set()); setPage(1); }}>
              <Icon name="reset" size={12} /> Reset
            </button>
            <button className="cl-btn cl-btn-cyan cl-btn-sm" disabled={loadingRand || fetchingRand} onClick={pickRandom}>
              <Icon name="dice" size={13} /> {loadingRand || fetchingRand ? "…" : "Pick one"}
            </button>
          </div>
        </div>

        <div style={{ padding: "14px 22px", display: "flex", gap: 10, borderBottom: "1px solid var(--stroke)", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".1em", marginRight: 4 }}>Filters:</span>
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

        <table className="cl-tbl">
          <thead>
            <tr>
              <th style={{ width: 48 }}>#</th>
              <th>Title</th>
              <th style={{ width: 220 }}>Acceptance</th>
              <th style={{ width: 130 }}>Difficulty</th>
              <th style={{ width: 130 }}>Topic</th>
              <th style={{ width: 110 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading || isFetching) && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 48 }}><Spinner size="sm" color="primary" /></td></tr>
            )}
            {!(isLoading || isFetching) && rows.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "var(--text-mute)" }}>No problems match. Try loosening a filter.</td></tr>
            )}
            {!(isLoading || isFetching) && rows.map((p) => {
              const s = rowStatusClass(p.userSubmissionStatus);
              const diff = String(p.difficulty || "").toLowerCase();
              return (
                <tr key={p.id} onClick={() => navigate(`${p.id}`)}>
                  <td className="cl-mono cl-text-mute">{String(p.id)}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{p.title}</td>
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
                    {s === "solved" && <span className="cl-chip" style={{ background: "rgba(110,231,183,.1)", color: "var(--easy)", borderColor: "rgba(110,231,183,.2)" }}><Icon name="check" size={11} />Solved</span>}
                    {s === "attempted" && <span className="cl-chip cl-chip-dot" style={{ background: "rgba(252,211,77,.08)", color: "var(--medium)", borderColor: "rgba(252,211,77,.2)" }}>Tried</span>}
                    {s === "none" && <span style={{ color: "var(--text-mute)", borderColor: "var(--stroke-1)" }}>-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--stroke)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 4px 0 10px", border: "1px solid var(--stroke-1)", borderRadius: 8, height: 38, background: "var(--bg-1)" }}>
            <span style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".1em" }}>Rows</span>
            <select
              className="cl-input"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              style={{ width: "auto", height: 28, fontSize: 12, padding: "0 24px 0 6px", border: "none", background: "var(--bg-3)", borderRadius: 6 }}
            >
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="cl-btn cl-btn-icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><Icon name="chevronLeft" size={14} /></button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const n = i + 1;
              return (
                <button key={n} className="cl-btn cl-btn-icon" onClick={() => setPage(n)}
                  style={{ background: page === n ? "var(--bg-3)" : undefined, color: page === n ? "var(--text)" : undefined, borderColor: page === n ? "var(--stroke-2)" : "transparent" }}>{n}</button>
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
  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 14, width: "100%", marginBottom: 24 }}>
    <ProblemOfTheDayCard />
    <StreakCard />
    <ProgressCard />
  </div>
);

const StreakCard = () => {
  const { data, isLoading } = useUserStreak();
  const streak = data?.streakDays ?? 0;
  const best = data?.highestStreakDays ?? 0;
  const bestStreakdate = data?.highestStreakDate ? new Date(data.highestStreakDate) : null;
  const badge = data?.highestStreakBadge;
  const lastDate = data?.lastSubmissionDate;

  const lastSubmittedLabel = (() => {
    if (!lastDate) return "No submissions yet";
    const days = Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000);
    if (days === 0) return "Last submission: today";
    if (days === 1) return "Last submission: yesterday";
    return `Last submission: ${days} days ago`;
  })();

  const streakColor = streak <= 10 ? "var(--easy)" : streak <= 45 ? "var(--medium)" : "var(--hard)";
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const progress = Math.min(streak / 100, 1);
  const dash = progress * circ;

  return (
    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      {isLoading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", color: "var(--text-mute)", fontSize: 13 }}>Loading…</div>
      ) : (
        <>
          {/* Top — circle + title + last submission */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--bg-3)" strokeWidth="5" />
                <circle cx="32" cy="32" r={radius} fill="none" stroke={streakColor} strokeWidth="5"
                  strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
              </svg>
              <span style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: streakColor,
              }}>{streak}</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>Day streak</div>
              <div style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 3 }}>{lastSubmittedLabel}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--stroke)" }} />

          {/* Bottom — best streak stats + badge */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>{best}</span>
              <span style={{ fontSize: 10, color: "var(--text-mute)", textAlign: "center", lineHeight: 1.3 }}>Longest streak</span>
            </div>
            <div style={{ width: 1, height: "100%", background: "var(--stroke)", alignSelf: "stretch" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                {bestStreakdate ? (
                  <>
                    {`${bestStreakdate.toLocaleString("en-US", { month: "short" })} ${bestStreakdate.getDate()}`}
                    {bestStreakdate.getFullYear() !== new Date().getFullYear() && (
                      <span style={{ fontSize: 13, color: "var(--text-mute)", marginLeft: 3 }}>
                        '{String(bestStreakdate.getFullYear()).slice(-2)}
                      </span>
                    )}
                  </>
                ) : "—"}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-mute)", textAlign: "center", lineHeight: 1.3 }}>Best date</span>
            </div>
            <div style={{ width: 1, height: "100%", background: "var(--stroke)", alignSelf: "stretch" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {badge ? (
                <Badge imageUrl={badge.imageUrl} name={badge.name} description={badge.description} size={46} />
              ) : (
                <>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-mute)" }}>—</span>
                  <span style={{ fontSize: 10, color: "var(--text-mute)", textAlign: "center", lineHeight: 1.3 }}>Top badge</span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ProgressCard = () => {
  const { data: statusData, isLoading: loadingStatus } = useUserSubmissionStatus();
  const { data: countsData, isLoading: loadingCounts } = useProblemCounts();
  const isLoading = loadingStatus || loadingCounts;

  const solved = { easy: statusData?.solvedCountByDifficulty?.EASY ?? 0, medium: statusData?.solvedCountByDifficulty?.MEDIUM ?? 0, hard: statusData?.solvedCountByDifficulty?.HARD ?? 0 };
  const total  = { easy: countsData?.EASY ?? 0, medium: countsData?.MEDIUM ?? 0, hard: countsData?.HARD ?? 0 };

  const totalSolved = solved.easy + solved.medium + solved.hard;
  const totalAll    = total.easy + total.medium + total.hard;

  const circ = 2 * Math.PI * 32;
  const easyDash   = totalAll > 0 ? (solved.easy   / totalAll) * circ : 0;
  const medDash    = totalAll > 0 ? (solved.medium  / totalAll) * circ : 0;
  const hardDash   = totalAll > 0 ? (solved.hard    / totalAll) * circ : 0;
  const easyOffset = 0;
  const medOffset  = -(easyDash);
  const hardOffset = -(easyDash + medDash);

  return (
    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">progress overview</div>
      {isLoading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", color: "var(--text-mute)", fontSize: 13 }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flex: 1 }}>
          <svg width="130" height="130" viewBox="0 0 90 90">
            <circle cx="41" cy="41" r="32" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
            <circle cx="41" cy="41" r="32" fill="none" stroke="var(--easy)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${easyDash} ${circ}`} strokeDashoffset={easyOffset} transform="rotate(-90 41 41)" />
            <circle cx="41" cy="41" r="32" fill="none" stroke="var(--medium)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${medDash} ${circ}`} strokeDashoffset={medOffset} transform="rotate(-90 41 41)" />
            <circle cx="41" cy="41" r="32" fill="none" stroke="var(--hard)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${hardDash} ${circ}`} strokeDashoffset={hardOffset} transform="rotate(-90 41 41)" />
            <text x="41" y="38" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="16" fontWeight="600">{totalSolved}</text>
            <text x="41" y="52" textAnchor="middle" fill="#6B7385" fontFamily="Comme" fontSize="8">/ {totalAll}</text>
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, flex: 1 }}>
            <StatLine color="var(--easy)"   label="Easy" v={solved.easy}   t={total.easy} />
            <StatLine color="var(--medium)" label="Med"  v={solved.medium} t={total.medium} />
            <StatLine color="var(--hard)"   label="Hard" v={solved.hard}   t={total.hard} />
          </div>
        </div>
      )}
    </div>
  );
};

const StatLine = ({ color, label, v, t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, background: color, borderRadius: 2 }} />
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
    </span>
    <span className="cl-mono" style={{ color: "var(--text)" }}>{v}<span className="cl-text-mute">/{t}</span></span>
  </div>
);

const Picker = ({ label, value, onChange, options }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 4px 0 10px", border: "1px solid var(--stroke-1)", borderRadius: 8, height: 38, background: "var(--bg-1)" }}>
    <span style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</span>
    <div style={{ display: "flex", gap: 2 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, color: value === o.v ? "var(--text)" : "var(--text-mute)", background: value === o.v ? "var(--bg-3)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          {o.l}
        </button>
      ))}
    </div>
  </div>
);


export default ProblemsTab;
