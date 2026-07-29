import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { useQueryClient } from "react-query";
import { useProblemByIdData, useUserLists, useAddToListMutation, useCreateListMutation, useSubmissions } from "../services/queries";
import CodeEditor from "../Components/CodeEditor";
import Icon from "../Components/Icon";
import Toast from "../Components/Toast";
import { formatFieldName, timeAgo, formatSubmittedAt, SUBMISSION_STATUS, decodeBase64Utf8 } from "../lib/utils";
import { useUser } from "../context/UserContext";
import useMediaQuery from "../hooks/useMediaQuery";
import "./ProblemDetailsPage.css";

const LEFT_TABS = ["Description", "Submissions"];

const ResultField = ({ label, value, valueColor }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ color: "var(--text-mute)", fontSize: 11, marginBottom: 4 }}>{label} =</div>
    <div style={{ background: "var(--bg-2)", borderRadius: 6, padding: "6px 10px", whiteSpace: "pre-wrap", color: valueColor || "var(--text-dim)" }}>{value}</div>
  </div>
);

const RunTestResult = ({ result }) => {
  if (!result) return null;
  const passed = result.status === "PASSED";
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: passed ? "var(--easy)" : "var(--hard)" }}>{result.status}</span>
        <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{result.runtimeMs} ms</span>
      </div>
      <ResultField label="Input" value={result.input} />
      <ResultField label="Expected Output" value={result.expectedOutput} />
      <ResultField label="Actual Output" value={result.actualOutput} valueColor={passed ? undefined : "var(--hard)"} />
      {result.stdOut && <ResultField label="Stdout" value={result.stdOut} />}
      {result.errorMsg && <ResultField label="Error" value={result.errorMsg} valueColor="var(--hard)" />}
    </>
  );
};

const SubmitResultView = ({ report }) => {
  const isAcc = report.status === "ACC";
  const statusColor = isAcc ? "var(--easy)" : report.status === "TLE" || report.status === "MLE" ? "var(--medium)" : "var(--hard)";
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: statusColor }}>{report.statusMsg}</span>
        <span style={{ fontSize: 12, color: "var(--text-mute)" }}>{report.totalCorrect} / {report.totalTestcases} testcases passed</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        {[["Runtime", `${report.runtimeMs} ms`], ["Memory", `${report.memoryMb} MB`]].map(([l, v]) => (
          <div key={l} style={{ background: "var(--bg-2)", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-mute)", marginBottom: 3 }}>{l}</div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{v}</div>
          </div>
        ))}
      </div>
      {report.compileError && <ResultField label="Compile Error" value={report.compileError} valueColor="var(--hard)" />}
      {report.runtimeError && <ResultField label="Runtime Error" value={report.runtimeError} valueColor="var(--hard)" />}
      {!isAcc && report.failedTestcase && (
        <>
          <div style={{ color: "var(--text-mute)", fontSize: 11, marginBottom: 8, marginTop: 4 }}>FAILED TESTCASE</div>
          <ResultField label="Input" value={report.failedTestcase.input} />
          <ResultField label="Expected Output" value={report.failedTestcase.expectedOutput} />
          <ResultField label="Actual Output" value={report.failedTestcase.actualOutput} valueColor="var(--hard)" />
        </>
      )}
    </>
  );
};

/* Verdict colors keyed by the shared SUBMISSION_STATUS tier (pass/wrong/error). */
const TIER_COLOR = { pass: "var(--easy)", wrong: "var(--medium)", error: "var(--hard)" };
const TIER_VARIANT = { pass: "success", wrong: "warning", error: "danger" };
const LANG_LABEL = { JAVA: "Java", PYTHON: "Python", CPP: "C++", C: "C", GO: "Go", JAVASCRIPT: "JavaScript", RUST: "Rust" };

