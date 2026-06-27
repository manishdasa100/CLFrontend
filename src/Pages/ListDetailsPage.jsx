import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import {
  useListDetails,
  useStudyPlanProgress,
  useActivateStudyPlanMutation,
  useResetStudyPlanMutation,
  useDeactivateStudyPlanMutation,
} from "../services/queries";
import "../styles/listdetails.css";

const TIER_META = {
  BEGINNER:     { label: "Beginner",     chip: "cl-chip-easy"   },
  INTERMEDIATE: { label: "Intermediate", chip: "cl-chip-medium" },
  ADVANCED:     { label: "Advanced",     chip: "cl-chip-hard"   },
  MIXED:        { label: "Mixed",        chip: "cl-chip-cyan"   },
};

const DIFF_SEGMENTS = [
  { key: "EASY",   label: "Easy",   color: "var(--easy)"   },
  { key: "MEDIUM", label: "Medium", color: "var(--medium)" },
  { key: "HARD",   label: "Hard",   color: "var(--hard)"   },
];

// completion ring geometry (progress card)
const RING_R = 46;
const RING_CIRC = 2 * Math.PI * RING_R;

function formatDifficulty(d) {
  if (!d) return "";
  return d.charAt(0) + d.slice(1).toLowerCase();
}

// Parse an ISO "YYYY-MM-DD" as a local calendar date (avoids UTC offset drift).
function parseLocalDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatActivationDate(iso) {
  if (!iso) return "";
  return parseLocalDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Days elapsed since activation, counted in whole local days.
function daysSince(iso) {
  const start = parseLocalDate(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today - start) / 86400000);
}

