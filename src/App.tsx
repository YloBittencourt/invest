import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cotacao" element={<Cotacao />} />
        {/* Rota 404: Captura qualquer URL não mapeada acima */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}