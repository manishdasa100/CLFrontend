import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";

// Demo data — wire to a real query later
const CURRENT_USER = "manish";

const USERS = {
  manish: {
    handle: "manish",
    name: "Manish Das",
    title: "Full-stack engineer",
    location: "Bengaluru, IN",
    bio: "Squeezing one problem a day. Mostly Python, occasional Rust experiments. DM open for discussion threads.",
    joined: "Mar 2024",
    plan: "Pro",
    rank: 4287,
    avatarGrad: "linear-gradient(135deg, #FFE140, #22D3EE)",
    initials: "MD",
    socials: { github: "manishdas", twitter: "manish_codes", website: "manish.dev" },
    solved: { easy: 145, easyTotal: 320, medium: 92, mediumTotal: 690, hard: 21, hardTotal: 240 },
    rating: { current: 1842, peak: 1907, contests: 14 },
    languages: [
      { name: "Python", pct: 58, color: "#22D3EE" },
      { name: "JavaScript", pct: 22, color: "#FFE140" },
      { name: "Rust", pct: 12, color: "#FB7185" },
      { name: "Go", pct: 8, color: "#6EE7B7" },
    ],
    topics: [
      { name: "Arrays", solved: 64, total: 90 },
      { name: "Strings", solved: 42, total: 70 },
      { name: "Hashing", solved: 38, total: 55 },
      { name: "Dynamic Programming", solved: 28, total: 95 },
      { name: "Trees", solved: 24, total: 60 },
      { name: "Graphs", solved: 18, total: 80 },
      { name: "Two Pointers", solved: 22, total: 30 },
      { name: "Binary Search", solved: 16, total: 35 },
      { name: "Heap", solved: 8, total: 25 },
      { name: "Greedy", solved: 12, total: 40 },
    ],
    badges: [
      { id: "100c", t: "100 Club", d: "Solved 100 problems", color: "#FFE140", icon: "star" },
      { id: "polyglot", t: "Polyglot", d: "Submitted in 4+ languages", color: "#22D3EE", icon: "code" },
      { id: "earlybird", t: "Early Bird", d: "30 days at 7am", color: "#6EE7B7", icon: "fire" },
      { id: "dp", t: "DP Apprentice", d: "Cleared DP track tier 1", color: "#A78BFA", icon: "sparkle" },
      { id: "hardcore", t: "Hardcore", d: "20 hard problems", color: "#FB7185", icon: "heart" },
      { id: "contest", t: "Contestant", d: "Joined first contest", color: "#FCD34D", icon: "play" },
    ],
    recent: [
      { id: 322, title: "Coin Change", lang: "Python", status: "AC", runtime: "84ms", mem: "16.4MB", when: "2h ago", diff: "medium" },
      { id: 200, title: "Number of Islands", lang: "Python", status: "AC", runtime: "112ms", mem: "23.1MB", when: "yesterday", diff: "medium" },
      { id: 53,  title: "Maximum Subarray", lang: "Rust", status: "AC", runtime: "4ms", mem: "2.1MB", when: "yesterday", diff: "easy" },
      { id: 124, title: "Binary Tree Maximum Path Sum", lang: "Python", status: "WA", runtime: "—", mem: "—", when: "2 days ago", diff: "hard" },
      { id: 1,   title: "Two Sum", lang: "JavaScript", status: "AC", runtime: "68ms", mem: "44.2MB", when: "2 days ago", diff: "easy" },
      { id: 207, title: "Course Schedule", lang: "Python", status: "TLE", runtime: "—", mem: "—", when: "3 days ago", diff: "medium" },
      { id: 76,  title: "Minimum Window Substring", lang: "Python", status: "AC", runtime: "92ms", mem: "18.7MB", when: "4 days ago", diff: "hard" },
      { id: 70,  title: "Climbing Stairs", lang: "Go", status: "AC", runtime: "0ms", mem: "1.9MB", when: "5 days ago", diff: "easy" },
    ],
  },
  priya: {
    handle: "priya",
    name: "Priya Sharma",
    title: "Senior SWE @ Stripe",
    location: "Bangalore, IN",
    bio: "Distributed systems by day, leetcoding by night. Open to mentoring conversations.",
    joined: "Aug 2023",
    plan: "Pro",
    rank: 612,
    avatarGrad: "linear-gradient(135deg, #22D3EE, #6EE7B7)",
    initials: "PS",
    socials: { github: "priyas", twitter: "priya_dev" },
    solved: { easy: 280, easyTotal: 320, medium: 412, mediumTotal: 690, hard: 96, hardTotal: 240 },
    rating: { current: 2210, peak: 2284, contests: 38 },
    languages: [
      { name: "Go", pct: 48, color: "#6EE7B7" },
      { name: "Python", pct: 30, color: "#22D3EE" },
      { name: "C++", pct: 22, color: "#FB7185" },
    ],
    topics: [
      { name: "Arrays", solved: 88, total: 90 },
      { name: "Dynamic Programming", solved: 72, total: 95 },
      { name: "Graphs", solved: 64, total: 80 },
      { name: "Trees", solved: 52, total: 60 },
      { name: "Strings", solved: 60, total: 70 },
      { name: "Hashing", solved: 50, total: 55 },
      { name: "Binary Search", solved: 30, total: 35 },
      { name: "Heap", solved: 22, total: 25 },
    ],
    badges: [
      { id: "500c", t: "500 Club", d: "Solved 500 problems", color: "#FFE140", icon: "star" },
      { id: "guru", t: "Contest Guru", d: "Top 1% rating", color: "#22D3EE", icon: "sparkle" },
      { id: "all", t: "All-Rounder", d: "All topics > 50%", color: "#6EE7B7", icon: "check" },
    ],
    recent: [
      { id: 460, title: "LFU Cache", lang: "Go", status: "AC", runtime: "212ms", mem: "60.1MB", when: "1h ago", diff: "hard" },
      { id: 295, title: "Find Median from Data Stream", lang: "Go", status: "AC", runtime: "180ms", mem: "62MB", when: "5h ago", diff: "hard" },
      { id: 84,  title: "Largest Rectangle in Histogram", lang: "C++", status: "AC", runtime: "8ms", mem: "20MB", when: "yesterday", diff: "hard" },
    ],
  },
};

