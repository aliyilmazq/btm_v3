"""
Bu script, backtest_analiz.py  analiz sonuçlarını backtest_raporlama.py ile raporlar.
Analiz ve raporlama işlemlerini birbirinden izole tutar.
"""
import json
import os

SONUC_DOSYASI = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backtest_sonuclar.json')

def raporla(sonuclar):
    print("\n--- Backtest Sonuçları ---\n")
    for sonuc in sonuclar:
        modul = sonuc.get('modul')
        hata = sonuc.get('hata')
        if hata:
            print(f"{modul}: HATA - {hata}")
        else:
            print(f"{modul}: {sonuc.get('sonuc')}")

# Bu dosya artık doğrudan çalıştırılmıyor. 