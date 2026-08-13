import { Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import "../styles/landing.css";
import { useState } from "react";

/* Split Studio: every major block divides the screen — the claim on one side,
   the real thing on the other — and the pairing flips direction down the page.
   Two bands deliberately break out of the split (languages, close) so the
   alternation reads as rhythm rather than as a template.

   <main> is here for the landmark, and because .cl-page's sticky-footer rule
   hangs its 80px gap on :nth-last-child(2): one wrapper means one gap, rather
   than the last section quietly owning it. */
export default function LandingPage() {
  const [user] = useState({ isLoggedIn: false });

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <main className="lp-body">
        <Hero user={user} />
        <Editor />
        <Languages />
        <Map />
        <Close user={user} />
      </main>
      <Footer />
    </BackgroundWrapper>
  );
}

/* Titles, ids and difficulties only. The old table also carried acceptance rates
   — 52%, 41%, 64% — which were hardcoded fixtures, not anything the app knows.
   A made-up percentage sitting in the fold as a reason to sign up is the kind of
   number a reader checks you on. The problems themselves are real and the routes
   resolve, so that is what the column claims. */
const startHere = [
  { id: 1, title: "Two Sum", difficulty: "easy" },
  { id: 20, title: "Valid Parentheses", difficulty: "easy" },
  { id: 21, title: "Merge Two Sorted Lists", difficulty: "easy" },
  { id: 53, title: "Maximum Subarray", difficulty: "medium" },
];

/* Hero — text left, proof right. The proof half is the actual problem list,
   linking to the actual routes, rather than a drawing of one: a beginner
   deciding whether this place is for them is best served by seeing that the
   first problem is called Two Sum, is marked Easy, and that half the people who
   try it get it. That is the whole wall-lowering argument, and it belongs above
   the fold instead of in a table two screens down. */
