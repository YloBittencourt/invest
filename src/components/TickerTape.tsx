interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

// Dados ilustrativos para compor o elemento visual — não representam cotação real.
// A busca de cotação de verdade acontece na página /cotacao, via API.
const SAMPLE_TICKERS: TickerItem[] = [
  { symbol: "PETR4", price: "38,42", change: 1.24 },
  { symbol: "MXRF11", price: "10,18", change: -0.29 },
  { symbol: "VALE3", price: "61,05", change: 0.87 },
  { symbol: "BOVA11", price: "128,73", change: 0.42 },
  { symbol: "HGLG11", price: "162,90", change: -0.55 },
  { symbol: "ITUB4", price: "34,17", change: 1.68 },
  { symbol: "KNRI11", price: "9,84", change: 0.11 },
  { symbol: "WEGE3", price: "45,63", change: -0.94 },
];

function TickerRow({ items, ariaHidden }: { items: TickerItem[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-6 py-3 font-mono text-sm">
          <span className="text-text-secondary">{item.symbol}</span>
          <span className="tabular text-text-primary">{item.price}</span>
          <span className={`tabular ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
            {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TickerTape() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-ink-border bg-ink-surface/60"
      role="img"
      aria-label="Ilustração de painel de cotações com tickers de exemplo"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <TickerRow items={SAMPLE_TICKERS} />
        <TickerRow items={SAMPLE_TICKERS} ariaHidden />
      </div>
    </div>
  );
}
