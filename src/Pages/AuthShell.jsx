import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const { setUser } = useUser();
  const loginMut = useLoginMutation();
  const registerMut = useRegisterMutation();
  const isPending = loginMut.isLoading || registerMut.isLoading;

  const onAuthSuccess = (data) => {
    localStorage.setItem("jwtToken", data.jwtToken);
    getMe().then((me) => { setUser(me); navigate("/arena/problemset"); }).catch(() => navigate("/arena/problemset"));
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
    <div className="cl-page" style={{ display: "flex", minHeight: "100vh" }}>
      {toast && <Toast message={toast} state="failure" onClose={() => setToast(null)} />}

      <aside style={{
        flex: "1 1 45%",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "40px 48px",
        background: "linear-gradient(165deg, rgba(34,211,238,.06), transparent 50%), linear-gradient(345deg, rgba(255,225,64,.05), transparent 50%)",
        borderRight: "1px solid var(--stroke)",
        position: "relative", overflow: "hidden"
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

      <main style={{ flex: "1 1 55%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="cl-eyebrow" style={{ marginBottom: 10 }}>{mode === "login" ? "welcome back" : "new here"}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 10px" }}>
            {mode === "login" ? "Sign in to continue." : "Create your account."}
          </h1>
          <p className="cl-text-dim" style={{ fontSize: 14, marginBottom: 28 }}>
            {mode === "login" ? "Pick up where you left off — your streak is waiting." : "Free forever for the core problem set. No card needed."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            <button type="button" className="cl-btn cl-btn-ghost" style={{ height: 40, gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.8-.25.8-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.55-.3-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.3-.52-1.47.1-3.06 0 0 .97-.3 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.48 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.06.73.8 1.18 1.83 1.18 3.1 0 4.4-2.7 5.37-5.27 5.65.41.36.78 1.06.78 2.15v3.18c0 .31.22.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
              GitHub
            </button>
            <button type="button" className="cl-btn cl-btn-ghost" style={{ height: 40, gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1z" /><path fill="#34A853" d="M12 23c2.9 0 5.3-1 7.1-2.6l-3.5-2.8c-1 .7-2.2 1-3.6 1a6.2 6.2 0 0 1-5.8-4.3H2.5v2.9A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M6.2 14.3a6.6 6.6 0 0 1 0-4.2V7.2H2.5a11 11 0 0 0 0 9.9l3.7-2.8z" /><path fill="#EA4335" d="M12 5.4a6 6 0 0 1 4.2 1.6l3.1-3A11 11 0 0 0 12 1a11 11 0 0 0-9.5 5.4l3.7 2.9A6.2 6.2 0 0 1 12 5.4z" /></svg>
              Google
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 24px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--stroke)" }} />
            <span className="cl-mono" style={{ fontSize: 10, color: "var(--text-mute)", letterSpacing: ".2em" }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: "var(--stroke)" }} />
          </div>

          <form style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={submit}>
            {mode === "signup" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="cl-field">
                  <label className="cl-field-label">First name</label>
                  <input className="cl-input" placeholder="John" value={fields.firstName} onChange={set("firstName")} />
                </div>
                <div className="cl-field">
                  <label className="cl-field-label">Last name</label>
                  <input className="cl-input" placeholder="Doe" value={fields.lastName} onChange={set("lastName")} />
                </div>
              </div>
            )}
            <div className="cl-field">
              <label className="cl-field-label">Username</label>
              <div className="cl-input-wrap">
                <span className="cl-icon-l"><Icon name="user" size={15} /></span>
                <input className="cl-input" type="text" placeholder="john_doe" value={fields.username} onChange={set("username")} />
              </div>
            </div>
            {mode === "signup" && (
              <div className="cl-field">
                <label className="cl-field-label">Email</label>
                <div className="cl-input-wrap">
                  <span className="cl-icon-l"><Icon name="mail" size={15} /></span>
                  <input className="cl-input" type="email" placeholder="john@example.com" value={fields.email} onChange={set("email")} />
                </div>
              </div>
            )}
            <div className="cl-field">
              <label className="cl-field-label" style={{ display: "flex", justifyContent: "space-between" }}>
                Password
                {mode === "login" && <a href="#" style={{ color: "var(--cyan)", fontSize: 11 }}>Forgot?</a>}
              </label>
              <div className="cl-input-wrap">
                <span className="cl-icon-l"><Icon name="lock" size={15} /></span>
                <input className="cl-input" type={show ? "text" : "password"} placeholder="••••••••" value={fields.password} onChange={set("password")} />
                <span className="cl-icon-r" onClick={() => setShow((s) => !s)}>
                  <Icon name={show ? "eyeOff" : "eye"} size={15} />
                </span>
              </div>
            </div>
            {mode === "signup" && (
              <div className="cl-field">
                <label className="cl-field-label">Confirm password</label>
                <div className="cl-input-wrap">
                  <span className="cl-icon-l"><Icon name="lock" size={15} /></span>
                  <input className="cl-input" type={show2 ? "text" : "password"} placeholder="••••••••" value={fields.confirmPassword} onChange={set("confirmPassword")} />
                  <span className="cl-icon-r" onClick={() => setShow2((s) => !s)}>
                    <Icon name={show2 ? "eyeOff" : "eye"} size={15} />
                  </span>
                </div>
              </div>
            )}
            <button type="submit" className="cl-btn cl-btn-primary cl-btn-lg" style={{ marginTop: 8 }}>
              {mode === "login" ? "Sign in" : "Create account"} <Icon name="arrowRight" size={14} />
            </button>
          </form>

          <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-dim)", textAlign: "center" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Link to={mode === "login" ? "/signup" : "/login"} style={{ color: "var(--cyan)" }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthShell;
