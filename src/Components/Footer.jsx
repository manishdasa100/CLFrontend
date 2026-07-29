import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";

const GITHUB_URL = "https://github.com/manishdasa100/CLFrontend";

const FooterLink = ({ to, children }) => (
  <Link to={to} style={{ display: "block", fontSize: 13, color: "var(--text-dim)", padding: "4px 0" }}
    onMouseOver={(e) => (e.currentTarget.style.color = "var(--text)")}
    onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-dim)")}>
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--stroke)", marginTop: 80, padding: "40px 0", color: "var(--text-mute)" }}>
      <div className="cl-container cl-footer-grid" style={{ marginBottom: 32 }}>
        <div className="cl-footer-brand">
          <BrandLogo />
          <p style={{ marginTop: 12, fontSize: 13, maxWidth: 300, lineHeight: 1.55 }}>
            A calmer way to learn data structures and algorithms — one problem at a time.
          </p>
        </div>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>Practice</div>
          <FooterLink to="/arena/problemset">Problems</FooterLink>
          <FooterLink to="/arena/learn">Learn</FooterLink>
          <FooterLink to="/arena/study-plans">Study Plans</FooterLink>
        </div>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>Account</div>
          <FooterLink to="/login">Sign in</FooterLink>
          <FooterLink to="/signup">Start free</FooterLink>
        </div>
      </div>
      <div className="cl-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid var(--stroke)", fontSize: 12, flexWrap: "wrap", gap: 10 }}>
        <span>© {new Date().getFullYear()} CodingLemon. Crafted with curiosity.</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" className="cl-hit-24"
          style={{ gap: 6, color: "var(--text-mute)" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-mute)")}>
          <Icon name="github" size={13} /> Source on GitHub
        </a>
      </div>
    </footer>
  );
}
