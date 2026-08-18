import React from 'react';
import { Link } from 'react-router-dom';

export function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-gray-200 selection:text-primary">
      
      {/* HEADER */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold text-lg tracking-tight text-primary">InvestPainel</div>
          <nav className="hidden md:flex gap-8">
            <a href="#recursos" className="text-sm font-medium text-muted hover:text-primary transition-colors">Recursos</a>
            <Link to="/cotacao" className="text-sm font-medium text-muted hover:text-primary transition-colors">Cotações ao vivo</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-primary hover:text-gray-600 transition-colors hidden sm:block">
              Entrar
            </button>
            <button className="text-sm font-medium bg-primary hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              Criar conta
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center justify-center pt-24 pb-12 text-center px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-medium text-muted uppercase tracking-wider">
                Plataforma em Beta Público
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter leading-[1.1] mb-6">
              O controle dos seus ativos, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
                simplificado.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
              Acompanhe suas Ações, Fundos Imobiliários e proventos em uma interface limpa, rápida e pensada para quem valoriza o tempo. Sem planilhas complexas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
              <button className="h-12 px-8 rounded-lg bg-primary text-white font-medium shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                Começar gratuitamente
              </button>
              <Link to="/cotacao" className="h-12 px-8 rounded-lg bg-white border border-gray-200 text-primary font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                Ver cotações
              </Link>
            </div>
          </div>

          {/* MOCKUP DO DASHBOARD */}
          <div className="w-full max-w-6xl mx-auto relative mt-4">
            {/* Glow Effect */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-gray-200 blur-[100px] rounded-full -z-10 opacity-60"></div>
            
            <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xl bg-white ring-1 ring-gray-900/5">
              <div className="h-12 border-b border-gray-100 bg-gray-50/80 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              </div>
              <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-50 flex items-center justify-center p-8">
                 <div className="text-center">
                   <p className="text-muted text-sm font-medium border border-dashed border-gray-300 px-6 py-4 rounded-lg bg-white">
                     [ Substitua esta div pela tag &lt;img&gt; do print do seu Dashboard ]
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF (Fontes de Dados) */}
        <section className="w-full max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-8 uppercase tracking-widest text-center">
            Dados sincronizados e oficiais
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale">
            <span className="text-xl font-bold text-gray-800 tracking-tight">B3</span>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Tesouro Direto</span>
            <span className="text-xl font-bold text-gray-800 tracking-tight">CVM</span>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Bacen</span>
          </div>
        </section>

        {/* RECURSOS (Features) */}
        <section id="recursos" className="w-full bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-6">
                Tudo o que você precisa. <br className="hidden md:block" /> Nada do que você não precisa.
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Esqueça as planilhas complexas e os home brokers poluídos. Projetamos cada recurso para otimizar suas análises e focar no rendimento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Cotações em Tempo Real</h3>
                <p className="text-muted leading-relaxed text-sm">
                  Acompanhe FIIs, Fiagros e Ações da B3 com dados atualizados instantaneamente. Tome decisões de realocação com base em fatos, não em atrasos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Histórico de Proventos</h3>
                <p className="text-muted leading-relaxed text-sm">
                  Visualize a média de dividendos dos últimos 12 meses. Saiba exatamente quanto seus ativos estão gerando de renda passiva para o seu portfólio.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Interface Minimalista</h3>
                <p className="text-muted leading-relaxed text-sm">
                  Foco total no que importa. Um painel limpo e direto ao ponto, projetado para você analisar a evolução do seu patrimônio sem poluição visual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="w-full bg-primary py-20 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para assumir o controle?
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Junte-se a outros investidores e comece a gerenciar seu portfólio de forma profissional hoje mesmo.
            </p>
            <button className="h-12 px-8 rounded-lg bg-white text-primary font-bold shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
              Criar conta gratuitamente
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-extrabold text-primary tracking-tight">InvestPainel</span>
              <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
                Gestão inteligente e minimalista para o investidor moderno.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Produto</h3>
              <ul className="space-y-3">
                <li><a href="#recursos" className="text-sm text-muted hover:text-primary transition-colors">Recursos</a></li>
                <li><Link to="/cotacao" className="text-sm text-muted hover:text-primary transition-colors">Cotações da B3</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/termos" className="text-sm text-muted hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="text-sm text-muted hover:text-primary transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              © {currentYear} InvestPainel. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted">
              Os dados apresentados não configuram recomendação de investimento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}