export default function ProfilePage() {
  const { username } = useParams();
  const handle = (username || CURRENT_USER).toLowerCase();
  const u = USERS[handle] || USERS[CURRENT_USER];
  const isOwn = handle === CURRENT_USER;

  const [following, setFollowing] = useState(false);

  return (
    <BackgroundWrapper>
      <AppNavbar />
      <ProfileHero u={u} isOwn={isOwn} following={following} setFollowing={setFollowing} />
      <div className="cl-container" style={{ paddingBottom: 40, display: "flex", flexDirection: "column", gap: 16 }}>
        <StatsRow u={u} />
        <Heatmap />
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <TopicMastery u={u} />
          <RightColumn u={u} />
        </div>
        <RecentSubmissions u={u} />
        <Achievements u={u} />
      </div>
      <Footer />
    </BackgroundWrapper>
  );
}

const ProfileHero = ({ u, isOwn, following, setFollowing }) => (
  <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--stroke)" }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(900px 280px at 80% -20%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(700px 240px at 10% 130%, rgba(255,225,64,0.08), transparent 60%)" }} />
    <div className="cl-container" style={{ position: "relative", padding: "40px 28px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 104, height: 104, borderRadius: "50%", background: u.avatarGrad,
          display: "grid", placeItems: "center", color: "#0A0B10", fontWeight: 700,
          fontSize: 36, fontFamily: "var(--font-display)",
          border: "1px solid rgba(255,255,255,.18)",
          boxShadow: "0 16px 40px -10px rgba(0,0,0,.5), 0 0 0 6px rgba(255,255,255,.02)" }}>
          {u.initials}
        </div>
        {u.plan === "Pro" && (
          <span className="cl-chip cl-chip-lemon" style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", fontSize: 10 }}>
            <Icon name="sparkle" size={10} /> Pro
          </span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div className="cl-eyebrow" style={{ marginBottom: 8 }}>{isOwn ? "your profile" : "public profile"}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>{u.name}</h1>
          <span className="cl-mono cl-text-mute" style={{ fontSize: 14 }}>@{u.handle}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8, fontSize: 13, color: "var(--text-dim)" }}>
          <span>{u.title}</span>
          <span className="cl-text-faint">·</span>
          <span>{u.location}</span>
          <span className="cl-text-faint">·</span>
          <span>Joined {u.joined}</span>
          <span className="cl-text-faint">·</span>
          <span>Global rank <span className="cl-mono" style={{ color: "var(--cyan)" }}>#{u.rank.toLocaleString()}</span></span>
        </div>
        <p style={{ marginTop: 14, maxWidth: 640, fontSize: 13.5, lineHeight: 1.55, color: "var(--text-dim)" }}>{u.bio}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          {u.socials.github && <SocialLink icon="code" label={`github/${u.socials.github}`} />}
          {u.socials.twitter && <SocialLink icon="sparkle" label={`@${u.socials.twitter}`} />}
          {u.socials.website && <SocialLink icon="arrowRight" label={u.socials.website} />}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {isOwn ? (
          <>
            <Link to="#" className="cl-btn cl-btn-ghost cl-btn-sm">Settings</Link>
            <Link to="#" className="cl-btn cl-btn-primary cl-btn-sm">Edit profile</Link>
          </>
        ) : (
          <>
            <button className="cl-btn cl-btn-ghost cl-btn-sm">Share</button>
            <button className={`cl-btn cl-btn-sm ${following ? "cl-btn-subtle" : "cl-btn-primary"}`} onClick={() => setFollowing((f) => !f)}>
              {following ? <><Icon name="check" size={12} /> Following</> : <>+ Follow</>}
            </button>
          </>
        )}
      </div>
    </div>
  </section>
);

