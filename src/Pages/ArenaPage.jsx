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
              <Link to="/arena/learn" className={`cl-tab ${key === "learn" ? "active" : ""}`}><Icon name="book" size={13} />Learn</Link>
              <Link to="/arena/study-plans" className={`cl-tab ${key === "study-plans" ? "active" : ""}`}><Icon name="grid" size={13} />Study Plans</Link>
              <Link to="/arena/problemset" className={`cl-tab ${key === "problemset" ? "active" : ""}`}><Icon name="code" size={13} />Problems</Link>
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

export default ArenaPage;
