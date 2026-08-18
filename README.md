# InvestPainel

Landing page do InvestPainel — painel de cotação B3, carteira com P&L e análise de fundos por IA.

## Status desta etapa

- **Landing page**: completa e responsiva. Os números do ticker tape e da
  mini-carteira do hero são ilustração de produto (marcados no código como
  "dados de exemplo") — não são dados reais.
- **`/cotacao`**: funcional de verdade, busca preço atual e histórico de
  dividendos de um ticker real na B3 via Brapi, através do servidor local em
  `server/`. **Ainda sem tela de erro testada contra a API ao vivo** — o
  código foi validado por tipo e sintaxe, mas eu não consegui fazer uma
  chamada de rede real à Brapi neste ambiente (domínio fora da lista
  liberada aqui). Teste localmente antes de confiar 100%.
- **`/login`, `/carteira`, `/analise-fundos`**: ainda são placeholders —
  dependem do Supabase, que você ainda não configurou.
- **Nenhuma rota está protegida por login ainda** — `/cotacao` está acessível
  para qualquer pessoa que tenha a URL, mesmo sem conta.

## Rodando localmente

Pré-requisito: Node.js 18 ou superior (usa `fetch` nativo).

A busca de cotação (`/cotacao`) já funciona de verdade, mas precisa de **dois
processos rodando ao mesmo tempo**: o frontend (Vite) e um servidor local que
guarda o token da Brapi longe do navegador.

**Terminal 1 — servidor de cotação:**

```bash
cd server
npm install
cp .env.example .env   # depois edite .env e cole seu token da Brapi
npm run dev
```

Sobe em `http://localhost:3001`.

**Terminal 2 — frontend:**

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

> Por que dois servidores? A própria documentação da Brapi orienta a nunca
> expor o token no código do frontend — ele ficaria visível para qualquer
> pessoa que abrisse o DevTools do navegador. O `server/` é um proxy mínimo
> que resolve isso localmente, sem precisar configurar Supabase ainda. Quando
> você criar o projeto Supabase, esse servidor pode virar uma Edge Function,
> trocando muito pouco no frontend.

Para gerar build de produção do frontend:

```bash
npm run build
npm run preview
```

(O `server/` não tem build — é só `node index.js` em produção também, ou você
migra a lógica dele para uma Edge Function do Supabase.)

## Estrutura do projeto

```
src/
  components/
    Navbar.tsx        → cabeçalho fixo com navegação
    TickerTape.tsx     → fita de cotações (elemento de assinatura visual)
    WatchlistCard.tsx  → mockup da carteira, usado no hero
  pages/
    Landing.tsx        → a landing page completa
    ComingSoon.tsx      → placeholder das rotas ainda não implementadas
  App.tsx              → definição de rotas
  main.tsx             → entrada da aplicação
  index.css            → Tailwind + estilos globais
tailwind.config.js     → paleta, tipografia e tokens de design
```

## Próximas etapas (ainda não implementadas)

Estas dependem de contas em serviços externos que só você pode provisionar:

1. **Autenticação (`/login`)** — via Supabase Auth. Requer criar um projeto em
   [supabase.com](https://supabase.com) e preencher `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` no `.env` (veja `.env.example`).

2. **Cotação (`/cotacao`)** — via API da [Brapi](https://brapi.dev). Requer criar
   uma conta gratuita lá e gerar um token. O token deve ficar numa Supabase Edge
   Function (backend), nunca exposto no frontend.

3. **Carteira (`/carteira`)** — tabela no Supabase com Row Level Security, para
   que cada usuário só veja os próprios ativos. O cálculo de P&L usa a mesma
   integração da cotação.

4. **Análise de fundos (`/analise-fundos`)** — upload/link de PDF, extração de
   texto e envio para a API da Anthropic a partir de uma Edge Function (a chave
   `ANTHROPIC_API_KEY` nunca deve rodar no navegador do usuário).

Quando você tiver as contas do Supabase e da Brapi criadas, me avise que eu
implemento a próxima etapa em cima do que já está pronto aqui — sem reescrever
o que já funciona.

## Aviso legal

O rodapé já inclui o texto "InvestPainel não é uma corretora e não presta
recomendação de investimento" — mantenha isso visível em todas as páginas do
produto; é relevante para conformidade ao lidar com dados financeiros no Brasil.
# invest
