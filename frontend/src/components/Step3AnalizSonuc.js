import React, { useState } from "react";

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
      <button onClick={onBack}>Geri</button>
      <button onClick={handleAnalyze} disabled={loading} style={{marginLeft: 8}}>
        Analiz Et
      </button>
      {loading && <div>Analiz yapılıyor...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {sonuc && (
        <pre style={{background: '#f5f5f5', padding: 12, marginTop: 12}}>
          {JSON.stringify(sonuc, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Step3AnalizSonuc; 