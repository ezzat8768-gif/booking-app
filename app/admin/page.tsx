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
  const [activeTab, setActiveTab] = useState<"bookings" | "stats" | "settings">("bookings");
  const [filterDate, setFilterDate] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (adminOpen) fetchBookings();
  }, [adminOpen]);

  const openAdmin = () => {
    if (adminPass === "admin123" || adminPass === currentPassword) {
      setAdminOpen(true);
      setCurrentPassword(adminPass);
      setAdminPass("");
    } else {
      alert("كلمة السر غلط!");
    }
  };

  const changePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      setPassMsg("❌ اكمل كل الحقول!");
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg("❌ كلمة السر الجديدة مش متطابقة!");
      return;
    }
    if (newPass.length < 6) {
      setPassMsg("❌ كلمة السر لازم تكون 6 أحرف على الأقل!");
      return;
    }
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassMsg("❌ " + data.error);
      } else {
        setPassMsg("✅ تم تغيير كلمة السر بنجاح!");
        setCurrentPassword(newPass);
        setOldPass(""); setNewPass(""); setConfirmPass("");
      }
    } catch {
      setPassMsg("❌ حصل خطأ!");
    }
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
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const exportToCSV = () => {
    const headers = ["رقم الحجز", "الاسم", "التليفون", "الخدمة", "التاريخ", "الوقت", "السعر", "ملاحظات"];
    const rows = bookings.map(b => [b.ref, b.name, b.phone, b.service, b.date, b.time, getPrice(b.service), b.notes || ""]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `حجوزات-${today}.csv`;
    a.click();
  };

  const tabStyle = (tab: string) => ({
    padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
    fontFamily: "Cairo", fontWeight: 700, fontSize: 13,
    background: activeTab === tab ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#fff",
  });

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <header style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 32px" }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>🔐 لوحة إدارة الحجوزات</h1>
      </header>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {!adminOpen ? (
          <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h2 style={{ color: "#fff", fontSize: 22, marginBottom: 24 }}>لوحة الإدارة</h2>
            <input type="password" placeholder="كلمة السر" value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && openAdmin()}
              style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", marginBottom: 16, textAlign: "center" }} />
            <button onClick={openAdmin}
              style={{ width: "100%", padding: "14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
              دخول
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ color: "#fff", fontSize: 22, margin: 0 }}>📊 لوحة التحكم</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={exportToCSV} style={{ padding: "8px 16px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo", fontWeight: 700, fontSize: 13 }}>📥 تحميل Excel</button>
                <button onClick={fetchBookings} style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>🔄 تحديث</button>
                <button onClick={() => setAdminOpen(false)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>خروج</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "حجوزات اليوم", value: todayBookings.length, sub: `${todayRevenue} جنيه`, icon: "📅", color: "#3b82f6" },
                { label: "حجوزات الشهر", value: monthBookings.length, sub: `${monthRevenue} جنيه`, icon: "📆", color: "#8b5cf6" },
                { label: "إجمالي الحجوزات", value: bookings.length, sub: `${totalRevenue} جنيه`, icon: "💰", color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}40`, borderRadius: 16, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 14, fontWeight: 700 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: 16 }}>📈 الحجوزات - آخر 7 أيام</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                {last7Days.map(day => {
                  const count = bookings.filter(b => b.date === day).length;
                  const maxCount = Math.max(...last7Days.map(d => bookings.filter(b => b.date === d).length), 1);
                  const height = (count / maxCount) * 80 + 10;
                  const isToday = day === today;
                  return (
                    <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{count}</div>
                      <div style={{ width: "100%", height: height, background: isToday ? "#3b82f6" : "#1e3a5f", borderRadius: 4 }} />
                      <div style={{ fontSize: 10, color: isToday ? "#3b82f6" : "#64748b" }}>
                        {new Date(day).toLocaleDateString("ar-EG", { weekday: "short" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button style={tabStyle("bookings")} onClick={() => setActiveTab("bookings")}>📋 الحجوزات</button>
              <button style={tabStyle("stats")} onClick={() => setActiveTab("stats")}>📊 الإيرادات</button>
              <button style={tabStyle("settings")} onClick={() => setActiveTab("settings")}>⚙️ الإعدادات</button>
            </div>

            {activeTab === "bookings" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                  <label style={{ color: "#94a3b8", fontSize: 14 }}>فلتر بالتاريخ:</label>
                  <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    style={{ padding: "8px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, color: "#fff", fontFamily: "Cairo" }} />
                  {filterDate && <button onClick={() => setFilterDate("")}
                    style={{ padding: "8px 12px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>مسح</button>}
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>جاري التحميل...</div>
                ) : filteredBookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
                    <div style={{ fontSize: 48 }}>📭</div>
                    <p>لا توجد حجوزات</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredBookings.map((b) => (
                      <div key={b.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div>
                            <p style={{ color: "#22c55e", fontWeight: 900, margin: "0 0 4px", fontSize: 13 }}>🔖 {b.ref}</p>
                            <p style={{ color: "#fff", fontWeight: 700, margin: "0 0 4px", fontSize: 16 }}>👤 {b.name}</p>
                            <p style={{ color: "#94a3b8", margin: "0 0 4px", fontSize: 13 }}>📞 {b.phone}</p>
                            {b.email && <p style={{ color: "#94a3b8", margin: 0, fontSize: 13 }}>✉️ {b.email}</p>}
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <p style={{ color: "#3b82f6", fontWeight: 700, margin: "0 0 4px" }}>🛎️ {b.service}</p>
                            <p style={{ color: "#22c55e", fontWeight: 900, margin: "0 0 4px" }}>💰 {getPrice(b.service)} جنيه</p>
                            <p style={{ color: "#94a3b8", margin: "0 0 4px", fontSize: 13 }}>📅 {b.date} | 🕐 {b.time}</p>
                            {b.notes && <p style={{ color: "#64748b", margin: 0, fontSize: 12 }}>📝 {b.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 18 }}>💰 تفاصيل الإيرادات</h3>
                {Object.keys(servicePrices).map(service => {
                  const count = bookings.filter(b => b.service === service).length;
                  const revenue = count * servicePrices[service];
                  return (
                    <div key={service} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: "#fff" }}>{service}</span>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>{count} حجز</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>{revenue} جنيه</span>
                    </div>
                  );
                })}
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: 16, marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#94a3b8" }}>إيرادات اليوم</span>
                    <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 18 }}>{todayRevenue} جنيه</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#94a3b8" }}>إيرادات الشهر</span>
                    <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 18 }}>{monthRevenue} جنيه</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>إجمالي الإيرادات</span>
                    <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 22 }}>{totalRevenue} جنيه</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24 }}>
                <h3 style={{ color: "#fff", margin: "0 0 20px", fontSize: 18 }}>⚙️ تغيير كلمة السر</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                  {[
                    { label: "كلمة السر القديمة", value: oldPass, set: setOldPass },
                    { label: "كلمة السر الجديدة", value: newPass, set: setNewPass },
                    { label: "تأكيد كلمة السر الجديدة", value: confirmPass, set: setConfirmPass },
                  ].map((f, i) => (
                    <div key={i}>
                      <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type="password" value={f.value} onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                    </div>
                  ))}
                  {passMsg && (
                    <div style={{ padding: 12, borderRadius: 8, background: passMsg.includes("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: passMsg.includes("✅") ? "#22c55e" : "#ef4444", fontSize: 14 }}>
                      {passMsg}
                    </div>
                  )}
                  <button onClick={changePassword}
                    style={{ padding: "14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                    حفظ كلمة السر الجديدة
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