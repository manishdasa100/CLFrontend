import { Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import { useState } from "react";

export default function LandingPage() {
  const [user] = useState({ isLoggedIn: false });

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <Hero user={user} />
      <Features />
      <LangsStrip />
      <ProblemShowcase />
      <CTA user={user} />
      <Footer />
    </BackgroundWrapper>
  );
}

const Hero = ({ user }) => (
  <section style={{ padding: "80px 0 60px" }}>
    <div className="cl-container cl-hero-grid">
      <div>
        {/* The one deliberate kicker on the site, and not interchangeable with the
            five section eyebrows that came out around it: this is the setup and
            the h1 is the punchline — "make lemonade" doesn't land without it.
            It gets its own class rather than .cl-eyebrow so nothing can
            accidentally reuse it as section furniture. */}
        <div className="cl-hero-kicker">// when life gives you lemons</div>
        <h1 className="cl-h1">
          make lemonade<br />
          and <span style={{ color: "var(--cyan)", fontStyle: "italic" }}>code</span>
        </h1>
        <p className="cl-lede" style={{ marginTop: 28 }}>
          A calmer way to learn data structures and algorithms. Hand-picked problems across
          7 languages, a clear path to follow, and progress you can actually see — in an
          editor that stays out of your way.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36, alignItems: "center", flexWrap: "wrap" }}>
          <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
            {user.isLoggedIn ? "Continue learning" : "Start free"} <Icon name="arrowRight" size={14} />
          </Link>
          <Link to="/arena/problemset" className="cl-btn cl-btn-ghost cl-btn-lg">Browse problems</Link>
          <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-mute)" }}>
            <Icon name="check" size={14} style={{ color: "var(--easy)" }} /> No credit card
          </div>
        </div>
      </div>
      {/* The cyan bloom that used to sit behind this card was the third glow in
          the fold, on top of the page backdrop and the card's own shadow. The
          card reads fine on its own. */}
      <EditorCard />
    </div>
  </section>
);

const CodeLine = ({ n, children, caret }) => (
  <div style={{ display: "flex", gap: 14, color: "var(--text)" }}>
    <span style={{ color: "var(--text-faint)", width: 14, textAlign: "right" }}>{n}</span>
    <span>{children}{caret && <span className="cl-blink" style={{ display: "inline-block", width: 7, height: 14, background: "var(--cyan)", verticalAlign: "middle", marginLeft: 4 }} />}</span>
  </div>
);

const EditorCard = () => (
  <div aria-hidden="true" style={{ position: "relative", background: "var(--bg-1)", border: "1px solid var(--stroke-2)", borderRadius: 14, boxShadow: "var(--shadow-panel)", overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--bg-2)", borderBottom: "1px solid var(--stroke)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FB7185" }} />
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FCD34D" }} />
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#6EE7B7" }} />
      <span className="cl-mono" style={{ marginLeft: 10, fontSize: 11, color: "var(--text-mute)" }}>two-sum.py</span>
      <span style={{ marginLeft: "auto" }} className="cl-chip cl-chip-easy">Easy</span>
    </div>
    <div style={{ padding: "18px 20px", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7 }}>
      <CodeLine n={1}><span style={{ color: "#c792ea" }}>def</span> <span style={{ color: "#22D3EE" }}>twoSum</span>(nums, target):</CodeLine>
      <CodeLine n={2}>    seen = {'{}'}</CodeLine>
      <CodeLine n={3}>    <span style={{ color: "#c792ea" }}>for</span> i, x <span style={{ color: "#c792ea" }}>in</span> <span style={{ color: "#82aaff" }}>enumerate</span>(nums):</CodeLine>
      <CodeLine n={4}>        <span style={{ color: "#c792ea" }}>if</span> (target - x) <span style={{ color: "#c792ea" }}>in</span> seen:</CodeLine>
      <CodeLine n={5}>            <span style={{ color: "#c792ea" }}>return</span> [seen[target - x], i]</CodeLine>
      <CodeLine n={6}>        seen[x] = i</CodeLine>
      <CodeLine n={7} caret>    <span style={{ color: "var(--text-mute)" }}># O(n) · single pass</span></CodeLine>
    </div>
    <div style={{ display: "flex", gap: 10, padding: "12px 16px", borderTop: "1px solid var(--stroke)", background: "var(--bg-0)", alignItems: "center", flexWrap: "wrap" }}>
      <span className="cl-btn cl-btn-subtle cl-btn-sm">Run</span>
      <span className="cl-btn cl-btn-primary cl-btn-sm">Submit <Icon name="play" size={10} /></span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 11, color: "var(--text-mute)", alignItems: "center", flexWrap: "wrap", minWidth: 0 }}>
        <span className="cl-mono">✓ 58/58 tests passed</span>
        <span className="cl-chip cl-chip-cyan"><Icon name="sparkle" size={11} /> 12ms · nice and fast</span>
      </div>
    </div>
  </div>
);

