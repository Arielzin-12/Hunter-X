import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Shield, RefreshCw, Save, LogOut, Search } from "lucide-react";
import { adminListUsers, adminSetPlan, clearAdminSession, hasAdminSession, type AdminUser } from "@/services/admin";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"free" | "pro" | "max">("free");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      if (!hasAdminSession()) {
        navigate({ to: "/login" });
        return;
      }
      setUsers(await adminListUsers());
    } catch (e) {
      clearAdminSession();
      setError(e instanceof Error ? e.message : "Sessão administrativa inválida.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function savePlan() {
    if (!email.trim()) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await adminSetPlan(email.trim(), plan);
      setMessage(`${result.email} agora está no plano ${result.plan.toUpperCase()} — ${result.weekly_limit} pesquisas/semana e até ${result.result_limit} empresas por pesquisa.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível alterar o plano.");
    } finally {
      setSaving(false);
    }
  }

  const shown = users.filter((u) =>
    (u.email + " " + (u.name || "") + " " + (u.company_name || "")).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07080d] px-4 py-7 text-white sm:px-7">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-white/35"><Shield size={14}/> Modo ADM</div>
            <h1 className="mt-2 text-2xl font-bold">Controle de planos</h1>
            <p className="mt-1 text-sm text-white/40">Gerencie o plano de cada usuário sem expor credenciais administrativas.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/app" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm"><ArrowLeft size={15}/> Dashboard</Link>
            <button onClick={() => { clearAdminSession(); navigate({ to: "/login" }); }} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm text-red-200"><LogOut size={15}/> Sair ADM</button>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border border-white/8 bg-white/[.035] p-5">
          <h2 className="font-semibold">Adicionar plano a um usuário</h2>
          <p className="mt-1 text-xs text-white/40">Use o email cadastrado. A alteração reinicia os créditos semanais para o novo limite.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@cliente.com" className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none"/>
            <select value={plan} onChange={e => setPlan(e.target.value as typeof plan)} className="h-11 rounded-xl border border-white/10 bg-black/20 px-4 text-sm">
              <option value="free">Free — 10/semana · 5 empresas</option>
              <option value="pro">Pro — 50/semana · 20 empresas</option>
              <option value="max">Max — 150/semana · 50 empresas</option>
            </select>
            <button disabled={saving || !email.trim()} onClick={savePlan} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black disabled:opacity-40"><Save size={15}/>{saving ? "Salvando..." : "Salvar plano"}</button>
          </div>
          {message && <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm text-emerald-200">{message}</div>}
          {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">{error}</div>}
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[.035]">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/8 p-5">
            <div><h2 className="font-semibold">Usuários</h2><p className="mt-1 text-xs text-white/35">{users.length} contas</p></div>
            <div className="ml-auto flex gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/8 px-3"><Search size={14} className="text-white/30"/><input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filtrar..." className="h-9 w-44 bg-transparent text-xs outline-none"/></div>
              <button onClick={load} className="grid size-9 place-items-center rounded-xl border border-white/8"><RefreshCw size={15}/></button>
            </div>
          </div>
          {loading ? <div className="p-10 text-center text-sm text-white/35">Carregando usuários...</div> : shown.length ? (
            <div className="divide-y divide-white/6">
              {shown.map(u => <div key={u.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{u.email}</div><div className="mt-1 text-xs text-white/35">{u.name || "Sem nome"}{u.company_name ? " · " + u.company_name : ""}</div></div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase">{u.plan}</span>
                <button onClick={() => { setEmail(u.email); setPlan(u.plan); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-lg border border-white/8 px-3 py-2 text-xs">Editar plano</button>
              </div>)}
            </div>
          ) : <div className="p-10 text-center text-sm text-white/35">Nenhum usuário encontrado.</div>}
        </section>
      </div>
    </div>
  );
}
