# IntelliChain IP - Project Notes

Este documento serve como memória persistente para o Antigravity sobre as decisões arquiteturais e o escopo do projeto IntelliChain IP.

## 🎯 Objetivo do Projeto
Sistema de registro e gestão de Propriedade Intelectual (IP) na blockchain Solana, focado em garantir a unicidade e a segurança dos registros.

## 🏗️ Stack Tecnológica
- **On-chain:** Solana + Anchor Framework (Rust).
  - Programa principal: `copyright-registry`.
- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS 4).
  - Estética: Dark Mode Premium / Neon.
  - Integração: Solana Wallet Adapter.
- **Backend:** Python (FastAPI).
  - Função: "Gatekeeper" inteligente para verificação de similaridade.
  - Banco de Dados: MongoDB (async via Motor).
  - IA: Ollama (Local) para geração de embeddings.

## 🛠️ Ambiente de Desenvolvimento
- **Sistema:** WSL (Ubuntu).
- **Localização:** `/home/joaof/projetos/intelliChain_IP`.
- **Ambiente Python:** venv em `backend/venv`.

## ✅ Progresso Realizado (05/05/2026)

### Backend (Python/FastAPI)
- Estrutura base criada em `backend/app/`.
- Integração com **MongoDB** configurada em `database.py`.
- Módulo de IA em `ai_engine.py` preparado para usar **Ollama** (`nomic-embed-text`).
- Lógica de Verificação: IPs com similaridade > 0.85 são marcados como `PENDING_REVIEW` para análise humana.
- Criada pasta `/tests/` na raiz do projeto para testes globais.
- **Status dos Testes:** Testes de Frontend estão operacionais; testes de Backend estão pendentes até a criação da instância do MongoDB.

### Frontend (Next.js)
- Configurado `WalletContextProvider` para suporte a Phantom/Solflare.
- **Layout Premium**: Aplicado tema Dark/Neon e fonte Inter.
- **Dashboard de Registro**: Criado formulário com campo de "Dono do IP" auto-preenchido pela carteira e fluxo de análise simulado (Mock).
- **Painel de Admin (`/admin`)**: Implementada trava de segurança via **Whitelist** de endereços de carteira.
- **Limpeza**: Removidos assets padrão do Next.js.

## 📝 Decisões Arquiteturais Atuais
1. **Validação Humana**: Registros suspeitos não são bloqueados permanentemente, mas enviados para uma fila de revisão acessível apenas por administradores via UI.
2. **Identidade via Wallet**: A carteira do usuário é a chave de identidade tanto para registro quanto para permissões administrativas.
3. **Mocks de Interface**: O frontend está operando com mocks para permitir testes de UI enquanto o MongoDB/Ollama não estão totalmente ativos no ambiente local.

## 🚀 Próximos Passos
- Configurar a instância do MongoDB.
- Integrar o frontend real com os endpoints do FastAPI (atualmente usando mocks).
- Implementar a lógica de transação on-chain (Anchor) após a aprovação da IA.
- Desenvolver a página de Documentação.
