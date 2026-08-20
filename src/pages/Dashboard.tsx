import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchQuote, averageDividends12m } from '../lib/brapi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Sidebar } from '../components/Sidebar';
import { TransactionModal } from '../components/TransactionModal';

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
  isExactDividend: boolean;
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
  const queryClient = useQueryClient();
  
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investidor');
      }
    };
    initDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const { data: portfolioData, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!transactions || transactions.length === 0) {
        return { positions: [], transactionsList: [], totalEquity: 0, totalInvested: 0, totalMonthlyDividends: 0 };
      }

      const grouped: Record<string, { quantity: number; totalCost: number }> = {};
      
      transactions.forEach((tx) => {
        if (!grouped[tx.ticker]) grouped[tx.ticker] = { quantity: 0, totalCost: 0 };
        if (tx.type === 'BUY') {
          grouped[tx.ticker].quantity += tx.quantity;
          grouped[tx.ticker].totalCost += (tx.quantity * tx.price);
        } else if (tx.type === 'SELL') {
          grouped[tx.ticker].quantity -= tx.quantity;
          grouped[tx.ticker].totalCost -= (tx.quantity * tx.price);
        }
      });

      const finalPositions: Position[] = [];
      let calcEquity = 0; let calcInvested = 0; let calcDividends = 0;

      for (const tck of Object.keys(grouped)) {
        const group = grouped[tck];
        if (group.quantity <= 0) continue; 

        const avgPrice = group.totalCost / group.quantity;
        let currPrice = avgPrice; 
        let divPerShare = 0;
        let isExact = false;

        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
          const quote: any = await Promise.race([fetchQuote(tck), timeoutPromise]);

          if (quote && quote.price) currPrice = quote.price;

          if (quote && quote.dividends && quote.dividends.length > 0) {
            divPerShare = averageDividends12m(quote.dividends);
            isExact = true;
          } else if (quote && quote.dividendYield) {
            divPerShare = (currPrice * (quote.dividendYield / 100)) / 12;
            isExact = true;
          }
        } catch (err) {
          console.warn(`Cotação indisponível para ${tck}.`);
        }

        if (!isExact && tck.endsWith('11')) {
          divPerShare = (currPrice * (10.5 / 100)) / 12;
          isExact = false;
        }

        const currentVal = group.quantity * currPrice;
        const monthlyDividend = divPerShare * group.quantity;

        calcEquity += currentVal; calcInvested += group.totalCost; calcDividends += monthlyDividend;

        finalPositions.push({
          ticker: tck, quantity: group.quantity, averagePrice: avgPrice, currentPrice: currPrice,
          totalInvested: group.totalCost, currentEquity: currentVal, profitability: ((currPrice / avgPrice) - 1) * 100,
          estimatedMonthlyDividend: monthlyDividend, dividendPerShare: divPerShare, isExactDividend: isExact
        });
      }

      return {
        positions: finalPositions.sort((a, b) => b.currentEquity - a.currentEquity),
        transactionsList: transactions as Transaction[],
        totalEquity: calcEquity,
        totalInvested: calcInvested,
        totalMonthlyDividends: calcDividends
      };
    }
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('transactions').insert([
        { 
          user_id: userId, 
          ticker: data.ticker,
          type: data.type,
          quantity: data.quantity,
          price: data.price,
          date: data.date // <-- Agora obedece a data informada pelo usuário no modal
        }
      ]);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.quantity} cotas de ${variables.ticker} registradas com sucesso!`);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['portfolio', userId] });
    },
    onError: () => toast.error('Erro ao salvar a transação.')
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Transação excluída e portfólio recalculado.');
      queryClient.invalidateQueries({ queryKey: ['portfolio', userId] });
    },
    onError: () => toast.error('Falha ao excluir a transação.')
  });

  const { positions = [], transactionsList = [], totalEquity = 0, totalInvested = 0, totalMonthlyDividends = 0 } = portfolioData || {};

  const historyChartData = useMemo(() => {
    if (!transactionsList.length) return [];
    
    const reversed = [...transactionsList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let accumulated = 0;
    const monthlyData: Record<string, number> = {};

    reversed.forEach(tx => {
      const dateObj = new Date(tx.date);
      const monthYear = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear().toString().slice(-2)}`;
      
      const value = tx.quantity * tx.price;
      if (tx.type === 'BUY') accumulated += value;
      if (tx.type === 'SELL') accumulated -= value;

      monthlyData[monthYear] = accumulated;
    });

    return Object.entries(monthlyData).map(([date, investido]) => ({ date, investido }));
  }, [transactionsList]);

  const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0,00%';
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '--/--/----';
    try {
      const datePart = dateString.split('T')[0];
      const parts = datePart.split('-');
      if (parts.length !== 3) return datePart;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch (e) { return dateString; }
  };

  const totalProfitability = totalInvested > 0 ? ((totalEquity / totalInvested) - 1) * 100 : 0;
  const isGlobalGain = totalProfitability >= 0;
  const chartData = positions.map(pos => ({ name: pos.ticker, value: pos.currentEquity }));

  if (isLoadingPortfolio) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex font-sans text-slate-300 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="w-48 h-6 bg-slate-800 rounded animate-pulse"></div>
            <div className="w-32 h-9 bg-slate-800 rounded-lg animate-pulse"></div>
          </header>
          <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-2xl h-[120px] animate-pulse flex flex-col justify-center">
                  <div className="w-24 h-3 bg-slate-800 rounded mb-4"></div>
                  <div className="w-32 h-8 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl h-[300px] animate-pulse"></div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl h-[300px] animate-pulse"></div>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-2xl h-[400px] animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex font-sans text-slate-300 relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
                  <p className="text-2xl font-mono font-bold text-white tracking-tight relative z-10">{formatCurrency(totalEquity)}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest">Valor Investido</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatCurrency(totalInvested)}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Média de Proventos</p>
                  <p className="text-2xl font-mono font-bold text-purple-400 tracking-tight relative z-10">
                    {formatCurrency(totalMonthlyDividends)}
                    <span className="text-xs text-slate-500 font-sans ml-1 font-normal tracking-normal">/mês</span>
                  </p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className={`absolute -right-10 -bottom-10 w-32 h-32 blur-3xl rounded-full ${isGlobalGain ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Rentabilidade</p>
                  <p className={`text-2xl font-mono font-bold tracking-tight relative z-10 ${isGlobalGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isGlobalGain ? '+' : ''}{formatPercent(totalProfitability)}
                  </p>
                </div>
              </div>

              {positions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    
                    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm flex flex-col items-center">
                      <p className="text-slate-500 text-sm font-semibold mb-4 uppercase tracking-widest self-start w-full border-b border-white/5 pb-4">
                        Composição da Carteira
                      </p>
                      <div className="w-full h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                              {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.75rem', padding: '12px' }} itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }} />
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

                    <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm flex flex-col">
                      <p className="text-slate-500 text-sm font-semibold mb-4 uppercase tracking-widest self-start w-full border-b border-white/5 pb-4">
                        Evolução de Aportes
                      </p>
                      <div className="w-full flex-1 min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historyChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorInvestido" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                              formatter={(value: number) => [formatCurrency(value), 'Aportado']}
                              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.75rem', padding: '12px' }}
                              itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="investido" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInvestido)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col mb-8">
                    <p className="text-slate-500 text-sm font-semibold p-6 pb-4 uppercase tracking-widest border-b border-white/5">Posições Consolidadas</p>
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
                                <td className="px-6 py-4"><span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded border border-white/5">{pos.ticker}</span></td>
                                <td className="px-6 py-4 text-right font-mono text-slate-300">{pos.quantity}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(pos.averagePrice)}</td>
                                <td className="px-6 py-4 text-right font-mono text-white">{formatCurrency(pos.currentPrice)}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-white">{formatCurrency(pos.currentEquity)}</td>
                                <td className="px-6 py-4 text-right flex flex-col items-end justify-center">
                                  <span className="font-mono font-medium text-purple-400">{pos.estimatedMonthlyDividend > 0 ? formatCurrency(pos.estimatedMonthlyDividend) : '-'}</span>
                                  {pos.dividendPerShare > 0 && (
                                    <span className="text-[10px] text-slate-500 font-mono mt-0.5" title={pos.isExactDividend ? "Rendimento calculado pela API" : "Estimativa baseada na média de FIIs"}>
                                      {formatCurrency(pos.dividendPerShare)} / cota {pos.isExactDividend ? '' : '*'}
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
                </>
              ) : (
                <div className="w-full bg-slate-900/50 border border-white/5 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
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
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/30">
                <h3 className="font-bold text-white">Histórico de Movimentações</h3>
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
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            <p>Nenhuma transação registrada no sistema.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactionsList.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">{formatDate(tx.date)}</td>
                          <td className="px-6 py-4"><span className="font-mono font-bold text-white">{tx.ticker}</span></td>
                          <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider ${tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{tx.type === 'BUY' ? 'COMPRA' : 'VENDA'}</span></td>
                          <td className="px-6 py-4 text-right font-mono text-slate-300">{tx.quantity}</td>
                          <td className="px-6 py-4 text-right font-mono text-slate-400">{formatCurrency(tx.price)}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-white">{formatCurrency((tx.quantity || 0) * (tx.price || 0))}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => {
                              if(window.confirm("Tem certeza?")) deleteTransactionMutation.mutate(tx.id);
                            }} disabled={deleteTransactionMutation.isPending} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={async (data) => addTransactionMutation.mutateAsync(data)} 
      />

    </div>
  );
}