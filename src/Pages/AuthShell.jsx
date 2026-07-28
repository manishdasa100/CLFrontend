import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import BrandLogo from "../Components/BrandLogo";
import Icon from "../Components/Icon";
import Toast from "../Components/Toast";
import { useLoginMutation, useRegisterMutation } from "../services/queries";
import { getMe } from "../services/api";
import { useUser } from "../context/UserContext";

function AuthShell({ mode }) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [fields, setFields] = useState({ firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "" });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { setUser } = useUser();
  const loginMut = useLoginMutation();
  const registerMut = useRegisterMutation();
  const isPending = loginMut.isLoading || registerMut.isLoading;

  // Where the visitor was headed before they landed here, and why. ProtectedRoute
  // passes this as router state; the 401 interceptor can't (it hard-reloads), so it
  // passes the same thing as query params instead.
  const REASONS = { expired: "Your session expired. Sign in to pick up where you left off." };
  const from = location.state?.from?.pathname || searchParams.get("next") || "/arena/problemset";
  const reason = location.state?.reason || REASONS[searchParams.get("reason")];

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setToast(decodeURIComponent(err));
  }, []);

  const onAuthSuccess = (data) => {
    localStorage.setItem("jwtToken", data.jwtToken);
    getMe().then((me) => { setUser(me); navigate(from); }).catch(() => navigate(from));
  };

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!fields.firstName.trim())       return setToast("First name is required.");
      if (!fields.lastName.trim())        return setToast("Last name is required.");
      if (!fields.username.trim())        return setToast("Username is required.");
      if (!fields.email.trim())           return setToast("Email is required.");
      if (!fields.password)               return setToast("Password is required.");
      if (!fields.confirmPassword)        return setToast("Please confirm your password.");
      if (fields.password !== fields.confirmPassword) return setToast("Passwords do not match.");

      registerMut.mutate(
        { username: fields.username, firstName: fields.firstName, lastName: fields.lastName, email: fields.email, password: fields.password },
        {
          onSuccess: onAuthSuccess,
          onError: (err) => setToast(err?.response?.data?.message || "Registration failed. Please try again."),
        }
      );
    } else {
      if (!fields.username.trim()) return setToast("Username is required.");
      if (!fields.password)        return setToast("Password is required.");

      loginMut.mutate(
        { username: fields.username, password: fields.password },
        {
          onSuccess: onAuthSuccess,
          onError: (err) => setToast(err?.response?.data?.message || "Invalid username or password."),
        }
      );
    }
  };

  return (
    <div className="cl-page cl-auth-shell">
      {toast && <Toast message={toast} state="failure" onClose={() => setToast(null)} />}

      <aside className="cl-auth-aside" style={{
        background: "linear-gradient(165deg, rgba(34,211,238,.06), transparent 50%), linear-gradient(345deg, rgba(255,225,64,.05), transparent 50%)",
      }}>
        <BrandLogo />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div className="cl-lemon-hero" style={{ width: 260, height: 260, opacity: .9 }}>
            <div className="cl-lemon-leaf" style={{ width: 68, height: 42, top: -22, right: -6 }} />
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, marginBottom: 20, maxWidth: 400 }}>
          <blockquote style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.3, letterSpacing: "-0.015em", margin: 0, color: "var(--text)" }}>
            "Ten minutes a day on CodingLemon and my interviews stopped feeling like trapdoors."
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #22D3EE, #6EE7B7)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Priya S.</div>
              <div className="cl-mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>Senior SWE · Stripe</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="cl-auth-main">
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* The aside carries the brand on desktop; when it's hidden the form needs its own. */}
          <div className="cl-auth-brand" style={{ marginBottom: 28 }}><BrandLogo /></div>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>{mode === "login" ? "welcome back" : "new here"}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 10px" }}>
            {mode === "login" ? "Sign in to continue." : "Create your account."}
          </h1>
          <p className="cl-text-dim" style={{ fontSize: 14, marginBottom: reason ? 20 : 28 }}>
            {mode === "login" ? "Pick up where you left off — your streak is waiting." : "Free forever for the core problem set. No card needed."}
          </p>

          {reason && (
            <div style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "10px 13px", marginBottom: 24,
              background: "rgba(34,211,238,.08)", border: "1px solid rgba(34,211,238,.25)",
              borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--cyan-soft)"
            }}>
              <Icon name="lock" size={14} /> {reason}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            <a href="http://localhost:3000/oauth2/authorization/github" className="cl-btn cl-btn-ghost" style={{ height: 40, gap: 10, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.8-.25.8-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.55-.3-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.3-.52-1.47.1-3.06 0 0 .97-.3 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.48 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.06.73.8 1.18 1.83 1.18 3.1 0 4.4-2.7 5.37-5.27 5.65.41.36.78 1.06.78 2.15v3.18c0 .31.22.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
              GitHub
            </a>
            <a href="http://localhost:3000/oauth2/authorization/google" className="cl-btn cl-btn-ghost" style={{ height: 40, gap: 10, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1z" /><path fill="#34A853" d="M12 23c2.9 0 5.3-1 7.1-2.6l-3.5-2.8c-1 .7-2.2 1-3.6 1a6.2 6.2 0 0 1-5.8-4.3H2.5v2.9A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M6.2 14.3a6.6 6.6 0 0 1 0-4.2V7.2H2.5a11 11 0 0 0 0 9.9l3.7-2.8z" /><path fill="#EA4335" d="M12 5.4a6 6 0 0 1 4.2 1.6l3.1-3A11 11 0 0 0 12 1a11 11 0 0 0-9.5 5.4l3.7 2.9A6.2 6.2 0 0 1 12 5.4z" /></svg>
              Google
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--stroke)" }} />
            <span className="cl-mono" style={{ fontSize: 10, color: "var(--text-mute)", letterSpacing: ".2em" }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: "var(--stroke)" }} />
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={submit}>
            {mode === "signup" && (
              <div className="cl-auth-namerow">
                <div className="cl-field">
                  <label className="cl-field-label" htmlFor="firstName">First name</label>
                  <input id="firstName" name="firstName" autoComplete="given-name" className="cl-input" placeholder="John" value={fields.firstName} onChange={set("firstName")} />
                </div>
                <div className="cl-field">
                  <label className="cl-field-label" htmlFor="lastName">Last name</label>
                  <input id="lastName" name="lastName" autoComplete="family-name" className="cl-input" placeholder="Doe" value={fields.lastName} onChange={set("lastName")} />
                </div>
              </div>
            )}
            <div className="cl-field">
              <label className="cl-field-label" htmlFor="username">Username</label>
              <div className="cl-input-wrap">
                <span className="cl-icon-l"><Icon name="user" size={15} /></span>
                <input id="username" name="username" autoComplete="username" className="cl-input" type="text" placeholder="john_doe" value={fields.username} onChange={set("username")} />
              </div>
            </div>
            {mode === "signup" && (
              <div className="cl-field">
                <label className="cl-field-label" htmlFor="email">Email</label>
                <div className="cl-input-wrap">
                  <span className="cl-icon-l"><Icon name="mail" size={15} /></span>
                  <input id="email" name="email" autoComplete="email" className="cl-input" type="email" placeholder="john@example.com" value={fields.email} onChange={set("email")} />
                </div>
              </div>
            )}
            <div className="cl-field">
              <label className="cl-field-label" htmlFor="password">Password</label>
              <div className="cl-input-wrap">
                <span className="cl-icon-l"><Icon name="lock" size={15} /></span>
                <input id="password" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className="cl-input" type={show ? "text" : "password"} placeholder="••••••••" value={fields.password} onChange={set("password")} />
                <button type="button" className="cl-icon-r" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} aria-controls="password" onClick={() => setShow((s) => !s)}>
                  <Icon name={show ? "eyeOff" : "eye"} size={15} />
                </button>
              </div>
            </div>
            {mode === "signup" && (
              <div className="cl-field">
                <label className="cl-field-label" htmlFor="confirmPassword">Confirm password</label>
                <div className="cl-input-wrap">
                  <span className="cl-icon-l"><Icon name="lock" size={15} /></span>
                  <input id="confirmPassword" name="confirmPassword" autoComplete="new-password" className="cl-input" type={show2 ? "text" : "password"} placeholder="••••••••" value={fields.confirmPassword} onChange={set("confirmPassword")} />
                  <button type="button" className="cl-icon-r" aria-label={show2 ? "Hide password" : "Show password"} aria-pressed={show2} aria-controls="confirmPassword" onClick={() => setShow2((s) => !s)}>
                    <Icon name={show2 ? "eyeOff" : "eye"} size={15} />
                  </button>
                </div>
              </div>
            )}
            <button type="submit" className="cl-btn cl-btn-primary cl-btn-lg" style={{ marginTop: 8 }} disabled={isPending}>
              {isPending
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : <>{mode === "login" ? "Sign in" : "Create account"} <Icon name="arrowRight" size={14} /></>}
            </button>
          </form>

          <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-dim)", textAlign: "center" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Link to={mode === "login" ? "/signup" : "/login"} state={location.state} style={{ color: "var(--cyan)" }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthShell;
