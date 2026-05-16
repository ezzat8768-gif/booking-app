"use client";
import { useState, useEffect } from "react";

type Booking = {
  id: number;
  ref: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes: string;
  created_at: string;
};

const servicePrices: Record<string, number> = {
  "استشارة عامة": 150,
  "فحص شامل": 300,
  "متابعة دورية": 100,
  "جلسة علاجية": 200,
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminPass, setAdminPass] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "stats" | "settings" | "design">("bookings");
  const [filterDate, setFilterDate] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [siteSettings, setSiteSettings] = useState({
    bgColor1: "#0a0a1a",
    bgColor2: "#0d1f3c",
    accentColor: "#6366f1",
    clinicName: "نظام حجز المواعيد",
    clinicSubtitle: "احجز موعدك بسهولة وسرعة",
  });
  const [settingsMsg, setSettingsMsg] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch { setBookings([]); }
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (!data.error) setSiteSettings(prev => ({ ...prev, ...data }));
    } catch {}
  };

  useEffect(() => {
    if (adminOpen) { fetchBookings(); fetchSettings(); }
  }, [adminOpen]);

  const openAdmin = () => {
    if (adminPass === "admin123") { setAdminOpen(true); setAdminPass(""); }
    else alert("كلمة السر غلط!");
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      if (res.ok) setSettingsMsg("✅ تم حفظ الإعدادات!");
      else setSettingsMsg("❌ حصل خطأ!");
    } catch { setSettingsMsg("❌ حصل خطأ!"); }
    setTimeout(() => setSettingsMsg(""), 3000);
  };

  const changePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) { setPassMsg("❌ اكمل كل الحقول!"); return; }
    if (newPass !== confirmPass) { setPassMsg("❌ كلمة السر مش متطابقة!"); return; }
    if (newPass.length < 6) { setPassMsg("❌ لازم تكون 6 أحرف على الأقل!"); return; }
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) setPassMsg("❌ " + data.error);
      else { setPassMsg("✅ تم تغيير كلمة السر!"); setOldPass(""); setNewPass(""); setConfirmPass(""); }
    } catch { setPassMsg("❌ حصل خطأ!"); }
  };

  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().slice(0, 7);
  const todayBookings = bookings.filter(b => b.date === today);
  const monthBookings = bookings.filter(b => b.date?.startsWith(thisMonth));
  const getPrice = (service: string) => servicePrices[service] || 0;
  const todayRevenue = todayBookings.reduce((sum, b) => sum + getPrice(b.service), 0);
  const monthRevenue = monthBookings.reduce((sum, b) => sum + getPrice(b.service), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + getPrice(b.service), 0);
  const filteredBookings = filterDate ? bookings.filter(b => b.date === filterDate) : bookings;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const exportToCSV = () => {
    const headers = ["رقم الحجز", "الاسم", "التليفون", "الخدمة", "التاريخ", "الوقت", "السعر", "ملاحظات"];
    const rows = bookings.map(b => [b.ref, b.name, b.phone, b.service, b.date, b.time, getPrice(b.service), b.notes || ""]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `حجوزات-${today}.csv`; a.click();
  };

  const tabStyle = (tab: string) => ({
    padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer",
    fontFamily: "Cairo", fontWeight: 700, fontSize: 13,
    background: activeTab === tab ? "#6366f1" : "rgba(255,255,255,0.08)", color: "#fff",
  });

  const presetColors = [
    { name: "بنفسجي", bg1: "#0a0a1a", bg2: "#0d1f3c", accent: "#6366f1" },
    { name: "أزرق", bg1: "#0a0f1a", bg2: "#0a1f3c", accent: "#3b82f6" },
    { name: "أخضر", bg1: "#0a1a0f", bg2: "#0d3c1f", accent: "#22c55e" },
    { name: "وردي", bg1: "#1a0a0f", bg2: "#3c0d1f", accent: "#ec4899" },
    { name: "برتقالي", bg1: "#1a0f0a", bg2: "#3c1f0d", accent: "#f97316" },
    { name: "فيروزي", bg1: "#0a1a1a", bg2: "#0d3c3c", accent: "#06b6d4" },
  ];

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a, #0d1f3c)", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <header style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 32px" }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>🔐 لوحة إدارة الحجوزات</h1>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {!adminOpen ? (
          <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
            <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 24 }}>لوحة الإدارة</h2>
            <input type="password" placeholder="كلمة السر" value={adminPass}
              onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === "Enter" && openAdmin()}
              style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", marginBottom: 16, textAlign: "center", outline: "none" }} />
            <button onClick={openAdmin}
              style={{ width: "100%", padding: "14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
              دخول
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ color: "#fff", fontSize: 22, margin: 0 }}>📊 لوحة التحكم</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={exportToCSV} style={{ padding: "8px 16px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo", fontWeight: 700, fontSize: 13 }}>📥 Excel</button>
                <button onClick={fetchBookings} style={{ padding: "8px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>🔄 تحديث</button>
                <button onClick={() => setAdminOpen(false)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>خروج</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "حجوزات اليوم", value: todayBookings.length, sub: `${todayRevenue} جنيه`, icon: "📅", color: "#6366f1" },
                { label: "حجوزات الشهر", value: monthBookings.length, sub: `${monthRevenue} جنيه`, icon: "📆", color: "#8b5cf6" },
                { label: "إجمالي الحجوزات", value: bookings.length, sub: `${totalRevenue} جنيه`, icon: "💰", color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}30`, borderRadius: 16, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 14, fontWeight: 700 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: 16 }}>📈 آخر 7 أيام</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                {last7Days.map(day => {
                  const count = bookings.filter(b => b.date === day).length;
                  const maxCount = Math.max(...last7Days.map(d => bookings.filter(b => b.date === d).length), 1);
                  const height = (count / maxCount) * 80 + 10;
                  return (
                    <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{count}</div>
                      <div style={{ width: "100%", height, background: day === today ? "#6366f1" : "#1e3a5f", borderRadius: 4 }} />
                      <div style={{ fontSize: 10, color: day === today ? "#6366f1" : "rgba(255,255,255,0.3)" }}>
                        {new Date(day).toLocaleDateString("ar-EG", { weekday: "short" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <button style={tabStyle("bookings")} onClick={() => setActiveTab("bookings")}>📋 الحجوزات</button>
              <button style={tabStyle("stats")} onClick={() => setActiveTab("stats")}>📊 الإيرادات</button>
              <button style={tabStyle("design")} onClick={() => setActiveTab("design")}>🎨 تصميم الموقع</button>
              <button style={tabStyle("settings")} onClick={() => setActiveTab("settings")}>⚙️ الإعدادات</button>
            </div>

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                  <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>فلتر:</label>
                  <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontFamily: "Cairo" }} />
                  {filterDate && <button onClick={() => setFilterDate("")} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>مسح</button>}
                </div>
                {loading ? <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: 40 }}>جاري التحميل...</div>
                  : filteredBookings.length === 0 ? <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}><div style={{ fontSize: 48 }}>📭</div><p>لا توجد حجوزات</p></div>
                  : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredBookings.map(b => (
                      <div key={b.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div>
                            <p style={{ color: "#22c55e", fontWeight: 900, margin: "0 0 4px", fontSize: 13 }}>🔖 {b.ref}</p>
                            <p style={{ color: "#fff", fontWeight: 700, margin: "0 0 4px", fontSize: 16 }}>👤 {b.name}</p>
                            <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 4px", fontSize: 13 }}>📞 {b.phone}</p>
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <p style={{ color: "#6366f1", fontWeight: 700, margin: "0 0 4px" }}>🛎 {b.service}</p>
                            <p style={{ color: "#22c55e", fontWeight: 900, margin: "0 0 4px" }}>💰 {getPrice(b.service)} جنيه</p>
                            <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 13 }}>📅 {b.date} | 🕐 {b.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>}
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 18 }}>💰 تفاصيل الإيرادات</h3>
                {Object.keys(servicePrices).map(service => {
                  const count = bookings.filter(b => b.service === service).length;
                  return (
                    <div key={service} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: "#fff" }}>{service}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{count} حجز</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>{count * servicePrices[service]} جنيه</span>
                    </div>
                  );
                })}
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                  {[
                    { label: "إيرادات اليوم", value: todayRevenue },
                    { label: "إيرادات الشهر", value: monthRevenue },
                    { label: "إجمالي الإيرادات", value: totalRevenue },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 8 : 0 }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{r.label}</span>
                      <span style={{ color: "#22c55e", fontWeight: 900, fontSize: i === 2 ? 22 : 18 }}>{r.value} جنيه</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === "design" && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: "#fff", margin: "0 0 24px", fontSize: 18 }}>🎨 تخصيص شكل الموقع</h3>

                {/* Preset Colors */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, display: "block", marginBottom: 12 }}>🎨 ألوان جاهزة</label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {presetColors.map((p, i) => (
                      <button key={i} onClick={() => setSiteSettings(prev => ({ ...prev, bgColor1: p.bg1, bgColor2: p.bg2, accentColor: p.accent }))}
                        style={{ padding: "10px 20px", borderRadius: 10, border: `2px solid ${p.accent}`, background: `linear-gradient(135deg, ${p.bg1}, ${p.bg2})`, color: "#fff", cursor: "pointer", fontFamily: "Cairo", fontWeight: 700, fontSize: 13 }}>
                        <span style={{ color: p.accent }}>●</span> {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "لون الخلفية 1", key: "bgColor1" },
                    { label: "لون الخلفية 2", key: "bgColor2" },
                    { label: "اللون الرئيسي", key: "accentColor" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="color" value={siteSettings[f.key as keyof typeof siteSettings]}
                          onChange={e => setSiteSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                          style={{ width: 48, height: 48, borderRadius: 10, border: "none", cursor: "pointer", background: "none" }} />
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{siteSettings[f.key as keyof typeof siteSettings]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clinic Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  {[
                    { label: "اسم الموقع", key: "clinicName", placeholder: "نظام حجز المواعيد" },
                    { label: "الوصف", key: "clinicSubtitle", placeholder: "احجز موعدك بسهولة" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type="text" placeholder={f.placeholder}
                        value={siteSettings[f.key as keyof typeof siteSettings]}
                        onChange={e => setSiteSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div style={{ background: `linear-gradient(135deg, ${siteSettings.bgColor1}, ${siteSettings.bgColor2})`, borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8 }}>معاينة</p>
                  <h3 style={{ color: "#fff", fontWeight: 900, margin: "0 0 4px" }}>{siteSettings.clinicName}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 12px" }}>{siteSettings.clinicSubtitle}</p>
                  <div style={{ display: "inline-block", padding: "8px 24px", background: siteSettings.accentColor, borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 14 }}>احجز الآن</div>
                </div>

                {settingsMsg && <div style={{ padding: 12, borderRadius: 8, background: settingsMsg.includes("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: settingsMsg.includes("✅") ? "#22c55e" : "#ef4444", fontSize: 14, marginBottom: 16 }}>{settingsMsg}</div>}
                <button onClick={saveSettings}
                  style={{ width: "100%", padding: "14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                  💾 حفظ التصميم
                </button>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 18 }}>⚙️ تغيير كلمة السر</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                  {[
                    { label: "كلمة السر القديمة", value: oldPass, set: setOldPass },
                    { label: "كلمة السر الجديدة", value: newPass, set: setNewPass },
                    { label: "تأكيد كلمة السر", value: confirmPass, set: setConfirmPass },
                  ].map((f, i) => (
                    <div key={i}>
                      <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type="password" value={f.value} onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                    </div>
                  ))}
                  {passMsg && <div style={{ padding: 12, borderRadius: 8, background: passMsg.includes("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: passMsg.includes("✅") ? "#22c55e" : "#ef4444", fontSize: 14 }}>{passMsg}</div>}
                  <button onClick={changePassword}
                    style={{ padding: "14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                    حفظ كلمة السر
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}