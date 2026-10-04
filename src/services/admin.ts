import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase";

const base = getSupabaseUrl();
const anon = getSupabaseAnonKey();
const KEY = "hunterx_admin_session";

export type AdminUser = {
  id: string;
  email: string;
  name?: string;
  company_name?: string;
  plan: "free" | "pro" | "max";
  status: string;
  created_at: string;
};

function getToken() {
  return sessionStorage.getItem(KEY) || "";
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEY);
}

export function hasAdminSession() {
  return Boolean(getToken());
}

async function callAdmin(body: Record<string, unknown>) {
  if (!base || !anon) throw new Error("Supabase não configurado.");
  const response = await fetch(base + "/functions/v1/admin-control", {
    method: "POST",
    headers: {
      apikey: anon,
      Authorization: "Bearer " + (getToken() || anon),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Não foi possível executar a ação administrativa.");
  return data;
}

export async function adminLogin(password: string) {
  const data = await callAdmin({ action: "login", password });
  sessionStorage.setItem(KEY, data.token);
  return data;
}

export async function adminListUsers(): Promise<AdminUser[]> {
  const data = await callAdmin({ action: "list_users", token: getToken() });
  return data.users || [];
}

export async function adminSetPlan(email: string, plan: "free" | "pro" | "max") {
  return callAdmin({ action: "set_plan", token: getToken(), email, plan });
}
