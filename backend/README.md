# Proje Yapısı, Scriptler ve Amaçları

## Genel Mimari
- **Tamamen izole ve modüler yapı:** Her script ve modül yalnızca kendi görevini yapar, diğerlerinden bağımsızdır. Geliştirme sırasında mevcut kodlar bozulmaz, yeni eklemeler izole yapılır.
- **Frontend (SPA & PWA):**
    - React tabanlı, responsive ve stepper (adım adım) kullanıcı arayüzü.
    - Kullanıcıdan hisse sembolü, tarih aralığı, periyot alınır → Backend'den strateji listesi çekilir → Kullanıcı strateji seçer → Analiz isteği backend'e gönderilir → Sonuç ve hata mesajı ekranda gösterilir.
    - Frontend hiçbir iş mantığı, veri işleme veya matematiksel analiz yapmaz. Sadece API ile konuşur, gelen cevabı gösterir.
    - Rapor ve hata mesajları backend'den döner, frontend sadece gösterir.
    - Kodlar: `frontend/src/App.js`, `frontend/src/components/Step1VeriParametreleri.js`, `Step2StratejiSecimi.js`, `Step3AnalizSonuc.js`
- **Backend (Python):**
    - Polygon.io'dan veri çeker, analiz ve strateji scriptlerini izole şekilde çalıştırır, sonuçları ve hataları yönetir.
    - Her analiz/strateji scripti izole çağrılır, mevcut kodlara müdahale edilmez.
    - Hata ve raporlamalar loglanır (`butun_hata_kayitlari.log`).
    - Kodlar: `main.py`, `polygon_veri_cekme.py`, `backtest/`, `algo_stratejiler/`

## Scriptler ve Klasörler
- **polygon_veri_cekme.py:** Polygon.io API'sinden hisse senedi OHLCV verilerini çeker. Diğer analiz ve strateji scriptleri için veri kaynağıdır.
- **backtest/**: Backtest işlemleriyle ilgili tüm scriptleri ve sonuç dosyasını içerir:
    - `backtest_analiz.py`: Polygon.io'dan veri çeker, `algo_stratejiler` klasöründeki tüm strateji dosyalarını izole şekilde çalıştırır ve analiz sonuçlarını `backtest_sonuclar.json` dosyasına kaydeder. Strateji dosyalarına veya mevcut kodlara müdahale etmez.
    - `backtest_raporlama.py`: `backtest_analiz.py` tarafından oluşturulan `backtest_sonuclar.json` dosyasını okur ve analiz sonuçlarını ekrana yazdırır. Analiz ve raporlama işlemleri birbirinden izole tutulur.
    - `backtest_sonuclar.json`: Analiz sonuçlarının kaydedildiği dosya.
- **algo_stratejiler/**: Her bir script, ilgili fiyat/teknik analiz stratejisi için analiz fonksiyonları barındırır. `backtest_analiz.py` tarafından izole şekilde çağrılır. Scriptler:
    - `fiyat_1sma_stratejisi.py`, `fiyat_2sma_stratejisi.py`, `fiyat_1ema_stratejisi.py`, `fiyat_2ema_stratejisi.py`, `arima_stratejisi.py`, `rsi_stratejisi.py`, `al_ve_tut_stratejisi.py`

## Otomatik Başlatma ve Test
- Proje kökünde `npm start` veya `yarn start` ile hem backend (uvicorn ile) hem frontend otomatik başlatılır.
- Her fazın sonunda ve entegrasyon noktalarında test yapılır.
- Integration point'lerde (ör. frontend-backend API, analiz-raporlama) tam test zorunludur.

## Entegrasyon Akışı (Özet)
1. **Adım 1:** Kullanıcıdan hisse sembolü, tarih aralığı, periyot alınır (frontend).
2. **Adım 2:** Backend'den strateji listesi çekilir, kullanıcı birini seçer (frontend → backend API: `/strategies`).
3. **Adım 3:** "Analiz Et" butonuna basınca, tüm parametreler backend'e gönderilir (frontend → backend API: `/analyze`).
4. **Adım 4:** Backend'den gelen analiz sonucu ve rapor ekranda gösterilir (hata varsa hata mesajı da gösterilir).

## Notlar
- Her script yalnızca kendi görevini yerine getirir ve diğerlerinden izole çalışır.
- Geliştirme sırasında mevcut kodlar bozulmaz, yeni eklemeler izole yapılır.
- Cursor ile geliştirme yaparken scriptleri amacına uygun şekilde kullanınız. 