const Hero = ({ user }) => (
  <section className="lp-hero">
    <div className="cl-container lp-split">
      <div>
        {/* The one deliberate kicker on the site: this is the setup and the h1
            is the punchline — "make lemonade" doesn't land without it. */}
        <div className="cl-hero-kicker">// when life gives you lemons</div>
        <h1 className="cl-h1">
          make lemonade<br />
          and <span style={{ color: "var(--cyan)" }}>code</span>
        </h1>
        <p className="cl-lede" style={{ marginTop: 28 }}>
          A calmer way to learn data structures and algorithms. Hand-picked problems in
          seven languages, a clear order to follow, and progress you can actually see —
          in an editor that stays out of your way.
        </p>
        <div className="lp-hero-actions">
          <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
            {user.isLoggedIn ? "Continue learning" : "Start free"} <Icon name="arrowRight" size={14} />
          </Link>
          <Link to="/arena/problemset" className="cl-btn cl-btn-ghost cl-btn-lg">Browse problems</Link>
          <span className="lp-hero-note">
            <Icon name="check" size={14} style={{ color: "var(--easy)" }} /> No credit card
          </span>
        </div>
      </div>

      <div className="cl-card lp-plist">
        <div className="lp-plist-head">
          <h2 className="cl-card-title">Start here.</h2>
          <p className="cl-card-sub">New to this? These four are a friendly place to begin.</p>
        </div>
        {startHere.map((p) => (
          <Link key={p.id} to={`/arena/problemset/${p.id}`} className="lp-prow">
            <span className="lp-prow-id">{String(p.id).padStart(4, "0")}</span>
            <span className="lp-prow-title">{p.title}</span>
            <span className={`cl-chip cl-chip-${p.difficulty} cl-chip-dot`}>
              {p.difficulty[0].toUpperCase() + p.difficulty.slice(1)}
            </span>
          </Link>
        ))}
        <div className="lp-plist-foot">
          <Link to="/arena/problemset" className="cl-btn cl-btn-subtle cl-btn-sm">
            See all problems <Icon name="arrowRight" size={12} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* Editor — flipped: proof left, text right. The specimen is framed
   typographically (label rule above, result rule below) rather than wrapped in a
   drawn window with traffic-light dots. The reader already owns a real editor;
   re-drawing one in the page is a picture of a picture frame, and the invented
   filename bar was the loudest generated-UI tell on the old page.
   aria-hidden because the code and the timings in it are an illustration — no
   one should be read a fabricated "12ms" as if it were a claim. */
const Editor = () => (
  <section className="lp-editor">
    <div className="cl-container lp-split lp-split-flip">
      <div>
        <h2 className="cl-h2">An editor you&rsquo;d actually pick.</h2>
        <p className="cl-lede" style={{ fontSize: 15, marginTop: 16 }}>
          Monaco-powered, with clear error messages, one-click test runs, and a focus mode
          that keeps things calm. We sweat the small stuff — smooth keyboard flow, honest
          feedback — so you can focus on understanding rather than fighting the tools.
        </p>
      </div>

      <figure className="lp-code" aria-hidden="true" style={{ margin: 0 }}>
        <figcaption className="lp-code-head">
          <span>two-sum.py</span>
          <span style={{ marginLeft: "auto" }} className="cl-chip cl-chip-easy cl-chip-dot">Easy</span>
        </figcaption>
        <pre>
          <span className="lp-code-line"><span className="lp-code-n">1</span><span className="lp-code-kw">def</span> <span className="lp-code-fn">twoSum</span>(nums, target):</span>
          <span className="lp-code-line"><span className="lp-code-n">2</span>    seen = {"{}"}</span>
          <span className="lp-code-line"><span className="lp-code-n">3</span>    <span className="lp-code-kw">for</span> i, x <span className="lp-code-kw">in</span> <span className="lp-code-call">enumerate</span>(nums):</span>
          <span className="lp-code-line"><span className="lp-code-n">4</span>        <span className="lp-code-kw">if</span> (target - x) <span className="lp-code-kw">in</span> seen:</span>
          <span className="lp-code-line"><span className="lp-code-n">5</span>            <span className="lp-code-kw">return</span> [seen[target - x], i]</span>
          <span className="lp-code-line"><span className="lp-code-n">6</span>        seen[x] = i</span>
        </pre>
        <div className="lp-code-foot">
          <span style={{ color: "var(--easy)" }}>58/58 tests passed</span>
          <span>12ms</span>
          <span style={{ marginLeft: "auto" }}>O(n) · single pass</span>
        </div>
      </figure>
    </div>
  </section>
);

/* Languages — the diptych compressed to one line between two hairlines. It used
   to be a centred row of seven chips, which made a supporting fact look like a
   feature announcement. */
const Languages = () => (
  <section className="lp-langs">
    <div className="cl-container lp-langs-inner">
      <p style={{ margin: 0, fontSize: 14, color: "var(--text-dim)" }}>
        Write in whichever language you&rsquo;re learning.
      </p>
      <ul className="lp-langs-list">
        {["Python", "JavaScript", "Java", "C++", "C", "Go", "Rust"].map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  </section>
);

const tracks = [
  { label: "Arrays 101", pct: 100, state: "done" },
  { label: "Two Pointers", pct: 100, state: "done" },
  { label: "Binary Search", pct: 66, state: "active" },
  { label: "Recursion", pct: 20, state: "active" },
  { label: "Dynamic Programming", pct: 0, state: "locked" },
];

/* Map — text left, proof right. This is where the old page's separate "progress"
   and "paths" cards merge: what to do next and how far you've come are one
   picture, and splitting them into two feature tiles was the grid asking for
   three things to put in it.
   The old donut carried an invented "248 solved" — a fabricated headline number
   in a proof slot, which is the thing an audience reads fastest. A track list
   with a caption saying it's an example makes the same argument honestly. */
const Map = () => (
  <section className="lp-map">
    <div className="cl-container lp-split">
      <div>
        <h2 className="cl-h2">Never wonder what to solve next.</h2>
        <p className="cl-lede" style={{ fontSize: 15, marginTop: 16 }}>
          Guided routes through arrays, recursion, graphs and dynamic programming — a
          sensible order, one small step at a time. Topic heatmaps and your full history
          fill in behind you, so you can see what&rsquo;s clicking and what to practice next.
        </p>
      </div>

      <div>
        <div className="lp-track" aria-hidden="true">
          {tracks.map((t) => (
            <div key={t.label} className={`lp-track-row ${t.state === "active" ? "is-active" : ""}`}>
              <span
                className="lp-track-mark"
                style={{
                  background: t.state === "done" ? "var(--cyan)" : t.state === "locked" ? "var(--bg-3)" : "transparent",
                  border: t.state === "done" ? "none" : `1.5px solid ${t.state === "active" ? "var(--cyan)" : "var(--stroke-2)"}`,
                }}
              >
                {t.state === "done" && <Icon name="check" size={10} />}
                {t.state === "locked" && <Icon name="lock" size={9} style={{ color: "var(--text-mute)" }} />}
              </span>
              <span className="lp-track-label" style={{ color: t.state === "locked" ? "var(--text-mute)" : "var(--text)" }}>
                {t.label}
              </span>
              <div className="cl-bar" style={{ width: 64 }}>
                <div className="cl-bar-fill" style={{ width: `${t.pct}%` }} />
              </div>
              <span className="lp-track-pct">{t.pct}%</span>
            </div>
          ))}
        </div>
        <p className="lp-caption">An example — your own map, once you get going.</p>
      </div>
    </div>
  </section>
);

/* Close — the page stops splitting at the moment it asks you to act. Left-biased
   rather than centred, with the lemon as a mark at the edge instead of a 140px
   centrepiece: the identity is a wink, not a mascot taking a bow. */
const Close = ({ user }) => (
  <section className="lp-close">
    <div className="cl-container lp-close-inner">
      <div className="lp-close-copy">
        <h2 className="cl-h2">
          Ready to squeeze<br />some <span style={{ color: "var(--cyan)" }}>better code</span>?
        </h2>
        <p className="cl-lede" style={{ marginTop: 20 }}>
          A lightweight daily habit. 15 minutes · 1 problem · compounding returns.
        </p>
        <div className="lp-close-actions">
          <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
            {user.isLoggedIn ? "Continue learning" : "Start free"} <Icon name="arrowRight" size={14} />
          </Link>
          <a
            href="https://github.com/manishdasa100/CLFrontend"
            target="_blank"
            rel="noreferrer noopener"
            className="cl-btn cl-btn-ghost cl-btn-lg"
          >
            <Icon name="code" size={14} /> View source
          </a>
        </div>
      </div>
      <div className="lp-close-mark" aria-hidden="true">
        <div className="cl-lemon-hero"><div className="cl-lemon-leaf" /></div>
      </div>
    </div>
  </section>
);
