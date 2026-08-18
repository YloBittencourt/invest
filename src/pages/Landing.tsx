import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import TickerTape from "../components/TickerTape";
import WatchlistCard from "../components/WatchlistCard";

const VALUE_PROPS = [
  {
    label: "Cotação",
    title: "Preço da B3 no momento exato em que você olha",
    description:
      "Busque qualquer ação, FII ou ETF e veja o preço atual, a variação do dia e o histórico de proventos — sem precisar abrir o home broker da corretora.",
    sample: (
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-ink-border bg-ink px-4 py-3">
        <span className="font-mono text-sm text-text-primary">VALE3</span>
        <span className="tabular font-mono text-sm text-text-primary">R$ 61,05</span>
        <span className="tabular font-mono text-sm text-gain">▲ 0,87%</span>
      </div>
    ),
  },
  {
    label: "Carteira",
    title: "Preço médio, cotas e lucro — calculado sozinho",
    description:
      "Cadastre o que você comprou e a que preço. O painel busca a cotação atual e calcula seu resultado em reais e em porcentagem, a cada ativo e na carteira toda.",
    sample: (
      <div className="mt-6 flex items-center justify-between rounded-lg border border-ink-border bg-ink px-4 py-3">
        <span className="font-mono text-sm text-text-secondary">PM R$ 35,10 → R$ 38,42</span>
        <span className="tabular font-mono text-sm text-gain">+9,46%</span>
      </div>
    ),
  },
  {
    label: "Análise de fundos",
    title: "Cole o relatório gerencial, a IA lê por você",
    description:
      "Envie o PDF ou o link do relatório do fundo. A IA aponta pontos positivos e negativos com base no que está escrito de verdade no documento, e mostra a média de dividendos dos últimos 12 meses.",
    sample: (
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-ink-border bg-ink px-4 py-3">
        <span className="rounded-full bg-gain/10 px-2 py-0.5 font-mono text-xs text-gain">
          + vacância baixa
        </span>
        <span className="rounded-full bg-loss/10 px-2 py-0.5 font-mono text-xs text-loss">
          − alavancagem alta
        </span>
      </div>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Crie sua conta",
    description: "Cadastro com e-mail e senha. Seus dados de carteira ficam vinculados só a você.",
  },
  {
    n: "02",
    title: "Monte sua carteira",
    description: "Adicione seus ativos com preço médio e quantidade de cotas.",
  },
  {
    n: "03",
    title: "Acompanhe o resultado",
    description: "Veja o lucro ou prejuízo atualizado e analise fundos quando precisar decidir algo.",
  },
];

const FAQ = [
  {
    q: "A cotação é realmente em tempo real?",
    a: "É a cotação mais recente disponível na fonte de dados que usamos. Em alguns momentos de alto volume, pode haver um pequeno atraso — se isso acontecer, o painel avisa em vez de mostrar um número desatualizado sem sinalizar.",
  },
  {
    q: "Preciso informar dados da minha corretora?",
    a: "Não. Você digita manualmente o que comprou (ativo, preço médio e quantidade). O InvestPainel não se conecta à sua corretora.",
  },
  {
    q: "Como funciona a análise de fundos?",
    a: "Você indica o link do PDF do relatório gerencial ou faz upload do arquivo. A IA lê o conteúdo real do documento e organiza os pontos relevantes — ela não pesquisa nem inventa informações fora do que está no relatório.",
  },
  {
    q: "É gratuito?",
    a: "A conta e o acompanhamento de carteira são gratuitos. Detalhes de eventuais limites de uso ficam disponíveis após o cadastro.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-ink-border bg-ink-surface px-3 py-1 font-mono text-xs text-text-secondary">
              Feito para o investidor da B3
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary md:text-5xl">
              Sua carteira, sua cotação e a análise do fundo — num painel só.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              Pare de calcular preço médio na mão e de garimpar relatório de fundo em PDF.
              O InvestPainel busca a cotação, calcula seu lucro e lê o relatório gerencial por você.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="rounded-lg bg-cta px-6 py-3.5 text-center text-sm font-semibold text-ink transition hover:bg-cta-hover"
              >
                Criar conta grátis
              </Link>
              <a
                href="#recursos"
                className="rounded-lg border border-ink-border px-6 py-3.5 text-center text-sm font-medium text-text-primary transition hover:bg-ink-surface"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <WatchlistCard />
          </div>
        </div>
      </section>

      <TickerTape />

      {/* Value props */}
      <section id="recursos" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
            Três problemas do investidor pessoa física, resolvidos num lugar
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-ink-border bg-ink-surface p-7"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-cta">
                {item.label}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
              {item.sample}
            </div>
          ))}
        </div>
      </section>

      <TickerTape />

      {/* Como funciona */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
          Como funciona
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n}>
              <span className="font-mono text-sm text-text-muted">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
          Dúvidas comuns
        </h2>

        <div className="mt-10 divide-y divide-ink-border border-y border-ink-border">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left">
                <span className="font-medium text-text-primary">{item.q}</span>
                <span className="ml-4 shrink-0 text-text-muted transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-ink-border bg-ink-surface px-8 py-16 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
            Comece a acompanhar sua carteira de graça
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            Leva menos de um minuto pra criar sua conta e cadastrar seu primeiro ativo.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block rounded-lg bg-cta px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-cta-hover"
          >
            Criar conta grátis
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <span className="font-display text-sm font-semibold text-text-primary">
            Invest<span className="text-cta">Painel</span>
          </span>
          <p className="text-center text-xs text-text-muted md:text-left">
            InvestPainel não é uma corretora e não presta recomendação de investimento.
            As informações apresentadas têm caráter informativo.
          </p>
        </div>
      </footer>
    </div>
  );
}