const SubmissionRow = ({ sub }) => {
  const navigate = useNavigate();
  const meta = SUBMISSION_STATUS[sub.status] || { label: sub.status, tier: "error", ran: false };
  const color = TIER_COLOR[meta.tier];
  const lang = LANG_LABEL[sub.language] || formatFieldName(sub.language) || sub.language;
  const runtime = sub.runtimeMs;
  const open = () => sub.submissionId && navigate(`/submission/${sub.submissionId}`);

  return (
    <div
      className="pd-sub-row"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      // The status chip below already carries the verdict colour, so the row only
      // needs a quiet tint of it — a 3px left stripe fought the rounded corner.
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", borderRadius: 8, border: `1px solid color-mix(in srgb, ${color} 28%, transparent)` }}
    >
      <span className={`cl-chip cl-chip-mono cl-chip-${TIER_VARIANT[meta.tier]}`} style={{ minWidth: 48, justifyContent: "center", fontWeight: 600 }}>
        {sub.status}
      </span>

      <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {meta.label}
      </div>

      <span className="cl-mono" style={{ fontSize: 12, color: "var(--text-dim)", minWidth: 60, textAlign: "right", flexShrink: 0 }}>{lang}</span>
      <span className="cl-mono" title="Runtime" style={{ fontSize: 12, color: "var(--text-mute)", width: 56, textAlign: "right", flexShrink: 0 }}>{runtime} ms</span>
      <span className="cl-mono" title="Memory" style={{ fontSize: 12, color: "var(--text-mute)", width: 56, textAlign: "right", flexShrink: 0 }}>{sub.memoryMb} MB</span>
      <span title={formatSubmittedAt(sub.dateOfSubmission)} style={{ fontSize: 11.5, color: "var(--text-mute)", width: 92, textAlign: "right", flexShrink: 0 }}>{timeAgo(sub.dateOfSubmission)}</span>
    </div>
  );
};

