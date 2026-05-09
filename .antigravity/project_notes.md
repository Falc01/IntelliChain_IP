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

## ✅ Progresso Realizado (08/05/2026)

### On-chain (Solana/Anchor)
- **Programa `copyright-registry`**: Implementado com sucesso.
  - Instrução `register_copyright` funcional, salvando `owner`, `content_hash`, `title` e `timestamp`.
  - Uso de macros `InitSpace` para cálculo automático de aluguel (rent).
- **Testes de Integração**: Criados em `tests/copyright_registry.ts` usando Mocha/Chai.
  - Verificam a criação da conta e a persistência correta dos dados na blockchain local.

### Backend (Python/FastAPI)
- **Infraestrutura**: Configurado `docker-compose.yml` para instanciar **MongoDB** e **Mongo Express** localmente.
- **Integração Completa**:
  - `main.py` agora possui endpoints reais para `/verify` (IA), `/admin/pending` e `/admin/resolve`.
  - Lógica de similaridade integrada com o banco de dados (busca embeddings existentes para comparação).
- **IA Local**: Conectado ao **Ollama** para geração de embeddings em tempo real.

### Frontend (Next.js)
- **Dashboard de Registro**: Pronto para conectar ao backend.
- **Painel Administrativo**: Estrutura de revisão humana implementada na UI.
- **Integração de Carteira**: Phantom e Solflare funcionais via `WalletContextProvider`.

## 📝 Decisões Arquiteturais Atuais
1. **Fluxo de Registro**: O backend atua como validador inicial. A transação on-chain só deve ser disparada após o status `APPROVED` do backend (ou aprovação manual do admin).
2. **Persistência Híbrida**: O conteúdo completo e os embeddings ficam no MongoDB (Off-chain), enquanto o Hash e a prova de propriedade ficam na Solana (On-chain).
3. **Escalabilidade**: Uso de Docker para facilitar o setup do ambiente de dados.

## 🚀 Próximos Passos
- Implementar o componente `TransactionFlow` no frontend para assinar e enviar a transação Solana após a verificação do backend.
- Adicionar suporte a arquivos maiores (PDF/Imagens) via processamento de texto no backend.
- Realizar deploy do programa na **Devnet** para testes reais fora do Localhost.
- Finalizar a documentação do usuário.

