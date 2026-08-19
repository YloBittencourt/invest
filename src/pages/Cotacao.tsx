import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchQuote, averageDividends12m, Quote, QuoteError } from "../lib/brapi";

type Status = "idle" | "loading" | "error";

const SUGERIDOS = ["VALE3", "PETR4", "VGIR11", "MXRF11", "IVVB11"];

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

    try {
      const result = await fetchQuote(query);
      setQuote(result);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof QuoteError ? err.message : "Erro crítico de conexão com o servidor.");
    }
  }

  const hasDividends = Array.isArray(quote?.dividends) && quote.dividends.length > 0;
  const avgDividend = hasDividends ? averageDividends12m(quote!.dividends) : null;
  const changePercent = quote?.changePercent ?? 0;
  const isGain = changePercent >= 0;
  const currentPrice = quote?.price ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md"></div>
            InvestPainel
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        
        {/* COLUNA ESQUERDA: CONTROLES DE BUSCA */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div>
            <span className="inline-flex items-center gap-2 py-1 px-2.5 rounded-md bg-slate-900 border border-white/10 text-slate-400 font-mono text-[10px] uppercase font-semibold tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Terminal de Mercado
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Pesquisa de Ativos
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Consulte dados da B3 em tempo real sincronizados via Yahoo Finance.
            </p>
          </div>

          <div className="bg-slate-900 p-1.5 rounded-xl border border-white/10 shadow-lg focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
            <form onSubmit={handleSearch} className="flex flex-col gap-2">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Ex: GARE11"
                className="w-full bg-slate-950 rounded-lg px-4 py-3 font-mono text-xl text-white placeholder:text-slate-700 outline-none uppercase border border-white/5"
                autoCapitalize="characters"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={status === "loading" || !ticker.trim()}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando
                  </>
                ) : (
                  "Consultar Mercado"
                )}
              </button>
            </form>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Buscas Frequentes</p>
            <div className="flex flex-wrap gap-2">
              {SUGERIDOS.map((sugestao) => (
                <button
                  key={sugestao}
                  onClick={() => handleSearch(undefined, sugestao)}
                  disabled={status === "loading"}
                  className="px-3 py-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-white/5 rounded-md hover:border-white/20 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: VISUALIZAÇÃO DE DADOS */}
        <div className="w-full md:w-2/3 flex flex-col">
          
          {/* Empty State */}
          {status === "idle" && !quote && !error && (
            <div className="flex-1 rounded-2xl border border-white/5 bg-slate-900/30 border-dashed flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Aguardando consulta</p>
              <p className="text-slate-600 text-sm mt-1 max-w-xs">Insira o código de um ativo no painel ao lado para visualizar as métricas.</p>
            </div>
          )}

          {/* Estado de Erro */}
          {status === "error" && error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 flex gap-4 items-start animate-fade-in-up">
              <div className="bg-rose-500/20 p-2 rounded-lg mt-0.5">
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-300 mb-1">Falha na Requisição</h3>
                <p className="text-sm text-rose-200/70 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Resultado da Busca */}
          {quote && status === "idle" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 shadow-2xl relative overflow-hidden animate-fade-in-up">
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/3 ${isGain ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

              <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                  <div>
                    <h2 className="font-mono text-5xl font-black text-white tracking-tighter">{quote.symbol}</h2>
                    <p className="text-slate-400 mt-2 font-medium max-w-sm">{quote.name || "Nome do ativo indisponível"}</p>
                  </div>
                  <div className="md:text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Cotação Atual</span>
                    <span className="tabular-nums font-mono text-4xl font-bold text-white block">
                      <span className="text-xl text-slate-500 font-sans mr-2">{quote.currency || "BRL"}</span>
                      {currentPrice.toFixed(2)}
                    </span>
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-md text-sm font-bold ${isGain ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                      <span>{isGain ? "▲" : "▼"}</span>
                      <span className="tabular-nums">{Math.abs(changePercent).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                  <div className="bg-slate-950/50 p-5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Média de Dividendos (12m)</span>
                    <p className="tabular-nums font-mono text-2xl text-white">
                      {avgDividend !== null
                        ? <><span className="text-slate-500 text-sm font-sans mr-1">{quote.currency || "BRL"}</span>{avgDividend.toFixed(4)}</>
                        : <span className="text-sm font-sans text-slate-500">N/A</span>}
                    </p>
                  </div>
                  
                  <div className="bg-slate-950/50 p-5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Última Sincronização</span>
                    <p className="tabular-nums font-mono text-sm text-slate-300 mt-2">
                      {quote.updatedAt ? new Date(quote.updatedAt).toLocaleString("pt-BR") : "Desconhecido"}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1 uppercase">Fonte: Yahoo Finance API</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>   
  );
}