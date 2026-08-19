import { Routes, Route } from 'react-router-dom';

import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { PrivateRoute } from './components/PrivateRoute'; // <-- Importamos o segurança

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
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
        <Route path="/login" element={<Auth />} />
        <Route path="/cadastro" element={<Auth />} />
        
        {/* ROTA PROTEGIDA */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}