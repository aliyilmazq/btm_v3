# Proje Scriptleri ve Amaçları

- polygon_veri_cekme.py: Polygon.io API'sinden hisse senedi OHLCV verilerini çekmek için kullanılır. Diğer analiz ve strateji scriptleri için veri kaynağıdır.
- backtest/: Bu klasör, backtest işlemleriyle ilgili tüm scriptleri ve sonuç dosyasını içerir:
    - backtest_analiz.py: Polygon.io'dan veri çeker, algo_stratejiler klasöründeki tüm strateji dosyalarını izole şekilde çalıştırır ve analiz sonuçlarını backtest_sonuclar.json dosyasına kaydeder. Strateji dosyalarına veya mevcut kodlara müdahale etmez.
    - backtest_raporlama.py: backtest_analiz.py tarafından oluşturulan backtest_sonuclar.json dosyasını okur ve analiz sonuçlarını ekrana yazdırır. Analiz ve raporlama işlemlerini birbirinden izole tutar.
    - backtest_sonuclar.json: Analiz sonuçlarının kaydedildiği dosyadır.
- algo_stratejiler/*: Her bir script, ilgili fiyat/teknik analiz stratejisi için analiz fonksiyonları barındırmak amacıyla hazırlanmıştır. backtest_analiz.py tarafından izole şekilde çağrılır. Scriptler: fiyat_1sma_stratejisi.py, fiyat_2sma_stratejisi.py, fiyat_1ema_stratejisi.py, fiyat_2ema_stratejisi.py, arima_stratejisi.py, rsi_stratejisi.py, al_ve_tut_stratejisi.py

Her script yalnızca kendi görevini yerine getirir ve diğerlerinden izole çalışır. Cursor ile geliştirme yaparken scriptleri amacına uygun şekilde kullanınız. 