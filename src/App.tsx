import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Cotacao from "./pages/Cotacao";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/cotacao" element={<Cotacao />} />

      {/*
        Rotas abaixo ainda são placeholders. Dependem de autenticação (Supabase),
        que ainda não foi configurada:
        - /login          → autenticação via Supabase
        - /carteira       → gestão de carteira com P&L (protegida)
        - /analise-fundos → upload de PDF + análise por IA (protegida)

        Nota: /cotacao acima está SEM proteção de login por enquanto — qualquer
        pessoa que acessar a URL consegue usar. Isso deve ser revisto quando o
        login existir, caso você queira restringir a busca de cotação a usuários
        cadastrados.
      */}
      <Route path="/login" element={<ComingSoon title="Login e cadastro" />} />
      <Route path="/carteira" element={<ComingSoon title="Minha carteira" />} />
      <Route path="/analise-fundos" element={<ComingSoon title="Análise de fundos com IA" />} />
    </Routes>
  );
}

export default App;
