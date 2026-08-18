import { Link } from "react-router-dom";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
        Em construção
      </span>
      <h1 className="font-display text-2xl font-semibold text-text-primary">{title}</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        Esta página ainda não foi implementada nesta etapa do projeto.
      </p>
      <Link to="/" className="mt-2 text-sm text-cta hover:text-cta-hover">
        Voltar para a página inicial
      </Link>
    </main>
  );
}
