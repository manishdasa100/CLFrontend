import BrandLogo from "./BrandLogo";

const FooterLink = ({ children }) => (
  <a href="#" style={{ display: "block", fontSize: 13, color: "var(--text-dim)", padding: "4px 0" }}
    onMouseOver={(e) => (e.currentTarget.style.color = "var(--text)")}
    onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-dim)")}>
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--stroke)", marginTop: 80, padding: "40px 0", color: "var(--text-mute)" }}>
      <div className="cl-container" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
        <div>
          <BrandLogo />
          <p style={{ marginTop: 12, fontSize: 13, maxWidth: 300, lineHeight: 1.55 }}>
            Practice coding and ship better code. Thoughtfully crafted problems for every level.
          </p>
        </div>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>Product</div>
          <FooterLink>Arena</FooterLink><FooterLink>Learn</FooterLink><FooterLink>Contests</FooterLink><FooterLink>Pricing</FooterLink>
        </div>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>Resources</div>
          <FooterLink>Docs</FooterLink><FooterLink>Community</FooterLink><FooterLink>Changelog</FooterLink>
        </div>
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>Company</div>
          <FooterLink>About</FooterLink><FooterLink>Blog</FooterLink><FooterLink>Careers</FooterLink>
        </div>
      </div>
      <div className="cl-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid var(--stroke)", fontSize: 12 }}>
        <span>© 2026 CodingLemon. Crafted with curiosity.</span>
        <span className="cl-mono">v2.1.0 · all systems operational
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", marginLeft: 6, verticalAlign: "middle" }} />
        </span>
      </div>
    </footer>
  );
}
