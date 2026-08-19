import express from "express";
import cors from "cors";
import "dotenv/config";
import { createRequire } from "module";

// 1. Extração robusta da Instância do Yahoo Finance
const require = createRequire(import.meta.url);
const yfModule = require("yahoo-finance2");

const YF = yfModule.default || yfModule;
const yahooFinance = typeof YF === "function" ? new YF() : YF;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// 2. Rota de Cotações
app.get("/api/quote/:ticker", async (req, res) => {
  const rawTicker = req.params.ticker.toUpperCase().trim();

  if (!/^[A-Z0-9]{4,7}$/.test(rawTicker)) {
    return res.status(400).json({ error: "Ticker inválido. Formato esperado: PETR4, VGIR11" });
  }

  const symbol = `${rawTicker}.SA`;

  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: `Dados indisponíveis para ${rawTicker}.` });
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    let mappedDividends = [];
    try {
      const historical = await yahooFinance.historical(symbol, {
        period1: oneYearAgo.toISOString().split("T")[0],
        events: "dividends",
      });
      
      mappedDividends = historical.map((d) => ({
        paymentDate: d.date.toISOString(),
        rate: d.dividends,
      }));
    } catch (divError) {
      console.warn(`[InvestPainel] Histórico de dividendos vazio/indisponível para ${symbol}`);
    }

    res.json({
      symbol: rawTicker,
      name: quote.longName || quote.shortName || rawTicker,
      currency: quote.currency || "BRL",
      price: quote.regularMarketPrice,
      changePercent: quote.regularMarketChangePercent || 0,
      updatedAt: quote.regularMarketTime,
      dividends: mappedDividends,
    });

  } catch (err) {
    console.error(`[InvestPainel Erro] ${symbol}:`, err.message);
    if (err.message && (err.message.includes("Not Found") || err.message.includes("No data"))) {
        return res.status(404).json({ error: `O ativo "${rawTicker}" não foi localizado na B3.` });
    }
    res.status(502).json({ error: "O servidor do Yahoo Finance rejeitou a conexão." });
  }
});

app.listen(PORT, () => {
  console.log(`[InvestPainel Backend] Operante na porta ${PORT} | Integração: Yahoo Finance`);
});