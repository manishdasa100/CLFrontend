import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useProblemOfTheDayData } from "../services/queries";
import { formatFieldName } from "../lib/utils";

export default function ProblemOfTheDayCard() {
  const { isLoading, isFetching, data, isError } = useProblemOfTheDayData();
  const loading = isLoading || isFetching;
  const diff = String(data?.difficulty || "").toLowerCase();

  return (
    <div className="cl-card" style={{
      minWidth: 0,
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(255,225,64,0.12) 0%, var(--bg-1) 70%)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div className="cl-eyebrow" style={{color: "var(--lemon)"}}>problem of the day</div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 600,
        marginTop: 10,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        maxWidth: "70%",
      }}>
        {loading ? "Loading…" : isError ? "Couldn't load today" : data?.title || "Problem of the day"}
      </div>

      {!loading && !isError && data && (
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {data.difficulty && (
            <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{formatFieldName(data.difficulty)}</span>
          )}
          {data.topics?.slice(0, 2).map((t) => (
            <span key={t} className="cl-chip">{t}</span>
          ))}
        </div>
      )}

      {!loading && !isError && data?.problemId && (
        <Link
          to={`problemset/${data.problemId}`}
          className="cl-btn cl-btn-primary cl-btn-sm"
          style={{ marginTop: 26, width: "fit-content" }}
        >
          Try now <Icon name="arrowRight" size={12} />
        </Link>
      )}

      {/* Decorative lemon orb — vertically centred on the right */}
      <div style={{
        position: "absolute",
        right: -30,
        top: "50%",
        transform: "translateY(-80%)",
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 28%, #FFF5B0 0%, #FFE140 40%, #C89E00 100%)",
        opacity: 0.60,
        filter: "blur(0px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
