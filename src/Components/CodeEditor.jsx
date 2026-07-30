import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { useParams } from "react-router-dom";
import { languageCodes, formatFieldName } from "../lib/utils";
import { submitCode, checkSubmission } from "../services/api";

const codeKey = (id, lang) => `acecode_code_${id}_${lang}`;

export default function CodeEditor({ codeSnippets, toggleFullScreenEditor, isFullScreen, onPending, onResult }) {
  const { id } = useParams();

  const initLang = codeSnippets?.[0]?.languageCode?.toLowerCase() || "java";
  const [language, setLanguage] = useState(initLang);
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(codeKey(id, initLang));
    return saved !== null ? saved : (codeSnippets?.[0]?.code || "");
  });
  const [action, setAction] = useState(null); // 'run' | 'submit' | null
  const abortRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(codeKey(id, language));
    if (saved !== null) {
      setCode(saved);
    } else {
      const snip = codeSnippets?.find((s) => s.languageCode.toLowerCase() === language);
      if (snip) setCode(snip.code);
    }
  }, [language]); // intentionally omits codeSnippets — only reset on explicit language switch

  useEffect(() => () => { abortRef.current = true; }, []);

  const handleCodeChange = (v) => {
    const next = v || "";
    setCode(next);
    localStorage.setItem(codeKey(id, language), next);
  };

  const resetToDefault = () => {
    const snip = codeSnippets?.find((s) => s.languageCode.toLowerCase() === language);
    if (!snip) return;
    localStorage.removeItem(codeKey(id, language));
    setCode(snip.code);
  };

  const execute = async (isRunCode) => {
    if (action) return;
    abortRef.current = false;
    setAction(isRunCode ? "run" : "submit");
    onPending?.(isRunCode);

    try {
      const { submissionId } = await submitCode({
        code,
        language: languageCodes[language],
        problemId: Number(id),
        isRunCode,
      });

      while (!abortRef.current) {
        await new Promise((r) => setTimeout(r, 1500));
        if (abortRef.current) break;
        const res = await checkSubmission(submissionId);
        if (res.submissionStatus === "COMPLETED") {
          if (!abortRef.current) onResult?.(res.executionReport, isRunCode);
          break;
        }
      }
    } catch (err) {
      if (!abortRef.current) {
        onResult?.(null, isRunCode, err?.response?.data?.message || "Something went wrong.");
      }
    } finally {
      if (!abortRef.current) setAction(null);
    }
  };

  return (
    <div className="cl-card" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 0 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid var(--stroke)", gap: 10, background: "var(--bg-1)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 4px 0 10px", border: "1px solid var(--stroke-1)", borderRadius: 8, height: 32, background: "var(--bg-2)" }}>
          <span className="cl-picker-label">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ height: 24, fontSize: 12, padding: "0 20px 0 4px", border: "none", background: "var(--bg-3)", borderRadius: 6, color: "var(--text)", cursor: "pointer", outline: "none", fontFamily: "inherit" }}
          >
            {codeSnippets?.map((s) => (
              <option key={s.languageCode} value={s.languageCode.toLowerCase()}>{formatFieldName(s.languageCode)}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }} />
        <button className="cl-btn cl-btn-icon" onClick={resetToDefault} disabled={!!action} title="Reset to default snippet">
          <Icon name="reset" size={13} />
        </button>
        <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={() => execute(true)} disabled={!!action}>
          {action === "run" ? "Running…" : <><Icon name="play" size={10} /> Run</>}
        </button>
        <button className="cl-btn cl-btn-primary cl-btn-sm" onClick={() => execute(false)} disabled={!!action}>
          {action === "submit" ? "Submitting…" : "Submit"}
        </button>
        {/* Omitted on narrow screens, where the caller passes no handler: the
            editor already fills its pane there, so there is nothing to expand.
            It was also a bare icon with no accessible name and no indication of
            which state it was in. */}
        {toggleFullScreenEditor && (
          <button
            className="cl-btn cl-btn-icon"
            onClick={toggleFullScreenEditor}
            aria-pressed={isFullScreen}
            aria-label={isFullScreen ? "Exit full screen editor" : "Expand editor to full screen"}
            title={isFullScreen ? "Exit full screen" : "Full screen editor"}
          >
            <Icon name={isFullScreen ? "collapse" : "expand"} size={13} />
          </button>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          language={language}
          theme="ace-black"
          value={code}
          onChange={handleCodeChange}
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
          options={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, lineNumbersMinChars: 3, glyphMargin: false }}
        />
      </div>
    </div>
  );
}
