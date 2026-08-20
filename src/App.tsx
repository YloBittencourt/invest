import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { PrivateRoute } from './components/PrivateRoute';

// Instância do motor de cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Os dados ficam "frescos" por 5 minutos sem precisar re-buscar
      refetchOnWindowFocus: false, // Evita buscar dados à toa só de mudar de aba no Chrome
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
      <p>Página não encontrada (404)</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen font-sans antialiased bg-slate-950 text-white">
        <Toaster theme="dark" position="bottom-right" richColors />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/cotacao" element={<Cotacao />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/cadastro" element={<Auth />} />
          
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
    </QueryClientProvider>
  );
}