import os
import sys
import importlib.util
from polygon_veri_cekme import polygon_veri_cekme
from backtest.backtest_raporlama import raporla

# Kullanıcıdan veri parametrelerini al
print("--- Polygon Veri Parametreleri ---")
ticker = input("Hisse sembolü (örn: AAPL): ")
start_date = input("Başlangıç tarihi (YYYY-MM-DD): ")
end_date = input("Bitiş tarihi (YYYY-MM-DD): ")
print("Veri periyodu seçenekleri: day, hour, 4hour, 5min, 10min, 15min, 20min")
periyot = input("Veri periyodu: ")

# Periyot mapping
periyot_map = {
    'day':    {'timespan': 'day',    'multiplier': 1},
    'hour':   {'timespan': 'hour',   'multiplier': 1},
    '4hour':  {'timespan': 'hour',   'multiplier': 4},
    '5min':   {'timespan': 'minute', 'multiplier': 5},
    '10min':  {'timespan': 'minute', 'multiplier': 10},
    '15min':  {'timespan': 'minute', 'multiplier': 15},
    '20min':  {'timespan': 'minute', 'multiplier': 20},
}

if periyot not in periyot_map:
    print("Geçersiz periyot. Sadece 'day', 'hour', '4hour', '5min', '10min', '15min', '20min' kabul edilir.")
    sys.exit(1)

# Strateji dosyalarının bulunduğu klasör
dir_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'algo_stratejiler')
strateji_dosyalar = [f for f in os.listdir(dir_path) if f.endswith('.py')]
strateji_adlari = [f.replace('.py', '') for f in strateji_dosyalar]

print("\nKullanılabilir stratejiler:")
for i, ad in enumerate(strateji_adlari):
    print(f"{i+1}. {ad}")

secim = input("Lütfen bir strateji seçin (numara girin): ")
try:
    secim_idx = int(secim) - 1
    if secim_idx < 0 or secim_idx >= len(strateji_adlari):
        raise ValueError
except ValueError:
    print("Geçersiz seçim. Çıkılıyor.")
    sys.exit(1)

secilen_modul = strateji_adlari[secim_idx]
modul_yolu = os.path.join(dir_path, secilen_modul + '.py')
spec = importlib.util.spec_from_file_location(secilen_modul, modul_yolu)
strateji_modul = importlib.util.module_from_spec(spec)
spec.loader.exec_module(strateji_modul)

# Polygon'dan veri çek
print("Veri çekiliyor...")
api_params = periyot_map[periyot]
data = polygon_veri_cekme(
    ticker,
    start_date,
    end_date,
    multiplier=api_params['multiplier'],
    timespan=api_params['timespan']
)

# Analiz
if hasattr(strateji_modul, 'run_strategy'):
    sonuc = strateji_modul.run_strategy(data)
    sonuclar = [{'modul': secilen_modul, 'sonuc': sonuc}]
else:
    sonuclar = [{'modul': secilen_modul, 'sonuc': None, 'hata': 'run_strategy fonksiyonu yok'}]

# Raporlama
giris = input("Analiz tamamlandı. Sonuçları ekrana yazdırmak için Enter'a basın...")
raporla(sonuclar) 