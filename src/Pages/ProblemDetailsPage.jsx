import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useProblemByIdData } from "../services/queries";
import CodeEditor from "../Components/CodeEditor";
import Icon from "../Components/Icon";
import { formatFieldName } from "../lib/utils";
import "./ProblemDetailsPage.css";

const LEFT_TABS = ["Description", "Editorial", "Solutions", "Submissions"];

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [leftTab, setLeftTab] = useState("Description");
  const [testcaseIdx, setTestcaseIdx] = useState(0);

  const { isLoading, isFetching, data, isError, error } = useProblemByIdData(id);
  const toggleFull = () => setFullScreen((v) => !v);

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
    : "N/A";
  const codeSnippets = data.codeSnippets
    ? Object.entries(data.codeSnippets).map(([languageCode, code]) => ({ languageCode, code }))
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
                    <span className="cl-chip" style={{ fontSize: 11 }}>Acceptance {acceptance}</span>
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
                              <div key={k}><span style={{ color: "var(--cyan)" }}>{formatFieldName(k)}:</span> {v}</div>
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
        <div style={{ width: fullScreen ? "100%" : "60%", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ flex: "0 0 70%", minHeight: 0 }}>
            <CodeEditor codeSnippets={codeSnippets} toggleFullScreenEditor={toggleFull} />
          </div>

          {!fullScreen && (
            <div className="cl-card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 0 }}>
              {/* Testcases tab bar */}
              <div style={{ padding: "0 16px", borderBottom: "1px solid var(--stroke)", display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-dim)", padding: "10px 6px 10px 0", marginRight: 6 }}>
                  TESTCASES
                </span>
                {examples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestcaseIdx(i)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "10px 10px",
                      fontSize: 12,
                      color: testcaseIdx === i ? "var(--text)" : "var(--text-dim)",
                      borderBottom: testcaseIdx === i ? "2px solid var(--cyan)" : "2px solid transparent",
                      marginBottom: -1,
                      fontWeight: testcaseIdx === i ? 600 : 400,
                    }}
                  >
                    Case {i + 1}
                  </button>
                ))}
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 8px", fontSize: 13, color: "var(--text-mute)" }}>
                  +Add
                </button>
              </div>

              {/* Testcase content */}
              <div style={{ padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", overflowY: "auto", flex: 1 }}>
                {selectedCase ? (
                  Object.entries(selectedCase).map(([k, v]) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
