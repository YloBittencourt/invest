import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Verifique se o Navbar também não está usando classes antigas
import { fetchQuote, averageDividends12m, Quote, QuoteError } from "../lib/brapi";

type Status = "idle" | "loading" | "error";

export function Cotacao() {
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    
    // Força o uppercase para evitar erros na requisição da API
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;

    setStatus("loading");
    setError(null);
    setQuote(null);

    try {
      const result = await fetchQuote(cleanTicker);
      setQuote(result);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof QuoteError ? err.message : "Ativo não encontrado ou API indisponível.");
    }
  }

  // Programação Defensiva: Garante que não haverá crash se o ativo não tiver dividendos ou variação no dia
  const hasDividends = Array.isArray(quote?.dividends) && quote.dividends.length > 0;
  const avgDividend = hasDividends ? averageDividends12m(quote!.dividends) : null;
  const changePercent = quote?.changePercent ?? 0;
  const isGain = changePercent >= 0;
  const currentPrice = quote?.price ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* <Navbar /> */} 

      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500">
          Cotação ao vivo
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Busque um ativo da B3
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ações, FIIs, Fiagros e ETFs. Ex: PETR4, VGIR11, GARE11.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Digite o ticker (ex: CPTI11)"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
            autoCapitalize="characters"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 shadow-sm"
          >
            {status === "loading" ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {status === "error" && error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {quote && status === "idle" && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono text-xl font-bold text-slate-900">{quote.symbol}</span>
                <p className="text-sm text-gray-500 mt-1">{quote.name || "Nome indisponível"}</p>
              </div>
              <div className="text-right">
                <span className="tabular-nums font-mono text-2xl font-bold text-slate-900">
                  {quote.currency || "R$"} {currentPrice.toFixed(2)}
                </span>
                <p className={`tabular-nums font-mono text-sm mt-1 font-medium ${isGain ? "text-emerald-600" : "text-rose-600"}`}>
                  {isGain ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}% hoje
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Média de dividendos (12 meses)</span>
              <p className="tabular-nums mt-1 font-mono text-lg text-slate-900">
                {avgDividend !== null
                  ? `${quote.currency || "R$"} ${avgDividend.toFixed(4)} / pagamento`
                  : "Dado indisponível no momento"}
              </p>
            </div>

            {quote.updatedAt && (
              <p className="mt-6 text-xs text-gray-400">
                Atualizado em {new Date(quote.updatedAt).toLocaleString("pt-BR")}
              </p>
            )}
          </div>
        )}

        <Link to="/" className="mt-10 inline-flex items-center text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors">
          &larr; Voltar ao início
        </Link>
      </main>
    </div>
  );
}