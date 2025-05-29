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
    <form onSubmit={handleSubmit}>
      <h2>Veri Parametreleri</h2>
      <div>
        <label>Hisse Sembolü:</label>
        <input value={ticker} onChange={e => setTicker(e.target.value)} required />
      </div>
      <div>
        <label>Başlangıç Tarihi:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      </div>
      <div>
        <label>Bitiş Tarihi:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
      </div>
      <div>
        <label>Periyot:</label>
        <select value={periyot} onChange={e => setPeriyot(e.target.value)}>
          <option value="day">day</option>
          <option value="hour">hour</option>
          <option value="4hour">4hour</option>
          <option value="5min">5min</option>
          <option value="10min">10min</option>
          <option value="15min">15min</option>
          <option value="20min">20min</option>
        </select>
      </div>
      <button type="submit">İleri</button>
    </form>
  );
}

export default Step1VeriParametreleri; 