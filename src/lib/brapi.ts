const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface Dividend {
  paymentDate: string;
  rate: number;
  relatedTo?: string;
}

export interface Quote {
  symbol: string;
  name: string;
  currency: string;
  price: number;
  changePercent: number;
  updatedAt: string;
  // A chave agora é opcional, refletindo a realidade da API
  dividends?: Dividend[]; 
}

export class QuoteError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchQuote(ticker: string): Promise<Quote> {
  const response = await fetch(`${API_BASE}/api/quote/${encodeURIComponent(ticker)}`);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new QuoteError(
      body?.error || "Não foi possível buscar essa cotação agora.",
      response.status
    );
  }

  return body as Quote;
}

/** Média simples de dividendos pagos nos últimos 12 meses, com validação de nulidade. */
export function averageDividends12m(dividends?: Dividend[]): number | null {
  // Validação crítica: Interrompe a execução se o array não existir ou for vazio
  if (!dividends || !Array.isArray(dividends) || dividends.length === 0) {
    return null;
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recent = dividends.filter((d) => new Date(d.paymentDate) >= oneYearAgo);

  if (recent.length === 0) return null;

  const total = recent.reduce((sum, d) => sum + (d.rate || 0), 0);
  return total / recent.length;
}