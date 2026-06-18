import { useParams, useNavigate, Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import { useListDetails } from "../services/queries";
import "../styles/listdetails.css";

const TIER_META = {
  BEGINNER:     { label: "Beginner",     chip: "cl-chip-easy"   },
  INTERMEDIATE: { label: "Intermediate", chip: "cl-chip-medium" },
  ADVANCED:     { label: "Advanced",     chip: "cl-chip-hard"   },
  MIXED:        { label: "Mixed",        chip: "cl-chip-cyan"   },
};

function formatDifficulty(d) {
  if (!d) return "";
  return d.charAt(0) + d.slice(1).toLowerCase();
}

export default function ListDetailsPage() {
  const { username, listName } = useParams();
  const decodedName = listName ? decodeURIComponent(listName) : "";
  const navigate = useNavigate();
  const { data: list, isLoading, isError, error } = useListDetails(username, decodedName);

  const tier = list?.isStudyPlan ? (TIER_META[list.difficultyTier] || TIER_META.MIXED) : null;

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <div className="cl-container ld-shell">
        <Link to={-1} onClick={(e) => { e.preventDefault(); navigate(-1); }} className="ld-back">
          <Icon name="chevronLeft" size={13} /> Back
        </Link>

        {isLoading && <div className="ld-state">Loading list…</div>}

        {isError && (
          <div className="ld-state ld-state-error">
            <Icon name="warn" size={14} />
            {error?.response?.data?.message || "Failed to load list."}
          </div>
        )}

        {!isLoading && !isError && list && (
          <>
            <header className={`ld-head ${list.isStudyPlan ? "ld-head-plan" : ""}`}>
              {list.isStudyPlan && <div className="ld-head-accent" />}
              <div className="ld-head-top">
                <span className={`ld-kind ${list.isStudyPlan ? "ld-kind-plan" : "ld-kind-list"}`}>
                  <Icon name={list.isStudyPlan ? "grid" : "bookmark"} size={11} />
                  {list.isStudyPlan ? "Study Plan" : "Problem List"}
                </span>
                {list.isPinned && (
                  <span className="ld-pin"><Icon name="pin2" size={11} /> Pinned</span>
                )}
                <span className={"ld-vis " + (list.isPublic ? "ld-vis-public" : "ld-vis-private")}>
                  <Icon name={list.isPublic ? "globe" : "lock"} size={11} />
                  {list.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <h1 className="ld-name">{list.name}</h1>
              {list.description && <p className="ld-desc">{list.description}</p>}
              <div className="ld-meta">
                <span className="ld-meta-item">
                  <Icon name="list" size={12} />
                  <span className="cl-mono">{list.totalProblems}</span> {list.totalProblems === 1 ? "problem" : "problems"}
                </span>
                {list.isStudyPlan && (
                  <>
                    <span className="ld-meta-dot">·</span>
                    <span className="ld-meta-item">
                      <Icon name="fire" size={12} />
                      <span className="cl-mono">{list.timelineDays}</span> {list.timelineDays === 1 ? "day" : "days"}
                    </span>
                    <span className="ld-meta-dot">·</span>
                    <span className={`cl-chip ${tier.chip}`}>{tier.label}</span>
                  </>
                )}
              </div>
            </header>

            <div className="ld-table-wrap">
              <table className="ld-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>#</th>
                    <th>Title</th>
                    <th style={{ width: 140 }}>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {(list.problemsData || []).length === 0 && (
                    <tr>
                      <td colSpan={3} className="ld-empty">No problems in this list yet.</td>
                    </tr>
                  )}
                  {(list.problemsData || []).map(p => {
                    const diff = String(p.difficulty || "").toLowerCase();
                    return (
                      <tr key={p.id} className="ld-row" onClick={() => navigate(`/arena/problemset/${p.id}`)}>
                        <td className="cl-mono cl-text-mute">{p.id}</td>
                        <td className="ld-title">{p.title}</td>
                        <td><span className={`cl-chip cl-chip-${diff}`}>{formatDifficulty(p.difficulty)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </BackgroundWrapper>
  );
}