/* Was `01 · editor / 02 · progress / 03 · paths`. These three aren't a sequence —
   you don't do the editor before the progress — so the numbers were pure
   scaffolding, and each label just restated its own heading a size smaller. */
const Feature = ({ title, body, visual }) => (
  <div className="cl-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ padding: "28px 26px 22px" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>{title}</h3>
      <p className="cl-text-dim" style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 10 }}>{body}</p>
    </div>
    {/* Illustrations, not content: the sample code and the numbers in them are
        invented. aria-hidden keeps them out of the accessibility tree so no one
        is read a fabricated "248 solved" — same treatment as the hero mock. */}
    <div aria-hidden="true" style={{ marginTop: "auto", height: 220, borderTop: "1px solid var(--stroke)", background: "var(--bg-0)" }}>{visual}</div>
  </div>
);

const Features = () => (
  <section style={{ padding: "100px 0" }}>
    <div className="cl-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
        <h2 className="cl-h2">Everything here helps you learn.</h2>
        <p className="cl-lede" style={{ fontSize: 15, maxWidth: 420 }}>
          We sweat the small stuff — smooth keyboard flow, clear error messages, honest
          feedback — so you can focus on understanding, not fighting the tools.
        </p>
      </div>
      <div className="cl-features-grid">
        <Feature title="An editor you'd actually pick." body="Monaco-powered, with clear error messages, one-click test runs, and a focus mode that keeps things calm — so the tool never gets in your way." visual={<EditorVis />} />
        <Feature title="Watch yourself improve." body="Topic heatmaps, progress over time, and your full history — so you can see what's clicking and what to practice next." visual={<DonutVis />} />
        <Feature title="Never wonder what to solve next." body="Guided routes through arrays, recursion, graphs, dynamic programming and more — a sensible order, one small step at a time." visual={<PathVis />} />
      </div>
    </div>
  </section>
);

const EditorVis = () => (
  <div style={{ padding: 20, fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.9, color: "var(--text-dim)" }}>
    <div><span style={{ color: "var(--text-faint)" }}>1</span>  <span style={{ color: "#c792ea" }}>function</span> <span style={{ color: "#22D3EE" }}>merge</span>(l, r) {'{'}</div>
    <div><span style={{ color: "var(--text-faint)" }}>2</span>    <span style={{ color: "#c792ea" }}>const</span> out = [];</div>
    <div><span style={{ color: "var(--text-faint)" }}>3</span>    <span style={{ color: "#c792ea" }}>while</span> (l.length && r.length)</div>
    <div><span style={{ color: "var(--text-faint)" }}>4</span>      out.push(l[0] &lt; r[0] ? l.shift() : r.shift());</div>
    <div><span style={{ color: "var(--text-faint)" }}>5</span>    <span style={{ color: "#c792ea" }}>return</span> [...out, ...l, ...r];</div>
    <div><span style={{ color: "var(--text-faint)" }}>6</span>  {'}'}</div>
    <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
      <span className="cl-chip cl-chip-easy"><Icon name="check" size={11} /> 58/58 pass</span>
      <span className="cl-chip cl-chip-cyan">O(n+m)</span>
    </div>
  </div>
);

const DonutVis = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="14" />
      <circle cx="80" cy="80" r="60" fill="none" stroke="var(--cyan)" strokeWidth="14" strokeLinecap="round" strokeDasharray="240 377" transform="rotate(-90 80 80)" />
      <circle cx="80" cy="80" r="60" fill="none" stroke="var(--lemon)" strokeWidth="14" strokeLinecap="round" strokeDasharray="90 377" strokeDashoffset="-240" transform="rotate(-90 80 80)" />
      <text x="80" y="76" textAnchor="middle" fill="var(--text)" fontFamily="Comme" fontSize="28" fontWeight="600">248</text>
      <text x="80" y="94" textAnchor="middle" fill="var(--text-mute)" fontFamily="Geist" fontSize="10.5">solved</text>
    </svg>
  </div>
);

