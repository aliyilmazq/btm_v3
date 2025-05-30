import os
import requests
from dotenv import load_dotenv

"""
Bu script, Polygon.io API'sinden hisse senedi OHLCV (açılış, yüksek, düşük, kapanış, hacim) verilerini çekmek için kullanılır.
Diğer analiz ve strateji scriptleri için veri kaynağı olarak görev yapar.
"""

# .env dosyasından API anahtarını yükle
load_dotenv()
API_KEY = os.getenv("POLYGON_API_KEY")

def polygon_veri_cekme(ticker, start_date, end_date, multiplier=1, timespan="day"):
    """
    Polygon.io üzerinden belirtilen hisse senedinin OHLCV verilerini çeker.
    :param ticker: Hisse senedi sembolü (ör: 'AAPL')
    :param start_date: Başlangıç tarihi (YYYY-MM-DD)
    :param end_date: Bitiş tarihi (YYYY-MM-DD)
    :param multiplier: Zaman aralığı çarpanı (varsayılan: 1)
    :param timespan: Zaman aralığı türü (ör: 'day', 'minute')
    :return: JSON veri
    """
    url = (
        f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/"
        f"{multiplier}/{timespan}/{start_date}/{end_date}"
    )
    params = {"apiKey": API_KEY}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

# Örnek kullanım (doğrudan çalıştırılırsa)
if __name__ == "__main__":
    data = polygon_veri_cekme("AAPL", "2023-01-01", "2023-01-31")
    print(data) 