export default function ListDetailsPage() {
  const { username, listName } = useParams();
  const decodedName = listName ? decodeURIComponent(listName) : "";
  const navigate = useNavigate();
  const { data: list, isLoading, isError, error } = useListDetails(username, decodedName);

  const isPlan = !!list?.isStudyPlan;
  const tier = isPlan ? (TIER_META[list.difficultyTier] || TIER_META.MIXED) : null;
  const problems = useMemo(() => list?.problemsData || [], [list]);

  // Only study plans check for an activation record for the signed-in user.
  const {
    data: progress,
    isLoading: progressLoading,
    refetch: refetchProgress,
  } = useStudyPlanProgress(list?.id, isPlan);

  const activate = useActivateStudyPlanMutation();
  const reset = useResetStudyPlanMutation();
  const deactivate = useDeactivateStudyPlanMutation();

  const [confirming, setConfirming] = useState(null); // null | "reset" | "deactivate"
  const [pending, setPending] = useState(null);       // null | "activate" | "reset" | "deactivate"

  const activated = !!progress;
  const solvedSet = useMemo(() => new Set(progress?.solvedProblemIds || []), [progress]);

  const diff = useMemo(() => {
    const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
    for (const p of problems) {
      const k = String(p.difficulty || "").toUpperCase();
      if (k in counts) counts[k] += 1;
    }
    const total = counts.EASY + counts.MEDIUM + counts.HARD;
    return { counts, total };
  }, [problems]);

  const totalCount = problems.length || list?.totalProblems || 0;
  const solvedCount = solvedSet.size;
  const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
  const complete = totalCount > 0 && solvedCount >= totalCount;

  const timeLeft = useMemo(() => {
    if (!activated) return null;
    if (complete) return { text: "Plan complete", tone: "done" };
    const left = (list.timelineDays ?? 0) - daysSince(progress.dateOfActivation);
    if (left > 1)   return { text: `${left} days left`, tone: "" };
    if (left === 1) return { text: "1 day left", tone: "warn" };
    if (left === 0) return { text: "Due today", tone: "warn" };
    const over = Math.abs(left);
    return { text: `${over} ${over === 1 ? "day" : "days"} overdue`, tone: "over" };
  }, [activated, complete, list, progress]);

  const run = (mutation, action) => {
    if (!list?.id) return;
    setPending(action);
    mutation.mutate(list.id, {
      onSuccess: () => refetchProgress().finally(() => { setPending(null); setConfirming(null); }),
      onError: () => setPending(null),
    });
  };

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
          <div className={`ld-layout ${isPlan && activated ? "ld-layout-3" : ""}`}>
            {/* ── Identity rail ── */}
            <aside className="ld-rail">
              <div className={`ld-panel ${isPlan ? "ld-panel-plan" : ""}`}>
                {isPlan && <div className="ld-panel-accent" />}

                <div className="ld-kindline">
                  <div className="ld-kindline-l">
                    <span className={`ld-kind ${isPlan ? "ld-kind-plan" : "ld-kind-list"}`}>
                      <Icon name={isPlan ? "grid" : "bookmark"} size={11} />
                      {isPlan ? "Study Plan" : "Problem List"}
                    </span>
                    {isPlan && <span className={`cl-chip ${tier.chip}`}>{tier.label}</span>}
                  </div>
                  <div className="ld-kindline-r">
                    <span className={"ld-flag " + (list.isPublic ? "ld-flag-public" : "")}>
                      <Icon name={list.isPublic ? "globe" : "lock"} size={11} />
                      {list.isPublic ? "Public" : "Private"}
                    </span>
                    {list.isPinned && (
                      <span className="ld-flag ld-flag-pin"><Icon name="pin2" size={11} /> Pinned</span>
                    )}
                  </div>
                </div>

                <h1 className="ld-name">{list.name}</h1>
                {list.description && <p className="ld-desc">{list.description}</p>}

                <div className="ld-stats">
                  <div className="ld-stat">
                    <span className="ld-stat-num cl-mono">{list.totalProblems}</span>
                    <span className="ld-stat-label">{list.totalProblems === 1 ? "Problem" : "Problems"}</span>
                  </div>
                  {isPlan && (
                    <div className="ld-stat">
                      <span className="ld-stat-num cl-mono">
                        {list.timelineDays}<span className="ld-stat-unit">d</span>
                      </span>
                      <span className="ld-stat-label">Timeline</span>
                    </div>
                  )}
                </div>

                {diff.total > 0 && (
                  <div className="ld-mix">
                    <span className="ld-mix-label">Problem mix</span>
                    <div className="ld-meter" role="img"
                      aria-label={DIFF_SEGMENTS.map(s => `${s.label} ${diff.counts[s.key]}`).join(", ")}>
                      {DIFF_SEGMENTS.filter(s => diff.counts[s.key] > 0).map(s => (
                        <span key={s.key} className="ld-meter-seg"
                          style={{ width: `${(diff.counts[s.key] / diff.total) * 100}%`, background: s.color }} />
                      ))}
                    </div>
                    <div className="ld-legend">
                      {DIFF_SEGMENTS.filter(s => diff.counts[s.key] > 0).map(s => (
                        <span key={s.key} className="ld-legend-item">
                          <span className="ld-legend-dot" style={{ background: s.color }} />
                          {s.label} <span className="cl-mono ld-legend-num">{diff.counts[s.key]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* The plan's entry CTA. Once activated, management moves to the progress card. */}
                {isPlan && !activated && (
                  <div className="ld-actions">
                    {progressLoading ? (
                      <div className="ld-checking"><span className="ld-spin" /> Checking your progress…</div>
                    ) : (
                      <button className="ld-activate" onClick={() => run(activate, "activate")} disabled={!!pending}>
                        {pending === "activate"
                          ? <><span className="ld-spin" /> Activating…</>
                          : <><Icon name="play" size={14} /> Activate plan</>}
                      </button>
                    )}
                    {activate.isError && !pending && (
                      <p className="ld-activate-err">
                        <Icon name="warn" size={12} />
                        {activate.error?.response?.data?.message || "Couldn't activate. Try again."}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* ── Problem track ── */}
            <main className="ld-main">
              <div className="ld-track-card">
                <header className="ld-track-head">
                  <span className="ld-main-title">
                    <Icon name={isPlan ? "target" : "list"} size={14} />
                    {isPlan ? "The track" : "Problems"}
                  </span>
                  <span className="ld-main-count cl-mono">
                    {activated ? `${solvedCount}/${problems.length}` : problems.length}
                  </span>
                </header>

                {problems.length === 0 ? (
                  <div className="ld-empty">
                    <Icon name="list" size={20} />
                    <p>No problems in this list yet.</p>
                  </div>
                ) : (
                  <ol className={`ld-track ${isPlan ? "is-plan" : ""}`}>
                    {problems.map((p, i) => {
                      const d = String(p.difficulty || "").toLowerCase();
                      const solved = solvedSet.has(p.id);
                      return (
                        <li key={p.id} className={solved ? "is-solved" : ""}>
                          <Link to={`/arena/problemset/${p.id}`} className="ld-item">
                            <span className={`ld-node ${isPlan ? "ld-node-plan" : ""} ${solved ? "ld-node-done" : ""}`}>
                              {solved ? <Icon name="check" size={15} /> : i + 1}
                            </span>
                            <span className="ld-item-body">
                              <span className="ld-item-title">{p.title}</span>
                              {p.topics?.length > 0 && (
                                <span className="ld-topics">
                                  {p.topics.map(t => (
                                    <span key={t} className="cl-chip ld-topic">{t}</span>
                                  ))}
                                </span>
                              )}
                            </span>
                            <span className={`cl-chip cl-chip-${d} ld-item-diff`}>{formatDifficulty(p.difficulty)}</span>
                            <Icon name="chevronRight" size={15} className="ld-item-go" />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </main>

            {/* ── Progress card (study plans, once activated) ── */}
            {isPlan && activated && (
              <aside className="ld-progress-col">
                <div className="ld-pcard">
                  <span className="ld-mix-label">Your progress</span>

                  <div className="ld-pring">
                    <svg width="108" height="108" viewBox="0 0 108 108" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="54" cy="54" r={RING_R} fill="none" stroke="var(--bg-3)" strokeWidth="6" />
                      <circle cx="54" cy="54" r={RING_R} fill="none" stroke={complete ? "var(--easy)" : "var(--cyan)"}
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${(Math.min(Math.max(pct, 0), 100) / 100) * RING_CIRC} ${RING_CIRC}`} />
                    </svg>
                    <span className="ld-pring-num">{pct}<span className="ld-pring-pct">%</span></span>
                  </div>
                  <p className="ld-pcard-solved">
                    <span className="cl-mono">{solvedCount}</span> of <span className="cl-mono">{totalCount}</span> solved
                  </p>

                  <dl className="ld-pcard-stats">
                    <div className="ld-pcard-row">
                      <dt>Time left</dt>
                      <dd className={`ld-tone-${timeLeft.tone || "none"}`}>{timeLeft.text}</dd>
                    </div>
                    <div className="ld-pcard-row">
                      <dt>Activated</dt>
                      <dd>{formatActivationDate(progress.dateOfActivation)}</dd>
                    </div>
                  </dl>

                  <div className="ld-pcard-foot">
                    {confirming ? (
                      <div className="ld-confirm">
                        <p className="ld-confirm-q">
                          {confirming === "reset"
                            ? "Reset progress? This clears the problems you've solved on this plan."
                            : "Deactivate plan? Your progress will be removed."}
                        </p>
                        <div className="ld-confirm-row">
                          <button className="cl-btn cl-btn-subtle" onClick={() => setConfirming(null)} disabled={!!pending}>
                            Keep it
                          </button>
                          {confirming === "reset" ? (
                            <button className="cl-btn ld-btn-warn" onClick={() => run(reset, "reset")} disabled={!!pending}>
                              {pending === "reset" ? <><span className="ld-spin" /> Resetting…</> : "Reset progress"}
                            </button>
                          ) : (
                            <button className="cl-btn ld-btn-danger" onClick={() => run(deactivate, "deactivate")} disabled={!!pending}>
                              {pending === "deactivate" ? <><span className="ld-spin" /> Removing…</> : "Deactivate"}
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="ld-action-row">
                        <button className="cl-btn cl-btn-subtle ld-action-btn" onClick={() => setConfirming("reset")}>
                          <Icon name="reset" size={14} /> Reset
                        </button>
                        <button className="cl-btn ld-btn-danger ld-action-btn" onClick={() => setConfirming("deactivate")}>
                          <Icon name="x" size={14} /> Deactivate
                        </button>
                      </div>
                    )}

                    {(reset.isError || deactivate.isError) && !pending && (
                      <p className="ld-activate-err">
                        <Icon name="warn" size={12} />
                        {(reset.error || deactivate.error)?.response?.data?.message || "Something went wrong. Try again."}
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
      <Footer />
    </BackgroundWrapper>
  );
}