const PathVis = () => (
  <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
    {[
      { label: "Arrays 101", val: 100, done: true },
      { label: "Two Pointers", val: 100, done: true },
      { label: "Binary Search", val: 66, active: true },
      { label: "Dynamic Programming", val: 0, locked: true },
    ].map((p, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: p.active ? "rgba(34,211,238,.06)" : "transparent", border: p.active ? "1px solid rgba(34,211,238,.25)" : "1px solid transparent" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.done ? "var(--cyan)" : p.locked ? "var(--bg-3)" : "transparent", border: p.done ? "none" : "1.5px solid " + (p.active ? "var(--cyan)" : "var(--stroke-2)"), display: "grid", placeItems: "center", color: "#0A0B10" }}>
          {p.done && <Icon name="check" size={10} />}
          {p.locked && <Icon name="lock" size={9} style={{ color: "var(--text-mute)" }} />}
        </div>
        <span style={{ flex: 1, fontSize: 12.5, color: p.locked ? "var(--text-mute)" : "var(--text)" }}>{p.label}</span>
        <span className="cl-mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>{p.val}%</span>
      </div>
    ))}
  </div>
);

const LangsStrip = () => (
  <section style={{ padding: "60px 0", borderTop: "1px solid var(--stroke)" }}>
    <div className="cl-container" style={{ textAlign: "center" }}>
      {/* This strip has no heading of its own, so the line has to carry it —
          as a sentence, not a tracked kicker. */}
      <p style={{ margin: 0, fontSize: 14, color: "var(--text-dim)" }}>Write in whichever language you're learning.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        {["Python", "JavaScript", "Java", "C++", "C", "Go", "Rust"].map((l) => (
          <span key={l} className="cl-chip cl-chip-mono" style={{ padding: "8px 14px", fontSize: 12 }}>{l}</span>
        ))}
      </div>
    </div>
  </section>
);

const ProblemShowcase = () => (
  <section style={{ padding: "80px 0", borderTop: "1px solid var(--stroke)" }}>
    <div className="cl-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 className="cl-h2">Start with a problem.</h2>
          <p className="cl-text-dim" style={{ marginTop: 10, fontSize: 14 }}>New here? These are a friendly place to begin.</p>
        </div>
        <Link to="/arena/problemset" className="cl-btn cl-btn-ghost cl-btn-sm">See all problems <Icon name="arrowRight" size={12} /></Link>
      </div>
      <div className="cl-card" style={{ overflowX: "auto" }}>
        <table className="cl-tbl" style={{ minWidth: 520 }}>
          <thead><tr><th style={{ width: 60 }}>#</th><th>Title</th><th style={{ width: 180 }}>Acceptance</th><th style={{ width: 100 }}>Difficulty</th><th style={{ width: 100 }}>Topics</th></tr></thead>
          <tbody>
            {[
              { id: 1, t: "Two Sum", a: 52, d: "easy", k: "Array" },
              { id: 20, t: "Valid Parentheses", a: 41, d: "easy", k: "Stack" },
              { id: 21, t: "Merge Two Sorted Lists", a: 64, d: "easy", k: "Linked List" },
              { id: 121, t: "Best Time to Buy and Sell Stock", a: 54, d: "easy", k: "Array" },
              { id: 53, t: "Maximum Subarray", a: 51, d: "medium", k: "Array" },
            ].map((p) => (
              <tr key={p.id}>
                <td className="cl-mono cl-text-mute">{String(p.id).padStart(4, "0")}</td>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>
                  <Link to={`/arena/problemset/${p.id}`} className="cl-tbl-link">{p.t}</Link>
                </td>
                <td><div style={{ display: "flex", gap: 8, alignItems: "center" }}><div className="cl-bar"><div className="cl-bar-fill" style={{ width: `${p.a}%` }} /></div><span className="cl-mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>{p.a}%</span></div></td>
                <td><span className={`cl-chip cl-chip-${p.d} cl-chip-dot`}>{p.d[0].toUpperCase() + p.d.slice(1)}</span></td>
                <td><span className="cl-chip">{p.k}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const CTA = ({ user }) => (
  <section style={{ padding: "100px 0 40px" }}>
    <div className="cl-container-narrow" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div className="cl-lemon-hero"><div className="cl-lemon-leaf" /></div>
      </div>
      {/* Cyan stays, italic doesn't — the hero already spends the one italic
          accent this page gets, and twice reads as a tic rather than a choice. */}
      <h2 className="cl-h2">Ready to squeeze<br />some <span style={{ color: "var(--cyan)" }}>better code</span>?</h2>
      <p className="cl-lede" style={{ margin: "20px auto 32px" }}>
        A lightweight daily habit. 15 minutes · 1 problem · compounding returns.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
          {user.isLoggedIn ? "Continue learning" : "Start free"} <Icon name="arrowRight" size={14} />
        </Link>
        <a href="https://github.com/manishdasa100/CLFrontend" target="_blank" rel="noreferrer noopener" className="cl-btn cl-btn-ghost cl-btn-lg"><Icon name="code" size={14} /> View source on GitHub</a>
      </div>
    </div>
  </section>
);
