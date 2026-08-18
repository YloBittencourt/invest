import { Link } from 'react-router-dom';

export function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* HEADER DARK PREMIUM */}
      <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md"></div>
            InvestPainel
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#recursos" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Recursos</a>
            <Link to="/cotacao" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Cotações ao vivo</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Entrar
            </button>
            <button className="text-sm font-semibold bg-white hover:bg-gray-200 text-slate-900 px-5 py-2.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Criar conta
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        
        {/* HERO SECTION DARK */}
        <section className="w-full flex flex-col items-center justify-center pt-24 pb-12 text-center px-6 relative overflow-hidden">
          
          {/* Mesh Gradients (Efeitos de Luz Fintech) */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
            
            {/* Trust Badge Dark */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                Plataforma em Beta Público
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
              O controle dos seus ativos, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                simplificado.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Acompanhe seus FIIs, Fiagros e Ações em uma interface limpa, rápida e pensada para quem valoriza o tempo. Sem planilhas complexas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
              <button className="h-12 px-8 rounded-lg bg-white text-slate-900 font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                Começar gratuitamente
              </button>
              <Link to="/cotacao" className="h-12 px-8 rounded-lg bg-transparent border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center backdrop-blur-sm">
                Ver cotações
              </Link>
            </div>
          </div>

          {/* MOCKUP DO DASHBOARD (Estilo MacOS Dark) */}
          <div className="w-full max-w-5xl mx-auto relative mt-4 z-10 animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 ring-1 ring-white/5">
              <div className="h-12 border-b border-white/5 bg-slate-900/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="aspect-[16/9] md:aspect-[21/9] bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
                 {/* Grade Técnica Abstrata */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 
                 <div className="text-center relative z-10">
                   <p className="text-slate-400 text-sm font-medium border border-dashed border-slate-700 px-6 py-4 rounded-lg bg-slate-900/80 backdrop-blur-sm">
                     [ Insira a screenshot do seu Dashboard escuro aqui ]
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF (Marcas e Instituições) */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-b border-white/5">
          <p className="text-xs font-semibold text-slate-500 mb-8 uppercase tracking-widest text-center">
            Dados sincronizados e oficiais
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl font-bold text-slate-300 tracking-tight">B3</span>
            <span className="text-xl font-bold text-slate-300 tracking-tight">Tesouro Direto</span>
            <span className="text-xl font-bold text-slate-300 tracking-tight">CVM</span>
            <span className="text-xl font-bold text-slate-300 tracking-tight">Bacen</span>
          </div>
        </section>

        {/* RECURSOS (A Quebra de Contraste para Branco) */}
        <section id="recursos" className="w-full bg-white py-32 rounded-t-[3rem] -mt-6 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Tudo o que você precisa. <br className="hidden md:block" /> Nada do que você não precisa.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Desenvolvido para eliminar as planilhas manuais. Projetamos cada recurso para otimizar suas análises e focar no rendimento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Cotações em Tempo Real</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Acompanhe seus ativos da B3 com dados atualizados instantaneamente via Yahoo Finance. Tome decisões de realocação com base em fatos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Histórico de Proventos</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Visualize a média de dividendos dos últimos 12 meses. Saiba exatamente quanto seus ativos estão gerando de renda passiva para o seu portfólio.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Interface Minimalista</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Foco total no que importa. Um painel limpo e direto ao ponto, projetado para você analisar a evolução do seu patrimônio sem poluição visual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="w-full bg-slate-950 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Pronto para assumir o controle?
            </h2>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Abandone a lentidão bancária e junte-se a outros investidores para gerenciar seu portfólio de forma profissional hoje mesmo.
            </p>
            <button className="h-14 px-10 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:shadow-[0_0_40px_rgba(52,211,153,0.5)] transition-all hover:scale-105 active:scale-95 text-lg">
              Criar conta gratuitamente
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-sm"></div>
                InvestPainel
              </span>
              <p className="mt-4 text-sm text-slate-400 max-w-xs leading-relaxed">
                Gestão inteligente e minimalista para o investidor moderno.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Produto</h3>
              <ul className="space-y-3">
                <li><a href="#recursos" className="text-sm text-slate-400 hover:text-white transition-colors">Recursos</a></li>
                <li><Link to="/cotacao" className="text-sm text-slate-400 hover:text-white transition-colors">Cotações da B3</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/termos" className="text-sm text-slate-400 hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="text-sm text-slate-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} InvestPainel. Todos os direitos reservados.
            </p>
            <p className="text-sm text-slate-500 text-center md:text-right">
              Os dados apresentados não configuram recomendação de investimento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}