const SocialLink = ({ icon, label }) => (
  <a href="#" className="cl-chip" style={{ padding: "5px 11px" }}>
    <Icon name={icon} size={11} /> {label}
  </a>
);

const StatsRow = ({ u }) => {
  const totalSolved = u.solved.easy + u.solved.medium + u.solved.hard;
  const totalProblems = u.solved.easyTotal + u.solved.mediumTotal + u.solved.hardTotal;
  const ePct = (u.solved.easy / u.solved.easyTotal) * 100;
  const mPct = (u.solved.medium / u.solved.mediumTotal) * 100;
  const hPct = (u.solved.hard / u.solved.hardTotal) * 100;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16, marginTop: 24 }}>
      <div className="cl-card" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 22 }}>
        <Donut e={u.solved.easy} et={u.solved.easyTotal} m={u.solved.medium} mt={u.solved.mediumTotal} h={u.solved.hard} ht={u.solved.hardTotal} />
        <div style={{ flex: 1 }}>
          <div className="cl-eyebrow">solved</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
            {totalSolved}<span className="cl-text-mute" style={{ fontSize: 16, fontWeight: 500 }}> / {totalProblems}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10, fontSize: 12 }}>
            <DiffLine color="var(--easy)" label="Easy" v={u.solved.easy} t={u.solved.easyTotal} pct={ePct} />
            <DiffLine color="var(--medium)" label="Medium" v={u.solved.medium} t={u.solved.mediumTotal} pct={mPct} />
            <DiffLine color="var(--hard)" label="Hard" v={u.solved.hard} t={u.solved.hardTotal} pct={hPct} />
          </div>
        </div>
      </div>
      <div className="cl-card" style={{ padding: "22px 24px" }}>
        <div className="cl-eyebrow">contest rating</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{u.rating.current}</div>
          <span className="cl-chip cl-chip-cyan" style={{ fontSize: 10 }}>+18</span>
        </div>
        <div className="cl-text-mute" style={{ fontSize: 12, marginTop: 4 }}>Peak <span className="cl-mono" style={{ color: "var(--text-dim)" }}>{u.rating.peak}</span> · {u.rating.contests} contests</div>
        <RatingSpark />
      </div>
      <div className="cl-card" style={{ padding: "22px 24px" }}>
        <div className="cl-eyebrow">global rank</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
          #{u.rank.toLocaleString()}
        </div>
        <div className="cl-text-mute" style={{ fontSize: 12, marginTop: 4 }}>Top <span style={{ color: "var(--cyan)" }}>{((u.rank / 82000) * 100).toFixed(1)}%</span> of 82k engineers</div>
        <div style={{ marginTop: 14, height: 6, borderRadius: 99, background: "var(--bg-3)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${100 - (u.rank / 82000) * 100}%`, background: "linear-gradient(90deg, var(--lemon), var(--cyan))" }} />
        </div>
      </div>
    </div>
  );
};

const Donut = ({ e, et, m, mt, h, ht }) => {
  const r = 42, c = 2 * Math.PI * r;
  const ePct = e / et, mPct = m / mt, hPct = h / ht;
  return (
    <svg width="118" height="118" viewBox="0 0 118 118">
      <circle cx="59" cy="59" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
      <circle cx="59" cy="59" r={r} fill="none" stroke="var(--easy)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * ePct * 0.33} ${c}`} transform="rotate(-90 59 59)" />
      <circle cx="59" cy="59" r={r} fill="none" stroke="var(--medium)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * mPct * 0.33} ${c}`} strokeDashoffset={`-${c * 0.33}`} transform="rotate(-90 59 59)" />
      <circle cx="59" cy="59" r={r} fill="none" stroke="var(--hard)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * hPct * 0.33} ${c}`} strokeDashoffset={`-${c * 0.66}`} transform="rotate(-90 59 59)" />
      <text x="59" y="56" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="22" fontWeight="600">{e + m + h}</text>
      <text x="59" y="74" textAnchor="middle" fill="#6B7385" fontFamily="JetBrains Mono" fontSize="9" letterSpacing=".15em">SOLVED</text>
    </svg>
  );
};

