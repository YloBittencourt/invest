import { Routes, Route } from 'react-router-dom';

import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth'; // <-- Importe a tela de Autenticação

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      <p>Página não encontrada (404)</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans antialiased bg-slate-950 text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cotacao" element={<Cotacao />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} /> {/* <-- Adicione a Rota */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}