import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchQuote, averageDividends12m, Quote, QuoteError } from "../lib/brapi";

type Status = "idle" | "loading" | "error";

const SUGERIDOS = ["PETR4", "VALE3", "MXRF11", "VGIR11"];

export function Cotacao() {
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  async function handleSearch(e?: FormEvent, targetTicker?: string) {
    if (e) e.preventDefault();
    
    const query = (targetTicker || ticker).trim().toUpperCase();
    if (!query) return;

    setTicker(query);
    setStatus("loading");
    setError(null);
    setQuote(null);

    console.log(`[Frontend] Iniciando busca pelo ativo: ${query}`);

    try {
      const result = await fetchQuote(query);
      console.log(`[Frontend] Dados recebidos com sucesso:`, result);
      setQuote(result);
      setStatus("idle");
    } catch (err) {
      console.error(`[Frontend] Falha na busca:`, err);
      setStatus("error");
      setError(
        err instanceof QuoteError 
          ? err.message 
          : "Erro fatal: Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      );
    }
  }

  // Programação Defensiva contra FIIs sem histórico de dividendos
  const hasDividends = Array.isArray(quote?.dividends) && quote.dividends.length > 0;
  const avgDividend = hasDividends ? averageDividends12m(quote!.dividends) : null;
  const changePercent = quote?.changePercent ?? 0;
  const isGain = changePercent >= 0;
  const currentPrice = quote?.price ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* HEADER DARK */}
      <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md"></div>
            InvestPainel
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-20">
        
        {/* TÍTULO E INTRODUÇÃO */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 py-1 px-2.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-semibold tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            MÓDULO DE COTAÇÕES
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Analise ativos da B3
          </h1>
          <p className="text-slate-400 text-lg">
            Acompanhe o preço em tempo real e o histórico de proventos de Ações, FIIs e ETFs.
          </p>
        </div>

        {/* ÁREA DE BUSCA (INPUT) */}
        <div className="bg-slate-900 p-2 rounded-xl border border-white/10 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all relative z-20">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="DIGITE O TICKER (EX: GARE11)"
              className="flex-1 bg-transparent px-4 py-3 font-mono text-lg text-white placeholder:text-slate-600 outline-none uppercase"
              autoCapitalize="characters"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={status === "loading" || !ticker.trim()}
              className="rounded-lg bg-white px-8 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-gray-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {status === "loading" ? (
                <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Consultar"
              )}
            </button>
          </form>
        </div>

        {/* SUGESTÕES RÁPIDAS */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mr-2">Buscas comuns:</span>
          {SUGERIDOS.map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => handleSearch(undefined, sugestao)}
              disabled={status === "loading"}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-white/5 rounded-md hover:border-white/20 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {sugestao}
            </button>
          ))}
        </div>

        {/* FEEDBACK DE ERRO */}
        {status === "error" && error && (
          <div className="mt-8 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex gap-3 animate-fade-in-up">
            <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-rose-200 leading-relaxed">{error}</p>
          </div>
        )}

        {/* MOCKUP DO RESULTADO (CARD) */}
        {quote && status === "idle" && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl relative overflow-hidden animate-fade-in-up">
            
            {/* Efeito visual no card */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-10 -mt-10 rounded-full opacity-20 pointer-events-none ${isGain ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h2 className="font-mono text-4xl font-black text-white tracking-tight">{quote.symbol}</h2>
                  <p className="text-slate-400 mt-1 font-medium">{quote.name || "Nome indisponível na B3"}</p>
                </div>
                <div className="md:text-right">
                  <span className="tabular-nums font-mono text-4xl font-bold text-white block">
                    <span className="text-xl text-slate-500 font-sans mr-1.5">{quote.currency || "BRL"}</span>
                    {currentPrice.toFixed(2)}
                  </span>
                  <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${isGain ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                    <span>{isGain ? "▲" : "▼"}</span>
                    <span className="tabular-nums">{Math.abs(changePercent).toFixed(2)}% hoje</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proventos (Média 12 Meses)
                </span>
                <p className="tabular-nums mt-3 font-mono text-2xl text-white">
                  {avgDividend !== null
                    ? <><span className="text-slate-500 text-base font-sans mr-1">{quote.currency || "BRL"}</span>{avgDividend.toFixed(4)} <span className="text-sm font-sans font-medium text-slate-500 ml-1">/ por cota</span></>
                    : <span className="text-sm font-sans text-slate-500 italic">Histórico indisponível no provedor de dados.</span>}
                </p>
              </div>
            </div>
            
            {quote.updatedAt && (
              <div className="bg-slate-950/50 px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-500">
                  Fonte: Yahoo Finance (Sincronizado via API)
                </p>
                <p className="text-xs font-mono text-slate-500">
                  Atualizado em: {new Date(quote.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}