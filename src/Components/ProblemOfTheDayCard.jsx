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
      // Two layers, because this inline background overrides .cl-card's and
      // would otherwise be the one translucent card left in the app: the lemon
      // wash on top, an opaque base beneath it. The wash ends on `transparent`
      // rather than a colour so the base is what shows through.
      background: "linear-gradient(135deg, rgba(255,225,64,0.16) 0%, transparent 70%), var(--surface-solid)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div className="cl-eyebrow" style={{fontSize: 13, color: "var(--lemon)"}}>Problem of the day</div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 600,
        marginTop: 10,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        maxWidth: "70%",
      }}>
        {loading ? "Loading…" : isError ? "Couldn't load today's problem" : data?.title || "Problem of the day"}
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
          to={`${data.problemId}`}
          className="cl-btn cl-btn-primary cl-btn-sm"
          style={{ marginTop: 26, width: "fit-content" }}
        >
          Try now <Icon name="arrowRight" size={12} />
        </Link>
      )}

      {/* Decorative lemon orb. It used to be a hard-edged 160px disc at 0.60 —
          opaque enough to read as a mis-cropped image sitting on top of the card
          and the single loudest thing in the Arena. Pushed further off the edge,
          dropped to a third of the opacity and softened, it does what it was
          meant to: tint the corner of the card. */}
      <div aria-hidden="true" style={{
        position: "absolute",
        right: -56,
        top: "50%",
        transform: "translateY(-72%)",
        width: 170,
        height: 170,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 28%, #FFF5B0 0%, #FFE140 40%, #C89E00 100%)",
        opacity: 0.22,
        filter: "blur(14px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
