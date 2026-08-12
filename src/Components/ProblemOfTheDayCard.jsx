import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useProblemOfTheDayData } from "../services/queries";
import { formatFieldName } from "../lib/utils";
import "../styles/arena.css";

/* Built from local parts, not toISOString(): that formats the UTC day, which for
   anyone west of Greenwich is yesterday for the last hours of their evening —
   the same trap parseApiDay guards in ProblemsTab. */
const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function ProblemOfTheDayCard() {
  /* isLoading only. `isLoading || isFetching` blanked the whole card on every
     background refetch — the title vanished and came back on window focus. With
     no cached data react-query v3 reports `loading` anyway, so the first paint is
     unchanged; only the re-fetch flicker goes. */
  const { isLoading, data, isError, error, refetch } = useProblemOfTheDayData();

  /* The list routes on `id` and this endpoint is documented as `problemId`; the
     repo's own db.json mock returns `id`. Both name the same problem, so read
     either rather than silently dropping the link. */
  const id = data?.problemId ?? data?.id;
  const diff = String(data?.difficulty || "").toLowerCase();
  /* No `error.response` means axios never heard back — offline, DNS, timeout.
     Different instruction from a server that answered badly. */
  const offline = isError && !error?.response;
  const today = new Date();

  return (
    <div className="cl-card potd">
      {/* The date is the point of the card. "Problem of the day" with no day on
          it asks the reader to take the daily part on trust; a stamp on the
          opposite edge says it, and gives the card its one piece of chrome. */}
      <div className="potd-head">
        <h2 className="cl-card-title-sm">Problem of the day</h2>
        <time className="potd-date" dateTime={isoDay(today)}>
          {today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </time>
      </div>

      {isLoading ? (
        <p className="potd-loading">Loading today’s problem…</p>
      ) : isError ? (
        /* The card used to put "Couldn't load today's problem" in the title slot
           and stop there: no cause, no way out, and it read as if today had no
           problem rather than as if the fetch failed. Same shape as the streak
           card's error now — say which failure it was, and offer the retry.
           role="status" announces politely; nothing here is the reader's fault. */
        <div className="potd-error" role="status">
          <Icon name="warn" size={16} className="potd-error-icon" />
          <div className="potd-error-title">
            {offline ? "You’re offline" : "Couldn’t load today’s problem"}
          </div>
          <div className="potd-error-sub">
            {offline ? "It’ll be here when you’re back." : "Try again in a moment."}
          </div>
          <button className="cl-btn cl-btn-subtle cl-btn-sm" type="button" onClick={() => refetch()}>
            <Icon name="reset" size={12} /> Try again
          </button>
        </div>
      ) : (
        <>
          {/* The title is the card's subject, so it is the card's link — and the
              link stretches over the whole card (see .potd-link::after), which is
              what let the separate "Try now" button go. One target, named by the
              problem it opens, instead of a heading a reader can't click sitting
              above a button that doesn't say what it opens. */}
          <h3 className="potd-name">
            {id != null
              ? <Link to={`${id}`} className="potd-link">{data?.title || "Today’s problem"}</Link>
              : data?.title || "Today’s problem"}
          </h3>

          {(data?.difficulty || data?.topics?.length > 0) && (
            <div className="potd-meta">
              {data.difficulty && (
                <span className={`cl-chip cl-chip-${diff} cl-chip-dot`}>{formatFieldName(data.difficulty)}</span>
              )}
              {data.topics?.slice(0, 2).map((t) => (
                <span key={t} className="cl-chip">{t}</span>
              ))}
            </div>
          )}

          {/* Visible affordance for an invisible hit area — a whole-card link with
              nothing that looks pressable is a guessing game, which is the one
              thing this product can't afford. aria-hidden because the link is
              already named by the title; announcing "Solve it" again would leave
              a screen-reader user with two labels for one target. */}
          {id != null && (
            <span className="potd-go" aria-hidden="true">
              Solve it <Icon name="arrowRight" size={12} />
            </span>
          )}
        </>
      )}
    </div>
  );
}
