import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const T = {
  bg:       "#F5F2EB",
  surface:  "#FDFAF4",
  card:     "#FFFFFF",
  border:   "#DDD8CC",
  text:     "#2A2518",
  textMd:   "#5C5647",
  textSm:   "#8C8578",
  green:    "#3A7D44",
  greenLt:  "#EAF3DE",
  coral:    "#C85A3A",
  coralLt:  "#FAEAE4",
};

export default function LoginPage({ onSwitch, onBack }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Lato', 'Georgia', sans-serif", padding: "1.5rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input:focus { border-color: ${T.green} !important; outline: none; }
        .auth-btn:hover { background: #2d6235 !important; }
        .home-btn:hover { background: #2d6235 !important; }
        .auth-link { color: ${T.green}; font-weight: 700; cursor: pointer; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
        
        /* Layout Container Split Configuration */
        .split-container {
          display: flex;
          width: 100%;
          max-width: 940px;
          background: ${T.card};
          border-radius: 20px;
          border: 1px solid ${T.border};
          box-shadow: 0 8px 40px rgba(42,37,24,0.08);
          overflow: hidden;
        }
        .left-panel {
          flex: 1;
          background: ${T.green};
          color: #ffffff;
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .right-panel {
          flex: 1.1;
          padding: 3rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #ffffff;
        }

        /* Decorative background shapes for left panel */
        .circle-decor-top {
          position: absolute;
          top: -100px; right: -50px;
          width: 300px; height: 300px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 50%;
          pointer-events: none;
        }
        .circle-decor-bottom {
          position: absolute;
          bottom: -80px; left: -60px;
          width: 220px; height: 220px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 50%;
          pointer-events: none;
        }

        /* Responsive Breakpoint */
        @media (max-width: 768px) {
          .split-container { flex-direction: column; max-width: 440px; }
          .left-panel { display: none; } /* Standard practice matching the registration template layout fallback */
          .right-panel { padding: 2.5rem 1.75rem; }
        }
      `}</style>

      <div className="split-container">
        
        {/* Left Marketing Panel */}
        <div className="left-panel">
          <div className="circle-decor-top"></div>
          <div className="circle-decor-bottom"></div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3.5rem", zIndex: 1 }}>
            <img 
  src="/logo.png" 
  alt="Verdant Logo" 
  style={{ width: 54, height: 54, objectFit: "contain" }} 
/>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: 1 }}>Verdant</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Expense Tracker</div>
            </div>
          </div>

          <div style={{ zIndex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Take control of your finances
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, marginBottom: "2rem" }}>
              Join Verdant and get a calm, clear picture of where your money goes — for free, forever.
            </p>

            {/* Bullet points */}
              {[
                "Track expenses across multi smart categories",
                "Visual charts updated in real time",
                "Secure, private — only you see your data",
                "Free forever, no credit card needed",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{item}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="right-panel">
          
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32, fontWeight: 600, color: T.text, letterSpacing: "-0.5px", marginBottom: "4px"
            }}>
              Welcome back
            </h2>
            <div style={{ fontSize: 14, color: T.textMd }}>
              Get started — it only takes a minute
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            {error && (
              <div style={{
                background: T.coralLt, border: `1px solid ${T.coral}`,
                borderRadius: 9, padding: "10px 14px", marginBottom: "1.25rem",
                fontSize: 13, color: T.coral, fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                className="auth-input"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: "100%", height: 44, border: `1px solid ${T.border}`,
                  borderRadius: 9, padding: "0 14px", fontSize: 14,
                  color: T.text, background: T.surface, transition: "border 0.15s",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%", height: 44, border: `1px solid ${T.border}`,
                  borderRadius: 9, padding: "0 14px", fontSize: 14,
                  color: T.text, background: T.surface, transition: "border 0.15s",
                }}
              />
            </div>

            {/* Submit Action Button */}
            <button
              className="auth-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: 46, background: T.green, color: "#fff",
                border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1, transition: "background 0.15s",
                marginBottom: "1.25rem"
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {/* Alternating Route Switcher */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: 14, color: T.textMd }}>
              Don't have an account?{" "}
              <span className="auth-link" onClick={onSwitch}>Create one</span>
            </div>

            {/* Relocated Home / Back Navigation Link */}
            {onBack && (
              <button 
                type="button" 
                className="home-btn" 
                onClick={onBack} 
                style={{
                  width: "100%", height: 34, background: T.green, color: "#fff",
                  border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", transition: "background 0.15s",
                }}
              >
                Home
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}