import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchQuote, averageDividends12m, Quote, QuoteError } from "../lib/brapi";

type Status = "idle" | "loading" | "error";

export default function Cotacao() {
  const [ticker, setTicker] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!ticker.trim()) return;

    setStatus("loading");
    setError(null);
    setQuote(null);

    try {
      const result = await fetchQuote(ticker.trim());
      setQuote(result);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof QuoteError ? err.message : "Erro inesperado. Tente novamente.");
    }
  }

  const avgDividend = quote ? averageDividends12m(quote.dividends) : null;
  const isGain = quote ? quote.changePercent >= 0 : true;

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          Cotação
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
          Busque um ativo da B3
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Ações, FIIs, ETFs e BDRs. Ex: PETR4, MXRF11, BOVA11.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Digite o ticker (ex: PETR4)"
            className="flex-1 rounded-lg border border-ink-border bg-ink-surface px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-cta"
            autoCapitalize="characters"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-cta px-6 py-3 text-sm font-semibold text-ink transition hover:bg-cta-hover disabled:opacity-50"
          >
            {status === "loading" ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {status === "error" && error && (
          <div className="mt-6 rounded-lg border border-loss/30 bg-loss/5 px-4 py-3 text-sm text-loss">
            {error}
          </div>
        )}

        {quote && (
          <div className="mt-8 rounded-2xl border border-ink-border bg-ink-surface p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono text-lg text-text-primary">{quote.symbol}</span>
                <p className="text-sm text-text-secondary">{quote.name}</p>
              </div>
              <div className="text-right">
                <span className="tabular font-mono text-2xl text-text-primary">
                  {quote.currency} {quote.price.toFixed(2)}
                </span>
                <p className={`tabular font-mono text-sm ${isGain ? "text-gain" : "text-loss"}`}>
                  {isGain ? "▲" : "▼"} {Math.abs(quote.changePercent).toFixed(2)}% hoje
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-ink-border pt-4">
              <span className="text-xs text-text-muted">Média de dividendos (12 meses)</span>
              <p className="tabular mt-1 font-mono text-lg text-text-primary">
                {avgDividend !== null
                  ? `${quote.currency} ${avgDividend.toFixed(4)} / pagamento`
                  : "Dado indisponível"}
              </p>
            </div>

            <p className="mt-4 text-xs text-text-muted">
              Atualizado em {new Date(quote.updatedAt).toLocaleString("pt-BR")}
            </p>
          </div>
        )}

        <Link to="/" className="mt-10 inline-block text-sm text-text-secondary hover:text-text-primary">
          ← Voltar
        </Link>
      </main>
    </div>
  );
}
