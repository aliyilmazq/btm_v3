import React, { useEffect, useState } from "react";

function Step2StratejiSecimi({ onNext, onBack }) {
  const [stratejiler, setStratejiler] = useState([]);
  const [secili, setSecili] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Backend'den strateji listesini çek
    fetch("/strategies")
      .then(res => res.json())
      .then(data => {
        setStratejiler(data.strategies || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Strateji listesi alınamadı.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secili) onNext(secili);
  };

  if (loading) return <div>Stratejiler yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Strateji Seçimi</h2>
      {stratejiler.map((s) => (
        <div key={s}>
          <label>
            <input
              type="radio"
              name="strategy"
              value={s}
              checked={secili === s}
              onChange={() => setSecili(s)}
              required
            />
            {s}
          </label>
        </div>
      ))}
      <button type="button" onClick={onBack}>Geri</button>
      <button type="submit" disabled={!secili}>İleri</button>
    </form>
  );
}

export default Step2StratejiSecimi; 