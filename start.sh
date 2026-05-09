#!/bin/bash

# IntelliChain IP - One-Button Start Script
# Este script sobe o Docker, o Backend e o Frontend simultaneamente.

echo "🚀 Iniciando IntelliChain IP..."

# Mata processos em background ao fechar o script (Ctrl+C)
trap "kill 0" EXIT

# 0. IA Local (Ollama)
if ! pgrep -x "ollama" > /dev/null
then
    echo "🦙 Iniciando Ollama..."
    ollama serve &
    sleep 2
else
    echo "🦙 Ollama já está rodando."
fi

# 1. Banco de Dados (Docker)

echo "📦 Subindo containers (MongoDB)..."
docker-compose up -d

# 2. Backend (FastAPI)
echo "🐍 Iniciando Backend..."
cd backend
./venv/bin/python -m uvicorn app.main:app --reload &
cd ..

# 3. Frontend (Next.js)
echo "⚛️ Iniciando Frontend..."
cd frontend
npm run dev

# Mantém o script rodando para capturar o Ctrl+C
wait
