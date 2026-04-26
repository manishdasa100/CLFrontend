import Icon from "../Components/Icon";

const PLANS = [
  { t: "75-Day Interview Crush", d: "The high-signal set before an onsite. 3 problems per day, curated progression.", items: 75, duration: "75 days", level: "mixed", highlight: true },
  { t: "DP Bootcamp", d: "A structured walk through DP patterns — 1D, 2D, tree, bitmask, digit.", items: 42, duration: "6 weeks", level: "advanced" },
  { t: "Graph Deep Dive", d: "From BFS/DFS basics to shortest paths, union-find, and network flow.", items: 36, duration: "5 weeks", level: "intermediate" },
  { t: "Daily Warm-up", d: "One easy problem a day. Habit-first; no pressure, no skipping.", items: "∞", duration: "forever", level: "beginner" },
  { t: "SQL for Engineers", d: "JOINs, window functions, and the kinds of queries interviewers actually ask.", items: 28, duration: "4 weeks", level: "intermediate" },
  { t: "Top 150 Classics", d: "The canonical list — the problems every engineer has seen at least once.", items: 150, duration: "flex", level: "mixed" },
];

export default function StudyPlans() {
  return (
    <div className="cl-container" style={{ paddingBottom: 40 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {PLANS.map((p, i) => (
          <div key={i} className="cl-card" style={{ padding: "24px 26px", position: "relative", overflow: "hidden",
            background: p.highlight ? "linear-gradient(135deg, rgba(34,211,238,0.06), var(--bg-1))" : undefined,
            borderColor: p.highlight ? "rgba(34,211,238,0.25)" : undefined }}>
            {p.highlight && <div className="cl-chip cl-chip-cyan" style={{ position: "absolute", top: 18, right: 18 }}>featured</div>}
            <div className="cl-eyebrow">{p.level}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", margin: "8px 0 6px" }}>{p.t}</h3>
            <p className="cl-text-dim" style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 18 }}>{p.d}</p>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-mute)", alignItems: "center" }}>
              <span><span className="cl-mono" style={{ color: "var(--text)" }}>{p.items}</span> problems</span>
              <span>·</span>
              <span>{p.duration}</span>
              <button className="cl-btn cl-btn-ghost cl-btn-sm" style={{ marginLeft: "auto" }}>
                Start plan <Icon name="arrowRight" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
