from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from fastapi.responses import JSONResponse
from fastapi import status
import importlib.util
import sys
from polygon_veri_cekme import polygon_veri_cekme

app = FastAPI()

# CORS ayarları (gerekirse frontend ile localde çalışmak için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/strategies")
def get_strategies():
    """
    algo_stratejiler klasöründeki tüm strateji dosyalarını (py) listeler.
    """
    try:
        strateji_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "algo_stratejiler")
        dosyalar = [f for f in os.listdir(strateji_dir) if f.endswith(".py") and not f.startswith("_")]
        strateji_adlari = [f.replace(".py", "") for f in dosyalar]
        return {"strategies": strateji_adlari}
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": f"Strateji listesi alınamadı: {str(e)}"})

@app.post("/analyze")
async def analyze(request: Request):
    try:
        data = await request.json()
        ticker = data.get("ticker")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        periyot = data.get("periyot")
        strategy = data.get("strategy")
        if not all([ticker, start_date, end_date, periyot, strategy]):
            return JSONResponse(status_code=400, content={"status": "error", "error": "Eksik parametre."})

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
            return JSONResponse(status_code=400, content={"status": "error", "error": "Geçersiz periyot."})
        api_params = periyot_map[periyot]

        # Polygon'dan veri çek
        veri = polygon_veri_cekme(
            ticker,
            start_date,
            end_date,
            multiplier=api_params['multiplier'],
            timespan=api_params['timespan']
        )

        # Strateji modülünü izole yükle
        strateji_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "algo_stratejiler")
        modul_yolu = os.path.join(strateji_dir, strategy + ".py")
        if not os.path.exists(modul_yolu):
            return JSONResponse(status_code=400, content={"status": "error", "error": "Strateji dosyası bulunamadı."})
        spec = importlib.util.spec_from_file_location(strategy, modul_yolu)
        strateji_modul = importlib.util.module_from_spec(spec)
        sys.modules[strategy] = strateji_modul
        try:
            spec.loader.exec_module(strateji_modul)
        except Exception as e:
            return JSONResponse(status_code=500, content={"status": "error", "error": f"Strateji modülü yüklenemedi: {str(e)}"})

        # Strateji fonksiyonunu çağır
        if hasattr(strateji_modul, 'run_strategy'):
            try:
                if strategy == "fiyat_1sma_stratejisi":
                    params = {
                        "sma_period": data.get("sma_period"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                elif strategy == "fiyat_2sma_stratejisi":
                    params = {
                        "sma_short": data.get("sma_short"),
                        "sma_long": data.get("sma_long"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                elif strategy == "fiyat_1ema_stratejisi":
                    params = {
                        "ema_period": data.get("ema_period"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                elif strategy == "fiyat_2ema_stratejisi":
                    params = {
                        "ema_short": data.get("ema_short"),
                        "ema_long": data.get("ema_long"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                elif strategy == "arima_stratejisi":
                    params = {
                        "p": data.get("p"),
                        "d": data.get("d"),
                        "q": data.get("q"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                elif strategy == "rsi_stratejisi":
                    params = {
                        "rsi_period": data.get("rsi_period"),
                        "oversold": data.get("oversold"),
                        "overbought": data.get("overbought"),
                        "allow_short": data.get("allow_short", False),
                        "use_take_profit": data.get("use_take_profit", False),
                        "take_profit": data.get("take_profit"),
                        "use_trailing_stop": data.get("use_trailing_stop", False),
                        "trailing_stop": data.get("trailing_stop")
                    }
                    sonuc = strateji_modul.run_strategy(veri, params)
                else:
                    sonuc = strateji_modul.run_strategy(veri)
                return {"status": "success", "result": sonuc}
            except Exception as e:
                return JSONResponse(status_code=500, content={"status": "error", "error": f"Strateji çalıştırılırken hata: {str(e)}"})
        else:
            return JSONResponse(status_code=500, content={"status": "error", "error": "Seçilen strateji dosyasında run_strategy fonksiyonu yok."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "error": f"Analiz sırasında beklenmeyen hata: {str(e)}"}) 