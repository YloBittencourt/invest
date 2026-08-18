import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchQuote, averageDividends12m, Quote, QuoteError } from "../lib/brapi";

type Status = "idle" | "loading" | "error";

const SUGERIDOS = ["PETR4", "VALE3", "MXRF11", "IVVB11"];

export default function Cotacao() {
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  async function handleSearch(e?: FormEvent, targetTicker?: string) {
    if (e) e.preventDefault();
    
    const query = (targetTicker || ticker).trim().toUpperCase();
    if (!query) return;

    setTicker(query); // Atualiza o input se o clique veio de uma sugestão
    setStatus("loading");
    setError(null);
    setQuote(null);

    try {
      const result = await fetchQuote(query);
      setQuote(result);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof QuoteError ? err.message : "Ativo não encontrado ou API indisponível.");
    }
  }

  const hasDividends = Array.isArray(quote?.dividends) && quote.dividends.length > 0;
  const avgDividend = hasDividends ? averageDividends12m(quote!.dividends) : null;
  const changePercent = quote?.changePercent ?? 0;
  const isGain = changePercent >= 0;
  const currentPrice = quote?.price ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      
      {/* HEADER MINIMALISTA */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-lg tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
            InvestPainel
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-8">
          <span className="inline-block py-1 px-2.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-semibold tracking-wider mb-4">
            MÓDULO DE COTAÇÕES
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Analise ativos da B3
          </h1>
          <p className="text-slate-600">
            Acompanhe o preço em tempo real e o histórico de proventos de Ações, FIIs e ETFs.
          </p>
        </div>

        {/* ÁREA DE BUSCA */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-all">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Digite o ticker (ex: CPTI11)"
              className="flex-1 bg-transparent px-4 py-3 font-mono text-slate-900 placeholder:text-gray-400 outline-none uppercase"
              autoCapitalize="characters"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={status === "loading" || !ticker.trim()}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando
                </span>
              ) : (
                "Consultar"
              )}
            </button>
          </form>
        </div>

        {/* SUGESTÕES RÁPIDAS (UX) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-2">Buscas comuns:</span>
          {SUGERIDOS.map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => handleSearch(undefined, sugestao)}
              disabled={status === "loading"}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-600 bg-white border border-gray-200 rounded-md hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              {sugestao}
            </button>
          ))}
        </div>

        {/* MENSAGEM DE ERRO */}
        {status === "error" && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 animate-fade-in-up">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* RESULTADO (CARD) */}
        {quote && status === "idle" && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm animate-fade-in-up">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="font-mono text-3xl font-black text-slate-900 tracking-tight">{quote.symbol}</h2>
                  <p className="text-slate-500 mt-1 font-medium">{quote.name || "Nome indisponível"}</p>
                </div>
                <div className="md:text-right">
                  <span className="tabular-nums font-mono text-4xl font-bold text-slate-900 block">
                    <span className="text-lg text-slate-400 font-sans mr-1">{quote.currency || "BRL"}</span>
                    {currentPrice.toFixed(2)}
                  </span>
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-sm font-medium ${isGain ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    <span>{isGain ? "▲" : "▼"}</span>
                    <span className="tabular-nums">{Math.abs(changePercent).toFixed(2)}% hoje</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proventos (Média 12 Meses)
                </span>
                <p className="tabular-nums mt-2 font-mono text-xl text-slate-900">
                  {avgDividend !== null
                    ? <><span className="text-slate-400 text-sm font-sans mr-1">{quote.currency || "BRL"}</span>{avgDividend.toFixed(4)} <span className="text-sm font-sans text-slate-500">/ pagamento</span></>
                    : <span className="text-sm font-sans text-slate-500 italic">Histórico indisponível no provedor de dados.</span>}
                </p>
              </div>
            </div>
            
            {quote.updatedAt && (
              <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  Última sincronização
                </p>
                <p className="text-xs font-mono text-slate-500">
                  {new Date(quote.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}