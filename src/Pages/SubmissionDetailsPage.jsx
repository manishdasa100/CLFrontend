import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import AppNavbar from "../Components/AppNavbar";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import { useSubmissionDetails } from "../services/queries";
import { SUBMISSION_STATUS, timeAgo, formatSubmittedAt, decodeBase64Utf8 } from "../lib/utils";
import { langLabel, titleCase } from "../Components/profileUtils";
import "../styles/submissiondetails.css";

const TIER_COLOR = { pass: "var(--easy)", wrong: "var(--medium)", error: "var(--hard)" };
const MONACO_LANG = { JAVA: "java", PYTHON: "python", CPP: "cpp", C: "c", GO: "go", JAVASCRIPT: "javascript", RUST: "rust" };

function CodePanel({ language, code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — leave the button as-is */
    }
  };

  return (
    <section className="sd-code">
      <header className="sd-code-bar">
        <span className="sd-code-lang"><Icon name="code" size={13} /> {langLabel((language || "").toLowerCase())}</span>
        <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={copy} disabled={!code}>
          <Icon name={copied ? "check" : "copy"} size={13} /> {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <div className="sd-code-body">
        <Editor
          language={MONACO_LANG[language] || (language || "").toLowerCase()}
          theme="ace-black"
          value={code}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("ace-black", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#000000",
                "editor.lineHighlightBackground": "#ffffff03",
                "editor.lineHighlightBorder": "#ffffff06",
                "editorGutter.background": "#0B0D14",
                "editorGutter.border": "#ffffff12",
              },
            });
          }}
          options={{
            readOnly: true,
            domReadOnly: true,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 14 },
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: false,
          }}
        />
      </div>
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="sd-stat">
      <div className="sd-stat-value" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="sd-stat-label">{label}</div>
    </div>
  );
}

function SubmissionBody({ data, code }) {
  const meta = SUBMISSION_STATUS[data.status] || { label: data.status, tier: "error", ran: false };
  const tier = TIER_COLOR[meta.tier];
  const prob = data.problemData || {};
  const pid = prob.id ?? data.problemId;
  const diff = (prob.difficulty || "").toLowerCase();
  // backend ships the flag as "runSucccess"; fall back to the status tier just in case.
  const ran = data.runSucccess ?? data.runSuccess ?? meta.ran;
  const allPassed = ran && data.totalTestCases > 0 && data.totalCorrectOutput === data.totalTestCases;

  return (
    <div className="sd-layout">
      <aside className="sd-meta">
        <div className="sd-verdict" style={{ "--tier": tier }}>
          <div className="sd-verdict-top">
            <span className="sd-verdict-dot" />
            <span className="sd-verdict-label">{meta.label}</span>
            <span className="cl-chip cl-chip-mono" style={{ marginLeft: "auto" }}>{data.status}</span>
          </div>
          <div className="sd-verdict-sub">
            {data.username && <>by <span className="sd-user">@{data.username}</span> · </>}
            <span title={formatSubmittedAt(data.dateOfSubmission)}>{timeAgo(data.dateOfSubmission)}</span>
          </div>
        </div>

        {(prob.title || pid != null) && (
          <Link to={`/arena/problemset/${pid}`} className="sd-problem">
            <span className="sd-problem-main">
              <span className="sd-problem-eyebrow">Problem</span>
              <span className="sd-problem-title">
                {pid != null && <span className="cl-mono sd-problem-id">{pid}.</span>} {prob.title}
              </span>
            </span>
            {diff && <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{titleCase(prob.difficulty)}</span>}
            <Icon name="arrowRight" size={14} className="sd-arrow" />
          </Link>
        )}

        {ran ? (
          <div className="sd-stats">
            <Stat label="Runtime" value={`${data.runtimeMs} ms`} />
            <Stat label="Memory" value={`${data.memoryMb} MB`} />
            <Stat
              label="Testcases"
              value={`${data.totalCorrectOutput} / ${data.totalTestCases}`}
              accent={allPassed ? "var(--easy)" : "var(--medium)"}
            />
          </div>
        ) : (
          <div className="sd-norun">This submission didn’t run, so there’s no runtime or test results to report.</div>
        )}

        <div className="sd-details">
          <div className="sd-detail"><span className="sd-detail-k">Language</span><span className="sd-detail-v">{langLabel((data.language || "").toLowerCase())}</span></div>
          <div className="sd-detail"><span className="sd-detail-k">Submitted</span><span className="sd-detail-v">{formatSubmittedAt(data.dateOfSubmission)}</span></div>
        </div>
      </aside>

      <CodePanel language={data.language} code={code} />
    </div>
  );
}

export default function SubmissionDetailsPage() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useSubmissionDetails(submissionId);

  const code = useMemo(() => decodeBase64Utf8(data?.userCode), [data?.userCode]);

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <div className="sd-shell">
        <button className="sd-back" type="button" onClick={() => navigate(-1)}>
          <Icon name="chevronLeft" size={13} /> Back
        </button>

        {isLoading ? (
          <div className="sd-state">Loading submission…</div>
        ) : isError ? (
          <div className="sd-state sd-state-error">
            <Icon name="warn" size={14} />
            {error?.response?.data?.message || "We couldn’t load this submission."}
            <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={() => refetch()} style={{ marginLeft: 4 }}>
              <Icon name="reset" size={12} /> Try again
            </button>
          </div>
        ) : data ? (
          <SubmissionBody data={data} code={code} />
        ) : null}
      </div>
    </BackgroundWrapper>
  );
}
