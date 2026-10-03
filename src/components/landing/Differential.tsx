import { Check, Brain, Database, Map as MapIcon, Search, Sparkles, TrendingUp, Workflow } from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  { icon: Search, label: "Pesquisa inteligente" },
  { icon: Database, label: "Dados organizados" },
  { icon: Workflow, label: "CRM integrado" },
  { icon: MapIcon, label: "Mapa de oportunidades" },
  { icon: Sparkles, label: "Automação" },
  { icon: Brain, label: "Inteligência artificial" },
  { icon: TrendingUp, label: "Analytics" },
];

export function Differential() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Diferencial
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Prospecção sem bagunça.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                O HunterX reúne descoberta, organização, análise e acompanhamento
                em uma única plataforma.
              </p>
              <a
                href="#cta"
                className="btn-glow mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Começar agora
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit.label}
                  className={`card-hover flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3.5 ${
                    i === benefits.length - 1 ? "sm:col-span-2" : ""
                  }`}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <benefit.icon className="size-4" />
                  </span>
                  <p className="text-sm font-medium">{benefit.label}</p>
                  <Check className="ml-auto size-4 shrink-0 text-primary" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
