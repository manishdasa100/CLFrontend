import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import Icon from "../Components/Icon";
import MultiSelect from "../Components/MultiSelect";
import ProblemOfTheDayCard from "../Components/ProblemOfTheDayCard";
import { useARandomProblemId, useProblemsData, useAllTopics, useAllCompanies } from "../services/queries";
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
    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">current streak</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>12</span>
        <span className="cl-text-mute" style={{ fontSize: 12 }}>best: 12</span>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 12 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 27, borderRadius: 2, background: i < 12 ? (i === 11 ? "var(--cyan)" : "rgba(34,211,238,0.3)") : "var(--bg-3)" }} />
        ))}
      </div>
      <div className="cl-text-mute cl-mono" style={{ fontSize: 10, marginTop: 8, letterSpacing: ".1em" }}>3 days ago</div>
    </div>
    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">progress overview</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flex: 1 }}>
        <svg width="130" height="130" viewBox="0 0 90 90">
          <circle cx="41" cy="41" r="32" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
          <circle cx="41" cy="41" r="32" fill="none" stroke="var(--easy)" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 201" transform="rotate(-90 41 41)" />
          <circle cx="41" cy="41" r="32" fill="none" stroke="var(--medium)" strokeWidth="8" strokeLinecap="round" strokeDasharray="50 201" strokeDashoffset="-90" transform="rotate(-90 41 41)" />
          <circle cx="41" cy="41" r="32" fill="none" stroke="var(--hard)" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 201" strokeDashoffset="-140" transform="rotate(-90 41 41)" />
          <text x="41" y="45" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="18" fontWeight="600">154</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, flex: 1 }}>
          <StatLine color="var(--easy)" label="Easy" v={90} t={145} />
          <StatLine color="var(--medium)" label="Med" v={50} t={320} />
          <StatLine color="var(--hard)" label="Hard" v={14} t={120} />
        </div>
      </div>
    </div>
  </div>
);

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
