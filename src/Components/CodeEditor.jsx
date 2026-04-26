import { CardBody, Card, Tabs, Tab, Button } from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import { useState, useEffect, useMemo } from "react";
import Icon from "./Icon";
import { useExecutePersonalRunMutation, useExecuteSubmissionMutation } from "../services/queries";
import { useParams } from "react-router-dom";
import { languageCodes, formatFieldName } from "../lib/utils";

export default function CodeEditor({ codeSnippets, toggleFullScreenEditor }) {
  const { id } = useParams();
  const [language, setLanguage] = useState(codeSnippets?.[0]?.languageCode?.toLowerCase() || "javascript");
  const [code, setCode] = useState(codeSnippets?.[0]?.code || "");

  useEffect(() => {
    const snip = codeSnippets?.find((s) => s.languageCode.toLowerCase() === language);
    if (snip) setCode(snip.code);
  }, [language, codeSnippets]);

  const runMut = useExecutePersonalRunMutation();
  const subMut = useExecuteSubmissionMutation();

  const onRun = () => runMut.mutate({ code, language: languageCodes[language], problemId: id });
  const onSubmit = () => subMut.mutate({ code, language: languageCodes[language], problemId: id });

  return (
    <div className="cl-card" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid var(--stroke)", gap: 10, background: "var(--bg-1)" }}>
        <select className="cl-input" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "auto", height: 30, fontSize: 12, padding: "0 28px 0 10px" }}>
          {codeSnippets?.map((s) => <option key={s.languageCode} value={s.languageCode.toLowerCase()}>{formatFieldName(s.languageCode)}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="cl-btn cl-btn-subtle cl-btn-sm" onClick={onRun} disabled={runMut.isPending}>
          {runMut.isPending ? "Running…" : <><Icon name="play" size={10} /> Run</>}
        </button>
        <button className="cl-btn cl-btn-primary cl-btn-sm" onClick={onSubmit} disabled={subMut.isPending}>
          {subMut.isPending ? "Submitting…" : "Submit"}
        </button>
        <button className="cl-btn cl-btn-icon" onClick={toggleFullScreenEditor}><Icon name="expand" size={13} /></button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor language={language} theme="vs-dark" value={code} onChange={(v) => setCode(v || "")}
          options={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 } }} />
      </div>
    </div>
  );
}
