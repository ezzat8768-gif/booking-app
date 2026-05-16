"use client";
import { useState, useEffect } from "react";

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

type Settings = {
  bgColor1: string;
  bgColor2: string;
  accentColor: string;
  clinicName: string;
  clinicSubtitle: string;
};

const defaultSettings: Settings = {
  bgColor1: "#0a0a1a",
  bgColor2: "#0d1f3c",
  accentColor: "#6366f1",
  clinicName: "نظام حجز المواعيد",
  clinicSubtitle: "احجز موعدك بسهولة وسرعة",
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", notes: "" });
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d && !d.error) setSettings({ ...defaultSettings, ...d });
    }).catch(() => {});
  }, []);

  const handleBook = async () => {
    if (!form.name || !form.phone || !form.date || !selectedTime || !selectedService) {
      alert("من فضلك اكمل كل البيانات!"); return;
    }
    setLoading(true);
    const ref = "BK" + Math.floor(Math.random() * 90000 + 10000);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref, name: form.name, phone: form.phone, email: form.email,
          date: form.date, time: selectedTime,
          service: selectedService.name, notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "حصل خطأ!"); setLoading(false); return; }
      setBookingRef(ref);
      setBooked(true);
    } catch { alert("حصل خطأ، حاول تاني!"); }
    setLoading(false);
  };

  const resetBooking = () => {
    setBooked(false); setStep(1); setSelectedService(null);
    setSelectedTime(""); setForm({ name: "", phone: "", email: "", date: "", notes: "" });
  };

  const accent = settings.accentColor;
  const bg = `linear-gradient(135deg, ${settings.bgColor1} 0%, ${settings.bgColor2} 50%, ${settings.bgColor1} 100%)`;

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", minHeight: "100vh", background: bg, direction: "rtl", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
      
      {/* Animated background orbs */}
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${accent}20, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${accent}15, transparent 70%)`, filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${accent}20`, backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.2)" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>
            <span style={{ color: accent }}>●</span> {settings.clinicName}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>{settings.clinicSubtitle}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>متاح الآن</span>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 10, maxWidth: 860, margin: "0 auto", padding: "40px 20px" }}>
        {!booked ? (
          <>
            {/* Steps */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 48 }}>
              {["اختار الخدمة", "حدد الموعد", "بياناتك"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 16,
                      background: step > i + 1 ? "#22c55e" : step === i + 1 ? accent : "rgba(255,255,255,0.05)",
                      color: "#fff", border: `2px solid ${step >= i + 1 ? (step > i + 1 ? "#22c55e" : accent) : "rgba(255,255,255,0.1)"}`,
                      boxShadow: step === i + 1 ? `0 0 20px ${accent}60` : "none",
                      transition: "all 0.4s"
                    }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ color: step === i + 1 ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{s}</span>
                  </div>
                  {i < 2 && <div style={{ width: 60, height: 1, background: step > i + 1 ? "#22c55e" : "rgba(255,255,255,0.1)", margin: "0 8px", marginBottom: 24, transition: "all 0.4s" }} />}
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 24, marginBottom: 8, fontWeight: 700 }}>اختار الخدمة</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 14, marginBottom: 32 }}>اختار الخدمة المناسبة ليك</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {services.map(s => (
                    <div key={s.id} onClick={() => setSelectedService(s)}
                      style={{
                        background: selectedService?.id === s.id ? `${accent}25` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedService?.id === s.id ? accent : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 20, padding: 28, cursor: "pointer",
                        boxShadow: selectedService?.id === s.id ? `0 0 30px ${accent}30` : "none",
                        transition: "all 0.3s",
                        backdropFilter: "blur(10px)",
                      }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                      <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>{s.name}</h3>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 12px" }}>⏱ {s.duration}</p>
                      <p style={{ color: accent, fontSize: 18, fontWeight: 900, margin: 0 }}>{s.price}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => { if (!selectedService) { alert("اختار خدمة أول!"); return; } setStep(2); }}
                  style={{ marginTop: 24, width: "100%", padding: "16px", background: accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo", boxShadow: `0 8px 30px ${accent}50`, transition: "all 0.3s" }}>
                  التالي ←
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 24, marginBottom: 8, fontWeight: 700 }}>حدد التاريخ والوقت</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 14, marginBottom: 32 }}>اختار التاريخ والوقت المناسب</p>
                
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, marginBottom: 20, backdropFilter: "blur(10px)" }}>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "block", marginBottom: 10 }}>📅 التاريخ</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: `1px solid ${accent}40`, borderRadius: 12, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, backdropFilter: "blur(10px)" }}>
                  <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "block", marginBottom: 14 }}>🕐 الوقت المتاح</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {timeSlots.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        style={{
                          padding: "10px 4px", borderRadius: 10,
                          border: `1px solid ${selectedTime === t ? accent : "rgba(255,255,255,0.08)"}`,
                          background: selectedTime === t ? accent : "rgba(255,255,255,0.03)",
                          color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "Cairo", fontWeight: 600,
                          boxShadow: selectedTime === t ? `0 0 15px ${accent}40` : "none",
                          transition: "all 0.2s"
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>→ رجوع</button>
                  <button onClick={() => { if (!form.date || !selectedTime) { alert("اختار التاريخ والوقت!"); return; } setStep(3); }}
                    style={{ flex: 2, padding: "16px", background: accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo", boxShadow: `0 8px 30px ${accent}50` }}>
                    التالي ←
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 style={{ color: "#fff", textAlign: "center", fontSize: 24, marginBottom: 8, fontWeight: 700 }}>بياناتك الشخصية</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: 14, marginBottom: 32 }}>ادخل بياناتك لتأكيد الحجز</p>

                {/* Summary */}
                <div style={{ background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>🛎 {selectedService?.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>📅 {form.date}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>🕐 {selectedTime}</span>
                  <span style={{ color: accent, fontSize: 13, fontWeight: 900 }}>{selectedService?.price}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "الاسم الكامل *", key: "name", type: "text", placeholder: "اكتب اسمك بالكامل" },
                    { label: "رقم التليفون *", key: "phone", type: "tel", placeholder: "01xxxxxxxxx" },
                    { label: "البريد الإلكتروني", key: "email", type: "email", placeholder: "example@email.com" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, display: "block", marginBottom: 8 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}30`, borderRadius: 12, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", outline: "none" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, display: "block", marginBottom: 8 }}>ملاحظات إضافية</label>
                    <textarea placeholder="أي ملاحظات تريد إضافتها..." value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                      style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}30`, borderRadius: 12, color: "#fff", fontSize: 15, boxSizing: "border-box", fontFamily: "Cairo", resize: "none", outline: "none" }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>→ رجوع</button>
                  <button onClick={handleBook} disabled={loading}
                    style={{ flex: 2, padding: "16px", background: loading ? "rgba(255,255,255,0.1)" : accent, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Cairo", boxShadow: loading ? "none" : `0 8px 30px ${accent}50` }}>
                    {loading ? "جاري الحجز..." : "✅ تأكيد الحجز"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // SUCCESS
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 48, backdropFilter: "blur(20px)" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: "#22c55e", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>تم الحجز بنجاح!</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>رقم الحجز الخاص بك</p>
            <div style={{ background: `${accent}15`, border: `2px dashed ${accent}`, borderRadius: 14, padding: "16px 32px", display: "inline-block", marginBottom: 32 }}>
              <span style={{ color: accent, fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>{bookingRef}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 24, marginBottom: 32, textAlign: "right" }}>
              {[
                { label: "الاسم", value: form.name },
                { label: "الخدمة", value: selectedService?.name },
                { label: "التاريخ", value: form.date },
                { label: "الوقت", value: selectedTime },
                { label: "السعر", value: selectedService?.price },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
                  <span style={{ color: i === 4 ? accent : "#fff", fontWeight: i === 4 ? 900 : 700 }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`https://wa.me/?text=${encodeURIComponent(`✅ تأكيد حجز موعد\n\nرقم الحجز: ${bookingRef}\nالاسم: ${form.name}\nالخدمة: ${selectedService?.name}\nالتاريخ: ${form.date}\nالوقت: ${selectedTime}\nالسعر: ${selectedService?.price}\n\nشكراً لحجزك معنا! 🙏`)}`}
                target="_blank"
                style={{ padding: "14px 24px", background: "#25d366", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                📲 ارسل على واتساب
              </a>
              <button onClick={resetBooking}
                style={{ padding: "14px 24px", background: accent, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Cairo" }}>
                حجز موعد جديد
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}