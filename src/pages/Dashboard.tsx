import { Link } from "react-router-dom";

export function Dashboard() {
  // Dados fictícios para ancoragem visual da interface
  const mockPatrimonio = 124560.80;
  const mockVariacaoDia = 345.20;
  const mockProventosMes = 850.45;

  const mockAtivos = [
    { ticker: "VGIR11", tipo: "FII", preco: 9.85, variacao: 0.12, saldo: 15400.00 },
    { ticker: "GARE11", tipo: "FII", preco: 9.20, variacao: -0.45, saldo: 8200.00 },
    { ticker: "PETR4", tipo: "Ação", preco: 38.40, variacao: 1.25, saldo: 24500.00 },
    { ticker: "IVVB11", tipo: "ETF", preco: 295.10, variacao: 0.80, saldo: 14755.00 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* SIDEBAR (Menu Lateral) */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link to="/" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md shadow-[0_0_10px_rgba(52,211,153,0.2)]"></div>
            InvestPainel
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white font-medium border border-white/5">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Carteira
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Proventos
          </a>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
              <span className="text-xs font-bold text-white">YB</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Ylo Bittencourt</p>
              <p className="text-xs text-slate-500">Plano Grátis</p>
            </div>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-white tracking-tight">Visão Geral</h1>
          <div className="flex items-center gap-4">
            <Link to="/cotacao" className="text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors">
              Explorar Ativos
            </Link>
          </div>
        </header>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* CARDS DE RESUMO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Patrimônio */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Patrimônio Total</h2>
              <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                <span className="text-xl text-slate-500 mr-1">R$</span>
                {mockPatrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Variação Dia */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Variação no Dia</h2>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-emerald-400 tabular-nums tracking-tight">
                  <span className="text-xl mr-1">+ R$</span>
                  {mockVariacaoDia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  +0.28%
                </span>
              </div>
            </div>

            {/* Proventos */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Proventos no Mês</h2>
              <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                <span className="text-xl text-slate-500 mr-1">R$</span>
                {mockProventosMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* TABELA DE ATIVOS */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">Sua Carteira</h3>
              <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">
                Ver todos
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500 font-semibold bg-slate-900/50">
                    <th className="px-6 py-4">Ativo</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-right">Preço Atual</th>
                    <th className="px-6 py-4 text-right">Variação</th>
                    <th className="px-6 py-4 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockAtivos.map((ativo) => (
                    <tr key={ativo.ticker} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-white">{ativo.ticker}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                          {ativo.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-300">
                        R$ {ativo.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        <span className={ativo.variacao >= 0 ? "text-emerald-400" : "text-rose-400"}>
                          {ativo.variacao >= 0 ? "+" : ""}{ativo.variacao}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-white">
                        R$ {ativo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}