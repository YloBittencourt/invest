import { Link } from 'react-router-dom';

export function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-900">
      
      {/* PRIMEIRA DOBRA: DARK MODE (Premium Feel) */}
      <div className="bg-slate-950 relative overflow-hidden pb-12 md:pb-24">
        
        {/* Luzes de fundo abstratas (Mesh Gradient) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[40%] left-[20%] w-[500px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* HEADER */}
        <header className="w-full border-b border-white/5 bg-transparent sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md"></div>
              InvestPainel
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#recursos" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Recursos</a>
              <Link to="/cotacao" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Terminal B3</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/cotacao" className="text-sm font-semibold bg-white hover:bg-slate-200 text-slate-900 px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                Testar Plataforma
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="w-full pt-20 flex flex-col items-center text-center px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                Gestão Inteligente de Ativos
              </span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
              A sua renda passiva <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-300">
                sob controle absoluto.
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Substitua dezenas de planilhas por um painel inteligente. Acompanhe a evolução do seu patrimônio e descubra seu Dividend Yield real.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <Link to="/cotacao" className="h-14 px-8 flex items-center justify-center rounded-xl bg-white text-slate-900 font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 text-lg">
                Começar gratuitamente
              </Link>
            </div>
          </div>

          {/* MOCKUP ASPIRACIONAL DO PRODUTO (Renderizado via Tailwind) */}
          <div className="w-full max-w-5xl mx-auto mt-20 relative animate-fade-in-up">
            <div className="rounded-t-2xl overflow-hidden border border-white/10 border-b-0 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] bg-slate-900 ring-1 ring-white/5 relative z-20">
              
              {/* Controles de Janela */}
              <div className="h-10 border-b border-white/5 bg-slate-950/80 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              
              <div className="p-6 md:p-10 bg-[#0a0f1c] flex flex-col gap-8 h-[350px] relative overflow-hidden text-left">
                
                {/* Header Mockup */}
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-widest">Patrimônio Consolidado</p>
                    <p className="text-4xl font-mono font-bold text-white tracking-tight">R$ 142.850<span className="text-slate-500 text-2xl">,00</span></p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-emerald-400 font-mono text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-sm">
                      ▲ +R$ 840,00 (Proventos)
                    </p>
                  </div>
                </div>
                
                {/* Cards Mockup de Ativos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl flex justify-between items-center backdrop-blur-md">
                    <div>
                      <p className="text-white font-bold font-mono text-lg">VGIR11</p>
                      <p className="text-slate-500 text-xs mt-0.5">Fundo de Papel</p>
                    </div>
                    <p className="text-emerald-400 font-mono text-sm font-medium">R$ 0,10 / cota</p>
                  </div>
                  <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl flex justify-between items-center backdrop-blur-md">
                    <div>
                      <p className="text-white font-bold font-mono text-lg">GARE11</p>
                      <p className="text-slate-500 text-xs mt-0.5">Fundo de Tijolo</p>
                    </div>
                    <p className="text-emerald-400 font-mono text-sm font-medium">R$ 0,08 / cota</p>
                  </div>
                  <div className="bg-slate-800/50 border border-white/5 p-5 rounded-xl flex justify-between items-center backdrop-blur-md">
                    <div>
                      <p className="text-white font-bold font-mono text-lg">CPTI11</p>
                      <p className="text-slate-500 text-xs mt-0.5">Fiagro</p>
                    </div>
                    <p className="text-emerald-400 font-mono text-sm font-medium">R$ 0,09 / cota</p>
                  </div>
                </div>

                {/* Efeito de Gráfico Abstrato */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end px-10 gap-4 opacity-50">
                   <div className="w-1/4 bg-blue-500/20 rounded-t-md h-20"></div>
                   <div className="w-1/4 bg-blue-500/30 rounded-t-md h-28"></div>
                   <div className="w-1/4 bg-emerald-500/30 rounded-t-md h-40"></div>
                   <div className="w-1/4 bg-emerald-500/40 rounded-t-md h-56"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SOCIAL PROOF (Marcas e Instituições) */}
      <section className="w-full bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest text-center">
            Métricas de mercado integradas com
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold text-slate-800 tracking-tight">B3 Brasil</span>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Yahoo Finance</span>
            <span className="text-xl font-bold text-slate-800 tracking-tight">CVM</span>
          </div>
        </div>
      </section>

      {/* RECURSOS (Bento Grid Premium com Sobreposição) */}
      <section id="recursos" className="w-full bg-white py-24 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              O fim do trabalho manual.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Consolide sua custódia, descubra seu rendimento real e saiba exatamente onde aportar. Tudo automatizado.
            </p>
          </div>

          {/* GRID 12 COLUNAS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[auto]">
            
            {/* CARD 1: Rebalanceamento (Grande - 8 Colunas) */}
            <div className="md:col-span-8 bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -mr-20 -mt-20 transition-colors group-hover:bg-blue-200"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="mb-10">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Rebalanceamento de Carteira</h3>
                  <p className="text-slate-600 leading-relaxed max-w-md">
                    Defina o percentual ideal da sua carteira (ex: 60% FIIs, 40% Ações). O sistema calcula matematicamente o seu próximo aporte ideal para manter a estratégia.
                  </p>
                </div>

                {/* Micro-Mockup */}
                <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alocação Atual</span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">FIIs de Papel</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden flex">
                    <div className="bg-blue-600 h-full rounded-full w-[45%]"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Posição: 45%</span>
                    <span>Meta: 50%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Proventos (Pequeno - 4 Colunas) */}
            <div className="md:col-span-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Mapa de Dividendos</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Descubra seu Dividend Yield real médio dos últimos 12 meses e saiba exatamente quanto sua carteira gera.
                </p>
              </div>
              
              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Média Mensal</span>
                <span className="font-mono font-bold text-emerald-600">R$ 840,00</span>
              </div>
            </div>

            {/* CARD 3: Cotações (Pequeno - 4 Colunas) */}
            <div className="md:col-span-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Cotações Sem Delay</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Integração robusta garantindo que sua carteira reflita o mercado exatamente no momento em que ele acontece.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 uppercase">Sincronização Ativa</span>
              </div>
            </div>

            {/* CARD 4: Segurança (Dark Card para Quebra de Padrão) - 8 Colunas */}
            <div className="md:col-span-8 bg-slate-950 p-8 md:p-10 rounded-[2rem] border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Total controle e privacidade.</h3>
                  <p className="text-slate-400 leading-relaxed max-w-lg">
                    Não solicitamos senhas de corretoras e não possuímos acesso às suas contas. A evolução do seu patrimônio é gerada exclusivamente a partir dos registros que você insere na plataforma.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full bg-blue-600 py-24 pb-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Pronto para profissionalizar sua custódia?
          </h2>
          <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
            Abandone as planilhas complexas hoje. Teste nossas ferramentas de mercado abertas ou monte sua carteira.
          </p>
          <Link to="/cotacao" className="inline-flex h-14 px-10 items-center justify-center rounded-xl bg-slate-950 text-white font-bold shadow-2xl hover:bg-slate-900 transition-all duration-300 hover:scale-105 active:scale-95 text-lg">
            Consultar Ativos
          </Link>
        </div>
      </section>

      {/* FOOTER BÁSICO */}
      <footer className="bg-slate-950 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-400 rounded-sm"></div>
            <span className="font-bold text-white">InvestPainel</span>
          </div>
          <p className="text-sm text-slate-500">
            © {currentYear} InvestPainel. Este software não fornece recomendações de investimento.
          </p>
        </div>
      </footer>
    </div>
  );
}