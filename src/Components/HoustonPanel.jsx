import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import Icon from "./Icon";
import Spinner from "./Spinner";
import useMediaQuery from "../hooks/useMediaQuery";
import { SUBMISSION_STATUS, TIER_VARIANT, timeAgo, formatSubmittedAt } from "../lib/utils";
import { generateHint, getLastHint, getHintHistory } from "../services/api";

/* The three things you can ask Houston for. One list drives both the collapsed
   bar's rotating line and the buttons inside the panel, so the two can't drift.
   `title` is what the learner says to mission control; `sub` is the plain
   meaning, because "Say that again" on its own isn't a label a beginner can act
   on — the wink is allowed to cost nothing. */
const OPS = [
  { key: "new",     title: "I have a problem", sub: "New hint",  run: generateHint },
  { key: "last",    title: "Say that again",   sub: "Last hint", run: getLastHint },
  { key: "history", title: "Show me the log",  sub: "All hints", run: getHintHistory },
];

const ROTATE_MS = 4000;

/* A hint is { status, level, maxLevel, isFinal, content, createdAt }, where
   `content` is AI-written markdown. react-markdown ignores raw HTML unless you
   opt into rehype-raw, which is why none of this needs a sanitiser. */

const chipClass = (status) => {
  const variant = TIER_VARIANT[SUBMISSION_STATUS[status]?.tier];
  return `cl-chip cl-chip-mono${variant ? ` cl-chip-${variant}` : ""}`;
};

const verdictLabel = (status) => SUBMISSION_STATUS[status]?.label || status;

const Stamp = ({ at }) => (
  <time className="pd-houston-when" dateTime={at} title={formatSubmittedAt(at)}>{timeAgo(at)}</time>
);

/* generate/ and latest/ both return a single hint. */
const SingleHint = ({ hint }) => (
  <>
    <div className="pd-houston-meta">
      <span className={chipClass(hint.status)}>{hint.status}</span>
      <span>{verdictLabel(hint.status)}</span>
      {hint.maxLevel > 1 && <span>· Level {hint.level} of {hint.maxLevel}</span>}
      <Stamp at={hint.createdAt} />
    </div>
    <div className="pd-md"><Markdown>{hint.content}</Markdown></div>
    {/* isFinal is the payload telling you whether asking again buys anything. */}
    {!hint.isFinal && (
      <p className="pd-houston-more">There&rsquo;s a deeper hint after this one — ask again when you need it.</p>
    )}
  </>
);

/* history/ returns the hints grouped by the verdict that prompted them:
   { WA: [...], TLE: [...], RE: [...] }. */
const HintLog = ({ data }) => {
  const groups = Object.entries(data || {}).filter(([, list]) => Array.isArray(list) && list.length > 0);
  if (groups.length === 0) return <div className="pd-houston-idle">No hints yet for this problem.</div>;

  return (
    <>
      {groups.map(([status, list]) => (
        <section key={status} className="pd-houston-group">
          <div className="pd-houston-group-head">
            <span className={chipClass(status)}>{status}</span>
            <span>{verdictLabel(status)}</span>
            <span className="pd-houston-count">{list.length}</span>
          </div>
          {/* Collapsed by default — a single level-3 hint runs longer than the
              whole panel, so unrolling five at once buries the one you wanted. */}
          {list.map((hint, i) => (
            <details key={hint.createdAt ?? i} className="pd-houston-entry">
              <summary>
                <Icon name="chevron" size={11} className="pd-houston-entry-chevron" />
                <span>Level {hint.level} of {hint.maxLevel}</span>
                <Stamp at={hint.createdAt} />
              </summary>
              <div className="pd-md"><Markdown>{hint.content}</Markdown></div>
            </details>
          ))}
        </section>
      ))}
    </>
  );
};

export default function HoustonPanel() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(0);
  const [state, setState] = useState(null); // null | { op, status: 'loading'|'done'|'error', data?, message? }
  const abortRef = useRef(false);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => () => { abortRef.current = true; }, []);

  // Rotate only while the bar is collapsed: once the panel is open all three
  // operations are on screen as buttons, so a line cycling above them is noise.
  // It also stops under reduced-motion — a line that cycles indefinitely is
  // exactly what WCAG 2.2.2 asks you to be able to stop, and a bar this small
  // has nowhere to put a pause control.
  useEffect(() => {
    if (open || reduceMotion) return;
    const t = setInterval(() => setLine((i) => (i + 1) % OPS.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [open, reduceMotion]);

  const busy = state?.status === "loading";

  const run = async (op) => {
    if (busy) return;
    setState({ op, status: "loading" });
    try {
      const data = await op.run(Number(id));
      if (!abortRef.current) setState({ op, status: "done", data });
    } catch (err) {
      // Every non-2xx from these endpoints carries a `message` and nothing else;
      // the fallback only covers the request never landing at all.
      if (!abortRef.current) {
        setState({
          op,
          status: "error",
          message: err?.response?.data?.message || "Houston didn't answer. Check your connection and try again.",
        });
      }
    }
  };

  return (
    <details className="pd-editor-panel" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <Icon name="rocket" size={18} className="pd-houston-mark" />
        <span className="pd-houston-name">Houston</span>
        {/* Remounting on `line` is the whole fade mechanism — one keyframe carries
            both halves of the swap, so there's no exit state to hold and no second
            timer to keep in step. The colon lives with the line so "Houston" isn't
            left trailing a colon into empty space mid-fade. */}
        {!open && <span key={line} className="pd-houston-line">: {OPS[line].title}</span>}
        <Icon name="chevron" size={13} className="pd-houston-toggle" />
      </summary>

      <div className="pd-editor-panel-body">
        <div className="pd-houston-ops">
          {OPS.map((op) => (
            <button
              key={op.key}
              type="button"
              className={`pd-houston-op${busy && state.op.key === op.key ? " is-busy" : ""}`}
              onClick={() => run(op)}
              disabled={busy}
            >
              <span className="pd-houston-op-title">{op.title}</span>
              <span className="pd-houston-op-sub">{op.sub}</span>
            </button>
          ))}
        </div>

        <div className="pd-houston-out" aria-live="polite">
          {!state ? (
            <div className="pd-houston-idle">Stuck? Pick one above and Houston will come back to you.</div>
          ) : state.status === "loading" ? (
            <div className="pd-houston-idle">
              <Spinner size={13} label="Houston is working" /> Houston is on it…
            </div>
          ) : state.status === "error" ? (
            <div className="pd-houston-err">{state.message}</div>
          ) : state.op.key === "history" ? (
            <HintLog data={state.data} />
          ) : state.data?.content ? (
            <SingleHint hint={state.data} />
          ) : (
            <div className="pd-houston-idle">No hint saved yet — ask for a new one.</div>
          )}
        </div>
      </div>
    </details>
  );
}
