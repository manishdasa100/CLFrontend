import { useEffect } from "react";
import Icon from "./Icon";

export default function Toast({ message, state = "failure", onClose }) {
  const color = state === "success" ? "var(--easy)" : state === "warning" ? "var(--medium)" : "var(--hard)";
  const borderColor = state === "success" ? "rgba(110,231,183,.3)" : state === "warning" ? "rgba(252,211,77,.3)" : "rgba(251,113,133,.3)";

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--bg-2)", border: `1px solid ${borderColor}`,
      borderRadius: 10, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      fontSize: 13, color: "var(--text)", maxWidth: 320,
      animation: "toast-slide-in .3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
    }}>
      <span style={{ color, flexShrink: 0 }}>
        <Icon name={state === "success" ? "check" : state === "warning" ? "dot" : "close"} size={14} />
      </span>
      {message}
      <span style={{ marginLeft: "auto", cursor: "pointer", color: "var(--text-mute)", flexShrink: 0 }} onClick={onClose}>
        <Icon name="close" size={12} />
      </span>
    </div>
  );
}
