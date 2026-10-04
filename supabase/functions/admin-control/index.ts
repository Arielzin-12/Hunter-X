const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const enc = (value: Uint8Array) =>
  btoa(String.fromCharCode(...value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const dec = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

async function signToken(payload: Record<string, unknown>, secret: string) {
  const body = enc(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = enc(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))));
  return body + "." + signature;
}

async function verifyToken(token: string, secret: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    dec(signature),
    new TextEncoder().encode(body),
  );
  if (!valid) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(dec(body)));
    return payload.scope === "admin" && Number(payload.exp) > Date.now();
  } catch {
    return false;
  }
}

function serviceKey() {
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    || (() => {
      try { return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default; } catch { return undefined; }
    })();
}

async function adminFetch(path: string, init: RequestInit = {}) {
  const base = Deno.env.get("SUPABASE_URL");
  const key = serviceKey();
  if (!base || !key) throw new Error("Supabase admin secret não configurado.");
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", "Bearer " + key);
  headers.set("Content-Type", "application/json");
  const response = await fetch(base + path, { ...init, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.error_description || "Falha na operação administrativa.");
  return data;
}

function resultLimit(plan: string) {
  return plan === "max" ? 50 : plan === "pro" ? 20 : 5;
}

function weeklyLimit(plan: string) {
  return plan === "max" ? 150 : plan === "pro" ? 50 : 10;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");
    const password = String(body.password || "");
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword) return json({ error: "Modo ADM não configurado no servidor." }, 503);

    if (action === "login") {
      if (password !== adminPassword) return json({ error: "Senha administrativa inválida." }, 401);
      const token = await signToken(
        { scope: "admin", exp: Date.now() + 2 * 60 * 60 * 1000 },
        adminPassword,
      );
      return json({ token, expires_at: Date.now() + 2 * 60 * 60 * 1000 });
    }

    const token = String(body.token || "");
    if (!(await verifyToken(token, adminPassword))) return json({ error: "Sessão administrativa inválida ou expirada." }, 401);

    if (action === "list_users") {
      const usersResponse = await adminFetch("/auth/v1/admin/users?per_page=1000&page=1");
      const users = usersResponse?.users || [];
      const ids = users.map((u: any) => u.id).filter(Boolean);
      const queryIds = ids.length ? ids.join(",") : null;
      const profiles = queryIds
        ? await adminFetch("/rest/v1/profiles?id=in.(" + queryIds + ")&select=id,name,company_name,role")
        : [];
      const subscriptions = queryIds
        ? await adminFetch("/rest/v1/subscriptions?user_id=in.(" + queryIds + ")&select=user_id,plan,status")
        : [];
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      const subMap = new Map((subscriptions || []).map((s: any) => [s.user_id, s]));
      return json({
        users: users.map((u: any) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          name: profileMap.get(u.id)?.name || u.user_metadata?.name || "",
          company_name: profileMap.get(u.id)?.company_name || "",
          plan: subMap.get(u.id)?.plan || "free",
          status: subMap.get(u.id)?.status || "active",
        })),
      });
    }

    if (action === "set_plan") {
      const email = String(body.email || "").trim().toLowerCase();
      const plan = String(body.plan || "free").toLowerCase();
      if (!email || !["free", "pro", "max"].includes(plan)) {
        return json({ error: "Informe um email e um plano válido." }, 400);
      }

      const usersResponse = await adminFetch("/auth/v1/admin/users?per_page=1000&page=1");
      const user = (usersResponse?.users || []).find((u: any) => String(u.email || "").toLowerCase() === email);
      if (!user) return json({ error: "Usuário não encontrado." }, 404);

      const limits = {
        weekly_searches: weeklyLimit(plan),
        result_limit: resultLimit(plan),
      };
      const existing = await adminFetch("/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(user.id) + "&select=id");
      if (existing?.[0]?.id) {
        await adminFetch("/rest/v1/subscriptions?id=eq." + encodeURIComponent(existing[0].id), {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ plan, status: "active", limits, updated_at: new Date().toISOString() }),
        });
      } else {
        await adminFetch("/rest/v1/subscriptions", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ user_id: user.id, plan, status: "active", limits }),
        });
      }

      const week = new Date();
      const day = week.getUTCDay();
      week.setUTCDate(week.getUTCDate() - ((day + 6) % 7));
      const weekStart = week.toISOString().slice(0, 10);
      const creditRows = await adminFetch("/rest/v1/credit_balances?user_id=eq." + encodeURIComponent(user.id) + "&select=user_id");
      if (creditRows?.[0]) {
        await adminFetch("/rest/v1/credit_balances?user_id=eq." + encodeURIComponent(user.id), {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ balance: weeklyLimit(plan), week_start: weekStart, updated_at: new Date().toISOString() }),
        });
      } else {
        await adminFetch("/rest/v1/credit_balances", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ user_id: user.id, balance: weeklyLimit(plan), week_start: weekStart }),
        });
      }

      return json({ ok: true, email, plan, weekly_limit: weeklyLimit(plan), result_limit: resultLimit(plan) });
    }

    return json({ error: "Ação administrativa inválida." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Falha no modo ADM." }, 500);
  }
});
