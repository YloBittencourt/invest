import express from "express";
import cors from "cors";
import "dotenv/config";
import { createRequire } from "module";

// 1. Bypass no ESM Loader do Node.js
const require = createRequire(import.meta.url);
const yfModule = require("yahoo-finance2");

// 2. Extração segura da Instância do Yahoo Finance
// Se o Node entregar a classe/função, nós instanciamos com "new". 
// Se entregar o objeto pronto, nós o usamos direto.
const YF = yfModule.default || yfModule;
const yahooFinance = typeof YF === "function" ? new YF() : YF;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Rota principal de cotação (Adapter Pattern)
app.get("/api/quote/:ticker", async (req, res) => {
  const rawTicker = req.params.ticker.toUpperCase().trim();

  // Validação estrita de formato (ex: PETR4, VGIR11, GARE11)
  if (!/^[A-Z0-9]{4,7}$/.test(rawTicker)) {
    return res.status(400).json({ error: "Ticker inválido. Use formatos como PETR4 ou VGIR11." });
  }

  // Acopla o sufixo da B3 silenciosamente no back-end
  const symbol = `${rawTicker}.SA`;

  try {
    // 1. Busca os metadados e preço em tempo real
    const quote = await yahooFinance.quote(symbol);

    if (!quote) {
      return res.status(404).json({ error: `Ativo "${rawTicker}" não encontrado.` });
    }

    // 2. Busca a janela de dividendos dos últimos 12 meses
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    let mappedDividends = [];
    try {
      const historical = await yahooFinance.historical(symbol, {
        period1: oneYearAgo.toISOString().split("T")[0],
        events: "dividends",
      });
      
      // Padroniza a resposta para o contrato que o Front-end (Cotacao.tsx) já espera
      mappedDividends = historical.map((d) => ({
        paymentDate: d.date.toISOString(),
        rate: d.dividends,
      }));
    } catch (divError) {
      // Falha silenciosa: Comum em FIIs com ciclos de publicação atrasados
      console.warn(`[investpainel] Histórico de dividendos indisponível para ${symbol}`);
    }

    // 3. Retorno do payload limpo para a Interface
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
    console.error(`[investpainel-server] Erro em ${symbol}:`, err.message);
    
    if (err.message.includes("Not Found") || err.message.includes("No data")) {
        return res.status(404).json({ error: `O ativo "${rawTicker}" não existe ou foi deslistado.` });
    }

    res.status(500).json({ error: "Erro interno ao comunicar com o provedor de dados." });
  }
});

app.listen(PORT, () => {
  console.log(`[investpainel-server] Rodando em http://localhost:${PORT} | Fonte: Yahoo Finance`);
});