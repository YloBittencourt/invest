import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Cotacao } from './pages/Cotacao'; 
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <div className="bg-white text-primary min-h-screen font-sans antialiased">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cotacao" element={<Cotacao />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}