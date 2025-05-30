"""
Bu script, backtest_analiz.py  analiz sonuçlarını backtest_raporlama.py ile raporlar.
Analiz ve raporlama işlemlerini birbirinden izole tutar.
"""
import json
import os
import logging

SONUC_DOSYASI = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backtest_sonuclar.json')

logging.basicConfig(filename='butun_hata_kayitlari.log', level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

def raporla(sonuclar):
    print("\n--- Backtest Sonuçları ---\n")
    for sonuc in sonuclar:
        modul = sonuc.get('modul')
        hata = sonuc.get('hata')
        if hata:
            print(f"{modul}: HATA - {hata}")
            logging.error(f"{modul}: HATA - {hata}")
        else:
            print(f"{modul}: {sonuc.get('sonuc')}")
            logging.info(f"{modul}: {sonuc.get('sonuc')}")

def raporla_json(sonuclar=None):
    if sonuclar is None:
        with open(SONUC_DOSYASI, 'r') as f:
            sonuclar = json.load(f)
    rapor = []
    for sonuc in sonuclar:
        modul = sonuc.get('modul')
        hata = sonuc.get('hata')
        s = sonuc.get('sonuc')
        if hata:
            rapor.append({
                'modul': modul,
                'hata': hata
            })
        else:
            # Sadece önemli metrikleri özetle
            rapor.append({
                'modul': modul,
                'strateji_getirisi': s.get('strateji_getirisi'),
                'al_tut_getirisi': s.get('al_tut_getirisi'),
                'islem_sayisi': s.get('islem_sayisi'),
                'aylik_ortalama_islem': s.get('aylik_ortalama_islem'),
                'ortalama_islem_getirisi': s.get('ortalama_islem_getirisi'),
                'maksimum_drawdown': s.get('maksimum_drawdown'),
                'sharpe_orani': s.get('sharpe_orani'),
                'sortino_orani': s.get('sortino_orani'),
                'baslangic_tarihi': s.get('baslangic_tarihi'),
                'bitis_tarihi': s.get('bitis_tarihi'),
            })
    return rapor

# Bu dosya artık doğrudan çalıştırılmıyor. 