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
  createdAt: string;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminPass, setAdminPass] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    if (adminOpen) fetchBookings();
  }, [adminOpen]);

  const openAdmin = () => {
    if (adminPass === "admin123") { setAdminOpen(true); setAdminPass(""); }
    else alert("كلمة السر غلط!");
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <header style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 32px" }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>🔐 لوحة إدارة الحجوزات</h1>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 22, margin: 0 }}>📊 الحجوزات ({bookings.length})</h2>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={fetchBookings}
                  style={{ padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>
                  🔄 تحديث
                </button>
                <button onClick={() => setAdminOpen(false)}
                  style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo" }}>
                  خروج
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "إجمالي الحجوزات", value: bookings.length, icon: "📅" },
                { label: "اليوم", value: bookings.filter(b => b.date === new Date().toISOString().split("T")[0]).length, icon: "🕐" },
                { label: "هذا الشهر", value: bookings.filter(b => b.date?.startsWith(new Date().toISOString().slice(0, 7))).length, icon: "📆" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>جاري التحميل...</div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p>لا توجد حجوزات بعد</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {bookings.map((b) => (
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
                        <p style={{ color: "#94a3b8", margin: "0 0 4px", fontSize: 13 }}>📅 {b.date} | 🕐 {b.time}</p>
                        {b.notes && <p style={{ color: "#64748b", margin: 0, fontSize: 12 }}>📝 {b.notes}</p>}
                        <p style={{ color: "#475569", margin: "4px 0 0", fontSize: 11 }}>
                          {new Date(b.createdAt).toLocaleString("ar-EG")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}