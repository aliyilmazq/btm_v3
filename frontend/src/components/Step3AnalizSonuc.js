import React, { useState } from "react";
import StratejiPerformansOzeti from "./StratejiPerformansOzeti";

function Step3AnalizSonuc({ formData, onBack }) {
  const [sonuc, setSonuc] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setSonuc(null);
    fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setSonuc(data.result);
        } else {
          setError(data.error || "Bilinmeyen bir hata oluştu.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Sunucuya ulaşılamadı.");
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Analiz ve Sonuç</h2>
      <button className="modern-btn" onClick={onBack}>Geri Dön</button>
      <button className="modern-btn" onClick={handleAnalyze} disabled={loading} style={{marginLeft: 8}}>
        Analiz Et
      </button>
      {loading && <div className="info-message">Analiz yapılıyor, lütfen bekleyin...</div>}
      {error && <div className="error-message">{error}</div>}
      {sonuc && (
        <div style={{marginTop: 24}}>
          <StratejiPerformansOzeti sonuc={sonuc} />
        </div>
      )}
    </div>
  );
}

export default Step3AnalizSonuc; 