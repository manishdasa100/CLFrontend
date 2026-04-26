import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";
import { useState } from "react";

export default function AppNavbar() {
  const { pathname } = useLocation();
  const [user] = useState({
    username: "Manish Das",
    isLoggedIn: false,
    profilePic: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  });

  const isActive = (match) => {
    if (match === "landing") return pathname === "/";
    if (match === "arena") return pathname.startsWith("/arena");
    return false;
  };

  return (
    <nav className="cl-nav">
      <div className="cl-nav-inner">
        <BrandLogo />
        <div className="cl-nav-links">
          <Link to="/arena/problemset" className={`cl-nav-link ${isActive("arena") ? "active" : ""}`}>Arena</Link>
          <Link to="/arena/learn" className="cl-nav-link">Learn</Link>
          <Link to="/arena/study-plans" className="cl-nav-link">Study Plans</Link>
          <a href="#" className="cl-nav-link">Contest</a>
          <a href="#" className="cl-nav-link">Discuss</a>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="cl-btn cl-btn-icon" aria-label="search">
            <Icon name="search" size={16} />
          </button>
          <span style={{ display: "inline-flex", gap: 4 }}>
            <span className="cl-kbd">⌘</span>
            <span className="cl-kbd">K</span>
          </span>
          {user.isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 6 }}>
              <span className="cl-chip cl-chip-cyan"><Icon name="fire" size={12} /> 12d</span>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #FFE140, #22D3EE)",
                display: "grid", placeItems: "center", color: "#0A0B10",
                fontWeight: 700, fontSize: 12, border: "1px solid rgba(255,255,255,.2)"
              }}>MD</div>
            </div>
          ) : (
            <>
              <Link to="/login" className="cl-btn cl-btn-ghost cl-btn-sm">Sign in</Link>
              <Link to="/signup" className="cl-btn cl-btn-primary cl-btn-sm">Create account</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
