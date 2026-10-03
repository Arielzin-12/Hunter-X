import { supabaseAuth, supabaseConfigured } from "./supabase";

const SESSION_KEY = "hunterx_session";

export type HunterSession = { access_token: string; refresh_token?: string; user?: { id: string; email?: string } };

export function getSession(): HunterSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export function clearSession() { localStorage.removeItem(SESSION_KEY); }

export async function signIn(email: string, password: string) {
  if (!supabaseConfigured) throw new Error("Configure o Supabase para entrar.");
  const session = await supabaseAuth("token?grant_type=password", { email, password });
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signUp(email: string, password: string, name: string) {
  if (!supabaseConfigured) throw new Error("Configure o Supabase para criar sua conta.");
  return supabaseAuth("signup", { email, password, data: { name } });
}
