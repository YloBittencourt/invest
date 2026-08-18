import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;
const BRAPI_TOKEN = process.env.BRAPI_TOKEN;

if (!BRAPI_TOKEN) {
  console.warn(
    "[investpainel-server] Aviso: BRAPI_TOKEN não está definido em server/.env — as chamadas à Brapi vão falhar."
  );
}

app.use(cors());

// GET /api/quote/PETR4  → cotação atual + proventos (para a página de Cotação)
app.get("/api/quote/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase().trim();

  if (!/^[A-Z0-9]{4,7}$/.test(ticker)) {
    return res.status(400).json({ error: "Ticker inválido." });
  }

  try {
    const url = `https://brapi.dev/api/quote/${ticker}?dividends=true`;
    const brapiResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${BRAPI_TOKEN}` },
    });

    if (brapiResponse.status === 401) {
      return res.status(502).json({
        error: "Token da Brapi inválido ou expirado. Verifique server/.env.",
      });
    }

    if (brapiResponse.status === 402) {
      return res.status(402).json({
        error: `"${ticker}" não está disponível no seu plano atual da Brapi (plano gratuito cobre um conjunto limitado de ativos e, para FIIs, exige o plano Pro). Veja brapi.dev/pricing para os detalhes de cobertura por plano.`,
      });
    }

    if (brapiResponse.status === 429) {
      return res.status(429).json({
        error: "Limite de requisições da Brapi atingido. Tente novamente em instantes.",
      });
    }

    if (!brapiResponse.ok) {
      const brapiBody = await brapiResponse.json().catch(() => null);
      console.error("[investpainel-server] Brapi retornou erro:", brapiResponse.status, brapiBody);
      return res.status(brapiResponse.status).json({
        error: brapiBody?.message || "Não foi possível consultar a cotação agora.",
      });
    }

    const data = await brapiResponse.json();
    const result = data.results?.[0];

    if (!result) {
      return res.status(404).json({ error: `Ativo "${ticker}" não encontrado.` });
    }

    res.json({
      symbol: result.symbol,
      name: result.longName || result.shortName,
      currency: result.currency,
      price: result.regularMarketPrice,
      changePercent: result.regularMarketChangePercent,
      updatedAt: result.regularMarketTime,
      dividends: result.dividendsData?.cashDividends ?? [],
    });
  } catch (err) {
    console.error("[investpainel-server] Erro ao consultar Brapi:", err);
    res.status(500).json({ error: "Erro interno ao consultar a cotação." });
  }
});

app.listen(PORT, () => {
  console.log(`[investpainel-server] Rodando em http://localhost:${PORT}`);
});
