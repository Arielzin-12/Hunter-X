import {
  Search,
  Map,
  FolderKanban,
  List,
  Rocket,
  Bot,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: Search,
    title: "Busca de Leads",
    text: "Encontre empresas por nicho e localização.",
  },
  {
    icon: Map,
    title: "Mapa Inteligente",
    text: "Visualize oportunidades diretamente no mapa.",
  },
  {
    icon: FolderKanban,
    title: "CRM",
    text: "Organize seus leads em um funil comercial.",
  },
  {
    icon: List,
    title: "Listas",
    text: "Crie listas personalizadas para organizar sua prospecção.",
  },
  {
    icon: Rocket,
    title: "Campanhas",
    text: "Gerencie suas ações comerciais.",
  },
  {
    icon: Bot,
    title: "HunterX AI",
    text: "Use inteligência artificial para analisar oportunidades e criar abordagens.",
    highlight: true,
  },
  {
    icon: TrendingUp,
    title: "Analytics",
    text: "Acompanhe seus resultados e métricas.",
  },
  {
    icon: Upload,
    title: "Exportações",
    text: "Exporte seus dados para utilizar onde quiser.",
  },
];

export function Features() {
  return (
    <section id="recursos" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Recursos
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Tudo o que sua prospecção precisa.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 4) * 0.08}>
              <div
                className={`card-hover h-full rounded-2xl border p-6 ${
                  feature.highlight
                    ? "border-primary/30 bg-primary/[0.06]"
                    : "border-border bg-card/50"
                }`}
              >
                <span
                  className={`grid size-10 place-items-center rounded-xl border ${
                    feature.highlight
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border bg-secondary text-foreground/80"
                  }`}
                >
                  <feature.icon className="size-4.5" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
