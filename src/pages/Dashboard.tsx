import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchQuote, averageDividends12m } from '../lib/brapi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

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

      setPositions(finalPositions.sort((a, b) => b.currentEquity - a.currentEquity));
      setTotalEquity(calcEquity); setTotalInvested(calcInvested); setTotalMonthlyDividends(calcDividends);

    } catch (err) {
      toast.error('Não foi possível carregar a carteira.');
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

  const handleAddTransaction = async (data: { ticker: string; type: 'BUY' | 'SELL'; quantity: number; price: number }) => {
    const { error } = await supabase.from('transactions').insert([
      {
        user_id: userId,
        ticker: data.ticker,
        type: data.type,
        quantity: data.quantity,
        price: data.price,
        date: new Date().toISOString().split('T')[0]
      }
    ]);

    if (error) {
      toast.error('Erro ao salvar a transação no banco de dados.');
      throw error;
    }

    setIsModalOpen(false);
    toast.success(`${data.quantity} cotas de ${data.ticker} registradas com sucesso!`);
    await loadPortfolio(userId);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;

    setIsDeleting(transactionId);
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
      if (error) throw error;
      toast.success('Transação excluída e portfólio recalculado.');
      await loadPortfolio(userId);
    } catch (error: any) {
      toast.error("Falha ao excluir a transação.");
    } finally {
      setIsDeleting(null);
    }
  };

  // PROGRAMAÇÃO DEFENSIVA: Formatadores Blindados contra undefined e null
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
    } catch (e) {
      return dateString;
    }
  };

  const totalProfitability = totalInvested > 0 ? ((totalEquity / totalInvested) - 1) * 100 : 0;
  const isGlobalGain = totalProfitability >= 0;
  const chartData = positions.map(pos => ({ name: pos.ticker, value: pos.currentEquity }));

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
              {/* GRID DE CARTÕES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest relative z-10">Patrimônio Total</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight relative z-10">{isLoadingPortfolio ? '...' : formatCurrency(totalEquity)}</p>
                </div>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm">
                  <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-widest">Valor Investido</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">{isLoadingPortfolio ? '...' : formatCurrency(totalInvested)}</p>
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
                    {isLoadingPortfolio ? '...' : <>{isGlobalGain ? '+' : ''}{formatPercent(totalProfitability)}</>}
                  </p>
                </div>
              </div>

              {!isLoadingPortfolio && positions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-1 bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm flex flex-col items-center">
                    <p className="text-slate-500 text-sm font-semibold mb-4 uppercase tracking-widest self-start w-full border-b border-white/5 pb-4">Composição</p>
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
                  </div>

                  <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
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
                </div>
              )}
            </>
          )}

          {/* ================= ABA: TRANSAÇÕES ================= */}
          {activeTab === 'transactions' && (
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
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
                            <button onClick={() => handleDeleteTransaction(tx.id)} disabled={isDeleting === tx.id} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50">
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

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTransaction} />
    </div>
  );
}