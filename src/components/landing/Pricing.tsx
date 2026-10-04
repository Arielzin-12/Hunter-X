import { Check, LockKeyhole } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

const plans = [
  {
    name: "Free",
    credits: "10",
    description: "Para começar a prospectar e testar o HunterX.",
    available: true,
    features: ["10 créditos de pesquisa por semana", "Até 5 empresas por pesquisa", "Google Maps", "Organização de leads"],
  },
  {
    name: "Pro",
    credits: "50",
    description: "Mais volume para uma prospecção consistente.",
    available: false,
    features: ["50 créditos de pesquisa por semana", "Até 20 empresas por pesquisa", "Todos os recursos do Free"],
  },
  {
    name: "Max",
    credits: "150",
    description: "Para quem quer escalar a prospecção.",
    available: false,
    features: ["150 créditos de pesquisa por semana", "Até 50 empresas por pesquisa", "Todos os recursos do Pro"],
  },
];

export function Pricing() {
  return (
    <section id="precos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Planos</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight md:text-5xl">Escolha seu nível de prospecção</h2>
            <p className="mt-5 text-muted-foreground md:text-lg">Comece grátis e aumente seu volume quando precisar.</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name}>
              <div className={`card-hover relative h-full rounded-3xl border p-6 md:p-7 ${plan.available ? "border-primary/40 bg-primary/[.06]" : "border-border bg-card/50"}`}>
                {!plan.available && (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    <LockKeyhole className="size-3" /> Em breve
                  </div>
                )}
                <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="font-display text-5xl font-bold">{plan.credits}</span>
                  <span className="pb-1 text-sm text-muted-foreground">créditos / semana</span>
                </div>
                <p className="mt-4 min-h-10 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.available ? (
                  <Link to="/register" className="btn-glow mt-8 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                    Começar grátis
                  </Link>
                ) : (
                  <button disabled className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-muted-foreground opacity-70">
                    Em breve
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
