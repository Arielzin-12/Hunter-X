import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Differential } from "@/components/landing/Differential";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HunterX — Encontre oportunidades antes dos seus concorrentes" },
      {
        name: "description",
        content:
          "O HunterX transforma pesquisas de empresas em oportunidades comerciais organizadas, inteligentes e prontas para prospecção.",
      },
      { property: "og:title", content: "HunterX — Prospecção comercial inteligente" },
      {
        property: "og:description",
        content:
          "Descubra empresas, organize leads, gerencie campanhas e feche mais negócios com o HunterX.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <Differential />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
