import React from 'react';
import { Link } from 'react-router-dom';

export function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* HEADER SIMPLES */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight text-primary">InvestPainel</div>
          <nav className="hidden md:flex gap-6">
            <a href="#recursos" className="text-sm font-medium text-muted hover:text-primary transition-colors">Recursos</a>
            <Link to="/cotacao" className="text-sm font-medium text-muted hover:text-primary transition-colors">Cotações</Link>
          </nav>
          <button className="text-sm font-medium bg-gray-100 hover:bg-gray-200 text-primary px-4 py-2 rounded-lg transition-colors">
            Acessar
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        
        {/* CHECKLIST ALTO: Trust Badge / Prova Social */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 mb-8 animate-fade-in-up">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-muted">
            Produto novo. Sem enrolação. Direto ao ponto.
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter max-w-4xl leading-tight mb-6">
          O controle dos seus ativos, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
            simplificado.
          </span>
        </h1>
        
        {/* Uso da cor MUTED corrigida */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
          Acompanhe suas Ações e Fundos Imobiliários em uma interface limpa, rápida e pensada para quem valoriza o tempo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="h-12 px-8 rounded-lg bg-primary text-white font-medium shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
            Criar conta grátis
          </button>
          <Link to="/cotacao" className="h-12 px-8 rounded-lg bg-white border border-gray-200 text-primary font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
            Ver cotações
          </Link>
        </div>
      </main>

      {/* CHECKLIST MÉDIO/ALTO: Footer Robusto com Termos e Privacidade */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-bold text-primary tracking-tight">InvestPainel</span>
              <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
                Gestão inteligente e minimalista para o investidor moderno.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Produto</h3>
              <ul className="space-y-3">
                <li><a href="#recursos" className="text-sm text-muted hover:text-primary transition-colors">Recursos</a></li>
                <li><Link to="/cotacao" className="text-sm text-muted hover:text-primary transition-colors">Cotações (Beta)</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                {/* Obrigatórios para LGPD */}
                <li><Link to="/termos" className="text-sm text-muted hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="text-sm text-muted hover:text-primary transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
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