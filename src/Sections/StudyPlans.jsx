import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Components/Icon";
import { useGlobalLists } from "../services/queries";
import "../styles/studyplans.css";

const TIER_META = {
  BEGINNER:     { label: "Beginner",     chip: "cl-chip-easy"   },
  INTERMEDIATE: { label: "Intermediate", chip: "cl-chip-medium" },
  ADVANCED:     { label: "Advanced",     chip: "cl-chip-hard"   },
  MIXED:        { label: "Mixed",        chip: "cl-chip-cyan"   },
};

function StudyPlanCard({ plan, onOpen }) {
  const tier = TIER_META[plan.difficultyTier] || TIER_META.MIXED;
  return (
    <div className="sp-card sp-plan">
      <div className="sp-plan-accent" />
      {plan.isPinned && (
        <div className="sp-pin"><Icon name="pin2" size={12} /> Pinned</div>
      )}
      <div className="sp-row">
        <span className="sp-badge"><Icon name="grid" size={11} /> Study Plan</span>
        <span className={`cl-chip ${tier.chip}`}>{tier.label}</span>
      </div>
      <h3 className="sp-title">{plan.name}</h3>
      <p className="sp-desc">{plan.description || "—"}</p>
      <div className="sp-foot">
        <span className="sp-meta">
          <Icon name="list" size={12} />
          <span className="cl-mono">{plan.totalProblems}</span> {plan.totalProblems === 1 ? "problem" : "problems"}
        </span>
        <span className="sp-dot">·</span>
        <span className="sp-meta">
          <Icon name="fire" size={12} />
          <span className="cl-mono">{plan.timelineDays}</span> {plan.timelineDays === 1 ? "day" : "days"}
        </span>
        <button className="cl-btn cl-btn-cyan cl-btn-sm sp-cta" type="button" onClick={onOpen}>
          Start plan <Icon name="arrowRight" size={12} />
        </button>
      </div>
    </div>
  );
}

function ProblemListCard({ list, onOpen }) {
  return (
    <div className="sp-card sp-list">
      {list.isPinned && (
        <div className="sp-pin sp-pin-muted"><Icon name="pin2" size={12} /> Pinned</div>
      )}
      <div className="sp-row">
        <span className="sp-badge sp-badge-muted"><Icon name="bookmark" size={11} /> Problem List</span>
      </div>
      <h3 className="sp-title sp-title-list">{list.name}</h3>
      <p className="sp-desc">{list.description || "—"}</p>
      <div className="sp-foot">
        <span className="sp-meta">
          <Icon name="list" size={12} />
          <span className="cl-mono">{list.totalProblems}</span> {list.totalProblems === 1 ? "problem" : "problems"}
        </span>
        <button className="cl-btn cl-btn-ghost cl-btn-sm sp-cta" type="button" onClick={onOpen}>
          Browse <Icon name="arrowRight" size={12} />
        </button>
      </div>
    </div>
  );
}

export default function StudyPlans() {
  const navigate = useNavigate();
  const { data: items, isLoading, isError, error } = useGlobalLists();

  const openList = (item) => navigate(`/lists/${item.creator}/${encodeURIComponent(item.name)}`);

  const { plans, lists } = useMemo(() => {
    if (!Array.isArray(items)) return { plans: [], lists: [] };
    const byPin = (a, b) => Number(!!b.isPinned) - Number(!!a.isPinned);
    return {
      plans: items.filter(i => i.isStudyPlan).sort(byPin),
      lists: items.filter(i => !i.isStudyPlan).sort(byPin),
    };
  }, [items]);

  const hasAny = plans.length > 0 || lists.length > 0;

  return (
    <div className="cl-container" style={{ paddingBottom: 40 }}>
      {isLoading && (
        <div className="sp-state">Loading study plans…</div>
      )}

      {isError && (
        <div className="sp-state sp-state-error">
          <Icon name="warn" size={14} />
          {error?.response?.data?.message || "Failed to load study plans."}
        </div>
      )}

      {!isLoading && !isError && !hasAny && (
        <div className="sp-state">No study plans or problem lists are available yet.</div>
      )}

      {!isLoading && !isError && plans.length > 0 && (
        <section className="sp-section">
          <header className="sp-section-head">
            <span className="sp-section-title"><Icon name="grid" size={13} /> Study Plans</span>
            <span className="sp-section-count cl-mono">{plans.length}</span>
          </header>
          <div className="sp-grid">
            {plans.map(plan => <StudyPlanCard key={plan.id} plan={plan} onOpen={() => openList(plan)} />)}
          </div>
        </section>
      )}

      {!isLoading && !isError && plans.length > 0 && lists.length > 0 && (
        <div className="sp-divider" role="separator" aria-hidden="true" />
      )}

      {!isLoading && !isError && lists.length > 0 && (
        <section className="sp-section">
          <header className="sp-section-head">
            <span className="sp-section-title"><Icon name="bookmark" size={13} /> Problem Lists</span>
            <span className="sp-section-count cl-mono">{lists.length}</span>
          </header>
          <div className="sp-grid">
            {lists.map(list => <ProblemListCard key={list.id} list={list} onOpen={() => openList(list)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
