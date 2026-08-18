import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
            Invest<span className="text-cta">Painel</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#recursos" className="text-sm text-text-secondary transition hover:text-text-primary">
            Recursos
          </a>
          <a href="#como-funciona" className="text-sm text-text-secondary transition hover:text-text-primary">
            Como funciona
          </a>
          <a href="#faq" className="text-sm text-text-secondary transition hover:text-text-primary">
            Dúvidas
          </a>
          <Link to="/cotacao" className="text-sm text-text-secondary transition hover:text-text-primary">
            Testar cotação
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-text-secondary transition hover:text-text-primary"
          >
            Entrar
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cta-hover"
          >
            Criar conta grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}
