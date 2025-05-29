"""
Bu script, al ve tut (buy and hold) stratejisi için analiz fonksiyonları barındırmak amacıyla hazırlanmıştır.
backtest_analiz.py tarafından izole şekilde çağrılır.
"""
# al_ve_tut_stratejisi.py
# Boş strateji scripti. Geliştirme için hazır. 

def al_ve_tut_analiz(fiyatlar, baslangic_tarihi=None, bitis_tarihi=None):
    """
    Klasik satın al ve tut stratejisi uygular. Her seferinde 1 adet hisse senedi için işlem yapar.
    fiyatlar: pandas.Series veya benzeri, tarih indeksli kapanış fiyatları
    baslangic_tarihi, bitis_tarihi: opsiyonel, analiz aralığı
    Dönüş: dict - getiri, alış/bitiş fiyatı, tarih aralığı
    """
    if baslangic_tarihi:
        fiyatlar = fiyatlar[fiyatlar.index >= baslangic_tarihi]
    if bitis_tarihi:
        fiyatlar = fiyatlar[fiyatlar.index <= bitis_tarihi]
    if fiyatlar.empty:
        return {"hata": "Verilen tarih aralığında fiyat verisi yok."}
    ilk_tarih = fiyatlar.index[0]
    son_tarih = fiyatlar.index[-1]
    alis_fiyati = fiyatlar.iloc[0]
    bitis_fiyati = fiyatlar.iloc[-1]
    getiri = (bitis_fiyati - alis_fiyati) / alis_fiyati
    return {
        "baslangic_tarihi": str(ilk_tarih),
        "bitis_tarihi": str(son_tarih),
        "alis_fiyati": float(alis_fiyati),
        "bitis_fiyati": float(bitis_fiyati),
        "getiri": float(getiri)
    } 