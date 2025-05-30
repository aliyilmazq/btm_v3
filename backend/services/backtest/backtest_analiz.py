"""
bu script, polygon_ver_cekne.py ile gelen verileri algo_stratejiler klasöründeki stratejiler ile backtest eder ve sonuçları backtest_sonuclar.json dosyasına kaydeder.
"""
import os
import importlib.util
import sys
import json
import logging

# Üst dizini sys.path'e ekle (algo_stratejiler ve polygon_veri_cekme için)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from backend.services.polygon_veri_cekme import polygon_veri_cekme

# Strateji dosyalarının bulunduğu klasör
STRATEJI_DIR = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), '../algo_stratejiler')))

# Sonuç dosyası yolu
SONUC_DOSYASI = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backtest_sonuclar.json')

# Strateji dosyalarını bul
strateji_dosyalar = [f for f in os.listdir(STRATEJI_DIR) if f.endswith('.py')]

# Polygon'dan veri çek (örnek parametrelerle)
data = polygon_veri_cekme('AAPL', '2023-01-01', '2023-01-31')

sonuclar = []

# Hata loglama için logging modülü ekleyeceğim. Tüm hata durumlarını ve önemli olayları 'butun_hata_kayitlari.log' dosyasına kaydedeceğim. Ekrana yazılan hata mesajları log dosyasına da yazılacak.
logging.basicConfig(filename='butun_hata_kayitlari.log', level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

# Her strateji dosyasını izole import et ve çalıştır
for dosya in strateji_dosyalar:
    dosya_yolu = os.path.join(STRATEJI_DIR, dosya)
    modul_adi = dosya.replace('.py', '')
    spec = importlib.util.spec_from_file_location(modul_adi, dosya_yolu)
    strateji_modul = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(strateji_modul)
        # run_strategy fonksiyonu varsa çağır
        if hasattr(strateji_modul, 'run_strategy'):
            sonuc = strateji_modul.run_strategy(data)
            sonuclar.append({'modul': modul_adi, 'sonuc': sonuc})
            logging.info(f"{modul_adi} başarıyla çalıştı.")
        else:
            msg = f"{modul_adi}: run_strategy fonksiyonu yok"
            sonuclar.append({'modul': modul_adi, 'sonuc': None, 'hata': "run_strategy fonksiyonu yok"})
            logging.error(msg)
    except Exception as e:
        msg = f"{modul_adi}: {str(e)}"
        sonuclar.append({'modul': modul_adi, 'sonuc': None, 'hata': str(e)})
        logging.error(msg)

# Sonuçları JSON dosyasına kaydet
with open(SONUC_DOSYASI, 'w') as f:
    json.dump(sonuclar, f, ensure_ascii=False, indent=2)

# Analiz bittikten sonra doğrudan raporlama
from backend.services.backtest.backtest_raporlama import raporla
raporla(sonuclar) 