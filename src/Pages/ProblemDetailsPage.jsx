import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Spinner } from "@nextui-org/react";
import { useProblemByIdData } from "../services/queries";
import CodeEditor from "../Components/CodeEditor";
import Icon from "../Components/Icon";
import { formatFieldName } from "../lib/utils";
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

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [leftTab, setLeftTab] = useState("Description");
  const [testcaseIdx, setTestcaseIdx] = useState(0);
  const [resultState, setResultState] = useState(null); // null | {status:'loading',isRun} | {status:'done',isRun,report} | {status:'error',message}
  const [runTab, setRunTab] = useState(0);

  const { isLoading, isFetching, data, isError, error } = useProblemByIdData(id);
  const toggleFull = () => setFullScreen((v) => !v);

  const handlePending = (isRun) => setResultState({ status: "loading", isRun });
  const handleResult = (report, isRun, errorMsg) => {
    if (errorMsg || !report) {
      setResultState({ status: "error", message: errorMsg || "Something went wrong." });
    } else {
      setResultState({ status: "done", isRun, report });
      setRunTab(0);
    }
  };

  const MIN_EDITOR_H = 150;
  const MIN_TC_H = 80;
  const DIVIDER_H = 8;
  const [editorHeightPx, setEditorHeightPx] = useState(null);
  const rightColRef = useRef(null);

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
        <ScaleLoader loading color="#22D3EE" height={25} width={2} speedMultiplier={0.5} />
        <div style={{ color: "var(--text-dim)", marginLeft: 12, fontSize: 14 }}>Loading problem…</div>
      </div>
    );
  }

  const diff = String(data.difficulty || "").toLowerCase();
  const acceptance = data.submissionCount > 0
    ? Math.round((data.acceptedCount / data.submissionCount) * 100) + "%"
    : "0";
  const codeSnippets = data.codeSnippets
    ? Object.entries(data.codeSnippets).map(([languageCode, code]) => ({ languageCode, code: atob(code) }))
    : [];
  const examples = data.examples || [];
  const selectedCase = examples[testcaseIdx] || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 72px)" }}>

      {/* ── Breadcrumb bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "25px 42px", borderBottom: "1px solid var(--stroke)", flexShrink: 0, height: 40, background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <Link to="/arena/problemset" style={{ color: "var(--text-mute)", textDecoration: "none" }}>arena</Link>
          <span style={{ color: "var(--stroke-2)" }}>/</span>
          <Link to="/arena/problemset" style={{ color: "var(--text-mute)", textDecoration: "none" }}>problemset</Link>
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

      {/* ── Two-column layout ── */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 0 0 28px", display: "flex", gap: 0 }}>

        {/* Left panel — open, no card */}
        {!fullScreen && (
          <div style={{ width: "40%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

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
                      <button className="cl-btn cl-btn-icon" onClick={() => setBookmarked((v) => !v)} style={{ color: bookmarked ? "var(--lemon)" : undefined }}>
                        <Icon name={bookmarked ? "bookmarkFill" : "bookmark"} size={21} />
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
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mute)", fontSize: 13 }}>
                {leftTab} coming soon
              </div>
            )}
          </div>
        )}

        {/* Right column: editor + testcases */}
        <div ref={rightColRef} style={{ width: fullScreen ? "100%" : "60%", display: "flex", flexDirection: "column" }}>
          <div style={{ height: editorHeightPx != null ? `${editorHeightPx}px` : "68%", flexShrink: 0, minHeight: MIN_EDITOR_H }}>
            <CodeEditor codeSnippets={codeSnippets} toggleFullScreenEditor={toggleFull} onPending={handlePending} onResult={handleResult} />
          </div>

          <>
            {/* ── Drag divider ── */}
            <div
              onMouseDown={onDividerMouseDown}
              style={{ height: DIVIDER_H, flexShrink: 0, cursor: "row-resize", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-1)", borderTop: "1px solid var(--stroke)", borderBottom: "1px solid var(--stroke)" }}
            >
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "var(--stroke-2)" }} />
            </div>

            <div className="cl-card" style={{ flex: 1, minHeight: MIN_TC_H, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 0 }}>
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
                        <Spinner size="sm" color="primary" />
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
                    <Spinner size="sm" color="primary" />
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
