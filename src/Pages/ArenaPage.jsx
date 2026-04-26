import { useMemo } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";

const ArenaPage = () => {
  const { pathname } = useLocation();
  const isProblemDetails = useMemo(() => pathname.match(/^\/arena\/problemset\/.+/), [pathname]);

  const key = useMemo(() => {
    if (pathname === "/arena/learn") return "learn";
    if (pathname === "/arena/study-plans") return "study-plans";
    return "problemset";
  }, [pathname]);

  return (
    <BackgroundWrapper>
      <AppNavbar />
      {!isProblemDetails ? (
        <>
          <div className="cl-container" style={{ paddingTop: 32 }}>
            <ArenaHeader />
            <div className="cl-tabs" style={{ marginTop: 32, marginBottom: 24 }}>
              <Link to="/arena/problemset" className={`cl-tab ${key === "problemset" ? "active" : ""}`}>Problems</Link>
              <Link to="/arena/learn" className={`cl-tab ${key === "learn" ? "active" : ""}`}>Learn</Link>
              <Link to="/arena/study-plans" className={`cl-tab ${key === "study-plans" ? "active" : ""}`}>Study Plans</Link>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
          <Footer />
        </>
      ) : (
        <Outlet />
      )}
    </BackgroundWrapper>
  );
};

const ArenaHeader = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 14 }}>
    <div className="cl-card" style={{ padding: "22px 24px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(255,225,64,0.06) 0%, var(--bg-1) 70%)" }}>
      <div className="cl-eyebrow">your arena</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>
        Hey, Manish <span style={{ color: "var(--lemon)" }}>→</span>
      </div>
      <div className="cl-text-dim" style={{ fontSize: 13, marginTop: 6 }}>
        You're on a <span style={{ color: "var(--cyan)" }}>12-day streak</span>. Keep the lemon squeezed.
      </div>
      <div style={{ position: "absolute", right: -10, bottom: -10, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 30% 28%, #FFF5B0 0%, #FFE140 40%, #C89E00 100%)", opacity: .12, filter: "blur(2px)" }} />
    </div>

    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">daily · fresh squeeze</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, marginTop: 10, lineHeight: 1.2 }}>Word Ladder II</div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        <span className="cl-chip cl-chip-hard cl-chip-dot">Hard</span>
        <span className="cl-chip">BFS</span>
      </div>
      <Link to="/arena/problemset/127" className="cl-btn cl-btn-primary cl-btn-sm" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
        Solve today <Icon name="arrowRight" size={12} />
      </Link>
    </div>

    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow"><Icon name="fire" size={11} style={{ color: "var(--lemon)", verticalAlign: "middle", marginRight: 4 }} />streak</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, marginTop: 4, letterSpacing: "-0.02em" }}>
        12<span className="cl-text-mute" style={{ fontSize: 14, fontWeight: 500, marginLeft: 4 }}>days</span>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 16, borderRadius: 2, background: i < 12 ? (i === 11 ? "var(--lemon)" : "rgba(255,225,64,0.7)") : "var(--bg-3)" }} />
        ))}
      </div>
      <div className="cl-text-mute cl-mono" style={{ fontSize: 10, marginTop: 6, letterSpacing: ".1em" }}>LAST 14 DAYS</div>
    </div>

    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="82" height="82" viewBox="0 0 82 82">
        <circle cx="41" cy="41" r="32" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--easy)" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 201" transform="rotate(-90 41 41)" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--medium)" strokeWidth="8" strokeLinecap="round" strokeDasharray="50 201" strokeDashoffset="-90" transform="rotate(-90 41 41)" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--hard)" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 201" strokeDashoffset="-140" transform="rotate(-90 41 41)" />
        <text x="41" y="45" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="18" fontWeight="600">154</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, flex: 1 }}>
        <StatLine color="var(--easy)" label="Easy" v={90} t={145} />
        <StatLine color="var(--medium)" label="Med" v={50} t={320} />
        <StatLine color="var(--hard)" label="Hard" v={14} t={120} />
      </div>
    </div>
  </div>
);

const StatLine = ({ color, label, v, t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, background: color, borderRadius: 2 }} />
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
    </span>
    <span className="cl-mono" style={{ color: "var(--text)" }}>{v}<span className="cl-text-mute">/{t}</span></span>
  </div>
);

export default ArenaPage;
