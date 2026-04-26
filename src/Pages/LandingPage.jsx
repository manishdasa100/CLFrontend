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
      <StatsBar />
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
    <div className="cl-container" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 20 }}>// when life gives you lemons</div>
        <h1 className="cl-h1">
          make lemonade<br />
          and <span style={{ color: "var(--cyan)", fontStyle: "italic" }}>code</span>
          <span className="cl-blink" style={{ display: "inline-block", width: 14, height: 14, marginLeft: 10, borderRadius: 3, background: "var(--cyan)", boxShadow: "0 0 20px var(--cyan)", verticalAlign: "baseline" }} />
        </h1>
        <p className="cl-lede" style={{ marginTop: 28 }}>
          Your daily gym for algorithmic thinking. 1,400+ hand-picked problems, 14 languages,
          real-time progress tracking — wrapped in an editor that doesn't get in your way.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 36, alignItems: "center" }}>
          <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
            {user.isLoggedIn ? "Enter the Arena" : "Start free"} <Icon name="arrowRight" size={14} />
          </Link>
          <Link to="/arena/problemset" className="cl-btn cl-btn-ghost cl-btn-lg">Browse problems</Link>
          <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-mute)" }}>
            <Icon name="check" size={14} style={{ color: "var(--easy)" }} /> No credit card
          </div>
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 18 }}>
          <span className="cl-eyebrow">trusted by engineers at</span>
          <div style={{ display: "flex", gap: 22, color: "var(--text-mute)", fontSize: 13, fontWeight: 500 }}>
            <span>Google</span><span>·</span><span>Meta</span><span>·</span><span>Amazon</span><span>·</span><span>Atlassian</span><span>·</span><span>Stripe</span>
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -30, background: "radial-gradient(circle at 50% 50%, rgba(34,211,238,.18), transparent 60%)", filter: "blur(40px)" }} />
        <EditorCard />
      </div>
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
  <div style={{ position: "relative", background: "var(--bg-1)", border: "1px solid var(--stroke-2)", borderRadius: 14, boxShadow: "0 40px 80px -20px rgba(0,0,0,.6)", overflow: "hidden" }}>
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
    <div style={{ display: "flex", gap: 10, padding: "12px 16px", borderTop: "1px solid var(--stroke)", background: "var(--bg-0)", alignItems: "center" }}>
      <button className="cl-btn cl-btn-subtle cl-btn-sm">Run</button>
      <button className="cl-btn cl-btn-primary cl-btn-sm">Submit <Icon name="play" size={10} /></button>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10, fontSize: 11, color: "var(--text-mute)", alignItems: "center" }}>
        <span className="cl-mono">✓ 58/58 tests passed</span>
        <span className="cl-chip cl-chip-cyan"><Icon name="sparkle" size={11} /> 12ms · 98th pctl</span>
      </div>
    </div>
  </div>
);

const Stat = ({ num, label }) => (
  <div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em" }}>{num}</div>
    <div className="cl-eyebrow" style={{ marginTop: 4 }}>{label}</div>
  </div>
);

const StatsBar = () => (
  <section style={{ borderTop: "1px solid var(--stroke)", borderBottom: "1px solid var(--stroke)", padding: "24px 0" }}>
    <div className="cl-container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
      <Stat num="1,412" label="problems" />
      <Stat num="14" label="languages" />
      <Stat num="82k" label="engineers" />
      <Stat num="2.1M" label="submissions" />
    </div>
  </section>
);

const Feature = ({ eyebrow, title, body, visual }) => (
  <div className="cl-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ padding: "26px 26px 20px" }}>
      <div className="cl-eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>{title}</h3>
      <p className="cl-text-dim" style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 10 }}>{body}</p>
    </div>
    <div style={{ marginTop: "auto", height: 220, borderTop: "1px solid var(--stroke)", background: "var(--bg-0)" }}>{visual}</div>
  </div>
);

