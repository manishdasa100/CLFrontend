import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import AppNavbar from "../Components/AppNavbar";
import Icon from "../Components/Icon";

// Serves double duty: the catch-all 404 route, and the router's errorElement for
// anything thrown while rendering or loading. Without the latter, a single bad
// value (a malformed payload, an unexpected null) white-screened the whole app.
export default function ErrorPage() {
  const error = useRouteError();
  const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  const title = notFound ? "Page not found" : "Something went wrong";
  const body = notFound
    ? "That link doesn't lead anywhere. It may have moved, or the address may have a typo."
    : "This page hit an unexpected error. Nothing you did caused it, and your work is still saved.";

  // Surfaced only in dev — in production this is noise the learner can't act on.
  const detail = import.meta.env.DEV && error
    ? (isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error.message || String(error))
    : null;

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <main className="cl-container-narrow" style={{ padding: "96px 28px 120px", textAlign: "center" }}>
        <div
          aria-hidden="true"
          style={{
            width: 52, height: 52, margin: "0 auto 24px", borderRadius: "50%",
            display: "grid", placeItems: "center",
            background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.22)",
            color: "var(--cyan)",
          }}
        >
          <Icon name={notFound ? "search" : "warn"} size={22} />
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          {title}
        </h1>
        <p className="cl-lede" style={{ margin: "0 auto 32px", fontSize: 15 }}>{body}</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/arena/problemset" className="cl-btn cl-btn-primary cl-btn-lg">
            Back to problems <Icon name="arrowRight" size={14} />
          </Link>
          {!notFound && (
            <button type="button" className="cl-btn cl-btn-ghost cl-btn-lg" onClick={() => window.location.reload()}>
              <Icon name="reset" size={14} /> Try again
            </button>
          )}
        </div>

        {detail && (
          <pre
            className="cl-mono"
            style={{
              marginTop: 40, padding: "12px 16px", textAlign: "left",
              background: "var(--bg-1)", border: "1px solid var(--stroke-1)", borderRadius: 8,
              fontSize: 12, color: "var(--text-dim)", overflowX: "auto", whiteSpace: "pre-wrap",
            }}
          >
            {detail}
          </pre>
        )}
      </main>
    </BackgroundWrapper>
  );
}
