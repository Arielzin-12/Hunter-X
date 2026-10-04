import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, Loader2, ExternalLink, ShieldCheck, SlidersHorizontal, Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import { supabaseConfigured } from "@/lib/supabase";
import { searchGooglePlaces } from "@/services/googlePlaces";
import { getSearchCreditStatus, type SearchCreditStatus, saveLead, listSavedFilters, saveFilter, deleteFilter } from "@/services/appData";

export const Route = createFileRoute("/app/leads/search")({ component: SearchPage });

function SearchPage() {
  const [q, setQ] = useState("");
  const [l, setL] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minReviews, setMinReviews] = useState("");
  const [hasWebsite, setHasWebsite] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [credit, setCredit] = useState<SearchCreditStatus | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([listSavedFilters(), getSearchCreditStatus()])
      .then(([filters, status]) => { setSaved(filters); setCredit(status); })
      .catch(() => {});
  }, []);

  const filtered = results.filter(x =>
    (!minRating || Number(x.rating || 0) >= Number(minRating)) &&
    (!minReviews || Number(x.reviews_count || 0) >= Number(minReviews)) &&
    (!hasWebsite || Boolean(x.website)) &&
    (!hasPhone || Boolean(x.phone))
  );

  async function search() {
    setError("");
    if (!q.trim() || !l.trim()) { setError("Informe o segmento e a localização."); return; }
    if (credit && credit.remaining <= 0) { setError("Você não tem créditos de pesquisa disponíveis nesta semana."); return; }

    setLoading(true);
    try {
      const d = await searchGooglePlaces(q, l);
      setResults(d.leads || []);
      setCredit({
        plan: d.credit.plan,
        weekly_limit: d.credit.weekly_limit,
        remaining: d.credit.remaining,
        result_limit: d.credit.result_limit,
        week_start: credit?.week_start || "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha na pesquisa.");
      getSearchCreditStatus().then(setCredit).catch(() => {});
    } finally {
      setLoading(false);
    }
  }

  async function persistFilter() {
    const name = window.prompt("Nome do filtro", "Meu filtro");
    if (!name?.trim()) return;
    try {
      const x = await saveFilter(name, q, l, { minRating, minReviews, hasWebsite, hasPhone, source: "google" });
      setSaved([x, ...saved]);
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar o filtro."); }
  }

  function applyFilter(x: any) {
    setQ(x.query || "");
    setL(x.location || "");
    const f = x.filters || {};
    setMinRating(f.minRating || "");
    setMinReviews(f.minReviews || "");
    setHasWebsite(Boolean(f.hasWebsite));
    setHasPhone(Boolean(f.hasPhone));
  }

  return <AppShell>
    <PageHeader
      eyebrow="Prospecção"
      title="Encontrar leads"
      description="Encontre empresas no Google Maps por segmento e localização. Cada pesquisa consome 1 crédito."
    />
    <div className="rounded-2xl border border-white/8 bg-white/[.035] p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">Google Maps</span>
        {credit && <span className="ml-auto rounded-full border border-white/8 px-3 py-1.5 text-xs text-white/50">
          {credit.remaining}/{credit.weekly_limit} créditos nesta semana · até {credit.result_limit} empresas por pesquisa
        </span>}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
        <label><span className="mb-2 block text-xs text-white/45">Segmento</span>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3">
            <Search size={16} className="text-white/30"/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Dentistas, pet shops, restaurantes..." className="h-12 w-full bg-transparent text-sm outline-none"/>
          </div>
        </label>
        <label><span className="mb-2 block text-xs text-white/45">Localização</span>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3">
            <MapPin size={16} className="text-white/30"/>
            <input value={l} onChange={e => setL(e.target.value)} placeholder="Campinas, SP" onKeyDown={e => e.key === "Enter" && search()} className="h-12 w-full bg-transparent text-sm outline-none"/>
          </div>
        </label>
        <button onClick={search} disabled={loading || !supabaseConfigured || (credit?.remaining ?? 1) <= 0} className="mt-6 h-12 rounded-xl bg-white px-6 text-sm font-semibold text-black disabled:opacity-40">
          {loading ? <Loader2 size={16} className="mr-2 inline animate-spin"/> : <Search size={16} className="mr-2 inline"/>}
          {loading ? "Pesquisando..." : "Encontrar leads"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="rounded-lg border border-white/8 px-3 py-2 text-xs text-white/65"><SlidersHorizontal size={14} className="mr-1 inline"/>Filtros</button>
        <button onClick={persistFilter} disabled={!q || !l} className="rounded-lg border border-white/8 px-3 py-2 text-xs text-white/65 disabled:opacity-40"><Bookmark size={14} className="mr-1 inline"/>Salvar filtro</button>
        <span className="text-xs text-white/30">{filtered.length} resultados após filtros</span>
      </div>

      {filtersOpen && <div className="mt-4 grid gap-3 rounded-xl border border-white/8 bg-black/10 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-white/40">Avaliação mínima<input value={minRating} onChange={e => setMinRating(e.target.value)} type="number" min="0" max="5" step=".1" placeholder="4.0" className="mt-2 h-10 w-full rounded-lg border border-white/8 bg-black/20 px-3 text-sm"/></label>
        <label className="text-xs text-white/40">Mínimo de avaliações<input value={minReviews} onChange={e => setMinReviews(e.target.value)} type="number" min="0" placeholder="10" className="mt-2 h-10 w-full rounded-lg border border-white/8 bg-black/20 px-3 text-sm"/></label>
        <label className="flex items-center gap-2 pt-6 text-xs text-white/55"><input type="checkbox" checked={hasWebsite} onChange={e => setHasWebsite(e.target.checked)}/> Possui site</label>
        <label className="flex items-center gap-2 pt-6 text-xs text-white/55"><input type="checkbox" checked={hasPhone} onChange={e => setHasPhone(e.target.checked)}/> Possui telefone</label>
      </div>}

      <div className="mt-4 flex flex-wrap gap-2">
        {saved.slice(0, 6).map(x => <div key={x.id} className="flex items-center rounded-full border border-white/8 bg-white/[.025]">
          <button onClick={() => applyFilter(x)} className="px-3 py-1.5 text-xs text-white/55">{x.name}</button>
          <button onClick={async () => { await deleteFilter(x.id); setSaved(saved.filter(y => y.id !== x.id)); }} title="Excluir filtro" className="px-2 text-white/30 hover:text-red-300"><Trash2 size={11}/></button>
        </div>)}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/35"><ShieldCheck size={14}/> Dados públicos do Google Maps. O HunterX não inventa informações.</div>
    </div>

    {error && <div className="mt-5 rounded-xl border border-red-400/15 bg-red-400/5 p-4 text-sm text-red-200">{error}</div>}

    <div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[.035]">
      <div className="border-b border-white/8 p-5"><h2 className="font-semibold">Resultados</h2><p className="mt-1 text-xs text-white/35">{filtered.length ? filtered.length + " resultados encontrados" : "Sua pesquisa aparecerá aqui."}</p></div>
      {filtered.length === 0 ? <div className="p-12 text-center text-sm text-white/35">Faça uma pesquisa para encontrar empresas.</div> : <div className="divide-y divide-white/6">
        {filtered.map((x: any) => <div key={x.id || x.google_place_id || x.name} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/6"><MapPin size={17}/></div>
          <div className="min-w-0 flex-1">
            <div className="font-medium">{x.name}</div>
            <div className="mt-1 text-xs text-white/40">{x.address || "Localização não informada"}</div>
            <div className="mt-2 text-xs text-white/35">{x.rating ? "Avaliação " + x.rating + " · " + (x.reviews_count || 0) + " avaliações" : "Fonte: Google Maps"}</div>
          </div>
          {(x.maps_url || x.website) && <a href={x.maps_url || x.website} target="_blank" rel="noreferrer" className="rounded-lg border border-white/8 px-3 py-2 text-xs text-white/60">Abrir mapa <ExternalLink size={13} className="ml-1 inline"/></a>}
          <button onClick={async () => { try { await saveLead(x); setResults(results.map((r: any) => r === x ? { ...r, saved: true } : r)); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar."); } }} disabled={x.saved} className="rounded-lg border border-white/8 px-3 py-2 text-xs disabled:opacity-40">{x.saved ? "Salvo" : "Salvar lead"}</button>
        </div>)}
      </div>}
    </div>
  </AppShell>;
}
