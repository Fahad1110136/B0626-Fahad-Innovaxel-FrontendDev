import { useState, useEffect } from "react";

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
  greenDk:  "#2d6235",
  greenMd:  "#639922",
  sage:     "#7EA67A",
  sageLt:   "#E8F0E5",
  amber:    "#B07D2A",
  amberLt:  "#FAF0DC",
  teal:     "#2A7D6E",
  tealLt:   "#E0F5F1",
  coral:    "#C85A3A",
  coralLt:  "#FAEAE4",
  earth:    "#8B6B3D",
  earthLt:  "#F5EDE0",
};

// ── Icons ─────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", style: s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
    <path d={d} />
  </svg>
);

// ── Logo image component — replaces every leaf icon usage ─────
const LogoImg = ({ size = 20, style: s }) => (
  <img
    src="/logo.png"
    alt="Verdant logo"
    style={{ width: size, height: size, objectFit: "contain", display: "inline-block", ...s }}
  />
);

const ICONS = {
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chart:   "M18 20V10M12 20V4M6 20v-6",
  wallet:  "M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4",
  check:   "M20 6L9 17l-5-5",
  arrow:   "M5 12h14M12 5l7 7-7 7",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  pie:     "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  filter:  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

// ── Animated counter ──────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ── Feature card ──────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, bg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? bg : T.card,
        border: `1px solid ${hovered ? color + "44" : T.border}`,
        borderRadius: 16, padding: "1.75rem",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 32px ${color}22` : "0 2px 8px rgba(42,37,24,0.05)",
        cursor: "default",
      }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
        <Icon d={icon} size={22} color={color} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: "0.5rem", fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</div>
      <div style={{ fontSize: 14, color: T.textMd, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Lato', 'Georgia', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .nav-btn-ghost:hover {
          background: rgba(255,255,255,0.15) !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.4) !important;
        }
        .cta-primary:hover   { background: ${T.greenDk} !important; transform: translateY(-2px); box-shadow: 0 8px 24px ${T.green}44 !important; }
        .cta-secondary:hover { background: ${T.greenLt} !important; border-color: ${T.green} !important; color: ${T.green} !important; transform: translateY(-2px); }
        .footer-link:hover   { color: ${T.green} !important; }
        .nav-link-item:hover { color: rgba(255,255,255,1) !important; }
        @media (max-width: 768px) {
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
          .feat-grid   { grid-template-columns: 1fr !important; }
          .cta-row     { flex-direction: column !important; }
          .nav-links   { display: none !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: T.green,
        backdropFilter: "none",
        borderBottom: `1px solid ${T.greenDk}`,
        transition: "all 0.3s ease",
        padding: "0 2rem",
        boxShadow: "0 2px 16px rgba(42,37,24,0.18)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoImg size={46} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1 }}>Verdant</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pocket Expense Tracker</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Features", "How it works", "About"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="nav-link-item"
                style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", textDecoration: "none", fontWeight: 600, transition: "color 0.15s" }}>
                {l}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="nav-btn-ghost" onClick={onLogin} style={{
              height: 38, padding: "0 18px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.35)",
              background: "transparent",
              fontSize: 14, fontWeight: 700, color: "#fff", transition: "all 0.2s", cursor: "pointer",
            }}>Sign In</button>
            <button onClick={onSignup} style={{
              height: 38, padding: "0 18px", borderRadius: 9,
              border: "none", background: "#fff",
              fontSize: 14, fontWeight: 700, color: T.green, transition: "all 0.2s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.greenLt; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "6rem 2rem 4rem", textAlign: "center" }}>
        <div style={{ animation: "heroIn 0.7s ease both" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: T.greenLt, border: `1px solid ${T.green}33`,
            borderRadius: 100, padding: "5px 14px", marginBottom: "1.5rem",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Your finances, finally clear
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.6rem, 5vw, 4rem)",
            fontWeight: 700, color: T.text,
            lineHeight: 1.15, letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}>
            Track every rupee,{" "}
            <span style={{ color: T.green, fontStyle: "italic" }}>grow</span>{" "}
            your saving.
          </h1>

          <p style={{ fontSize: 18, color: T.textMd, lineHeight: 1.7, marginBottom: "2.25rem", maxWidth: 520, margin: "0 auto 2.25rem" }}>
            Verdant gives you a calm, beautiful view of where your money goes —
            with smart categories, instant charts, and zero clutter.
          </p>

          {/* CTA buttons */}
          <div className="cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="cta-primary" onClick={onSignup} style={{
              height: 52, padding: "0 32px", borderRadius: 12,
              background: T.green, color: "#fff", border: "none",
              fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s", cursor: "pointer", boxShadow: `0 4px 16px ${T.green}33`,
            }}>
              Start for free
              <Icon d={ICONS.arrow} size={16} color="#fff" />
            </button>
            <button className="cta-secondary" onClick={onLogin} style={{
              height: 52, padding: "0 28px", borderRadius: 12,
              background: "transparent", color: T.textMd,
              border: `1px solid ${T.border}`, fontSize: 16, fontWeight: 700,
              transition: "all 0.2s", cursor: "pointer",
            }}>
              Sign in
            </button>
          </div>

          {/* Trust line */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "1.75rem", justifyContent: "center" }}>
            <Icon d={ICONS.shield} size={14} color={T.textSm} />
            <span style={{ fontSize: 12, color: T.textSm }}>No credit card required · Data encrypted · Free forever</span>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
<section style={{ background: T.green, borderTop: `1px solid ${T.greenDk}`, borderBottom: `1px solid ${T.greenDk}`, padding: "2.5rem 2rem" }}>
  <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center", justifyItems: "center" }}>
    {[
      { num: 100, suffix: "%",  label: "Data privacy — yours only" },
      { num: 0,   suffix: " ₨", label: "Cost to use, forever" },
      { num: 24,  suffix: "/7", label: "Access from any device" },
    ].map((s, i) => (
      <div key={i}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#fff" }}>
          <Counter to={s.num} suffix={s.suffix} duration={1500} />
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{s.label}</div>
      </div>
    ))}
  </div>
</section>

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>What Verdant does</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>
            Everything you need, nothing you don't
          </h2>
        </div>

        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          <FeatureCard icon={ICONS.wallet}  color={T.green}  bg={T.greenLt}  title="Add & manage expenses"   desc="Log any expense in seconds — title, amount, category, date, and optional notes. Edit or delete any time." />
          <FeatureCard icon={ICONS.filter}  color={T.teal}   bg={T.tealLt}   title="Smart filtering"         desc="Filter by category, date range, or keyword. Find any expense instantly across your full history." />
          <FeatureCard icon={ICONS.pie}     color={T.amber}  bg={T.amberLt}  title="Visual summaries"        desc="Pie charts and bar graphs show exactly where your money goes — by category and by month." />
          <FeatureCard icon={ICONS.tag}     color={T.coral}  bg={T.coralLt}  title="8 smart categories"      desc="Food, Transport, Utilities, Health, Entertainment, Shopping, Education, and Other — colour-coded throughout." />
          <FeatureCard icon={ICONS.lock}    color={T.earth}  bg={T.earthLt}  title="Secure & private"        desc="Your data lives in your account only. JWT-protected, bcrypt-hashed passwords, MongoDB cloud storage." />
          <FeatureCard icon={ICONS.users}   color={T.sage}   bg={T.sageLt}   title="Your account, your data" desc="Every user sees only their own expenses. Register, log in, and your data follows you everywhere." />
        </div>
      </section>

      <section style={{ background: T.green, borderTop: `1px solid ${T.greenDk}`, borderBottom: `1px solid ${T.greenDk}`, padding: "2.5rem 2rem" }}>
  <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center", justifyItems: "center" }}>
   
  </div>
</section>


      {/* ── How it works ── */}
      <section id="how-it-works" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>How it works</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>
              Up and running in under a minute
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { step: "01", title: "Create your free account", desc: "Sign up with your name, email, and a password. No credit card, no hidden steps.", color: T.green, bg: T.greenLt },
              { step: "02", title: "Log your first expense",   desc: "Hit 'Add Expense', fill in the details, pick a category, and save. Done in 10 seconds.", color: T.teal,  bg: T.tealLt  },
              { step: "03", title: "See your spending clearly", desc: "Switch to the Summary tab to see charts and breakdowns update in real time.", color: T.amber,  bg: T.amberLt },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", padding: "2rem 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: s.bg, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: s.color }}>{s.step}</span>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', serif", marginBottom: "0.4rem" }}>{s.title}</div>
                  <div style={{ fontSize: 15, color: T.textMd, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

 <section style={{ background: T.green, borderTop: `1px solid ${T.greenDk}`, borderBottom: `1px solid ${T.greenDk}`, padding: "2.5rem 2rem" }}>
  <div className="stats-grid" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center", justifyItems: "center" }}>
   
  </div>
</section>



      {/* ── About ── */}
      <section id="about" style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: T.greenLt, borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
          <LogoImg size={46} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: T.text, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
          Built to be calm and honest
        </h2>
        <p style={{ fontSize: 16, color: T.textMd, lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
          Verdant was designed with one goal: give you a clear, stress-free picture of your personal finances.
          No subscriptions, no ads, no dark patterns. Just a quiet, well-made tool that respects your time and your data.
        </p>
      </section>

      {/* ── Final CTA banner ── */}
      <section style={{ padding: "0 2rem 5rem" }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          background: `linear-gradient(135deg, ${T.green} 0%, #2d6e3a 100%)`,
          borderRadius: 24, padding: "3.5rem 2rem", textAlign: "center",
          boxShadow: `0 16px 48px ${T.green}44`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -60, right: -40, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", bottom: -50, left: -20, pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#fff", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
              Ready to take control?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: "2rem" }}>
              Join Verdant today — free, private, and built for clarity.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={onSignup} style={{
                height: 50, padding: "0 32px", borderRadius: 12,
                background: "#fff", color: T.green, border: "none",
                fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.greenLt; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                Create free account
              </button>
              <button onClick={onLogin} style={{
                height: 50, padding: "0 24px", borderRadius: 12,
                background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.4)", fontSize: 15, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
<footer style={{ borderTop: `1px solid ${T.border}`, padding: "2rem", background: T.surface }}>
  <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <LogoImg size={42} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: T.text }}>Verdant</span>
      <span style={{ fontSize: 13, color: T.textSm }}> - Expense Tracker</span>
    </div>
    <div style={{ fontSize: 13, color: T.textSm }}>
      Built with care - Your data stays yours
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      {["Sign in", "Create account"].map(l => (
        <span key={l}
          onClick={l === "Sign in" ? onLogin : onSignup}
          style={{
            fontSize: 13, color: "#fff", cursor: "pointer",
            background: T.green, padding: "6px 14px",
            borderRadius: 8, fontWeight: 700,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = T.greenDk}
          onMouseLeave={e => e.currentTarget.style.background = T.green}>
          {l}
        </span>
      ))}
    </div>
  </div>
</footer>
    </div>
  );
}