"""
Bu script, 1SMA (Basit Hareketli Ortalama) fiyat stratejisi için analiz fonksiyonları barındırmak amacıyla hazırlanmıştır.
backtest_analiz.py tarafından izole şekilde çağrılır.
"""

import pandas as pd
import numpy as np

# SMA stratejisi: fiyat SMA'yı yukarı keserse al, aşağı keserse sat. Her sinyalde 1 pozisyon açılır. Açığa satış opsiyonel.
def run_strategy(data, params=None):
    try:
        results = data.get('results', [])
        if not results:
            return {'hata': 'Veri bulunamadı veya sonuçlar boş.'}
        closes = [item['c'] for item in results]
        dates = [pd.to_datetime(item['t'], unit='ms') for item in results]
        fiyatlar = pd.Series(closes, index=dates)

        # Parametreler
        if params is None:
            return {'hata': 'Parametreler eksik.'}
        sma_period = params.get('sma_period')
        allow_short = params.get('allow_short', False)
        use_take_profit = params.get('use_take_profit', False)
        take_profit = params.get('take_profit')
        use_trailing_stop = params.get('use_trailing_stop', False)
        trailing_stop = params.get('trailing_stop')

        # Validasyon
        if not sma_period or sma_period < 1:
            return {'hata': 'SMA periyodu pozitif bir sayı olmalı.'}
        if use_take_profit and (take_profit is None or take_profit <= 0):
            return {'hata': 'Take profit yüzdesi pozitif bir sayı olmalı.'}
        if use_trailing_stop and (trailing_stop is None or trailing_stop <= 0):
            return {'hata': 'Trailing stop yüzdesi pozitif bir sayı olmalı.'}

        sma = fiyatlar.rolling(window=sma_period).mean()
        pozisyon = None  # None, 'long', 'short'
        entry_price = 0
        max_price = 0  # Trailing stop için
        trades = []
        for i in range(1, len(fiyatlar)):
            fiyat = fiyatlar.iloc[i]
            onceki_fiyat = fiyatlar.iloc[i-1]
            sma_now = sma.iloc[i]
            sma_prev = sma.iloc[i-1]
            tarih = fiyatlar.index[i]
            # Sinyal: Fiyat SMA'yı yukarı keserse AL, aşağı keserse SAT
            al_sinyali = onceki_fiyat < sma_prev and fiyat >= sma_now
            sat_sinyali = onceki_fiyat > sma_prev and fiyat <= sma_now
            # Pozisyon açma
            if pozisyon is None:
                if al_sinyali:
                    pozisyon = 'long'
                    entry_price = fiyat
                    max_price = fiyat
                    trades.append({'tarih': str(tarih), 'islem': 'AL', 'fiyat': float(fiyat)})
                elif sat_sinyali and allow_short:
                    pozisyon = 'short'
                    entry_price = fiyat
                    max_price = fiyat
                    trades.append({'tarih': str(tarih), 'islem': 'SHORT', 'fiyat': float(fiyat)})
            # Pozisyon yönetimi
            elif pozisyon == 'long':
                # Take profit
                if use_take_profit and fiyat >= entry_price * (1 + take_profit/100):
                    trades.append({'tarih': str(tarih), 'islem': 'TP-SELL', 'fiyat': float(fiyat)})
                    pozisyon = None
                # Trailing stop
                elif use_trailing_stop:
                    if fiyat > max_price:
                        max_price = fiyat
                    stop_price = max_price * (1 - trailing_stop/100)
                    if fiyat <= stop_price:
                        trades.append({'tarih': str(tarih), 'islem': 'TSL-SELL', 'fiyat': float(fiyat)})
                        pozisyon = None
                # Kesişimle pozisyon kapama
                elif sat_sinyali and allow_short:
                    trades.append({'tarih': str(tarih), 'islem': 'SMA-SELL', 'fiyat': float(fiyat)})
                    pozisyon = None
            elif pozisyon == 'short':
                # Take profit (short)
                if use_take_profit and fiyat <= entry_price * (1 - take_profit/100):
                    trades.append({'tarih': str(tarih), 'islem': 'TP-COVER', 'fiyat': float(fiyat)})
                    pozisyon = None
                # Trailing stop (short)
                elif use_trailing_stop:
                    if fiyat < max_price:
                        max_price = fiyat
                    stop_price = max_price * (1 + trailing_stop/100)
                    if fiyat >= stop_price:
                        trades.append({'tarih': str(tarih), 'islem': 'TSL-COVER', 'fiyat': float(fiyat)})
                        pozisyon = None
                # Kesişimle pozisyon kapama
                elif al_sinyali:
                    trades.append({'tarih': str(tarih), 'islem': 'SMA-COVER', 'fiyat': float(fiyat)})
                    pozisyon = None
        # Son pozisyonu kapat
        if pozisyon is not None:
            trades.append({'tarih': str(fiyatlar.index[-1]), 'islem': 'KAPAT', 'fiyat': float(fiyatlar.iloc[-1])})
        # Getiri hesapla
        bakiye = 1.0
        aktif_poz = None
        getiriler = []
        for t in trades:
            if t['islem'] == 'AL':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-SELL', 'TSL-SELL', 'SMA-SELL', 'KAPAT'] and aktif_poz is not None:
                getiriler.append((t['fiyat'] - aktif_poz) / aktif_poz)
                bakiye *= t['fiyat'] / aktif_poz
                aktif_poz = None
            elif t['islem'] == 'SHORT':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-COVER', 'TSL-COVER', 'SMA-COVER', 'KAPAT'] and aktif_poz is not None:
                getiriler.append((aktif_poz - t['fiyat']) / aktif_poz)
                bakiye *= aktif_poz / t['fiyat']
                aktif_poz = None
        # Maksimum Drawdown
        portfoy_degeri = [1.0]
        aktif_poz = None
        for t in trades:
            if t['islem'] == 'AL':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-SELL', 'TSL-SELL', 'SMA-SELL', 'KAPAT'] and aktif_poz is not None:
                portfoy_degeri.append(portfoy_degeri[-1] * (t['fiyat'] / aktif_poz))
                aktif_poz = None
            elif t['islem'] == 'SHORT':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-COVER', 'TSL-COVER', 'SMA-COVER', 'KAPAT'] and aktif_poz is not None:
                portfoy_degeri.append(portfoy_degeri[-1] * (aktif_poz / t['fiyat']))
                aktif_poz = None
        portfoy_degeri = np.array(portfoy_degeri)
        zirve = np.maximum.accumulate(portfoy_degeri)
        drawdown = (portfoy_degeri - zirve) / zirve
        maksimum_drawdown = abs(drawdown.min()) if len(drawdown) > 0 else 0
        # Sharpe ve Sortino Oranı (günlük)
        if len(getiriler) > 1:
            getiriler_np = np.array(getiriler)
            sharpe = (np.mean(getiriler_np) / (np.std(getiriler_np) + 1e-9)) * np.sqrt(252)
            sortino = (np.mean(getiriler_np) / (np.std(getiriler_np[getiriler_np<0]) + 1e-9)) * np.sqrt(252)
        else:
            sharpe = 0
            sortino = 0
        # Ortalama işlem getirisi
        ortalama_islem_getirisi = float(np.mean(getiriler)) if len(getiriler) > 0 else 0
        # Aylık ortalama işlem
        gun_sayisi = (fiyatlar.index[-1] - fiyatlar.index[0]).days + 1
        aylik_ortalama_islem = len(trades) / (gun_sayisi / 30.44) if gun_sayisi > 0 else 0
        # Al & Tut Getirisi
        al_tut_getirisi = (fiyatlar.iloc[-1] - fiyatlar.iloc[0]) / fiyatlar.iloc[0] if len(fiyatlar) > 1 else 0
        return {
            'islem_sayisi': len(trades),
            'islemler': trades,
            'getiri_orani': bakiye - 1,
            'baslangic_tarihi': str(fiyatlar.index[0]),
            'bitis_tarihi': str(fiyatlar.index[-1]),
            'maksimum_drawdown': maksimum_drawdown,
            'sharpe_orani': sharpe,
            'sortino_orani': sortino,
            'ortalama_islem_getirisi': ortalama_islem_getirisi,
            'aylik_ortalama_islem': aylik_ortalama_islem,
            'al_tut_getirisi': al_tut_getirisi,
            'strateji_getirisi': bakiye - 1
        }
    except Exception as e:
        return {'hata': str(e)}

# fiyat_1sma_stratejisi.py
# Boş fiyat 1SMA stratejisi scripti. Geliştirme için hazır. 