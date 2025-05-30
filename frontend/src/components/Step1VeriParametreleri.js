import React, { useState } from "react";

function Step1VeriParametreleri({ onNext }) {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periyot, setPeriyot] = useState("day");

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ ticker, start_date: startDate, end_date: endDate, periyot });
  };

  return (
    <form onSubmit={handleSubmit} className="modern-form">
      <h2>Veri Girişi</h2>
      <div>
        <label>Hisse Sembolü</label>
        <input className="modern-input" value={ticker} onChange={e => setTicker(e.target.value)} required />
      </div>
      <div>
        <label>Başlangıç Tarihi</label>
        <input className="modern-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      </div>
      <div>
        <label>Bitiş Tarihi</label>
        <input className="modern-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
      </div>
      <div>
        <label>Veri Periyodu</label>
        <select className="modern-input" value={periyot} onChange={e => setPeriyot(e.target.value)}>
          <option value="day">Günlük</option>
          <option value="hour">Saatlik</option>
          <option value="4hour">4 Saatlik</option>
          <option value="5min">5 Dakika</option>
          <option value="10min">10 Dakika</option>
          <option value="15min">15 Dakika</option>
          <option value="20min">20 Dakika</option>
        </select>
      </div>
      <button type="submit" className="modern-btn">Devam Et</button>
    </form>
  );
}

export default Step1VeriParametreleri; 