// Se o VITE_API_BASE_URL não existir, ele vai forçar a batida na porta 3001 (onde está o seu node)
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
  // Chamada HTTP para o seu backend Node.js
  const endpoint = `${API_BASE}/api/quote/${encodeURIComponent(ticker)}`;
  
  try {
    const response = await fetch(endpoint);
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new QuoteError(
        body?.error || "Servidor indisponível no momento.",
        response.status
      );
    }

    return body as Quote;
  } catch (error) {
    // Se o fetch falhar (ex: servidor Node.js estiver desligado), cai aqui
    if (error instanceof QuoteError) throw error;
    throw new QuoteError("Não foi possível conectar ao servidor. O backend (porta 3001) está rodando?", 500);
  }
}

export function averageDividends12m(dividends?: Dividend[]): number | null {
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