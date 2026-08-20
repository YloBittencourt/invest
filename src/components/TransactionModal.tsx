import React, { useState } from 'react';
import { toast } from 'sonner';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { ticker: string; type: 'BUY' | 'SELL'; quantity: number; price: number; date: string }) => Promise<void>;
}

export function TransactionModal({ isOpen, onClose, onSubmit }: TransactionModalProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [ticker, setTicker] = useState('');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      setPrice('');
      return;
    }

    const numericValue = parseInt(value, 10) / 100;
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);

    setPrice(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticker || !quantity || !price || !date) {
      toast.error('Preencha todos os campos corretamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPriceString = price
        .replace(/[R$\s.]/g, '')
        .replace(',', '.');

      const numericPrice = parseFloat(cleanPriceString);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        toast.error('O preço precisa ser maior que zero.');
        setIsSubmitting(false);
        return;
      }

      await onSubmit({
        ticker: ticker.toUpperCase().trim(),
        type,
        quantity: parseInt(quantity, 10),
        price: numericPrice,
        date: date,
      });

      setTicker(''); 
      setQuantity(''); 
      setPrice('');
      setDate(today);
      
    } catch (error) {
      console.error("Falha ao processar modal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">Nova Transação</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
            <button type="button" onClick={() => setType('BUY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>Compra</button>
            <button type="button" onClick={() => setType('SELL')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'SELL' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}>Venda</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ativo</label>
              <input 
                type="text" 
                value={ticker} 
                onChange={(e) => setTicker(e.target.value)} 
                placeholder="Ex: VGIR11" 
                required 
                autoCapitalize="characters" 
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono uppercase placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                max={today}
                required 
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quantidade</label>
              <input 
                type="text"
                inputMode="numeric"
                value={quantity} 
                onChange={handleQuantityChange} 
                placeholder="100" 
                required 
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preço Unitário</label>
              <input 
                type="text"
                inputMode="numeric"
                value={price} 
                onChange={handlePriceChange} 
                placeholder="R$ 0,00" 
                required 
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
            {isSubmitting ? 'Processando...' : 'Confirmar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}