const Features = () => (
  <section style={{ padding: "100px 0" }}>
    <div className="cl-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>the craft</div>
          <h2 className="cl-h2">Every rep feels deliberate.</h2>
        </div>
        <p className="cl-lede" style={{ fontSize: 15, maxWidth: 420 }}>
          We obsess over the small stuff — keyboard flow, clean diagnostics, honest feedback —
          so you can obsess over the problem.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20 }}>
        <Feature eyebrow="01 · editor" title="An editor you'd actually pick." body="Monaco-powered, shortcut-first, with language-aware diagnostics, test runners, and a focus mode that actually focuses." visual={<EditorVis />} />
        <Feature eyebrow="02 · progress" title="See your own shape." body="Topic heatmaps, complexity trends, and submission history that reveal where you're sharp — and where you're bluffing." visual={<DonutVis />} />
        <Feature eyebrow="03 · paths" title="Structured learning tracks." body="Curated routes through DP, graphs, recursion and more. Opinionated order, bite-sized milestones." visual={<PathVis />} />
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
      <text x="80" y="76" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="28" fontWeight="600">248</text>
      <text x="80" y="94" textAnchor="middle" fill="#6B7385" fontFamily="JetBrains Mono" fontSize="10" letterSpacing=".1em">SOLVED</text>
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
      <div className="cl-eyebrow">write in what you love</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        {["Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C++", "C#", "Kotlin", "Swift", "Ruby", "Scala", "PHP", "Elixir"].map((l) => (
          <span key={l} className="cl-chip cl-chip-mono" style={{ padding: "8px 14px", fontSize: 12 }}>{l}</span>
        ))}
      </div>
    </div>
  </section>
);

const ProblemShowcase = () => (
  <section style={{ padding: "80px 0", borderTop: "1px solid var(--stroke)" }}>
    <div className="cl-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>today's fresh squeeze</div>
          <h2 className="cl-h2">Start with a problem.</h2>
        </div>
        <Link to="/arena/problemset" className="cl-btn cl-btn-ghost cl-btn-sm">See all 1,412 <Icon name="arrowRight" size={12} /></Link>
      </div>
      <div className="cl-card">
        <table className="cl-tbl">
          <thead><tr><th style={{ width: 60 }}>#</th><th>Title</th><th style={{ width: 180 }}>Acceptance</th><th style={{ width: 100 }}>Difficulty</th><th style={{ width: 100 }}>Topics</th></tr></thead>
          <tbody>
            {[
              { id: 1, t: "Two Sum", a: 52, d: "easy", k: "Array" },
              { id: 53, t: "Maximum Subarray", a: 51, d: "medium", k: "DP" },
              { id: 124, t: "Binary Tree Maximum Path Sum", a: 41, d: "hard", k: "Tree" },
              { id: 200, t: "Number of Islands", a: 59, d: "medium", k: "Graph" },
              { id: 322, t: "Coin Change", a: 45, d: "medium", k: "DP" },
            ].map((p) => (
              <tr key={p.id}>
                <td className="cl-mono cl-text-mute">{String(p.id).padStart(4, "0")}</td>
                <td style={{ color: "var(--text)", fontWeight: 500 }}>
                  <Link to={`/arena/problemset/${p.id}`}>{p.t}</Link>
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
      <h2 className="cl-h2">Ready to squeeze<br />some <span style={{ color: "var(--cyan)", fontStyle: "italic" }}>better code</span>?</h2>
      <p className="cl-lede" style={{ margin: "20px auto 32px" }}>
        A lightweight daily habit. 15 minutes · 1 problem · compounding returns.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to={user.isLoggedIn ? "/arena/problemset" : "/signup"} className="cl-btn cl-btn-primary cl-btn-lg">
          {user.isLoggedIn ? "Go to Arena" : "Create your account"} <Icon name="arrowRight" size={14} />
        </Link>
        <a href="#" className="cl-btn cl-btn-ghost cl-btn-lg"><Icon name="code" size={14} /> View source on GitHub</a>
      </div>
    </div>
  </section>
);
