import { motion } from "motion/react";
import { ArrowRight, Bot, Search, Sparkles, TrendingUp } from "lucide-react";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

const kpis = [
  { label: "Leads encontrados", value: "1.284", delta: "+12%" },
  { label: "Contatos", value: "386", delta: "+8%" },
  { label: "Oportunidades", value: "74", delta: "+23%" },
];

const rows = [
  { name: "Aurora Distribuidora", segment: "Atacado", status: "Quente" },
  { name: "Vetra Logística", segment: "Transporte", status: "Morno" },
  { name: "Nimbus Software", segment: "SaaS", status: "Quente" },
];

export function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="bg-grid-faint absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Plataforma de prospecção comercial
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display mt-6 text-4xl leading-[1.08] font-bold tracking-tight text-balance md:text-6xl">
                Encontre oportunidades antes dos seus{" "}
                <span className="text-primary">concorrentes.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                O HunterX transforma pesquisas de empresas em oportunidades
                comerciais organizadas, inteligentes e prontas para prospecção.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Começar agora
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#produto"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Conhecer o HunterX
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={36} className="relative">
            <HeroVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.5, 0.2, 1] }}
        className="rounded-2xl border border-border bg-card/80 shadow-[0_40px_80px_-40px_oklch(0_0_0/0.8)] backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-3 rounded-md border border-border bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
            app.hunterx.com.br
          </span>
        </div>

        <div className="space-y-4 p-4 md:p-5">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
            <Search className="size-4 text-primary" />
            Clínicas odontológicas · Campinas, SP
          </div>

          <div className="grid grid-cols-3 gap-3">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-border bg-background/50 p-3"
              >
                <p className="truncate text-[11px] text-muted-foreground">{kpi.label}</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-display text-lg font-bold">{kpi.value}</span>
                  <span className="text-[11px] font-semibold text-primary">{kpi.delta}</span>
                </div>
              </div>
            ))}
          </div>

          <MiniChart />

          <div className="space-y-2">
            {rows.map((row, i) => (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15, duration: 0.5 }}
                className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.name}</p>
                  <p className="text-[11px] text-muted-foreground">{row.segment}</p>
                </div>
                <StatusBadge label={row.status} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border border-primary/30 bg-card px-3.5 py-2.5 shadow-lg md:-right-6"
      >
        <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-primary">
          <Bot className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">HunterX AI</p>
          <p className="text-[11px] text-muted-foreground">12 novas empresas encontradas</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-lg md:-left-8"
      >
        <TrendingUp className="size-4 text-primary" />
        <p className="text-xs font-medium">
          +38 leads <span className="text-muted-foreground">hoje</span>
        </p>
      </motion.div>
    </div>
  );
}

function MiniChart() {
  const bars = [38, 52, 44, 66, 58, 78, 92];
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">Novos leads · 7 dias</p>
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          +12%
        </span>
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.7 + i * 0.07, duration: 0.5, ease: "easeOut" }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-primary" : "bg-primary/35"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const styles =
    label === "Quente"
      ? "bg-primary/15 text-primary"
      : label === "Morno"
        ? "bg-secondary text-secondary-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}
