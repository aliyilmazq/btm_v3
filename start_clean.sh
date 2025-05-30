#!/bin/bash

# Önce eski süreçleri öldür
lsof -ti :8000 -sTCP:LISTEN | xargs kill -9 2>/dev/null
lsof -ti :3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null

# 1 saniye bekle
sleep 1

echo "npm start ile tüm servisler başlatılıyor..."
npm start 