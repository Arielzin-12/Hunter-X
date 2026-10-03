import { motion } from "motion/react";
import {
  LayoutDashboard,
  Search,
  Map,
  FolderKanban,
  List,
  Megaphone,
  BarChart3,
  Download,
  Bell,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { StatusBadge } from "./Hero";

const navItems = [
  { icon: LayoutDashboard, label: "Início", active: true },
  { icon: Search, label: "Busca de leads", active: false },
  { icon: Map, label: "Mapa", active: false },
  { icon: FolderKanban, label: "CRM", active: false },
  { icon: List, label: "Listas", active: false },
  { icon: Megaphone, label: "Campanhas", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Download, label: "Exportar", active: false },
];

const kpis = [
  { label: "Leads totais", value: 12483, delta: "+12,4%" },
  { label: "Leads encontrados", value: 1284, delta: "+8,1%" },
  { label: "Contatos realizados", value: 386, delta: "+15,2%" },
  { label: "Oportunidades", value: 74, delta: "+23,6%" },
];

const bars = [42, 55, 48, 70, 62, 84, 96];

const funnel = [
  { label: "Descoberta", count: 842, width: 100 },
  { label: "Qualificados", count: 412, width: 62 },
  { label: "Contatados", count: 198, width: 38 },
  { label: "Proposta", count: 56, width: 20 },
  { label: "Fechado", count: 24, width: 11 },
];

const companies = [
  { name: "Aurora Distribuidora", segment: "Atacado", location: "Campinas, SP", status: "Quente", score: 92 },
  { name: "Nimbus Software", segment: "SaaS", location: "São Paulo, SP", status: "Quente", score: 88 },
  { name: "Vetra Logística", segment: "Transporte", location: "Curitiba, PR", status: "Morno", score: 78 },
  { name: "Prisma Odontologia", segment: "Saúde", location: "Belo Horizonte, MG", status: "Morno", score: 71 },
  { name: "Ferragens Real", segment: "Indústria", location: "Joinville, SC", status: "Frio", score: 64 },
];

export function DashboardPreview() {
  return (
    <section id="produto" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              A plataforma
            </p>
            <h2 className="font-display mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Uma visão completa da sua operação comercial.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Do primeiro lead ao negócio fechado: tudo em um só painel.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} y={40}>
          <div className="relative mt-14">
            <div className="pointer-events-none absolute -inset-x-8 -top-10 h-40 rounded-full bg-primary/10 blur-[100px]" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_60px_120px_-40px_oklch(0_0_0/0.85)]">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 rounded-md border border-border bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                  app.hunterx.com.br/dashboard
                </span>
              </div>

              <div className="flex min-h-[560px]">
                <Sidebar />
                <div className="min-w-0 flex-1 p-4 md:p-6">
                  <KpiRow />
                  <ChartAndFunnel />
                  <CompaniesTable />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-48 shrink-0 flex-col border-r border-border bg-background/40 p-4 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="size-3.5" strokeWidth={2.5} />
        </span>
        <span className="font-display text-sm font-bold">
          Hunter<span className="text-primary">X</span>
        </span>
      </div>
      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map((item) => (
          <span
            key={item.label}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium ${
              item.active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </span>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-primary/25 bg-primary/[0.07] p-3">
        <p className="text-[11px] font-semibold">HunterX AI</p>
        <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
          12 novas empresas sugeridas no seu segmento.
        </p>
      </div>
    </aside>
  );
}

function KpiRow() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-display text-lg font-semibold">Visão geral</h3>
        <p className="text-xs text-muted-foreground">Sua prospecção nos últimos 30 dias</p>
      </div>
      <span className="grid size-9 place-items-center rounded-lg border border-border bg-background/60 text-muted-foreground">
        <Bell className="size-4" />
      </span>
    </div>
  );
}

function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-border bg-background/50 p-4"
        >
          <p className="truncate text-xs text-muted-foreground">{kpi.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <Counter
              value={kpi.value}
              className="font-display text-2xl font-bold tracking-tight"
            />
            <span className="text-[11px] font-semibold text-primary">{kpi.delta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartAndFunnel() {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border border-border bg-background/50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Novos leads por semana</p>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            +12% vs. semana anterior
          </span>
        </div>
        <div className="mt-4 flex h-36 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: "easeOut" }}
              style={{ height: `${h}%`, transformOrigin: "bottom" }}
              className={`flex-1 rounded-md ${
                i === bars.length - 1
                  ? "bg-primary shadow-[0_0_20px_-4px_var(--primary)]"
                  : "bg-primary/30"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
          {["S1", "S2", "S3", "S4", "S5", "S6", "S7"].map((week) => (
            <span key={week} className="flex-1 text-center">
              {week}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background/50 p-4">
        <p className="text-xs font-medium text-muted-foreground">Funil CRM</p>
        <div className="mt-4 space-y-3">
          {funnel.map((stage, i) => (
            <div key={stage.label}>
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] text-foreground/90">{stage.label}</p>
                <p className="font-display text-[11px] font-semibold">
                  {stage.count.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stage.width}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.25 + i * 0.09, duration: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary/30"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompaniesTable() {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/50">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">Empresas encontradas</p>
        <span className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">
          Últimos 7 dias
        </span>
      </div>
      <div className="divide-y divide-border/60">
        {companies.map((company, i) => (
          <motion.div
            key={company.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="font-display grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold">
              {company.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{company.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {company.segment} · {company.location}
              </p>
            </div>
            <StatusBadge label={company.status} />
            <span className="font-display hidden w-10 text-right text-xs font-bold text-primary sm:block">
              {company.score}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
