import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import Icon from "../Components/Icon";
import ProblemOfTheDayCard from "../Components/ProblemOfTheDayCard";
import useDebounce from "../hooks/useDebounce";
import { useARandomProblemId, useProblemsData } from "../services/queries";
import { formatFieldName, textMapForProblemStatus } from "../lib/utils";

const ProblemsTab = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);

  const difficultySet = useMemo(() => difficulty === "all" ? new Set() : new Set([difficulty.toUpperCase()]), [difficulty]);
  const statusSet = useMemo(() => {
    if (status === "all") return new Set();
    const map = { solved: "ACC", attempted: "ATT", todo: "NATT" };
    return new Set([map[status]]);
  }, [status]);

  const { isLoading, isFetching, data: problemsList, error } = useProblemsData(page, rowsPerPage, {
    searchValue: search, difficulty: difficultySet, status: statusSet,
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

  const rows = problemsList?.problems ?? [];

  return (
    <div className="cl-container" style={{ paddingBottom: 40 }}>
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
            <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={() => { setSearchInput(""); setDifficulty("all"); setStatus("all"); setPage(1); }}>
              <Icon name="reset" size={12} /> Reset
            </button>
            <button className="cl-btn cl-btn-cyan cl-btn-sm" disabled={loadingRand || fetchingRand} onClick={pickRandom}>
              <Icon name="dice" size={13} /> {loadingRand || fetchingRand ? "…" : "Pick one"}
            </button>
          </div>
        </div>

        <div style={{ padding: "14px 22px", display: "flex", gap: 10, borderBottom: "1px solid var(--stroke)", alignItems: "center", flexWrap: "wrap" }}>
          <div className="cl-input-wrap" style={{ width: 280 }}>
            <span className="cl-icon-l"><Icon name="search" size={14} /></span>
            <input className="cl-input" placeholder="Search problems…" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); setPage(1); }} />
          </div>
          <Picker label="Difficulty" value={difficulty} onChange={(v) => { setDifficulty(v); setPage(1); }} options={[
            { v: "all", l: "All" }, { v: "easy", l: "Easy" }, { v: "medium", l: "Medium" }, { v: "hard", l: "Hard" },
          ]} />
          <Picker label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={[
            { v: "all", l: "All" }, { v: "solved", l: "Solved" }, { v: "attempted", l: "Attempted" }, { v: "todo", l: "Todo" },
          ]} />
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-mute)" }} className="cl-mono">
            Page {page} / {totalPages}
          </div>
        </div>

        <table className="cl-tbl">
          <thead>
            <tr>
              <th style={{ width: 64 }}>Status</th>
              <th style={{ width: 70 }}>#</th>
              <th>Title</th>
              <th style={{ width: 220 }}>Acceptance</th>
              <th style={{ width: 130 }}>Difficulty</th>
              <th style={{ width: 160 }}>Topic</th>
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
              const s = rowStatusClass(p.status);
              const diff = String(p.difficulty || "").toLowerCase();
              return (
                <tr key={p.id} onClick={() => navigate(`${p.id}`)}>
                  <td>
                    {s === "solved" && <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "rgba(110,231,183,.12)", color: "var(--easy)", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={12} /></span>}
                    {s === "attempted" && <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "rgba(252,211,77,.1)", color: "var(--medium)", alignItems: "center", justifyContent: "center" }}><Icon name="dot" size={12} /></span>}
                    {s === "none" && <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", border: "1px solid var(--stroke-2)", marginLeft: 7 }} />}
                  </td>
                  <td className="cl-mono cl-text-mute">{String(p.id).padStart(4, "0")}</td>
                  <td style={{ color: "var(--text)", fontWeight: 500 }}>{p.title}</td>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div className="cl-bar" style={{ width: 120 }}><div className="cl-bar-fill" style={{ width: `${p.acceptance}%` }} /></div>
                      <span className="cl-mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{Number(p.acceptance).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td><span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{formatFieldName(p.difficulty)}</span></td>
                  <td>{p.topics?.[0] && <span className="cl-chip">{p.topics[0]}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--stroke)" }}>
          <div className="cl-mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>Rows per page: {rowsPerPage}</div>
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
