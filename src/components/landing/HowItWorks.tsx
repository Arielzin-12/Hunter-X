import { Search, FolderKanban, Target } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Encontre",
    text: "Descubra empresas e potenciais clientes por segmento e localização.",
  },
  {
    number: "02",
    icon: FolderKanban,
    title: "Organize",
    text: "Centralize seus leads, listas e oportunidades em um único lugar.",
  },
  {
    number: "03",
    icon: Target,
    title: "Converta",
    text: "Acompanhe seus contatos e transforme oportunidades em negócios.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Como funciona
          </p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Da busca ao cliente em poucos passos.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="card-hover group relative h-full overflow-hidden rounded-2xl border border-border bg-card/50 p-7">
                <span className="font-display absolute -top-2 right-5 text-7xl font-bold text-foreground/5 transition-colors group-hover:text-primary/10">
                  {step.number}
                </span>
                <span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="font-display mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
                <div className="mt-6 h-1 w-10 rounded-full bg-primary/30 transition-all duration-500 group-hover:w-20 group-hover:bg-primary" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
