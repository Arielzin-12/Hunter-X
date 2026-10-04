import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/auth";
import { adminLogin } from "@/services/admin";
import { Zap, ArrowRight, Shield, X } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, pw);
      await nav({ to: "/app" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }

  async function submitAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdminError("");
    setAdminBusy(true);
    try {
      await adminLogin(adminPassword);
      setAdminPassword("");
      await nav({ to: "/admin" });
    } catch (e) {
      setAdminError(e instanceof Error ? e.message : "Não foi possível entrar no modo ADM.");
    } finally {
      setAdminBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07080d] text-white grid place-items-center p-5">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2 font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-black"><Zap size={18} fill="currentColor"/></span>
          HunterX
        </Link>

        <form onSubmit={submit} className="rounded-3xl border border-white/8 bg-white/[.035] p-7">
          <h1 className="text-2xl font-bold">Entrar no HunterX</h1>
          <p className="mt-2 text-sm text-white/40">Acesse seu workspace comercial.</p>
          {error && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{error}</div>}
          <label className="mt-6 block text-xs text-white/45">Email
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none"/>
          </label>
          <label className="mt-4 block text-xs text-white/45">Senha
            <input value={pw} onChange={e => setPw(e.target.value)} type="password" required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none"/>
          </label>
          <button disabled={busy} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black disabled:opacity-50">
            {busy ? "Entrando..." : "Entrar"}<ArrowRight size={16}/>
          </button>
          <p className="mt-5 text-center text-sm text-white/40">Ainda não tem conta? <Link to="/register" className="text-white hover:underline">Criar conta</Link></p>
          <button type="button" onClick={() => { setAdminOpen(true); setAdminError(""); }} className="mx-auto mt-5 flex items-center gap-2 text-xs text-white/30 hover:text-white/60">
            <Shield size={13}/> Modo ADM
          </button>
        </form>
      </div>

      {adminOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
        <form onSubmit={submitAdmin} className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0e15] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div><div className="flex items-center gap-2 text-sm font-semibold"><Shield size={16}/> Modo ADM</div><p className="mt-1 text-xs text-white/35">Acesso administrativo protegido.</p></div>
            <button type="button" onClick={() => setAdminOpen(false)} className="text-white/40"><X size={18}/></button>
          </div>
          {adminError && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-200">{adminError}</div>}
          <label className="mt-5 block text-xs text-white/45">Senha administrativa
            <input value={adminPassword} onChange={e => setAdminPassword(e.target.value)} type="password" autoFocus required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none"/>
          </label>
          <button disabled={adminBusy} className="mt-5 h-11 w-full rounded-xl bg-white text-sm font-semibold text-black disabled:opacity-50">{adminBusy ? "Verificando..." : "Acessar modo ADM"}</button>
        </form>
      </div>}
    </div>
  );
}
