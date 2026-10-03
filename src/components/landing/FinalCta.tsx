import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/70 px-6 py-16 text-center md:py-24">
            <div className="bg-grid-faint absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />

            <div className="relative">
              <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-5xl">
                Pronto para encontrar seus próximos clientes?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-muted-foreground md:text-lg">
                Comece a transformar pesquisas em oportunidades comerciais.
              </p>
              <a
                href="#top"
                className="btn-glow mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground md:text-base"
              >
                Começar agora
                <ArrowRight className="size-4" />
              </a>
              <p className="mt-4 text-xs text-muted-foreground">
                Sem cartão de crédito · Configuração em minutos
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
