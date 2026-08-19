import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function Auth() {
  // Estado para alternar entre Login e Cadastro de forma fluida
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* LADO ESQUERDO: FORMULÁRIO (Foco total) */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 md:px-20 relative z-10">
        
        {/* Botão Voltar Absoluto */}
        <Link to="/" className="absolute top-8 left-8 sm:left-16 md:left-20 text-sm font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </Link>

        <div className="max-w-sm w-full mx-auto animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md shadow-[0_0_10px_rgba(52,211,153,0.2)]"></div>
            <span className="font-extrabold text-xl tracking-tight text-white">InvestPainel</span>
          </div>

          {/* Cabeçalho do Form */}
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {isLogin 
              ? 'Insira suas credenciais para acessar sua carteira.' 
              : 'Junte-se a investidores que valorizam o tempo e os dados.'}
          </p>

          {/* Social Logins (Redução de Fricção) */}
          <div className="flex flex-col gap-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ou com e-mail</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          {/* Formulário Tradicional */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400">Nome completo</label>
                <input 
                  type="text" 
                  placeholder="Seu nome" 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-400">Senha</label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
                    Esqueceu a senha?
                  </a>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
              {isLogin ? 'Acessar minha carteira' : 'Criar conta grátis'}
            </button>
          </form>

          {/* Toggle State */}
          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
            <button 
              onClick={toggleAuthMode}
              className="text-white font-medium hover:text-blue-400 transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>

      {/* LADO DIREITO: ASPIRACIONAL (Apenas Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-slate-900 relative overflow-hidden border-l border-white/5 items-center justify-center">
        
        {/* Mesh Gradients de Fundo */}
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        {/* Pattern Técnico de Fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative z-10 max-w-lg p-10">
          <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-white leading-relaxed mb-6">
              "Abandonei 3 planilhas do Excel. Agora acompanho meus dividendos e o momento exato de aportar em FIIs em um único painel."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-300">YB</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Ylo Bittencourt</p>
                <p className="text-xs text-slate-500">Investidor</p>
              </div>
            </div>
          </div>
          
          {/* Badge flutuante decorativo */}
          <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-white/10 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md animate-fade-in-up">
             <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="text-blue-400 font-bold text-xs">B3</span>
             </div>
             <div>
               <p className="text-xs font-bold text-white">Sincronização 256-bit</p>
               <p className="text-[10px] text-slate-500">Privacidade garantida</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}