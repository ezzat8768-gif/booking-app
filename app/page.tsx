"use client";
import { useState } from "react";

const timeSlots = [
  "9:00 صباحاً", "9:30 صباحاً", "10:00 صباحاً", "10:30 صباحاً",
  "11:00 صباحاً", "11:30 صباحاً", "12:00 ظهراً", "12:30 ظهراً",
  "1:00 مساءً", "1:30 مساءً", "2:00 مساءً", "2:30 مساءً",
  "3:00 مساءً", "3:30 مساءً", "4:00 مساءً", "4:30 مساءً",
  "5:00 مساءً",
];

const services = [
  { id: 1, name: "استشارة عامة", duration: "30 دقيقة", price: "150 جنيه", icon: "💬" },
  { id: 2, name: "فحص شامل", duration: "60 دقيقة", price: "300 جنيه", icon: "🔍" },
  { id: 3, name: "متابعة دورية", duration: "20 دقيقة", price: "100 جنيه", icon: "📋" },
  { id: 4, name: "جلسة علاجية", duration: "45 دقيقة", price: "200 جنيه", icon: "⭐" },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", notes: "" });
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!form.name || !form.phone || !form.date || !selectedTime || !selectedService) {
      alert("من فضلك اكمل كل البيانات!");
      return;
    }
    setLoading(true);
    const ref = "BK" + Math.floor(Math.random() * 90000 + 10000);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref, name: form.name, phone: form.phone, email: form.email,
          date: form.date, time: selectedTime,
          service: selectedService.name, notes: form.notes,
        }),
      });
      setBookingRef(ref);
      setBooked(true);
    } catch {
      alert("حصل خطأ، حاول تاني!");
    }
    setLoading(false);
  };

  const resetBooking = () => {
    setBooked(false); setStep(1); setSelectedService(null);
    setSelectedTime(""); setForm({ name: "", phone: "", email: "", date: "", notes: "" });
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: 0 }}>🗓️ نظام حجز المواعيد</h1>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>احجز موعدك بسهولة وسرعة</p>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {!booked && (
          <>
            {/* Steps */}
            <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 40 }}>
              {["اختار الخدمة", "حدد الموعد", "بياناتك"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#fff", transition: "all 0.3s" }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ color: step === i + 1 ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600 }}>{s}</span>
                  </div>
                  {i < 2 && <div style={{ width: 80, height: 2, background: step > i + 1 ? "#22c55e" : "rgba(255,255,255,0.1)", margin: "0 8px", marginBottom: 24, transition: "all 0.3s" }} />}
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 22, marginBottom: 24 }}>اختار الخدمة المطلوبة</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {services.map(s => (
                    <div key={s.id} onClick={() => setSelectedService(s)}
                      style={{ background: selectedService?.id === s.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)", border: `2px solid ${selectedService?.id === s.id ? "#3b82f6" : "rgba(255,255,255,0.1)"}`, borderRadius: 16, padding: 24, cursor: "pointer", transition: "all 0.3s" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                      <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>{s.name}</h3>
                      <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 4px" }}>⏱️ {s.duration}</p>
                      <p style={{ color: "#3b82f6", fontSize: 16, fontWeight: 700, margin: 0 }}>{s.price}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { if (!selectedService) { alert("اختار خدمة أول!"); return; } setStep(2); }}
                  style={{ marginTop: 24, width: "100%", padding: "14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                  التالي ←
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 22, marginBottom: 24 }}>حدد التاريخ والوقت</h2>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
                  <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo" }} />
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24 }}>
                  <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 12 }}>الوقت المتاح</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        style={{ padding: "10px 6px", borderRadius: 8, border: `1px solid ${selectedTime === t ? "#3b82f6" : "rgba(255,255,255,0.15)"}`, background: selectedTime === t ? "#3b82f6" : "rgba(255,255,255,0.05)", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "Cairo", fontWeight: 600 }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>→ رجوع</button>
                  <button onClick={() => { if (!form.date || !selectedTime) { alert("اختار التاريخ والوقت!"); return; } setStep(3); }}
                    style={{ flex: 2, padding: "14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                    التالي ←
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 22, marginBottom: 24 }}>بياناتك الشخصية</h2>
                <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ color: "#93c5fd", fontSize: 14 }}>🛎️ {selectedService?.name}</span>
                  <span style={{ color: "#93c5fd", fontSize: 14 }}>📅 {form.date}</span>
                  <span style={{ color: "#93c5fd", fontSize: 14 }}>🕐 {selectedTime}</span>
                  <span style={{ color: "#93c5fd", fontSize: 14, fontWeight: 700 }}>{selectedService?.price}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "الاسم الكامل *", key: "name", type: "text", placeholder: "اكتب اسمك بالكامل" },
                    { label: "رقم التليفون *", key: "phone", type: "tel", placeholder: "01xxxxxxxxx" },
                    { label: "البريد الإلكتروني", key: "email", type: "email", placeholder: "example@email.com" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 8 }}>ملاحظات إضافية</label>
                    <textarea placeholder="أي ملاحظات تريد إضافتها..."
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", resize: "none", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>→ رجوع</button>
                  <button onClick={handleBook} disabled={loading}
                    style={{ flex: 2, padding: "14px", background: loading ? "#475569" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Cairo" }}>
                    {loading ? "جاري الحجز..." : "✅ تأكيد الحجز"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* SUCCESS */}
        {booked && (
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 48 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: "#22c55e", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>تم الحجز بنجاح!</h2>
            <p style={{ color: "#94a3b8", marginBottom: 32 }}>رقم الحجز الخاص بك</p>
            <div style={{ background: "rgba(59,130,246,0.2)", border: "2px dashed #3b82f6", borderRadius: 12, padding: "16px 32px", display: "inline-block", marginBottom: 32 }}>
              <span style={{ color: "#3b82f6", fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>{bookingRef}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, marginBottom: 32, textAlign: "right" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "#94a3b8" }}>الاسم</span><span style={{ color: "#fff", fontWeight: 700 }}>{form.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "#94a3b8" }}>الخدمة</span><span style={{ color: "#fff", fontWeight: 700 }}>{selectedService?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "#94a3b8" }}>التاريخ</span><span style={{ color: "#fff", fontWeight: 700 }}>{form.date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "#94a3b8" }}>الوقت</span><span style={{ color: "#fff", fontWeight: 700 }}>{selectedTime}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ color: "#94a3b8" }}>السعر</span><span style={{ color: "#3b82f6", fontWeight: 900 }}>{selectedService?.price}</span>
              </div>
            </div>
            <button onClick={resetBooking}
              style={{ padding: "14px 40px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
              حجز موعد جديد
            </button>
          </div>
        )}
      </main>
    </div>
  );
}