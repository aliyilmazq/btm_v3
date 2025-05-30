import React from "react";

const icons = {
  strateji_getirisi: <svg width="22" height="22" fill="none"><path d="M4 18l6-7 5 5 5-8" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="6" r="2" fill="#1976d2"/></svg>,
  al_tut_getirisi: <svg width="22" height="22" fill="none"><path d="M4 18l6-7 5 5 5-8" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="6" r="2" fill="#ff9800"/></svg>,
  islem_sayisi: <svg width="22" height="22" fill="none"><rect x="4" y="6" width="14" height="10" rx="2" stroke="#666" strokeWidth="2"/><path d="M8 10h6M8 14h4" stroke="#666" strokeWidth="2"/></svg>,
  aylik_ortalama_islem: <svg width="22" height="22" fill="none"><rect x="4" y="6" width="14" height="10" rx="2" stroke="#666" strokeWidth="2"/><path d="M8 10h6M8 14h4" stroke="#666" strokeWidth="2"/><rect x="7" y="3" width="2" height="4" rx="1" fill="#666"/><rect x="13" y="3" width="2" height="4" rx="1" fill="#666"/></svg>,
  ortalama_islem_getirisi: <svg width="22" height="22" fill="none"><path d="M4 18l6-7 5 5" stroke="#388e3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="6" r="2" fill="#388e3c"/></svg>,
  maksimum_drawdown: <svg width="22" height="22" fill="none"><path d="M4 6l8 8 6-8" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v4" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/></svg>,
  sharpe_orani: <svg width="22" height="22" fill="none"><path d="M4 18l6-7 5 5" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="6" r="2" fill="#1976d2"/></svg>,
  sortino_orani: <svg width="22" height="22" fill="none"><path d="M4 18l6-7 5 5" stroke="#8e24aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="6" r="2" fill="#8e24aa"/></svg>
};

const metricList = [
  { key: "strateji_getirisi", label: "Strateji Getirisi", format: v => v != null ? (v * 100).toFixed(2) + "%" : "-" },
  { key: "al_tut_getirisi", label: "Al & Tut Getirisi", format: v => v != null ? (v * 100).toFixed(2) + "%" : "-" },
  { key: "islem_sayisi", label: "İşlem Sayısı", format: v => v != null ? v : "-" },
  { key: "aylik_ortalama_islem", label: "Aylık Ortalama İşlem", format: v => v != null ? v.toFixed(2) : "-" },
  { key: "ortalama_islem_getirisi", label: "Ortalama İşlem Getirisi", format: v => v != null ? v.toFixed(2) : "-" },
  { key: "maksimum_drawdown", label: "Maksimum Drawdown", format: v => v != null ? (v * 100).toFixed(2) + "%" : "-" },
  { key: "sharpe_orani", label: "Sharpe Oranı", format: v => v != null ? v.toFixed(2) : "-" },
  { key: "sortino_orani", label: "Sortino Oranı", format: v => v != null ? v.toFixed(2) : "-" }
];

export default function StratejiPerformansOzeti({ sonuc }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      padding: '32px 10vw 18px 10vw',
      maxWidth: 700,
      margin: '32px auto',
      border: '1px solid #e0d4c4',
    }}>
      <h2 style={{fontWeight: 600, fontSize: 24, marginBottom: 24, textAlign: 'center'}}>Strateji Performans Özeti</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 0,
        borderTop: '1px solid #e0d4c4',
        borderBottom: '1px solid #e0d4c4',
      }}>
        {metricList.map((m, i) => (
          <div key={m.key} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '18px 0',
            borderBottom: i < metricList.length - 1 ? '1px solid #e0d4c4' : 'none',
            gap: 18,
            fontSize: 17,
            fontWeight: 500,
            flexWrap: 'wrap',
          }}>
            <span style={{width: 32, minWidth: 32, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{icons[m.key]}</span>
            <span style={{flex: 1, minWidth: 120, wordBreak: 'break-word'}}>{m.label}</span>
            <span style={{fontWeight: 600, fontSize: 19, minWidth: 80, textAlign: 'right', wordBreak: 'break-word'}}>{m.format(sonuc ? sonuc[m.key] : null)}</span>
          </div>
        ))}
      </div>
      <div style={{color: '#888', fontSize: 15, marginTop: 18, textAlign: 'center'}}>
        Bu metrikler seçili stratejiye göre hesaplanmıştır.
      </div>
      <style>{`
        @media (min-width: 600px) {
          .spozeti-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }
          .spozeti-row {
            border-right: 1px solid #e0d4c4;
          }
        }
      `}</style>
    </div>
  );
} 