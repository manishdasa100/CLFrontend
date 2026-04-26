import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useProblemByIdData } from "../services/queries";
import CodeEditor from "../Components/CodeEditor";
import Icon from "../Components/Icon";
import { formatFieldName, textMapForProblemStatus, percentisize } from "../lib/utils";
import "./ProblemDetailsPage.css";

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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
  const codeSnippets = data.codeSnippets
    ? Object.entries(data.codeSnippets).map(([languageCode, code]) => ({ languageCode, code }))
    : [];

  return (
    <div style={{ padding: "12px 28px 20px", display: "flex", gap: 16, height: "calc(100vh - 72px)" }}>
        {!fullScreen && (
          <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="cl-card" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--stroke)", display: "flex", alignItems: "center", gap: 10 }}>
                <span className="cl-mono cl-text-mute" style={{ fontSize: 11 }}>#{String(data.id).padStart(4, "0")}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", flex: 1 }}>{data.title}</span>
                <button className="cl-btn cl-btn-icon" onClick={() => setLiked((v) => !v)} style={{ color: liked ? "var(--hard)" : undefined }}>
                  <Icon name={liked ? "heartFill" : "heart"} size={15} />
                </button>
                <button className="cl-btn cl-btn-icon" onClick={() => setBookmarked((v) => !v)} style={{ color: bookmarked ? "var(--lemon)" : undefined }}>
                  <Icon name={bookmarked ? "bookmarkFill" : "bookmark"} size={15} />
                </button>
              </div>
              <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--stroke)", display: "flex", gap: 10, alignItems: "center" }}>
                <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{formatFieldName(data.difficulty)}</span>
                <span className="cl-chip">Acc {percentisize(data.acceptedCount, data.submissionCount)}</span>
                <span className="cl-chip">{textMapForProblemStatus[data.status]}</span>
              </div>
              <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1, color: "var(--text-dim)", fontSize: 13.5, lineHeight: 1.6 }}>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                  {data.examples?.map((ex, i) => (
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
                {data.constraints?.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>Constraints</div>
                    <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                      {data.constraints.map((c, i) => <li key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }} dangerouslySetInnerHTML={{ __html: c }} />)}
                    </ul>
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid var(--stroke)", display: "flex", justifyContent: "space-between" }}>
                <button className="cl-btn cl-btn-subtle cl-btn-sm" disabled={!data?.previousProblemId} onClick={() => navigate(`/arena/problemset/${data.previousProblemId}`)}>
                  <Icon name="chevronLeft" size={12} /> Previous
                </button>
                <button className="cl-btn cl-btn-subtle cl-btn-sm" disabled={!data?.nextProblemId} onClick={() => navigate(`/arena/problemset/${data.nextProblemId}`)}>
                  Next <Icon name="chevronRight" size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ width: fullScreen ? "100%" : "60%", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ flex: "0 0 70%", minHeight: 0 }}>
            <CodeEditor codeSnippets={codeSnippets} toggleFullScreenEditor={toggleFull} />
          </div>
          {!fullScreen && (
            <div className="cl-card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--stroke)", color: "var(--text-dim)", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="terminal" size={12} /> Testcase Results
              </div>
              <div style={{ padding: 18, color: "var(--text-mute)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                Run your solution to see results here.
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
