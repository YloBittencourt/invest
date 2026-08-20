# InvestPainel

Painel de carteira de investimentos B3 — cotação em tempo real, controle de posições com P&L, e proventos estimados. Autenticação via Supabase.

## Status atual

- **Landing page**: completa e responsiva.
- **`/cotacao`**: busca cotação e histórico de dividendos de um ticker da B3 via **Yahoo Finance** (não Brapi — a versão anterior usava Brapi, foi trocada), através do servidor local em `server/`. Funciona em desenvolvimento; **não está deployada em produção** (ver seção "Limitação conhecida" abaixo).
- **`/login` e `/cadastro`**: funcionais, via Supabase Auth (`signInWithPassword` / `signUp`).
- **`/dashboard`**: protegido por autenticação (`PrivateRoute`). Lê transações do Supabase, calcula posições consolidadas (preço médio, patrimônio atual, rentabilidade, proventos estimados) e permite registrar/excluir transações de compra e venda.
- Link "Esqueceu a senha?" na tela de login ainda não tem função (`href="#"`).

## ⚠️ Limitação conhecida — cotações não funcionam em produção

O servidor de cotação (`server/index.js`) é um processo Express separado, feito para rodar localmente na porta 3001. Ele **não está deployado** em nenhum lugar acessível publicamente. Em produção (ex. Vercel), `VITE_API_BASE_URL` não está definida, então o frontend tenta buscar cotação em `http://localhost:3001` do navegador de quem estiver acessando — o que falha sempre. Login e cadastro funcionam normalmente porque dependem só do Supabase; cotação e proventos, não.

Para corrigir: decidir onde o backend de cotação vai rodar em produção (Edge Function do Supabase, serverless function na própria Vercel, ou serviço separado com URL pública) e apontar `VITE_API_BASE_URL` para essa URL.

## Rodando localmente

Pré-requisito: Node.js 18 ou superior (usa `fetch` nativo).

Precisa de **dois processos rodando ao mesmo tempo**: o frontend (Vite) e o servidor de cotação.

**Terminal 1 — servidor de cotação:**

```bash
cd server
npm install
cp .env.example .env   # PORT=3001 já vem preenchido; Yahoo Finance não exige token
npm run dev
```

Sobe em `http://localhost:3001`.

**Terminal 2 — frontend:**

```bash
npm install
cp .env.example .env   # preencha as variáveis do Supabase (ver abaixo)
npm run dev
```

### Variáveis de ambiente (frontend, `.env`)

```
VITE_SUPABASE_URL=            # criar projeto em https://supabase.com
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:3001   # opcional em dev; obrigatório em produção
```

### Variáveis de ambiente (servidor, `server/.env`)

```
PORT=3001
```

## Pendências / próximos passos

- [ ] Deployar o servidor de cotação e configurar `VITE_API_BASE_URL` em produção
- [ ] Confirmar que RLS (Row Level Security) está ativo na tabela `transactions` no Supabase antes de abrir para múltiplos usuários
- [ ] Adicionar `.gitignore` (repo hoje versiona `node_modules` e `.env`)
- [ ] Implementar fluxo de "Esqueceu a senha?"
- [ ] Avaliar substituir `yahoo-finance2` (lib não-oficial, baseada em scraping) por uma fonte de dados mais estável para produção