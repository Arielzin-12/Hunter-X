import { supabaseFetch, supabaseConfigured } from "@/lib/supabase";
export async function getCreditBalance(userId: string) {
  if (!supabaseConfigured) return null;
  const rows = await supabaseFetch<{balance:number}[]>(`credit_balances?user_id=eq.${encodeURIComponent(userId)}&limit=1`);
  return rows[0]?.balance ?? 0;
}
