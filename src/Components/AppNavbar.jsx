import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";
import { useUser } from "../context/UserContext";
import { isDefaultDp } from "./profileUtils";

export default function AppNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useUser();
  const loggedIn = !!user;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // reset the broken-image fallback whenever the picture URL changes
  useEffect(() => { setAvatarError(false); }, [user?.profilePictureUrl]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close the mobile menu after navigating to a new route
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    clearUser();
    navigate("/login");
  };

  const isActive = (match) => {
    if (match === "landing") return pathname === "/";
    if (match === "arena") return pathname.startsWith("/arena");
    return false;
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <nav className="cl-nav" ref={navRef}>
      <div className="cl-nav-inner">
        <BrandLogo />
        <div className="cl-nav-links">
          <Link to="/arena/problemset" className={`cl-nav-link ${isActive("arena") ? "active" : ""}`}>Arena</Link>
          <Link to="/arena/learn" className="cl-nav-link">Learn</Link>
          <Link to="/arena/study-plans" className="cl-nav-link">Study Plans</Link>
        </div>
        <div style={{ flex: 1 }} />
        <div className="cl-nav-actions">
          {loggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 6 }}>
              <span className="cl-chip cl-chip-cyan"><Icon name="fire" size={12} /> 12d</span>
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <div onClick={() => setDropdownOpen((o) => !o)} style={{ cursor: "pointer" }}>
                  {user?.profilePictureUrl && !isDefaultDp(user.profilePictureUrl) && !avatarError ? (
                    <img src={user.profilePictureUrl} alt="avatar" onError={() => setAvatarError(true)} style={{
                      width: 30, height: 30, borderRadius: "50%",
                      objectFit: "cover", border: "1px solid rgba(255,255,255,.2)",
                    }} />
                  ) : (
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "linear-gradient(135deg, #FFE140, #22D3EE)",
                      display: "grid", placeItems: "center", color: "#0A0B10",
                      fontWeight: 700, fontSize: 12, border: "1px solid rgba(255,255,255,.2)",
                    }}>{initials}</div>
                  )}
                </div>
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "var(--bg-2)", border: "1px solid var(--stroke)",
                    borderRadius: 10, padding: 6, minWidth: 160,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100,
                  }}>
                    <div style={{ padding: "6px 10px 8px", borderBottom: "1px solid var(--stroke)" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{user?.firstName} {user?.lastName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-mute)" }}>@{user?.username}</div>
                    </div>
                    <Link to={`/profile/${user?.username}`} onClick={() => setDropdownOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px", borderRadius: 6, fontSize: 13,
                      color: "var(--text)", textDecoration: "none", marginTop: 4,
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-3)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Icon name="user" size={13} /> Profile
                    </Link>
                    <button onClick={handleLogout} style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      padding: "8px 10px", borderRadius: 6, fontSize: 13, border: "none",
                      background: "transparent", cursor: "pointer", color: "var(--hard)", fontFamily: "inherit",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(251,113,133,.08)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Icon name="logout" size={13} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="cl-btn cl-btn-ghost cl-btn-sm">Sign in</Link>
              <Link to="/signup" className="cl-btn cl-btn-primary cl-btn-sm">Start free</Link>
            </>
          )}
        </div>
        <button
          className="cl-nav-toggle cl-btn-icon"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Icon name={menuOpen ? "x" : "menu"} size={18} />
        </button>
      </div>
      <div className={`cl-nav-mobile ${menuOpen ? "is-open" : ""}`}>
        <div className="cl-nav-mobile-inner">
          <Link to="/arena/problemset" className={`cl-nav-mobile-link ${isActive("arena") ? "active" : ""}`}>Arena</Link>
          <Link to="/arena/learn" className="cl-nav-mobile-link">Learn</Link>
          <Link to="/arena/study-plans" className="cl-nav-mobile-link">Study Plans</Link>
          <div className="cl-nav-mobile-divider" />
          {loggedIn ? (
            <>
              <Link to={`/profile/${user?.username}`} className="cl-nav-mobile-link"><Icon name="user" size={15} /> Profile</Link>
              <button onClick={handleLogout} className="cl-nav-mobile-link" style={{ color: "var(--hard)" }}><Icon name="logout" size={15} /> Log out</button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, padding: "8px 4px" }}>
              <Link to="/login" className="cl-btn cl-btn-ghost" style={{ flex: 1 }}>Sign in</Link>
              <Link to="/signup" className="cl-btn cl-btn-primary" style={{ flex: 1 }}>Start free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
