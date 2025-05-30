import React, { useEffect, useState } from "react";

function Step2StratejiSecimi({ onNext, onBack }) {
  const [stratejiler, setStratejiler] = useState([]);
  const [secili, setSecili] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paramError, setParamError] = useState("");
  // Ortak parametreler
  const [allowShort, setAllowShort] = useState(false);
  const [useTakeProfit, setUseTakeProfit] = useState(false);
  const [takeProfit, setTakeProfit] = useState(5);
  const [useTrailingStop, setUseTrailingStop] = useState(false);
  const [trailingStop, setTrailingStop] = useState(2);
  // SMA/EMA/RSI/ARIMA parametreleri
  const [smaPeriod, setSmaPeriod] = useState(20);
  const [smaShort, setSmaShort] = useState(10);
  const [smaLong, setSmaLong] = useState(50);
  const [emaPeriod, setEmaPeriod] = useState(20);
  const [emaShort, setEmaShort] = useState(10);
  const [emaLong, setEmaLong] = useState(50);
  const [arimaP, setArimaP] = useState(1);
  const [arimaD, setArimaD] = useState(0);
  const [arimaQ, setArimaQ] = useState(0);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiOversold, setRsiOversold] = useState(30);
  const [rsiOverbought, setRsiOverbought] = useState(70);

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

  // Parametre formları
  function renderCommonParams() {
    return (
      <>
        <div>
          <label>
            <input type="checkbox" checked={allowShort} onChange={e => setAllowShort(e.target.checked)} /> Açığa Satış (Short) Yapılsın
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={useTakeProfit} onChange={e => setUseTakeProfit(e.target.checked)} /> Take Profit Kullan
          </label>
          {useTakeProfit && (
            <input type="number" min="0.01" step="0.01" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="%" required />
          )}
        </div>
        <div>
          <label>
            <input type="checkbox" checked={useTrailingStop} onChange={e => setUseTrailingStop(e.target.checked)} /> Trailing Stop Kullan
          </label>
          {useTrailingStop && (
            <input type="number" min="0.01" step="0.01" value={trailingStop} onChange={e => setTrailingStop(e.target.value)} placeholder="%" required />
          )}
        </div>
      </>
    );
  }

  function renderSMA1Params() {
    return (
      <>
        <div>
          <label>SMA Periyodu:</label>
          <input type="number" min="1" value={smaPeriod} onChange={e => setSmaPeriod(e.target.value)} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }
  function renderSMA2Params() {
    return (
      <>
        <div>
          <label>Kısa SMA Periyodu:</label>
          <input type="number" min="1" value={smaShort} onChange={e => setSmaShort(e.target.value)} required />
        </div>
        <div>
          <label>Uzun SMA Periyodu:</label>
          <input type="number" min="1" value={smaLong} onChange={e => setSmaLong(e.target.value)} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }
  function renderEMA1Params() {
    return (
      <>
        <div>
          <label>EMA Periyodu:</label>
          <input type="number" min="1" value={emaPeriod} onChange={e => setEmaPeriod(e.target.value)} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }
  function renderEMA2Params() {
    return (
      <>
        <div>
          <label>Kısa EMA Periyodu:</label>
          <input type="number" min="1" value={emaShort} onChange={e => setEmaShort(e.target.value)} required />
        </div>
        <div>
          <label>Uzun EMA Periyodu:</label>
          <input type="number" min="1" value={emaLong} onChange={e => setEmaLong(e.target.value)} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }
  function renderARIMAParams() {
    return (
      <>
        <div>
          <label>p:</label>
          <input type="number" min="0" value={arimaP} onChange={e => setArimaP(Number(e.target.value))} required />
        </div>
        <div>
          <label>d:</label>
          <input type="number" min="0" value={arimaD} onChange={e => setArimaD(Number(e.target.value))} required />
        </div>
        <div>
          <label>q:</label>
          <input type="number" min="0" value={arimaQ} onChange={e => setArimaQ(Number(e.target.value))} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }
  function renderRSIParams() {
    return (
      <>
        <div>
          <label>RSI Periyodu:</label>
          <input type="number" min="1" value={rsiPeriod} onChange={e => setRsiPeriod(e.target.value)} required />
        </div>
        <div>
          <label>Oversold (0-100):</label>
          <input type="number" min="0" max="100" value={rsiOversold} onChange={e => setRsiOversold(e.target.value)} required />
        </div>
        <div>
          <label>Overbought (0-100):</label>
          <input type="number" min="0" max="100" value={rsiOverbought} onChange={e => setRsiOverbought(e.target.value)} required />
        </div>
        {renderCommonParams()}
      </>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!secili) return;
    setParamError("");
    // Validasyon ve parametre toplama
    let params = { strategy: secili };
    if (secili === "fiyat_1sma_stratejisi") {
      if (!smaPeriod || isNaN(smaPeriod) || smaPeriod < 1) {
        setParamError("SMA periyodu pozitif bir sayı olmalı."); return;
      }
      params = { ...params, sma_period: Number(smaPeriod), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    } else if (secili === "fiyat_2sma_stratejisi") {
      if (!smaShort || !smaLong || isNaN(smaShort) || isNaN(smaLong) || smaShort < 1 || smaLong < 1 || Number(smaShort) >= Number(smaLong)) {
        setParamError("Kısa ve uzun SMA periyotları pozitif olmalı ve kısa < uzun olmalı."); return;
      }
      params = { ...params, sma_short: Number(smaShort), sma_long: Number(smaLong), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    } else if (secili === "fiyat_1ema_stratejisi") {
      if (!emaPeriod || isNaN(emaPeriod) || emaPeriod < 1) {
        setParamError("EMA periyodu pozitif bir sayı olmalı."); return;
      }
      params = { ...params, ema_period: Number(emaPeriod), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    } else if (secili === "fiyat_2ema_stratejisi") {
      if (!emaShort || !emaLong || isNaN(emaShort) || isNaN(emaLong) || emaShort < 1 || emaLong < 1 || Number(emaShort) >= Number(emaLong)) {
        setParamError("Kısa ve uzun EMA periyotları pozitif olmalı ve kısa < uzun olmalı."); return;
      }
      params = { ...params, ema_short: Number(emaShort), ema_long: Number(emaLong), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    } else if (secili === "arima_stratejisi") {
      if (arimaP < 0 || arimaD < 0 || arimaQ < 0) {
        setParamError("ARIMA p, d, q parametreleri pozitif tam sayı olmalı."); return;
      }
      params = { ...params, p: Number(arimaP), d: Number(arimaD), q: Number(arimaQ), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    } else if (secili === "rsi_stratejisi") {
      if (!rsiPeriod || isNaN(rsiPeriod) || rsiPeriod < 1) {
        setParamError("RSI periyodu pozitif bir sayı olmalı."); return;
      }
      if (rsiOversold === "" || rsiOverbought === "" || isNaN(rsiOversold) || isNaN(rsiOverbought) || Number(rsiOversold) < 0 || Number(rsiOverbought) > 100 || Number(rsiOversold) >= Number(rsiOverbought)) {
        setParamError("Oversold < Overbought ve 0-100 aralığında olmalı."); return;
      }
      params = { ...params, rsi_period: Number(rsiPeriod), oversold: Number(rsiOversold), overbought: Number(rsiOverbought), allow_short: allowShort, use_take_profit: useTakeProfit, take_profit: useTakeProfit ? Number(takeProfit) : null, use_trailing_stop: useTrailingStop, trailing_stop: useTrailingStop ? Number(trailingStop) : null };
    }
    onNext(params);
  };

  if (loading) return <div className="info-message">Stratejiler yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="modern-form">
      <h2>Strateji Seçimi</h2>
      {stratejiler.map((s) => (
        <div key={s}>
          <label>
            <input
              className="modern-input"
              type="radio"
              name="strategy"
              value={s}
              checked={secili === s}
              onChange={() => setSecili(s)}
              required
            />
            {s.replace(/_/g, ' ').replace('fiyat', 'Fiyat').replace('sma', 'SMA').replace('ema', 'EMA').replace('arima', 'ARIMA').replace('rsi', 'RSI').replace('stratejisi', 'Stratejisi')}
          </label>
        </div>
      ))}
      {secili === "fiyat_1sma_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>1 SMA Stratejisi Parametreleri</h4>
          {renderSMA1Params()}
        </div>
      )}
      {secili === "fiyat_2sma_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>2 SMA Stratejisi Parametreleri</h4>
          {renderSMA2Params()}
        </div>
      )}
      {secili === "fiyat_1ema_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>1 EMA Stratejisi Parametreleri</h4>
          {renderEMA1Params()}
        </div>
      )}
      {secili === "fiyat_2ema_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>2 EMA Stratejisi Parametreleri</h4>
          {renderEMA2Params()}
        </div>
      )}
      {secili === "arima_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>ARIMA Stratejisi Parametreleri</h4>
          {renderARIMAParams()}
        </div>
      )}
      {secili === "rsi_stratejisi" && (
        <div style={{marginTop:16, padding:12, background:'#f9f9f9', borderRadius:8}}>
          <h4>RSI Stratejisi Parametreleri</h4>
          {renderRSIParams()}
        </div>
      )}
      {paramError && <div className="error-message">{paramError}</div>}
      <button type="button" className="modern-btn" onClick={onBack}>Geri</button>
      <button type="submit" className="modern-btn" disabled={!secili}>Devam Et</button>
    </form>
  );
}

export default Step2StratejiSecimi; 