const SubmissionsView = ({ problemId }) => {
  const { data: submissions, isLoading, isError, refetch, isFetching } = useSubmissions(problemId);

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-mute)", fontSize: 13 }}>
        <Spinner label="Loading submissions" /> Loading submissions…
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, textAlign: "center" }}>
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Couldn’t load your submissions.</div>
        <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={() => refetch()}>
          <Icon name="reset" size={13} /> Try again
        </button>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 24, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)" }}>No submissions yet</div>
        <div style={{ fontSize: 12.5, color: "var(--text-mute)", maxWidth: "32ch", lineHeight: 1.5 }}>
          Run and submit your solution to start building a history here.
        </div>
      </div>
    );
  }

  const accepted = submissions.filter((s) => s.status === "ACC").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "18px 4px 24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14, paddingLeft: 2 }}>
        <span className="cl-mono" style={{ fontSize: 13, color: "var(--text)" }}>{submissions.length}</span>
        <span style={{ fontSize: 12, color: "var(--text-mute)" }}>{submissions.length === 1 ? "submission" : "submissions"}</span>
        {accepted > 0 && <span style={{ fontSize: 11.5, color: "var(--easy)" }}>· {accepted} accepted</span>}
        {isFetching && <Spinner size={14} label="Refreshing" style={{ marginLeft: 4 }} />}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {submissions.map((sub, i) => (
          <SubmissionRow key={sub.submissionId ?? i} sub={sub} />
        ))}
      </div>
    </div>
  );
};

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [fullScreen, setFullScreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [listPopupOpen, setListPopupOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, state }
  const [leftTab, setLeftTab] = useState("Description");
  const [testcaseIdx, setTestcaseIdx] = useState(0);
  const [resultState, setResultState] = useState(null); // null | {status:'loading',isRun} | {status:'done',isRun,report} | {status:'error',message}
  const [runTab, setRunTab] = useState(0);

  const { isLoading, isFetching, data, isError, error } = useProblemByIdData(id);
  const toggleFull = () => setFullScreen((v) => !v);

  // On a narrow screen the results panel isn't on screen when you hit Run, so bring
  // it forward — otherwise the verdict lands somewhere the learner can't see.
  const handlePending = (isRun) => { setResultState({ status: "loading", isRun }); setPane("result"); };
  const handleResult = (report, isRun, errorMsg) => {
    setPane("result");
    if (errorMsg || !report) {
      setResultState({ status: "error", message: errorMsg || "Something went wrong." });
    } else {
      setResultState({ status: "done", isRun, report });
      setRunTab(0);
      // A judged submit (not a run) creates a new submission record — refresh the history.
      if (!isRun) queryClient.invalidateQueries(["submissions", id]);
    }
  };

  const MIN_EDITOR_H = 150;
  const MIN_TC_H = 80;
  const DIVIDER_H = 8;
  const [editorHeightPx, setEditorHeightPx] = useState(null);
  const rightColRef = useRef(null);

  // Below this width the three panels can't usefully coexist — a 40/60 split of a
  // phone gives a 156px description beside a 234px editor. Show one at a time instead.
  const compact = useMediaQuery("(max-width: 1023px)");
  const [pane, setPane] = useState("problem"); // problem | code | result

  useEffect(() => {
    if (rightColRef.current) {
      setEditorHeightPx(Math.floor(rightColRef.current.clientHeight * 0.68));
    }
  }, []);

  const onDividerMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = editorHeightPx ?? Math.floor((rightColRef.current?.clientHeight ?? 600) * 0.68);

    const onMove = (ev) => {
      const colH = rightColRef.current?.clientHeight ?? 600;
      const next = Math.max(MIN_EDITOR_H, Math.min(colH - MIN_TC_H - DIVIDER_H, startH + ev.clientY - startY));
      setEditorHeightPx(next);
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  if (isError) {
    return (
      <div className="cl-container" style={{ padding: "60px 0", textAlign: "center", color: "var(--text-dim)" }}>
        Error: {error?.message || "Something went wrong"}
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 80px)" }}>
        <Spinner size={28} label="Loading problem" />
        <div style={{ color: "var(--text-dim)", marginLeft: 12, fontSize: 14 }}>Loading problem…</div>
      </div>
    );
  }

  const diff = String(data.difficulty || "").toLowerCase();
  const acceptance = data.submissionCount > 0
    ? Math.round((data.acceptedCount / data.submissionCount) * 100) + "%"
    : "0";
  const codeSnippets = data.codeSnippets
    ? Object.entries(data.codeSnippets).map(([languageCode, code]) => ({ languageCode, code: decodeBase64Utf8(code) }))
    : [];
  const examples = data.examples || [];
  const selectedCase = examples[testcaseIdx] || null;

  return (
    <div className="cl-pd-shell">
      {toast && <Toast message={toast.message} state={toast.state} onClose={() => setToast(null)} />}
      {listPopupOpen && (
        <SaveToListPopup
          problemId={data.id}
          username={user?.username}
          onClose={() => setListPopupOpen(false)}
          onToast={(t) => setToast(t)}
        />
      )}

      {/* ── Breadcrumb bar ── */}
      <div className="cl-pd-crumb">
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <Link to="/arena/problemset" className="cl-hit-24" style={{ color: "var(--text-mute)" }}>arena</Link>
          <span style={{ color: "var(--stroke-2)" }}>/</span>
          <Link to="/arena/problemset" className="cl-hit-24" style={{ color: "var(--text-mute)" }}>problemset</Link>
          <span style={{ color: "var(--stroke-2)" }}>/</span>
          <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>#{data.id}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            className="cl-btn cl-btn-icon"
            disabled={!data?.previousProblemId}
            onClick={() => navigate(`/arena/problemset/${data.previousProblemId}`)}
          >
            <Icon name="chevronLeft" size={13} />
          </button>
          <span className="cl-mono" style={{ fontSize: 12, color: "var(--text-dim)", padding: "0 4px" }}>{data.id}</span>
          <button
            className="cl-btn cl-btn-icon"
            disabled={!data?.nextProblemId}
            onClick={() => navigate(`/arena/problemset/${data.nextProblemId}`)}
          >
            <Icon name="chevronRight" size={13} />
          </button>
        </div>
      </div>

      {/* ── Narrow screens: one panel at a time ── */}
      {compact && (
        <div className="cl-pd-seg" role="tablist" aria-label="Problem view">
          {[["problem", "Problem"], ["code", "Code"], ["result", "Result"]].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={pane === key}
              className={pane === key ? "active" : ""}
              onClick={() => setPane(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Two-column layout (single column when compact) ── */}
      <div className="cl-pd-cols">

        {/* Left panel — open, no card */}
        {!fullScreen && (!compact || pane === "problem") && (
          <div className="cl-pd-left">

            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--stroke)", flexShrink: 0, gap: 10 }}>
              {LEFT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "18px 12px",
                    fontSize: 12,
                    fontWeight: leftTab === tab ? 600 : 400,
                    color: leftTab === tab ? "var(--text)" : "var(--text-dim)",
                    borderBottom: leftTab === tab ? "2px solid var(--cyan)" : "2px solid transparent",
                    marginBottom: 0,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {leftTab === "Description" ? (
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* Title + like/bookmark */}
                <div style={{ padding: "20px 4px 10px", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                      <span className="cl-mono" style={{ fontSize: 15, color: "var(--text-dim)", marginRight: 4 }}>{data.id}.</span>
                      {data.title}
                    </div>
                    <div style={{ display: "flex", gap: 2, flexShrink: 0, paddingTop: 2 }}>
                      <button className="cl-btn cl-btn-icon" onClick={() => setLiked((v) => !v)} style={{ color: liked ? "var(--hard)" : undefined }}>
                        <Icon name={liked ? "heartFill" : "heart"} size={22} />
                      </button>
                      <button className="cl-btn cl-btn-icon" onClick={() => setListPopupOpen(true)} title="Save to list">
                        <Icon name="bookmark" size={21} />
                      </button>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                    <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{formatFieldName(data.difficulty)}</span>
                    <span className="cl-chip" style={{ fontSize: 11 }}>Acceptance: {acceptance}</span>
                    <span style={{ fontSize: 12, color: "var(--text-mute)", display: "flex", alignItems: "center", gap: 4 }}>
                      👍 {data.submissionCount ?? 0}
                    </span>
                  </div>
                </div>

                {/* Description body */}
                <div style={{ padding: "14px 4px 20px", color: "var(--text-dim)", fontSize: 13.5, lineHeight: 1.7 }}>
                  <div dangerouslySetInnerHTML={{ __html: data.description }} />

                  {/* Examples */}
                  {examples.length > 0 && (
                    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                      {examples.map((ex, i) => (
                        <div key={i}>
                          <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Example {i + 1}</div>
                          <div style={{ borderLeft: "2px solid var(--stroke-2)", paddingLeft: 12, fontFamily: "var(--font-mono)", fontSize: 12, whiteSpace: "pre-wrap" }}>
                            {Object.entries(ex).map(([k, v]) => (
                              <div key={k}><span style={{ color: "var(--cyan)" }}>{formatFieldName(k)}:</span> <span dangerouslySetInnerHTML={{ __html: v }} /></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  {data.constraints?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Constraints</div>
                      <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 6, listStyleType: "disc" }}>
                        {data.constraints.map((c, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, display: "list-item" }} dangerouslySetInnerHTML={{ __html: c }} />
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Topics */}
                  {data.topics?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 8 }}>Topics</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {data.topics.map((t) => (
                          <span key={t} className="cl-chip">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Companies */}
                  {data.companies?.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 8 }}>Companies</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {data.companies.map((c) => (
                          <span key={c} className="cl-chip">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <SubmissionsView problemId={id} />
            )}
          </div>
        )}

        {/* Right column: editor + testcases. When compact these are two separate panes. */}
        <div
          ref={rightColRef}
          className={`cl-pd-right ${fullScreen ? "is-full" : ""}`}
          style={compact && pane === "problem" ? { display: "none" } : undefined}
        >
          {(!compact || pane === "code") && (
            // Compact: the editor owns the pane. Wide: it's the resizable top half.
            <div style={compact
              ? { flex: 1, minHeight: 0 }
              : { height: editorHeightPx != null ? `${editorHeightPx}px` : "68%", flexShrink: 0, minHeight: MIN_EDITOR_H }}>
              <CodeEditor codeSnippets={codeSnippets} toggleFullScreenEditor={toggleFull} onPending={handlePending} onResult={handleResult} />
            </div>
          )}

          <>
            {/* ── Drag divider — pointer-only affordance, so it's wide-screen only ── */}
            {!compact && (
              <div
                onMouseDown={onDividerMouseDown}
                style={{ height: DIVIDER_H, flexShrink: 0, cursor: "row-resize", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-1)", borderTop: "1px solid var(--stroke)", borderBottom: "1px solid var(--stroke)" }}
              >
                <div style={{ width: 36, height: 3, borderRadius: 999, background: "var(--stroke-2)" }} />
              </div>
            )}

            <div
              className="cl-card"
              style={{
                flex: 1, minHeight: MIN_TC_H, display: compact && pane !== "result" ? "none" : "flex",
                flexDirection: "column", overflow: "hidden", borderRadius: 0,
              }}
            >
              {/* Testcases tab bar */}
              <div style={{ padding: "0 16px", borderBottom: "1px solid var(--stroke)", display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>

                {/* Run result: tabs with pass/fail dots */}
                {resultState?.status === "done" && resultState.isRun ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-dim)", padding: "10px 6px 10px 0", marginRight: 6 }}>TESTCASES</span>
                    {resultState.report.testcaseResults.map((r, i) => (
                      <button key={i} onClick={() => setRunTab(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5, color: runTab === i ? "var(--text)" : "var(--text-dim)", borderBottom: runTab === i ? "2px solid var(--cyan)" : "2px solid transparent", marginBottom: -1, fontWeight: runTab === i ? 600 : 400 }}>
                        <span style={{ fontSize: 8, color: r.status === "PASSED" ? "var(--easy)" : "var(--hard)" }}>●</span>
                        Case {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setResultState(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--text-mute)", padding: "10px 4px" }}>← Cases</button>
                  </>
                ) : resultState?.status === "done" && !resultState.isRun ? (
                  /* Submit result: single result header */
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", padding: "10px 6px 10px 0", color: resultState.report.status === "ACC" ? "var(--easy)" : "var(--hard)" }}>
                      {resultState.report.statusMsg?.toUpperCase()}
                    </span>
                    <button onClick={() => setResultState(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--text-mute)", padding: "10px 4px" }}>← Cases</button>
                  </>
                ) : resultState?.status === "error" ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--hard)", padding: "10px 6px 10px 0" }}>ERROR</span>
                    <button onClick={() => setResultState(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--text-mute)", padding: "10px 4px" }}>← Cases</button>
                  </>
                ) : (
                  /* Default + loading: normal case tabs */
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-dim)", padding: "10px 6px 10px 0", marginRight: 6 }}>TESTCASES</span>
                    {examples.map((_, i) => (
                      <button key={i} onClick={() => setTestcaseIdx(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 10px", fontSize: 12, color: testcaseIdx === i ? "var(--text)" : "var(--text-dim)", borderBottom: testcaseIdx === i ? "2px solid var(--cyan)" : "2px solid transparent", marginBottom: -1, fontWeight: testcaseIdx === i ? 600 : 400 }}>
                        Case {i + 1}
                      </button>
                    ))}
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 8px", fontSize: 13, color: "var(--text-mute)" }}>+Add</button>
                    {resultState?.status === "loading" && (
                      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, paddingRight: 4 }}>
                        <Spinner size={13} label={resultState.isRun ? "Running" : "Judging"} />
                        <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{resultState.isRun ? "Running…" : "Judging…"}</span>
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Testcase / result content */}
              <div style={{ padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", overflowY: "auto", flex: 1 }}>
                {resultState?.status === "loading" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-mute)", padding: "10px 0" }}>
                    <Spinner label={resultState.isRun ? "Running your code" : "Judging your submission"} />
                    <span>{resultState.isRun ? "Running your code…" : "Judging your submission…"}</span>
                  </div>
                ) : resultState?.status === "error" ? (
                  <div style={{ color: "var(--hard)" }}>{resultState.message}</div>
                ) : resultState?.status === "done" && resultState.isRun ? (
                  <RunTestResult result={resultState.report.testcaseResults[runTab]} />
                ) : resultState?.status === "done" && !resultState.isRun ? (
                  <SubmitResultView report={resultState.report} />
                ) : selectedCase ? (
                  Object.entries(selectedCase).filter(([k]) => k !== "explanation").map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <div style={{ color: "var(--text-mute)", fontSize: 11, marginBottom: 4 }}>{formatFieldName(k)} =</div>
                      <div style={{ background: "var(--bg-2)", borderRadius: 6, padding: "6px 10px", whiteSpace: "pre-wrap" }}>{v}</div>
                    </div>
                  ))
                ) : (
                  <span style={{ color: "var(--text-mute)" }}>No test cases available.</span>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    style={{
      width: 40, height: 22, borderRadius: 11, padding: 0, flexShrink: 0,
      background: value ? "var(--cyan)" : "var(--bg-3)",
      border: `1px solid ${value ? "var(--cyan)" : "var(--stroke-1)"}`,
      cursor: "pointer", position: "relative",
      transition: "background 0.2s, border-color 0.2s",
    }}
  >
    <span style={{
      position: "absolute", top: 3, left: value ? 21 : 3,
      width: 14, height: 14, borderRadius: "50%",
      background: value ? "#fff" : "var(--text-mute)",
      transition: "left 0.2s, background 0.2s",
      display: "block",
    }} />
  </button>
);

const SaveToListPopup = ({ problemId, username, onClose, onToast }) => {
  const queryClient = useQueryClient();
  const { data: lists = [], isLoading } = useUserLists(username);
  const addMut = useAddToListMutation();
  const createMut = useCreateListMutation();

  const [view, setView] = useState("list"); // "list" | "create"
  const [form, setForm] = useState({ name: "", description: "", isPublic: false, isPinned: false });
  const [createResult, setCreateResult] = useState(null); // { success: bool, message: string } | null
  const [addResult, setAddResult] = useState(null);       // { state: 'success'|'warning'|'failure', message } | null
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const goToCreate = () => { setCreateResult(null); setAddResult(null); setView("create"); };
  const goToList   = () => { setCreateResult(null); setView("list"); };

  const handleAdd = (list) => {
    setAddResult(null);
    addMut.mutate(
      { id: list.id, problemIds: [Number(problemId)] },
      {
        onSuccess: (msg) => {
          const lower = (msg ?? "").toLowerCase().trim();
          const state = lower.startsWith("1 new") ? "success" : "warning";
          setAddResult({ state, message: msg });
        },
        onError: (err) => {
          setAddResult({ state: "failure", message: err?.response?.data?.message || "Failed to add problem to list." });
        },
      }
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreateResult(null);
    createMut.mutate(form, {
      onSuccess: (msg) => {
        queryClient.invalidateQueries(["userLists", username]);
        setCreateResult({ success: true, message: msg || "List created" });
        setTimeout(() => {
          setForm({ name: "", description: "", isPublic: false, isPinned: false });
          setCreateResult(null);
          setView("list");
        }, 1500);
      },
      onError: (err) => {
        setCreateResult({ success: false, message: err?.response?.data?.message || "Failed to create list." });
      },
    });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: "var(--z-backdrop)", background: "rgba(0,0,0,0.55)" }} />

      <div style={{
        position: "fixed", zIndex: "var(--z-modal)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "var(--bg-1)", border: "1px solid var(--stroke-1)",
        borderRadius: 12, padding: "20px 20px 16px", width: 320,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}>
        {view === "list" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>Save to list</span>
              <button className="cl-btn cl-btn-icon" onClick={onClose}><Icon name="close" size={14} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12, maxHeight: 180, overflowY: "auto" }}>
              {isLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", color: "var(--text-mute)", fontSize: 13 }}>
                  <Spinner label="Loading lists" /> Loading lists…
                </div>
              ) : lists.length === 0 ? (
                <div style={{ color: "var(--text-mute)", fontSize: 13, padding: "8px 0" }}>No lists yet. Create one below.</div>
              ) : lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAdd(list)}
                  disabled={addMut.isLoading}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 8, width: "100%",
                    background: "transparent", border: "1px solid var(--stroke)",
                    cursor: "pointer", textAlign: "left",
                    color: "var(--text)", fontSize: 13, fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Icon name="bookmark" size={13} style={{ color: "var(--text-mute)", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{list.name}</span>
                  <span style={{ fontSize: 10, color: "var(--text-mute)", border: "1px solid var(--stroke)", borderRadius: 4, padding: "1px 5px" }}>
                    {list.isPublic ? "public" : "private"}
                  </span>
                </button>
              ))}
            </div>

            {addResult && (
              <div style={{ fontSize: 12, textAlign: "center", padding: "8px 4px 4px", color: addResult.state === "success" ? "var(--easy)" : addResult.state === "warning" ? "var(--medium)" : "var(--hard)" }}>
                {addResult.message}
              </div>
            )}

            <div style={{ height: 1, background: "var(--stroke)", margin: "4px 0 12px" }} />
            <button className="cl-btn cl-btn-subtle" style={{ width: "100%", gap: 8, justifyContent: "center" }} onClick={goToCreate}>
              <Icon name="plus" size={13} /> Create new list
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <button className="cl-btn cl-btn-icon" onClick={goToList}><Icon name="chevronLeft" size={14} /></button>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>New list</span>
              <div style={{ flex: 1 }} />
              <button className="cl-btn cl-btn-icon" onClick={onClose}><Icon name="close" size={14} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="cl-field">
                <label className="cl-field-label" htmlFor="newListName">Name</label>
                <input id="newListName" name="newListName" className="cl-input" placeholder="e.g. Amazon Interview Prep" value={form.name} onChange={(e) => set("name")(e.target.value)} autoFocus required />
              </div>
              <div className="cl-field">
                <label className="cl-field-label" htmlFor="newListDescription">Description</label>
                <input id="newListDescription" name="newListDescription" className="cl-input" placeholder="Optional" value={form.description} onChange={(e) => set("description")(e.target.value)} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "4px 0" }}>
                {[
                  { key: "isPublic",  label: "Public",  sub: "Anyone can view this list" },
                  { key: "isPinned",  label: "Pinned",  sub: "Show at the top of your lists" },
                ].map(({ key, label, sub }) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--text)" }}>{label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>{sub}</div>
                    </div>
                    <Toggle value={form[key]} onChange={set(key)} />
                  </div>
                ))}
              </div>

              <button type="submit" className="cl-btn cl-btn-primary" style={{ marginTop: 4, gap: 8, justifyContent: "center" }} disabled={!form.name.trim() || createMut.isLoading || createResult?.success}>
                {createMut.isLoading ? "Creating…" : <><Icon name="plus" size={13} /> Create list</>}
              </button>

              {createResult && (
                <div style={{ fontSize: 12, textAlign: "center", color: createResult.success ? "var(--easy)" : "var(--hard)", marginTop: -6 }}>
                  {createResult.message}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
};
