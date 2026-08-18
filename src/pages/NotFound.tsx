import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center max-w-md w-full">
        {/* Elemento visual minimalista */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
            <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">
          Página não encontrada
        </h1>
        <p className="text-base text-muted mb-8">
          A URL que você tentou acessar não existe, foi movida ou está temporariamente indisponível.
        </p>
        
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}