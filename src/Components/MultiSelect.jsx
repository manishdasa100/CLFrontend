import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export default function MultiSelect({ label, selected, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (v) => {
    const next = new Set(selected);
    next.has(v) ? next.delete(v) : next.add(v);
    onChange(next);
  };

  const labelText = selected.size === 0 ? "All" : `${selected.size} selected`;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 10px", border: "1px solid var(--stroke-1)", borderRadius: 8, height: 38, background: "var(--bg-1)", cursor: "pointer", fontFamily: "inherit" }}
      >
        <span style={{ fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</span>
        <span style={{ fontSize: 12, color: selected.size > 0 ? "var(--text)" : "var(--text-mute)" }}>{labelText}</span>
        <Icon name="chevron" size={12} style={{ color: "var(--text-mute)" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50, background: "var(--bg-1)", border: "1px solid var(--stroke-1)", borderRadius: 10, minWidth: 180, maxHeight: 240, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          {options.map((o) => (
            <label
              key={o.v}
              onClick={() => toggle(o.v)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, color: selected.has(o.v) ? "var(--text)" : "var(--text-dim)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                border: selected.has(o.v) ? "2px solid var(--lemon-deep)" : "2px solid var(--stroke-2)",
                background: selected.has(o.v) ? "var(--lemon-deep)" : "transparent",
                transition: "all .15s",
              }}>
                {selected.has(o.v) && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-11" />
                  </svg>
                )}
              </span>
              {o.l}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
