import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchQuote } from '../lib/brapi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Position {
  ticker: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvested: number;
  currentEquity: number;
  profitability: number;
  estimatedMonthlyDividend: number;
  dividendPerShare: number;
}

interface Transaction {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#0ea5e9', '#14b8a6'];

export function Dashboard() {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  const [positions, setPositions] = useState<Position[]>([]);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  
  const [totalEquity, setTotalEquity] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalMonthlyDividends, setTotalMonthlyDividends] = useState(0);
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ticker, setTicker] = useState('');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const loadPortfolio = async (currentUserId: string) => {
    setIsLoadingPortfolio(true);
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUserId)
        .order('date', { ascending: false });

      if (error) throw error;

      setTransactionsList(transactions || []);

      if (!transactions || transactions.length === 0) {
        setPositions([]);
        setTotalEquity(0);
        setTotalInvested(0);
        setTotalMonthlyDividends(0);
        setIsLoadingPortfolio(false);
        return;
      }

      const grouped: Record<string, { quantity: number; totalCost: number }> = {};
      
      transactions.forEach((tx) => {
        if (!grouped[tx.ticker]) {
          grouped[tx.ticker] = { quantity: 0, totalCost: 0 };
        }
        
        if (tx.type === 'BUY') {
          grouped[tx.ticker].quantity += tx.quantity;
          grouped[tx.ticker].totalCost += (tx.quantity * tx.price);
        } else if (tx.type === 'SELL') {
          grouped[tx.ticker].quantity -= tx.quantity;
          grouped[tx.ticker].totalCost -= (tx.quantity * tx.price);
        }
      });

      const finalPositions: Position[] = [];
      let calcEquity = 0;
      let calcInvested = 0;
      let calcDividends = 0;

      for (const tck of Object.keys(grouped)) {
        const group = grouped[tck];
        if (group.quantity <= 0) continue; 

        const avgPrice = group.totalCost / group.quantity;
        let currPrice = avgPrice; 
        let dividendYieldAnnual = 0;

        // ARQUITETURA DINÂMICA: Busca 100% da API com Timeout de segurança
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout da API')), 5000)
          );
          const quote: any = await Promise.race([fetchQuote(tck), timeoutPromise]);

          if (quote && quote.price) {
            currPrice = quote.price;
          }
          if (quote && quote.dividendYield) {
            dividendYieldAnnual = quote.dividendYield; 
          }
        } catch (err) {
          console.warn(`[Sistema] Cotação indisponível para ${tck}. Usando fallback.`);
        }

        // FALLBACK INTELIGENTE: Se a API não enviar DY e for FII/Fiagro, estima 10.5% a.a.
        if (dividendYieldAnnual === 0 && tck.endsWith('11')) {
          dividendYieldAnnual = 10.5; 
        }

        const currentVal = group.quantity * currPrice;
        
        // MOTOR DE DIVIDENDOS
        const monthlyDividend = (currentVal * (dividendYieldAnnual / 100)) / 12;
        const divPerShare = monthlyDividend / group.quantity;

        calcEquity += currentVal;
        calcInvested += group.totalCost;
        calcDividends += monthlyDividend;

        finalPositions.push({
          ticker: tck,
          quantity: group.quantity,
          averagePrice: avgPrice,
          currentPrice: currPrice,
          totalInvested: group.totalCost,
          currentEquity: currentVal,
          profitability: ((currPrice / avgPrice) - 1) * 100,
          estimatedMonthlyDividend: monthlyDividend,
          dividendPerShare: divPerShare
        });
      }

      setPositions(finalPositions.sort((a, b) => b.currentEquity - a.currentEquity));
      setTotalEquity(calcEquity);
      setTotalInvested(calcInvested);
      setTotalMonthlyDividends(calcDividends);

    } catch (err) {
      console.error("Erro ao carregar carteira:", err);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investidor');
        await loadPortfolio(user.id);
      }
    };
    initDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!ticker || !quantity || !price) throw new Error("Preencha todos os campos.");

      const { error } = await supabase.from('transactions').insert([
        {
          user_id: userId,
          ticker: ticker.toUpperCase().trim(),
          type: type,
          quantity: parseInt(quantity),
          price: parseFloat(price.replace(',', '.')),
          date: new Date().toISOString().split('T')[0]
        }
      ]);

      if (error) throw error;

      setTicker(''); setQuantity(''); setPrice('');
      setIsModalOpen(false);
      await loadPortfolio(userId);

    } catch (error: any) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar a transação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta transação? Seu patrimônio será recalculado.");
    if (!confirmDelete) return;

    setIsDeleting(transactionId);

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
      if (error) throw error;
      await loadPortfolio(userId);
    } catch (error: any) {
      console.error("Erro ao deletar:", error.message);
      alert("Falha ao excluir a transação.");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  
  const formatPercent = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const totalProfitability = totalInvested > 0 ? ((totalEquity / totalInvested) - 1) * 100 : 0;
  const isGlobalGain = totalProfitability >= 0;

  const chartData = positions.map(pos => ({
    name: pos.ticker,
    value: pos.currentEquity
  }));

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex font-sans text-slate-300 relative">
      
      <aside className="w-64 bg-slate-950 border-r border-white/5 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md"></div>
            <span className="font-extrabold text-lg text-white tracking-tight">InvestPainel</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'transactions' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Transações
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair da conta
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-20">
          <h2 className="text-lg font-semibold text-white">Carteira de {userName}</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nova Transação
          </button>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in-up">
          
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Patrimônio Total</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight relative z-10">
                    {isLoadingPortfolio ? '...' : formatCurrency(totalEquity)}
                  </p>
                </div>
                
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest">Valor Investido</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">
                    {isLoadingPortfolio ? '...' : formatCurrency(totalInvested)}
                  </p>
                </div>

                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Média de Proventos</p>
                  <p className="text-2xl font-mono font-bold text-purple-400 tracking-tight relative z-10">
                    {isLoadingPortfolio ? '...' : formatCurrency(totalMonthlyDividends)}
                    <span className="text-xs text-slate-500 font-sans ml-1 font-normal tracking-normal">/mês</span>
                  </p>
                </div>
                
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className={`absolute -right-10 -bottom-10 w-32 h-32 blur-3xl rounded-full ${isGlobalGain ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Rentabilidade</p>
                  <p className={`text-2xl font-mono font-bold tracking-tight relative z-10 ${isGlobalGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isLoadingPortfolio ? '...' : (
                      <>{isGlobalGain ? '+' : ''}{formatPercent(totalProfitability)}</>
                    )}
                  </p>
                </div>

              </div>

              {!isLoadingPortfolio && positions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  
                  <div className="lg:col-span-1 bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm flex flex-col items-center">
                    <p className="text-slate-500 text-sm font-semibold mb-4 uppercase tracking-widest self-start w-full border-b border-white/5 pb-4">
                      Composição
                    </p>
                    <div className="w-full h-[220px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.75rem', padding: '12px' }}
                            itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-slate-500 font-bold">Ativos</span>
                        <span className="text-2xl font-mono font-bold text-white">{positions.length}</span>
                      </div>
                    </div>
                    <div className="w-full flex flex-wrap gap-3 mt-4 justify-center">
                      {chartData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5 text-xs font-mono">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                          <span className="text-slate-400">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <p className="text-slate-500 text-sm font-semibold p-6 pb-4 uppercase tracking-widest border-b border-white/5">
                      Posições Consolidadas
                    </p>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-white/5 bg-slate-950/50 text-slate-500 text-[10px] font-bold">
                          <tr>
                            <th className="px-6 py-3">Ativo</th>
                            <th className="px-6 py-3 text-right">Qtd</th>
                            <th className="px-6 py-3 text-right">Preço Médio</th>
                            <th className="px-6 py-3 text-right">Cotação Atual</th>
                            <th className="px-6 py-3 text-right">Saldo Atual</th>
                            <th className="px-6 py-3 text-right">Proventos (Mês)</th>
                            <th className="px-6 py-3 text-right">Rentab.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {positions.map((pos) => {
                            const isProfit = pos.profitability >= 0;
                            return (
                              <tr key={pos.ticker} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded border border-white/5">{pos.ticker}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-slate-300">{pos.quantity}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(pos.averagePrice)}</td>
                                <td className="px-6 py-4 text-right font-mono text-white">{formatCurrency(pos.currentPrice)}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-white">{formatCurrency(pos.currentEquity)}</td>
                                
                                {/* Célula Dupla de Proventos Dinâmica */}
                                <td className="px-6 py-4 text-right flex flex-col items-end justify-center">
                                  <span className="font-mono font-medium text-purple-400">
                                    {pos.estimatedMonthlyDividend > 0 ? formatCurrency(pos.estimatedMonthlyDividend) : '-'}
                                  </span>
                                  {pos.dividendPerShare > 0 && (
                                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                                      {formatCurrency(pos.dividendPerShare)} / cota
                                    </span>
                                  )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <span className={`inline-flex font-mono font-bold px-2 py-1 rounded-md text-xs ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {isProfit ? '+' : ''}{formatPercent(pos.profitability)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {isLoadingPortfolio && (
                <div className="w-full h-64 flex items-center justify-center">
                   <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {!isLoadingPortfolio && positions.length === 0 && (
                <div className="w-full bg-slate-900/50 border border-white/5 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum ativo cadastrado</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6">Comece a construir sua carteira registrando sua primeira compra.</p>
                  <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/10 shadow-sm">
                    Registrar primeira transação
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/30">
                <h3 className="font-bold text-white">Histórico de Movimentações</h3>
                <span className="text-xs font-medium text-slate-500 px-3 py-1 bg-slate-800 rounded-full border border-white/5">
                  {transactionsList.length} Registros
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="uppercase tracking-wider border-b border-white/5 bg-slate-950/80 text-slate-500 text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Ativo</th>
                      <th className="px-6 py-4">Operação</th>
                      <th className="px-6 py-4 text-right">Qtd</th>
                      <th className="px-6 py-4 text-right">Preço Unit.</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactionsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          Nenhuma transação registrada no sistema.
                        </td>
                      </tr>
                    ) : (
                      transactionsList.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">{formatDate(tx.date)}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-white">{tx.ticker}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider ${tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {tx.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-slate-300">{tx.quantity}</td>
                          <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(tx.price)}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-white">{formatCurrency(tx.quantity * tx.price)}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleDeleteTransaction(tx.id)} disabled={isDeleting === tx.id} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50" title="Excluir transação">
                              {isDeleting === tx.id ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL BLINDADO COM Z-[100] */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Nova Transação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-5">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                <button type="button" onClick={() => setType('BUY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>Compra</button>
                <button type="button" onClick={() => setType('SELL')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'SELL' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}>Venda</button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Código do Ativo</label>
                <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Ex: VGIR11" required autoCapitalize="characters" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono uppercase placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantidade</label>
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="100" required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preço (R$)</label>
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9,50" required className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"/>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
                {isSubmitting ? 'Processando...' : 'Confirmar Transação'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}