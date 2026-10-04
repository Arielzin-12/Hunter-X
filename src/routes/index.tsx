import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
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
      { name: "description", content: "O HunterX transforma pesquisas de empresas em oportunidades comerciais organizadas, inteligentes e prontas para prospecção." },
      { property: "og:title", content: "HunterX — Prospecção comercial inteligente" },
      { property: "og:description", content: "Descubra empresas, organize leads, gerencie campanhas e feche mais negócios com o HunterX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getSession()?.access_token) {
      navigate({ to: "/app", replace: true });
      return;
    }
    setChecking(false);
  }, [navigate]);

  if (checking) return <div className="min-h-screen bg-background" />;

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
