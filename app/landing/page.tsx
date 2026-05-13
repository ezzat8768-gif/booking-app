export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0f172a", color: "#fff", direction: "rtl", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f, #0f172a)", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 16 }}>
          موقع <span style={{ color: "#3b82f6" }}>حجز المواعيد</span> الاحترافي<br />لعيادتك أو محلك
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
          خلي عملاؤك يحجزوا مواعيدهم أونلاين بسهولة — وانت تستقبل الحجوزات وتتابع إيراداتك من أي مكان
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" target="_blank" style={{ padding: "16px 32px", background: "#3b82f6", color: "#fff", borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: "none" }}>🔗 شوف مثال حي</a>
          <a href="https://wa.me/201205084496?text=مرحبا، عايز أعرف أكتر عن موقع حجز المواعيد" target="_blank" style={{ padding: "16px 32px", background: "#25d366", color: "#fff", borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: "none" }}>📲 تواصل معنا</a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ display: "flex", justifyContent: "center", gap: 40, padding: "60px 20px", flexWrap: "wrap", background: "rgba(255,255,255,0.02)" }}>
        {[
          { num: "24/7", label: "حجز على مدار اليوم" },
          { num: "5 دقايق", label: "وقت إعداد الموقع" },
          { num: "100%", label: "أونلاين وآمن" },
          { num: "مجاني", label: "السيرفر والاستضافة" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: "#3b82f6" }}>{s.num}</div>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: "80px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 900, marginBottom: 48 }}>⚡ كل اللي محتاجه في موقع واحد</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { icon: "📅", title: "حجز ذكي", desc: "العميل بيختار الخدمة والتاريخ والوقت بسهولة — والنظام بيمنع الحجز المكرر تلقائياً" },
            { icon: "📊", title: "لوحة إدارة كاملة", desc: "شوف كل الحجوزات، إيرادات اليوم والشهر، ورسم بياني لآخر 7 أيام" },
            { icon: "📲", title: "تأكيد واتساب", desc: "العميل بيبعت تأكيد حجزه على واتساب بضغطة زرار واحدة" },
            { icon: "📥", title: "تحميل Excel", desc: "صدّر كل الحجوزات في ملف Excel بضغطة واحدة للمتابعة والأرشفة" },
            { icon: "🔐", title: "لوحة أدمن سرية", desc: "لوحة إدارة محمية بكلمة سر — العملاء مش بيشوفوها خالص" },
            { icon: "📱", title: "يشتغل على الموبايل", desc: "الموقع بيشتغل على أي جهاز — موبايل، تابلت، أو كمبيوتر" },
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section style={{ padding: "80px 20px", textAlign: "center", background: "rgba(59,130,246,0.05)" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>🎯 جرب الموقع بنفسك</h2>
        <p style={{ color: "#94a3b8", marginBottom: 32 }}>ده مثال حقيقي لموقع حجز مواعيد — جرب تحجز موعد وشوف إزاي بيشتغل</p>
        <a href="/" target="_blank" style={{ display: "inline-block", padding: "14px 32px", background: "rgba(59,130,246,0.2)", border: "1px solid #3b82f6", borderRadius: 12, color: "#3b82f6", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
          🔗 افتح الموقع التجريبي
        </a>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 20px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 900, marginBottom: 48 }}>💰 الأسعار</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            {
              title: "الباقة الأساسية", price: "500", period: "جنيه — مرة واحدة", featured: false,
              features: ["موقع باسمك وخدماتك", "لوحة إدارة كاملة", "حجز مواعيد أونلاين", "تأكيد واتساب", "تحميل Excel"],
              msg: "عايز الباقة الأساسية", color: "#3b82f6"
            },
            {
              title: "الباقة الاحترافية", price: "800", period: "جنيه + 100 جنيه/شهر", featured: true,
              features: ["كل مميزات الأساسية", "دومين باسمك .com", "صيانة شهرية", "تعديلات مجانية", "دعم فني على واتساب"],
              msg: "عايز الباقة الاحترافية", color: "#25d366"
            },
          ].map((p, i) => (
            <div key={i} style={{ background: p.featured ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${p.featured ? "#3b82f6" : "rgba(255,255,255,0.1)"}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
              {p.featured && <div style={{ background: "#3b82f6", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 16 }}>⭐ الأكثر طلباً</div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{p.title}</h3>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#3b82f6" }}>{p.price}</div>
              <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>{p.period}</div>
              <ul style={{ listStyle: "none", marginBottom: 24, textAlign: "right" }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ padding: "8px 0", color: "#94a3b8", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>✅ {f}</li>
                ))}
              </ul>
              <a href={`https://wa.me/201205084496?text=${encodeURIComponent(p.msg)}`} target="_blank"
                style={{ display: "block", padding: "14px", background: p.color, color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
                تواصل معنا
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", textAlign: "center", background: "linear-gradient(135deg, #1e3a5f, #0f172a)" }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>🚀 ابدأ دلوقتي!</h2>
        <p style={{ color: "#94a3b8", marginBottom: 40, fontSize: 18 }}>مش هتدفع حاجة غير لما تشوف الموقع شغال باسمك وبخدماتك</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/201205084496?text=مرحبا، عايز موقع حجز مواعيد" target="_blank"
            style={{ padding: "16px 32px", background: "#25d366", color: "#fff", borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
            📲 تواصل على واتساب
          </a>
          <a href="/" target="_blank"
            style={{ padding: "16px 32px", background: "#3b82f6", color: "#fff", borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
            🔗 شوف مثال حي
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 24, textAlign: "center", color: "#475569", fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        جميع الحقوق محفوظة © 2026 | تواصل: 01205084496
      </footer>
    </div>
  );
}