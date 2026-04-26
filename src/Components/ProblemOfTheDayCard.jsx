import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useProblemOfTheDayData } from "../services/queries";

export default function ProblemOfTheDayCard() {
  const { isLoading, isFetching, data, isError } = useProblemOfTheDayData();
  const loading = isLoading || isFetching;

  return (
    <div className="cl-card" style={{ flex: 1, padding: "22px 24px", position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, rgba(255,225,64,0.08) 0%, var(--bg-1) 70%)" }}>
      <div className="cl-eyebrow"><Icon name="sparkle" size={11} style={{ color: "var(--lemon)", verticalAlign: "middle", marginRight: 4 }} />daily · fresh squeeze</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, marginTop: 8, letterSpacing: "-0.015em" }}>
        {loading ? "Loading…" : isError ? "Couldn't load today" : data?.title || "Problem of the day"}
      </div>
      <div className="cl-text-dim" style={{ fontSize: 13, marginTop: 6 }}>
        One problem. Fifteen minutes. No excuses.
      </div>
      {!loading && !isError && data?.id && (
        <Link to={`${data.id}`} className="cl-btn cl-btn-primary cl-btn-sm" style={{ marginTop: 16, width: "fit-content" }}>
          Try it <Icon name="arrowRight" size={12} />
        </Link>
      )}
      <div style={{ position: "absolute", right: -20, bottom: -20, width: 140, height: 140, borderRadius: "50%",
        background: "radial-gradient(circle at 30% 28%, #FFF5B0 0%, #FFE140 40%, #C89E00 100%)",
        opacity: .18, filter: "blur(2px)" }} />
    </div>
  );
}
