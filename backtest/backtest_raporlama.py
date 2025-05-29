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

# Bu dosya artık doğrudan çalıştırılmıyor. 