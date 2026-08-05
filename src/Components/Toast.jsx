import { useEffect } from "react";
import Icon from "./Icon";

export default function Toast({ message, state = "failure", onClose }) {
  const color = state === "success" ? "var(--easy)" : state === "warning" ? "var(--medium)" : "var(--hard)";
  // The state used to be spelled out by a tinted 1px border. Same information,
  // moved into the surface: a failure toast is cast red rather than outlined red.
  const surface = `color-mix(in srgb, ${color} 13%, var(--bg-4))`;

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    // This carries every error in the app (login, validation, submission), so it
    // has to be announced — a silent <div> left screen-reader users with no feedback.
    <div
      role={state === "failure" ? "alert" : "status"}
      aria-live={state === "failure" ? "assertive" : "polite"}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: "var(--z-toast)",
        display: "flex", alignItems: "center", gap: 10,
        background: surface,
        borderRadius: 10, padding: "12px 16px", boxShadow: "0 24px 50px -16px rgba(0,0,0,0.8)",
        fontSize: 13, color: "var(--text)", maxWidth: 320,
        animation: "toast-slide-in .28s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      }}
    >
      <span style={{ color, flexShrink: 0 }} aria-hidden="true">
        <Icon name={state === "success" ? "check" : state === "warning" ? "dot" : "close"} size={14} />
      </span>
      {message}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        style={{
          marginLeft: "auto", flexShrink: 0, display: "grid", placeItems: "center",
          width: 22, height: 22, padding: 0, borderRadius: 5,
          background: "none", border: "none", cursor: "pointer", color: "var(--text-mute)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-mute)")}
      >
        <Icon name="close" size={12} />
      </button>
    </div>
  );
}
