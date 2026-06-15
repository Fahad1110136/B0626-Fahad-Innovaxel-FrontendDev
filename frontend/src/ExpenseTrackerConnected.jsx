import { useState, useEffect, useMemo, useRef } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

// ── Theme tokens ──────────────────────────────────────────────
const T = {
  bg:        "#F5F2EB",
  surface:   "#FDFAF4",
  card:      "#FFFFFF",
  border:    "#DDD8CC",
  borderMd:  "#C8C2B4",
  text:      "#2A2518",
  textMd:    "#5C5647",
  textSm:    "#8C8578",
  green:     "#3A7D44",
  greenLt:   "#EAF3DE",
  greenDk:   "#2d6235",
  greenMd:   "#639922",
  sage:      "#7EA67A",
  sageLt:    "#E8F0E5",
  amber:     "#B07D2A",
  amberLt:   "#FAF0DC",
  teal:      "#2A7D6E",
  tealLt:    "#E0F5F1",
  coral:     "#C85A3A",
  coralLt:   "#FAEAE4",
  earth:     "#8B6B3D",
  earthLt:   "#F5EDE0",
  slate:     "#4A6B7A",
  slateLt:   "#E4EEF3",
  moss:      "#5C7A3A",
  mossLt:    "#EAF0E0",
};

const CATEGORIES = ["Food", "Transport", "Utilities", "Health", "Entertainment", "Shopping", "Education", "Other"];

const CAT_COLORS = {
  Food:          T.green,
  Transport:     T.teal,
  Utilities:     T.amber,
  Health:        T.coral,
  Entertainment: T.sage,
  Shopping:      T.earth,
  Education:     T.slate,
  Other:         T.textSm,
};

const CAT_BG = {
  Food:          T.greenLt,
  Transport:     T.tealLt,
  Utilities:     T.amberLt,
  Health:        T.coralLt,
  Entertainment: T.sageLt,
  Shopping:      T.earthLt,
  Education:     T.slateLt,
  Other:         "#F0EDE8",
};

// ── Icons ─────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

