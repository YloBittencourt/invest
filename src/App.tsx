import { Routes, Route } from 'react-router-dom';

// Importações Nomeadas (Named Exports) - Padrão Clean Code para evitar "telas brancas"
import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    // Wrapper Global: 
    // - min-h-screen: Garante que a tela sempre ocupe 100% da altura
    // - font-sans: Força a família tipográfica padrão
    // - antialiased: Aplica suavização de fontes (padrão MacOS/iOS) para um visual premium
    // Nota: O background (bg-slate-950 ou bg-white) foi delegado para cada página individualmente.
    <div className="min-h-screen font-sans antialiased">
      <Routes>
        {/* Funil de Aquisição */}
        <Route path="/" element={<Landing />} />
        
        {/* Ferramentas Abertas (Isca de Lead) */}
        <Route path="/cotacao" element={<Cotacao />} />
        
        {/* Área Logada (Produto Principal) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Fallback de Erro 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}