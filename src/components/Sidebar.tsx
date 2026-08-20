import React from 'react';

interface SidebarProps {
  activeTab: 'overview' | 'transactions';
  setActiveTab: (tab: 'overview' | 'transactions') => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'transactions' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Transações
        </button>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sair da conta
        </button>
      </div>
    </aside>
  );
}