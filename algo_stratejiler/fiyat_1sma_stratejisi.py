"""
Bu script, 1SMA (Basit Hareketli Ortalama) fiyat stratejisi için analiz fonksiyonları barındırmak amacıyla hazırlanmıştır.
backtest_analiz.py tarafından izole şekilde çağrılır.
"""

def run_strategy(data):
    # Örnek analiz: veri kaç gün içeriyor?
    try:
        return {'veri_gun_sayisi': len(data.get('results', []))}
    except Exception as e:
        return {'hata': str(e)}
# fiyat_1sma_stratejisi.py
# Boş fiyat 1SMA stratejisi scripti. Geliştirme için hazır. 