const HOLDINGS = [
  { symbol: "MXRF11", qty: 340, avg: "9,72", current: "10,18", pnlPct: 4.73 },
  { symbol: "PETR4", qty: 120, avg: "35,10", current: "38,42", pnlPct: 9.46 },
  { symbol: "HGLG11", qty: 85, avg: "168,40", current: "162,90", pnlPct: -3.27 },
];

export default function WatchlistCard() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-ink-border bg-ink-surface shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-ink-border px-5 py-4">
        <span className="text-sm font-medium text-text-secondary">Minha carteira</span>
        <span className="rounded-full bg-gain/10 px-2.5 py-1 font-mono text-xs text-gain">
          +6,84% no total
        </span>
      </div>

      <div className="divide-y divide-ink-border">
        {HOLDINGS.map((h) => (
          <div key={h.symbol} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex flex-col">
              <span className="font-mono text-sm text-text-primary">{h.symbol}</span>
              <span className="font-mono text-xs text-text-muted">
                {h.qty} cotas · PM R$ {h.avg}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="tabular font-mono text-sm text-text-primary">
                R$ {h.current}
              </span>
              <span
                className={`tabular font-mono text-xs ${
                  h.pnlPct >= 0 ? "text-gain" : "text-loss"
                }`}
              >
                {h.pnlPct >= 0 ? "+" : ""}
                {h.pnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3">
        <span className="text-xs text-text-muted">
          Ilustração do painel · dados de exemplo
        </span>
      </div>
    </div>
  );
}
