import { supabaseFetch, supabaseConfigured } from "@/lib/supabase";
import type { Lead, LeadStatus } from "@/types/hunterx";

export async function listLeads(userId?: string): Promise<Lead[]> {
  if (!supabaseConfigured || !userId) return [];
  return supabaseFetch<Lead[]>(`leads?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`);
}
export async function updateLeadStatus(id: string, status: LeadStatus, token: string) {
  return supabaseFetch<Lead[]>(`leads?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH", headers: { Authorization: `Bearer ${token}`, Prefer: "return=representation" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() })
  });
}
