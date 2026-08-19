import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // O estado inicial lê a URL. Se for /cadastro, isLogin nasce como false.
  const [isLogin, setIsLogin] = useState(location.pathname !== '/cadastro');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados dos formulários
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Se a URL mudar enquanto o usuário está na tela, atualizamos o estado
  useEffect(() => {
    setIsLogin(location.pathname !== '/cadastro');
    setErrorMsg(null);
  }, [location.pathname]);

  const toggleAuthMode = () => {
    // Alterna a URL sutilmente para manter o histórico do navegador organizado
    navigate(isLogin ? '/cadastro' : '/login', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        // FLUXO DE LOGIN SUPABASE
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
        
      } else {
        // FLUXO DE CADASTRO SUPABASE
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Erro de Autenticação:", error.message);
      if (error.message.includes("Invalid login")) {
        setErrorMsg("E-mail ou senha incorretos.");
      } else if (error.message.includes("User already registered")) {
        setErrorMsg("Este e-mail já está cadastrado.");
      } else if (error.message.includes("Password should be at least")) {
        setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setErrorMsg("Ocorreu um erro de conexão. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300 selection:bg-blue-500/30">
      
      {/* LADO ESQUERDO: FORMULÁRIO */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 md:px-20 relative z-10">
        
        <Link to="/" className="absolute top-8 left-8 sm:left-16 md:left-20 text-sm font-medium text-slate-500 hover:text-white transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </Link>

        <div className="max-w-sm w-full mx-auto animate-fade-in-up">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md shadow-[0_0_10px_rgba(52,211,153,0.2)]"></div>
            <span className="font-extrabold text-xl tracking-tight text-white">InvestPainel</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {isLogin 
              ? 'Insira suas credenciais para acessar sua carteira.' 
              : 'Junte-se a investidores que valorizam o tempo e os dados.'}
          </p>

          {errorMsg && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in-up">
                <label className="text-sm font-medium text-slate-400">Nome completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Seu nome" 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isLogin ? 'Acessar minha carteira' : 'Criar conta grátis'
              )}
            </button>
          </form>

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

      {/* LADO DIREITO: ASPIRACIONAL */}
      <div className="hidden lg:flex w-[55%] bg-slate-900 relative overflow-hidden border-l border-white/5 items-center justify-center">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
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
        </div>
      </div>
    </div>
  );
}