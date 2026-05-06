import { useMemo } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import ProblemOfTheDayCard from "../Components/ProblemOfTheDayCard";
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
          <div className="cl-container" style={{ paddingTop: 32, width: "100%"}}>
            {/* Greeting */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 18}}>
              <span className="cl-eyebrow" style={{ marginBottom: 5 }}>Your Arena</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>
                Good to see you, <span style={{ color: "var(--cyan)" }}>Manish</span>.
              </div>
            </div>

            {/* Navigation tabs — above the cards */}
            <div className="cl-tabs" style={{ marginBottom: 24 }}>
              <Link to="/arena/problemset" className={`cl-tab ${key === "problemset" ? "active" : ""}`}><Icon name="code" size={13} />Problems</Link>
              <Link to="/arena/learn" className={`cl-tab ${key === "learn" ? "active" : ""}`}><Icon name="book" size={13} />Learn</Link>
              <Link to="/arena/study-plans" className={`cl-tab ${key === "study-plans" ? "active" : ""}`}><Icon name="grid" size={13} />Study Plans</Link>
            </div>

            {/* Arena header cards — below the tabs */}
            <ArenaHeader />
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
  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 14, width: "100%", marginBottom:24 }}>

    <ProblemOfTheDayCard />

    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">current streak</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>12</span>
        <span className="cl-text-mute" style={{ fontSize: 12 }}>best: 12</span>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 12 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 27, borderRadius: 2, background: i < 12 ? (i === 11 ? "var(--cyan)" : "rgba(34,211,238,0.3)") : "var(--bg-3)" }} />
        ))}
      </div>
      <div className="cl-text-mute cl-mono" style={{ fontSize: 10, marginTop: 8, letterSpacing: ".1em" }}>3 days ago</div>
    </div>

    <div className="cl-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
      <div className="cl-eyebrow">progress overview</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flex: 1 }}>
      <svg width="130" height="130" viewBox="0 0 90 90">
        <circle cx="41" cy="41" r="32" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--easy)" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 201" transform="rotate(-90 41 41)" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--medium)" strokeWidth="8" strokeLinecap="round" strokeDasharray="50 201" strokeDashoffset="-90" transform="rotate(-90 41 41)" />
        <circle cx="41" cy="41" r="32" fill="none" stroke="var(--hard)" strokeWidth="8" strokeLinecap="round" strokeDasharray="14 201" strokeDashoffset="-140" transform="rotate(-90 41 41)" />
        <text x="41" y="45" textAnchor="middle" fill="#EDEFF4" fontFamily="Comme" fontSize="18" fontWeight="600">154</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, flex: 1 }}>
        <StatLine color="var(--easy)" label="Easy" v={90} t={145} />
        <StatLine color="var(--medium)" label="Med" v={50} t={320} />
        <StatLine color="var(--hard)" label="Hard" v={14} t={120} />
      </div>
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
