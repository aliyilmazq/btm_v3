import React, { useState } from "react";
import StratejiPerformansOzeti from "./StratejiPerformansOzeti";
import MessageBox from "./MessageBox";

function Step3AnalizSonuc({ formData, onBack }) {
  const [sonuc, setSonuc] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "info", text: "" });
  const [log, setLog] = useState([]);

  const appendLog = (msg) => setLog((prev) => [...prev, msg]);

  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setSonuc(null);
    setMessage({ type: "info", text: "Analiz başlatıldı, lütfen bekleyin..." });
    setLog([]);
    appendLog("[INFO] /analyze endpoint'ine istek gönderiliyor...");
    appendLog(`[PAYLOAD] ${JSON.stringify(formData)}`);
    fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(async res => {
        appendLog(`[RESPONSE] Status: ${res.status}`);
        const data = await res.json();
        appendLog(`[RESPONSE BODY] ${JSON.stringify(data)}`);
        if (data.status === "success") {
          setSonuc(data.rapor);
          setMessage({ type: "success", text: "Analiz tamamlandı, rapor hazır!" });
        } else {
          setError(data.error || "Bilinmeyen bir hata oluştu.");
          setMessage({ type: "error", text: data.error || "Bilinmeyen bir hata oluştu." });
        }
        setLoading(false);
        // Backend loglarını çek
        fetch("/logs")
          .then(res => res.json())
          .then(logData => {
            appendLog("[BACKEND LOG - Son 50 Satır]");
            (logData.lines || []).forEach(line => appendLog(line.trim()));
          });
      })
      .catch((e) => {
        setError("Sunucuya ulaşılamadı.");
        setMessage({ type: "error", text: "Sunucuya ulaşılamadı." });
        appendLog(`[ERROR] ${e && e.message ? e.message : e}`);
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Analiz ve Sonuç</h2>
      <MessageBox type={message.type} message={message.text} onClose={() => setMessage({ ...message, text: "" })} />
      <div style={{background:'#f5f5f5', borderRadius:8, padding:'12px 16px', margin:'12px 0 18px 0', fontSize:14, maxHeight:260, overflowY:'auto'}}>
        <b>Analiz Günlüğü</b>
        <pre style={{whiteSpace:'pre-wrap', margin:0}}>{log.join("\n")}</pre>
      </div>
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