const DiffLine = ({ color, label, v, t, pct }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 6, height: 6, background: color, borderRadius: 2 }} />
    <span style={{ width: 60, color: "var(--text-dim)" }}>{label}</span>
    <div style={{ flex: 1, height: 3, borderRadius: 99, background: "var(--bg-3)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
    </div>
    <span className="cl-mono" style={{ minWidth: 60, textAlign: "right", color: "var(--text)" }}>{v}<span className="cl-text-mute">/{t}</span></span>
  </div>
);

const RatingSpark = () => {
  const data = [1620, 1640, 1610, 1680, 1720, 1700, 1780, 1820, 1790, 1842];
  const min = Math.min(...data), max = Math.max(...data);
  const w = 220, h = 44;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(" ");
  return (
    <svg width="100%" height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} style={{ marginTop: 14, display: "block" }}>
      <defs>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#sparkfill)" stroke="none" />
      <polyline points={pts} fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Heatmap = () => {
  // 53 weeks × 7 days
  const weeks = 53;
  const seed = (i) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  return (
    <div className="cl-card" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="cl-eyebrow">activity · last 12 months</div>
          <div className="cl-text-dim" style={{ fontSize: 13, marginTop: 4 }}>
            <span className="cl-mono" style={{ color: "var(--text)" }}>432</span> submissions in the last year
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-mute)" }}>
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <span key={i} style={{ width: 12, height: 12, borderRadius: 3,
              background: v === 0 ? "var(--bg-3)" : `rgba(34,211,238,${0.18 + v * 0.62})`,
              border: "1px solid var(--stroke)" }} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", minWidth: "fit-content" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 18, fontSize: 10, color: "var(--text-mute)", fontFamily: "var(--font-mono)" }}>
            <span style={{ height: 12 }}>Mon</span>
            <span style={{ height: 12, opacity: 0 }}>·</span>
            <span style={{ height: 12 }}>Wed</span>
            <span style={{ height: 12, opacity: 0 }}>·</span>
            <span style={{ height: 12 }}>Fri</span>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 4, marginBottom: 4, fontSize: 10, color: "var(--text-mute)", fontFamily: "var(--font-mono)" }}>
              {months.map((m) => <span key={m}>{m}</span>)}
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: weeks }).map((_, w) => (
                <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {Array.from({ length: 7 }).map((_, d) => {
                    const idx = w * 7 + d;
                    const r = seed(idx);
                    // bias active days; first 30 weeks active, then break, then ramp up
                    let intensity = 0;
                    if (w < 30 || w > 38) intensity = r > 0.55 ? Math.min(1, (r - 0.55) * 2.5) : 0;
                    if (w > 45) intensity = r > 0.3 ? Math.min(1, (r - 0.3) * 1.6) : 0;
                    return (
                      <div key={d} title={`${idx} contributions`}
                        style={{ width: 12, height: 12, borderRadius: 3,
                          background: intensity === 0 ? "var(--bg-3)" : `rgba(34,211,238,${0.18 + intensity * 0.62})`,
                          border: "1px solid var(--stroke)" }} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopicMastery = ({ u }) => (
  <div className="cl-card" style={{ padding: "22px 24px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <div className="cl-eyebrow">topic mastery</div>
        <div className="cl-card-title" style={{ marginTop: 4 }}>Where they're sharp.</div>
      </div>
      <span className="cl-chip cl-chip-cyan">{u.topics.length} topics</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {u.topics.map((t) => {
        const pct = (t.solved / t.total) * 100;
        const color = pct > 70 ? "var(--easy)" : pct > 40 ? "var(--cyan)" : pct > 20 ? "var(--medium)" : "var(--text-mute)";
        return (
          <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 160, fontSize: 13, color: "var(--text)" }}>{t.name}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--bg-3)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width .4s" }} />
            </div>
            <span className="cl-mono" style={{ fontSize: 11, color: "var(--text-dim)", minWidth: 70, textAlign: "right" }}>
              {t.solved}<span className="cl-text-mute">/{t.total}</span>
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const RightColumn = ({ u }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div className="cl-card" style={{ padding: "22px 24px" }}>
      <div className="cl-eyebrow">languages</div>
      <div className="cl-card-title" style={{ marginTop: 4, marginBottom: 14 }}>By submission share.</div>
      <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 14, background: "var(--bg-3)" }}>
        {u.languages.map((l) => (
          <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {u.languages.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ flex: 1, color: "var(--text)" }}>{l.name}</span>
            <span className="cl-mono cl-text-mute">{l.pct}%</span>
          </div>
        ))}
      </div>
    </div>
    <div className="cl-card" style={{ padding: "22px 24px" }}>
      <div className="cl-eyebrow">at a glance</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <Mini label="Acceptance rate" value="68.4%" />
        <Mini label="Avg runtime pctl" value="74th" />
        <Mini label="Submissions" value="1,247" />
        <Mini label="Discussions" value="38" />
      </div>
    </div>
  </div>
);

const Mini = ({ label, value }) => (
  <div style={{ padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--stroke)", borderRadius: 8 }}>
    <div className="cl-mono" style={{ fontSize: 10, color: "var(--text-mute)", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 4 }}>{value}</div>
  </div>
);

const STATUS_COLORS = {
  AC: { bg: "rgba(110,231,183,.1)", color: "var(--easy)", label: "Accepted" },
  WA: { bg: "rgba(251,113,133,.1)", color: "var(--hard)", label: "Wrong Answer" },
  TLE: { bg: "rgba(252,211,77,.1)", color: "var(--medium)", label: "Time Limit" },
};

const RecentSubmissions = ({ u }) => (
  <div className="cl-card">
    <div className="cl-card-header">
      <div>
        <div className="cl-card-title">Recent submissions</div>
        <div className="cl-card-sub">The last few attempts.</div>
      </div>
      <Link to="#" className="cl-btn cl-btn-ghost cl-btn-sm">View all <Icon name="arrowRight" size={12} /></Link>
    </div>
    <table className="cl-tbl">
      <thead>
        <tr>
          <th style={{ width: 110 }}>Status</th>
          <th>Problem</th>
          <th style={{ width: 110 }}>Difficulty</th>
          <th style={{ width: 110 }}>Language</th>
          <th style={{ width: 100 }}>Runtime</th>
          <th style={{ width: 100 }}>Memory</th>
          <th style={{ width: 110 }}>When</th>
        </tr>
      </thead>
      <tbody>
        {u.recent.map((r, i) => {
          const s = STATUS_COLORS[r.status];
          return (
            <tr key={i}>
              <td>
                <span className="cl-chip cl-chip-dot" style={{ background: s.bg, color: s.color, borderColor: s.bg }}>
                  {s.label}
                </span>
              </td>
              <td>
                <Link to={`/arena/problemset/${r.id}`} style={{ color: "var(--text)", fontWeight: 500 }}>
                  {r.title}
                </Link>
              </td>
              <td><span className={`cl-chip cl-chip-${r.diff} cl-chip-dot`}>{r.diff[0].toUpperCase() + r.diff.slice(1)}</span></td>
              <td><span className="cl-mono cl-text-dim">{r.lang}</span></td>
              <td className="cl-mono">{r.runtime}</td>
              <td className="cl-mono cl-text-dim">{r.mem}</td>
              <td className="cl-text-mute">{r.when}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const Achievements = ({ u }) => (
  <div className="cl-card" style={{ padding: "22px 24px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
      <div>
        <div className="cl-eyebrow">achievements</div>
        <div className="cl-card-title" style={{ marginTop: 4 }}>{u.badges.length} unlocked</div>
      </div>
      <Link to="#" className="cl-btn cl-btn-ghost cl-btn-sm">All badges</Link>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
      {u.badges.map((b) => (
        <div key={b.id} style={{ background: "var(--bg-2)", border: "1px solid var(--stroke-1)", borderRadius: 12, padding: "16px 14px", textAlign: "center", transition: "transform .15s, border-color .15s" }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = b.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--stroke-1)"; e.currentTarget.style.transform = ""; }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", margin: "0 auto 10px",
            background: `radial-gradient(circle at 30% 28%, ${b.color}33, ${b.color}11)`,
            border: `1px solid ${b.color}44`,
            display: "grid", placeItems: "center", color: b.color }}>
            <Icon name={b.icon} size={18} />
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)" }}>{b.t}</div>
          <div className="cl-text-mute" style={{ fontSize: 10.5, marginTop: 4, lineHeight: 1.4 }}>{b.d}</div>
        </div>
      ))}
    </div>
  </div>
);
