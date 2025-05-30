"""
Bu script, 1EMA (Üssel Hareketli Ortalama) fiyat stratejisi için analiz fonksiyonları barındırmak amacıyla hazırlanmıştır.
backtest_analiz.py tarafından izole şekilde çağrılır.
"""
# fiyat_1ema_stratejisi.py
# Boş fiyat 1EMA stratejisi scripti. Geliştirme için hazır. 

import pandas as pd

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
        ema_period = params.get('ema_period')
        allow_short = params.get('allow_short', False)
        use_take_profit = params.get('use_take_profit', False)
        take_profit = params.get('take_profit')
        use_trailing_stop = params.get('use_trailing_stop', False)
        trailing_stop = params.get('trailing_stop')

        # Validasyon
        if not ema_period or ema_period < 1:
            return {'hata': 'EMA periyodu pozitif bir sayı olmalı.'}
        if use_take_profit and (take_profit is None or take_profit <= 0):
            return {'hata': 'Take profit yüzdesi pozitif bir sayı olmalı.'}
        if use_trailing_stop and (trailing_stop is None or trailing_stop <= 0):
            return {'hata': 'Trailing stop yüzdesi pozitif bir sayı olmalı.'}

        ema = fiyatlar.ewm(span=ema_period, adjust=False).mean()
        pozisyon = None
        entry_price = 0
        max_price = 0
        trades = []
        for i in range(1, len(fiyatlar)):
            fiyat = fiyatlar.iloc[i]
            onceki_fiyat = fiyatlar.iloc[i-1]
            ema_now = ema.iloc[i]
            ema_prev = ema.iloc[i-1]
            tarih = fiyatlar.index[i]
            # Sinyal: Fiyat EMA'yı yukarı keserse AL, aşağı keserse SAT
            al_sinyali = onceki_fiyat < ema_prev and fiyat >= ema_now
            sat_sinyali = onceki_fiyat > ema_prev and fiyat <= ema_now
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
                if use_take_profit and fiyat >= entry_price * (1 + take_profit/100):
                    trades.append({'tarih': str(tarih), 'islem': 'TP-SELL', 'fiyat': float(fiyat)})
                    pozisyon = None
                elif use_trailing_stop:
                    if fiyat > max_price:
                        max_price = fiyat
                    stop_price = max_price * (1 - trailing_stop/100)
                    if fiyat <= stop_price:
                        trades.append({'tarih': str(tarih), 'islem': 'TSL-SELL', 'fiyat': float(fiyat)})
                        pozisyon = None
                elif sat_sinyali and allow_short:
                    trades.append({'tarih': str(tarih), 'islem': 'EMA-SELL', 'fiyat': float(fiyat)})
                    pozisyon = None
            elif pozisyon == 'short':
                if use_take_profit and fiyat <= entry_price * (1 - take_profit/100):
                    trades.append({'tarih': str(tarih), 'islem': 'TP-COVER', 'fiyat': float(fiyat)})
                    pozisyon = None
                elif use_trailing_stop:
                    if fiyat < max_price:
                        max_price = fiyat
                    stop_price = max_price * (1 + trailing_stop/100)
                    if fiyat >= stop_price:
                        trades.append({'tarih': str(tarih), 'islem': 'TSL-COVER', 'fiyat': float(fiyat)})
                        pozisyon = None
                elif al_sinyali:
                    trades.append({'tarih': str(tarih), 'islem': 'EMA-COVER', 'fiyat': float(fiyat)})
                    pozisyon = None
        if pozisyon is not None:
            trades.append({'tarih': str(fiyatlar.index[-1]), 'islem': 'KAPAT', 'fiyat': float(fiyatlar.iloc[-1])})
        bakiye = 1.0
        aktif_poz = None
        for t in trades:
            if t['islem'] == 'AL':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-SELL', 'TSL-SELL', 'EMA-SELL', 'KAPAT'] and aktif_poz is not None:
                bakiye *= t['fiyat'] / aktif_poz
                aktif_poz = None
            elif t['islem'] == 'SHORT':
                aktif_poz = t['fiyat']
            elif t['islem'] in ['TP-COVER', 'TSL-COVER', 'EMA-COVER', 'KAPAT'] and aktif_poz is not None:
                bakiye *= aktif_poz / t['fiyat']
                aktif_poz = None
        return {
            'islem_sayisi': len(trades),
            'islemler': trades,
            'getiri_orani': bakiye - 1,
            'baslangic_tarihi': str(fiyatlar.index[0]),
            'bitis_tarihi': str(fiyatlar.index[-1])
        }
    except Exception as e:
        return {'hata': str(e)} 