const Icons = {
  plus:   "M12 5v14M5 12h14",
  edit:   "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:  "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  x:      "M18 6L6 18M6 6l12 12",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  chart:  "M18 20V10M12 20V4M6 20v-6",
  wallet: "M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4",
  check:  "M20 6L9 17l-5-5",
  cal:    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  arrow:  "M19 12H5M12 5l-7 7 7 7",
  tag:    "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  leaf:   "M17 8C8 10 5.9 16.17 3.82 22c4.66-2.15 8.18-4.5 11.18-10 .86 1.86 2 3.5 2 5C17 20.17 13.17 22 9 22S1 20.17 1 17c0-2.5 1.5-4 3-5C5 10 8 8 11 8c-1.5 1-2.5 3-2.5 5C10 16 12 17 15 16.5",
  user:   "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

// ── Helpers ───────────────────────────────────────────────────
const fmt     = (n) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const today   = () => new Date().toISOString().split("T")[0];

// ── Main Component ────────────────────────────────────────────
export default function ExpenseTrackerConnected({ user, expenses, onAdd, onEdit, onDelete, onLogout, syncError }) {
  const [tab,            setTab]           = useState("expenses");
  const [modal,          setModal]         = useState(null);
  const [filters,        setFilters]       = useState({ category: "", dateFrom: "", dateTo: "", search: "" });
  const [dateRangeError, setDateRangeError] = useState("");
  const [toast,          setToast]         = useState(null);
  const [saving,         setSaving]        = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await onAdd(data);
      setModal(null);
      showToast("Expense added");
    } catch (err) {
      showToast(err.message || "Failed to add expense", "danger");
    } finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await onEdit(data);
      setModal(null);
      showToast("Expense updated");
    } catch (err) {
      showToast(err.message || "Failed to update expense", "danger");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      showToast("Expense deleted", "danger");
    } catch (err) {
      showToast(err.message || "Failed to delete", "danger");
    }
  };

  const filtered = useMemo(() => {
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) return [];
    return expenses
      .filter(e => {
        if (filters.category && e.category !== filters.category) return false;
        if (filters.dateFrom && e.date < filters.dateFrom) return false;
        if (filters.dateTo  && e.date > filters.dateTo)   return false;
        if (filters.search  && !e.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, filters]);

  const total   = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const catData = useMemo(() => {
    const m = {};
    filtered.forEach(e => { m[e.category] = (m[e.category] || 0) + e.amount; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const hasFilters = filters.category || filters.dateFrom || filters.dateTo || filters.search;
  const clearFilters = () => { setFilters({ category: "", dateFrom: "", dateTo: "", search: "" }); setDateRangeError(""); };
  const normalizeId  = (exp) => exp._id || exp.id;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Lato', 'Georgia', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        input, select, textarea { font-family: inherit; }
        button { font-family: inherit; cursor: pointer; }
        ::placeholder { color: ${T.textSm}; }
        @keyframes slideIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; }  to { opacity:1; } }
        @keyframes toastIn  { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        .row-enter          { animation: slideIn 0.25s ease; }
        .expense-row:hover  { background: ${T.greenLt} !important; }
        .tab-btn            { transition: all 0.2s; }
        .tab-btn:hover      { background: rgba(255,255,255,0.15) !important; }
        .action-btn:hover   { opacity:0.75; transform:scale(1.08); }
        .filter-pill        { transition: all 0.15s; }
        .filter-pill:hover  { border-color: ${T.green} !important; }
        .logout-btn:hover   { background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.4) !important; }
        @media (max-width:640px) {
          .desktop-only { display:none !important; }
          .summary-grid { grid-template-columns:1fr !important; }
          .chart-row    { flex-direction:column !important; }
        }
      `}</style>

      {/* ── HEADER — full green background ── */}
      <header style={{
        background: T.green,
        borderBottom: `1px solid ${T.greenDk}`,
        padding: "0 1.5rem",
        boxShadow: "0 2px 12px rgba(42,37,24,0.15)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo — image from public folder */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* CHANGE 1: logo.png from public folder */}
              <img
                src="/logo.png"
                alt="Verdant"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={e => {
                  // fallback to leaf icon if logo.png not found
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span style={{ display: "none", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                <Icon d={Icons.leaf} size={18} color="#fff" />
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>
                Verdant
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: -2 }}>
                Pocket Expense Tracker
              </div>
            </div>
          </div>

          {/* Tabs — Expenses & Summary */}
          <nav style={{ display: "flex", gap: 4 }}>
            {[{ id: "expenses", label: "Expenses", icon: Icons.wallet },
              { id: "summary",  label: "Summary",  icon: Icons.chart  }].map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                borderRadius: 8, border: "none",
                background: tab === t.id ? "rgba(255,255,255,0.2)" : "transparent",
                color: "#fff",
                fontWeight: tab === t.id ? 700 : 400, fontSize: 14,
              }}>
                <Icon d={t.icon} size={15} color="#fff" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* Right side: Add + User chip + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setModal("add")} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: "#fff", color: T.green, border: "none", borderRadius: 9,
              fontSize: 14, fontWeight: 700, transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.greenLt; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              <Icon d={Icons.plus} size={15} color={T.green} />
              <span className="desktop-only">Add Expense</span>
            </button>

            {/* User chip */}
            <div className="desktop-only" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 8, fontSize: 13, color: "#fff",
            }}>
              <Icon d={Icons.user} size={13} color="rgba(255,255,255,0.8)" />
              {user?.name?.split(" ")[0]}
            </div>

            {/* Logout button */}
            <button className="logout-btn" onClick={onLogout} title="Sign out" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34,
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 8, background: "transparent", color: "#fff",
              transition: "all 0.15s",
            }}>
              <Icon d={Icons.logout} size={14} color="#fff" />
            </button>
          </div>
        </div>
      </header>

      {/* Sync error banner */}
      {syncError && (
        <div style={{ background: T.coralLt, borderBottom: `1px solid ${T.coral}`, padding: "8px 1.5rem", fontSize: 13, color: T.coral, textAlign: "center" }}>
          ⚠ {syncError}
        </div>
      )}

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>

        {tab === "expenses" && (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
              <StatCard label="Total Shown"   value={fmt(total)}                                                    icon={Icons.wallet} color={T.green} bg={T.greenLt} />
              <StatCard label="Entries"       value={filtered.length}                                               icon={Icons.tag}    color={T.teal}  bg={T.tealLt}  />
              <StatCard label="Top Category"  value={catData[0]?.name || "—"}                                      icon={Icons.chart}  color={T.amber} bg={T.amberLt} />
              <StatCard label="Avg. per Entry" value={filtered.length ? fmt(Math.round(total / filtered.length)) : "—"} icon={Icons.leaf} color={T.earth} bg={T.earthLt} />
            </div>

            {/* Filters */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 180px" }}>
                  <Icon d={Icons.search} size={15} color={T.textSm} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                    placeholder="Search expenses…"
                    style={{ width: "100%", paddingLeft: 32, paddingRight: 10, height: 36, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, background: T.card, color: T.text, outline: "none" }} />
                </div>
                <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
                  style={{ height: 36, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, padding: "0 10px", background: T.card, color: filters.category ? T.text : T.textSm, outline: "none", flex: "0 0 auto" }}>
                  <option value="">All categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "0 0 auto" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="date" value={filters.dateFrom}
                      onChange={e => {
                        const val = e.target.value;
                        setFilters(p => ({ ...p, dateFrom: val }));
                        if (filters.dateTo && val > filters.dateTo) setDateRangeError("'From' date must be before 'To' date.");
                        else setDateRangeError("");
                      }}
                      style={{ height: 36, border: `1px solid ${filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo ? T.coral : T.border}`, borderRadius: 8, fontSize: 13, padding: "0 8px", background: T.card, color: T.text, outline: "none" }} />
                    <span style={{ color: T.textSm, fontSize: 12 }}>to</span>
                    <input type="date" value={filters.dateTo}
                      onChange={e => {
                        const val = e.target.value;
                        setFilters(p => ({ ...p, dateTo: val }));
                        if (filters.dateFrom && filters.dateFrom > val) setDateRangeError("'From' date must be before 'To' date.");
                        else setDateRangeError("");
                      }}
                      style={{ height: 36, border: `1px solid ${filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo ? T.coral : T.border}`, borderRadius: 8, fontSize: 13, padding: "0 8px", background: T.card, color: T.text, outline: "none" }} />
                  </div>
                  {dateRangeError && <div style={{ fontSize: 12, color: T.coral, fontWeight: 600 }}>⚠ {dateRangeError}</div>}
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="filter-pill" style={{
                    display: "flex", alignItems: "center", gap: 5, height: 34, padding: "0 12px",
                    border: `1px solid ${T.border}`, borderRadius: 8, background: "transparent", fontSize: 13, color: T.textMd,
                  }}>
                    <Icon d={Icons.x} size={13} color={T.textMd} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Expense list */}
            {filtered.length === 0 ? (
              <EmptyState onAdd={() => setModal("add")} hasFilters={!!hasFilters} onClear={clearFilters} />
            ) : (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                {/* CHANGE 3: Table header row — green background */}
                <div className="desktop-only" style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 110px 110px 90px",
                  gap: 0, padding: "10px 20px",
                  borderBottom: `1px solid ${T.greenDk}`,
                  background: T.green,
                }}>
                  {["Title", "Category", "Date", "Amount", ""].map((h, i) => (
                    <div key={i} style={{
                      fontSize: 11, fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      textAlign: i === 3 ? "right" : "left",
                    }}>{h}</div>
                  ))}
                </div>

                {filtered.map((exp, idx) => (
                  <ExpenseRow
                    key={normalizeId(exp)}
                    exp={exp} idx={idx} total={filtered.length}
                    onEdit={() => setModal(exp)}
                    onDelete={() => handleDelete(normalizeId(exp))}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "summary" && (
          <SummaryTab
            expenses={expenses} filtered={filtered} catData={catData} total={total}
            filters={filters} setFilters={setFilters} hasFilters={!!hasFilters} clearFilters={clearFilters}
          />
        )}
      </main>

      {/* Modal */}
      {modal && (
        <ExpenseModal
          expense={modal === "add" ? null : modal}
          onSave={modal === "add" ? handleAdd : handleEdit}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === "danger" ? T.coralLt : T.greenLt,
          border: `1px solid ${toast.type === "danger" ? T.coral : T.green}`,
          color:  toast.type === "danger" ? T.coral : T.green,
          padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
          animation: "toastIn 0.25s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}>
          <Icon d={toast.type === "danger" ? Icons.trash : Icons.check} size={15} color={toast.type === "danger" ? T.coral : T.green} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, color, bg }) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 12, padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <Icon d={icon} size={14} color={color} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</div>
    </div>
  );
}

// ── Expense row ───────────────────────────────────────────────
function ExpenseRow({ exp, idx, total, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="expense-row row-enter" style={{
        display: "grid", gridTemplateColumns: "1fr 120px 110px 110px 90px",
        gap: 0, padding: "12px 20px", alignItems: "center",
        borderBottom: idx < total - 1 ? `1px solid ${T.border}` : "none",
        cursor: "pointer", background: "transparent", transition: "background 0.15s",
      }} onClick={() => setExpanded(p => !p)}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{exp.title}</div>
          {exp.notes && <div style={{ fontSize: 12, color: T.textSm, marginTop: 2 }} className="desktop-only">{exp.notes}</div>}
        </div>
        <div className="desktop-only">
          <span style={{ background: CAT_BG[exp.category], color: CAT_COLORS[exp.category], fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap" }}>
            {exp.category}
          </span>
        </div>
        <div className="desktop-only" style={{ fontSize: 13, color: T.textMd }}>{fmtDate(exp.date)}</div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: T.text }}>{fmt(exp.amount)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }} onClick={e => e.stopPropagation()}>
          <button className="action-btn" onClick={onEdit} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
            <Icon d={Icons.edit} size={13} color={T.teal} />
          </button>
          <button className="action-btn" onClick={onDelete} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
            <Icon d={Icons.trash} size={13} color={T.coral} />
          </button>
        </div>
      </div>
      {expanded && exp.notes && (
        <div style={{ padding: "0 20px 12px", fontSize: 13, color: T.textMd, background: T.surface, borderBottom: idx < total - 1 ? `1px solid ${T.border}` : "none" }}>
          <span style={{ color: T.textSm }}>Notes: </span>{exp.notes}
        </div>
      )}
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ onAdd, hasFilters, onClear }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, background: T.greenLt, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon d={Icons.leaf} size={24} color={T.green} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>No expenses found</div>
      <div style={{ fontSize: 14, color: T.textMd, marginBottom: 20 }}>
        {hasFilters ? "Try adjusting your filters." : "Start tracking by adding your first expense."}
      </div>
      {hasFilters ? (
        <button onClick={onClear} style={{ padding: "8px 18px", background: T.greenLt, color: T.green, border: `1px solid ${T.green}33`, borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Clear filters</button>
      ) : (
        <button onClick={onAdd} style={{ padding: "8px 18px", background: T.green, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Add first expense</button>
      )}
    </div>
  );
}

// ── Summary tab ───────────────────────────────────────────────
function SummaryTab({ expenses, filtered, catData, total, filters, setFilters, hasFilters, clearFilters }) {
  const monthData = useMemo(() => {
    const m = {};
    filtered.forEach(e => {
      const mo = e.date.slice(0, 7);
      m[mo] = (m[mo] || 0) + e.amount;
    });
    return Object.entries(m).sort().map(([month, amount]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      amount,
    }));
  }, [filtered]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {hasFilters && (
        <div style={{ background: T.amberLt, border: `1px solid ${T.amber}33`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: T.amber }}>
          <span>Showing filtered data. <strong>{filtered.length}</strong> of <strong>{expenses.length}</strong> expenses.</span>
          <button onClick={clearFilters} style={{ background: "none", border: "none", fontSize: 13, color: T.amber, fontWeight: 700, cursor: "pointer" }}>Show all</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }} className="summary-grid">
        <StatCard label="Total Spent"    value={fmt(total)}                                                       icon={Icons.wallet} color={T.green} bg={T.greenLt} />
        <StatCard label="Categories"     value={catData.length}                                                   icon={Icons.tag}    color={T.teal}  bg={T.tealLt}  />
        <StatCard label="Expenses"       value={filtered.length}                                                  icon={Icons.chart}  color={T.amber} bg={T.amberLt} />
        <StatCard label="Highest Single" value={filtered.length ? fmt(Math.max(...filtered.map(e => e.amount))) : "—"} icon={Icons.arrow} color={T.coral} bg={T.coralLt} />
      </div>

      {catData.length === 0 ? (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: T.textMd, fontSize: 14 }}>
          No data to display. Add some expenses first.
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }} className="chart-row">
          <div style={{ flex: "1 1 340px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>Spending by Category</div>
            <div style={{ fontSize: 12, color: T.textSm, marginBottom: "1rem" }}>Share of total spend</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                  {catData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[entry.name] || T.textSm} strokeWidth={0} />)}
                </Pie>
                <ReTooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12, color: T.textMd }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 340px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4 }}>Spending by Month</div>
            <div style={{ fontSize: 12, color: T.textSm, marginBottom: "1rem" }}>Monthly spend over time</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} tickFormatter={v => `₨${(v / 1000).toFixed(0)}k`} />
                <ReTooltip formatter={(v) => fmt(v)} contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13 }} cursor={{ fill: T.greenLt }} />
                <Bar dataKey="amount" fill={T.green} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {catData.length > 0 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: T.text }}>Category Breakdown</div>
          </div>
          {catData.map((cat, i) => {
            const pct   = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
            const count = filtered.filter(e => e.category === cat.name).length;
            return (
              <div key={cat.name} style={{ padding: "12px 20px", borderBottom: i < catData.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: CAT_COLORS[cat.name] }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{cat.name}</span>
                    <span style={{ fontSize: 12, color: T.textSm }}>{count} {count === 1 ? "entry" : "entries"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: T.textSm }}>{pct}%</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: T.text }}>{fmt(cat.value)}</span>
                  </div>
                </div>
                <div style={{ background: T.border, borderRadius: 3, height: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: CAT_COLORS[cat.name], borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Expense modal ─────────────────────────────────────────────
function ExpenseModal({ expense, onSave, onClose, saving }) {
  const isEdit = !!expense;
  const [form, setForm] = useState({
    title:    expense?.title    || "",
    amount:   expense?.amount   || "",
    category: expense?.category || "Food",
    date:     expense?.date     || today(),
    notes:    expense?.notes    || "",
  });
  const [errors, setErrors] = useState({});
  const firstInput = useRef(null);

  useEffect(() => { setTimeout(() => firstInput.current?.focus(), 50); }, []);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid positive amount";
    if (!form.date) e.date = "Date is required";
    else if (form.date > today()) e.date = "Date cannot be in the future";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: Number(form.amount) };
    if (isEdit) payload._id = expense._id || expense.id;
    onSave(payload);
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>{label}</label>
      <input ref={key === "title" ? firstInput : undefined} type={type} value={form[key]} onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", height: 38, border: `1px solid ${errors[key] ? T.coral : T.border}`, borderRadius: 8, padding: "0 12px", fontSize: 14, color: T.text, background: T.card, outline: "none", transition: "border 0.15s" }}
        onFocus={e => e.target.style.borderColor = T.green}
        onBlur={e  => e.target.style.borderColor = errors[key] ? T.coral : T.border}
      />
      {errors[key] && <div style={{ fontSize: 12, color: T.coral, marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,37,24,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeIn 0.15s", padding: "1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: T.card, borderRadius: 16, width: "100%", maxWidth: 460, border: `1px solid ${T.border}`, animation: "slideIn 0.2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: T.text }}>
            {isEdit ? "Edit Expense" : "New Expense"}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon d={Icons.x} size={14} color={T.textMd} />
          </button>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {field("Title", "title", "text", "e.g. Dinner with friends")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1rem" }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>Amount (PKR)</label>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set("amount", e.target.value)}
                placeholder="e.g. 2200"
                style={{ width: "100%", height: 38, border: `1px solid ${errors.amount ? T.coral : T.border}`, borderRadius: 8, padding: "0 12px", fontSize: 14, color: T.text, background: T.card, outline: "none" }}
                onFocus={e => e.target.style.borderColor = T.green}
                onBlur={e  => e.target.style.borderColor = errors.amount ? T.coral : T.border} />
              {errors.amount && <div style={{ fontSize: 12, color: T.coral, marginTop: 4 }}>{errors.amount}</div>}
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>Date</label>
              <input type="date" value={form.date} max={today()} onChange={e => set("date", e.target.value)}
                style={{ width: "100%", height: 38, border: `1px solid ${errors.date ? T.coral : T.border}`, borderRadius: 8, padding: "0 12px", fontSize: 14, color: T.text, background: T.card, outline: "none" }}
                onFocus={e => e.target.style.borderColor = T.green}
                onBlur={e  => e.target.style.borderColor = errors.date ? T.coral : T.border} />
              {errors.date && <div style={{ fontSize: 12, color: T.coral, marginTop: 4 }}>{errors.date}</div>}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>Category</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => set("category", c)} style={{
                  padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                  border: `1px solid ${form.category === c ? CAT_COLORS[c] : T.border}`,
                  background: form.category === c ? CAT_BG[c] : "transparent",
                  color: form.category === c ? CAT_COLORS[c] : T.textMd,
                  transition: "all 0.12s", cursor: "pointer",
                }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.textMd, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 5 }}>
              Notes <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: T.textSm }}>(optional)</span>
            </label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2}
              placeholder="Any extra details…"
              style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, color: T.text, background: T.card, outline: "none", resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = T.green}
              onBlur={e  => e.target.style.borderColor = T.border} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, height: 40, border: `1px solid ${T.border}`, borderRadius: 9, background: "transparent", fontSize: 14, fontWeight: 700, color: T.textMd, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={submit} disabled={saving} style={{ flex: 2, height: 40, border: "none", borderRadius: 9, background: saving ? T.greenMd : T.green, fontSize: 14, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1, transition: "background 0.15s" }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = T.greenDk; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = T.green; }}>
              {saving ? "Saving…" : (isEdit ? "Save Changes" : "Add Expense")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}