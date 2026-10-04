import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SUPABASE_URL = "https://ctxuixvumegoifmmkxzl.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0eHVpeHZ1bWVnb2lmbW1reHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNjIxNDYsImV4cCI6MjEwNjYzODE0Nn0.XjRidBWVhRtxpWOxxBXBUPN8lBpAe-TzKxnTEpwtyiw";

const Input = z.object({
  token: z.string().min(10),
  query: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(120),
});

export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    // Only signed-in users may trigger billable Google requests.
    const u = await fetch(SUPABASE_URL + "/auth/v1/user", {
      headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + data.token },
    });
    if (!u.ok) throw new Error("Sessão expirada. Entre novamente para pesquisar.");

    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const GOOGLE_MAPS_API_KEY = process.env["GOOGLE_MAPS_API_KEY"];
    if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) throw new Error("Google Maps não está configurado.");

    const r = await fetch("https://connector-gateway.lovable.dev/google_maps/places/v1/places:searchText", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.businessStatus,places.types,places.googleMapsUri,places.primaryTypeDisplayName",
      },
      body: JSON.stringify({ textQuery: `${data.query} em ${data.location}`, languageCode: "pt-BR", regionCode: "BR", pageSize: 20 }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("Places error", r.status, body);
      throw new Error(`Google Maps recusou a pesquisa (${r.status}).`);
    }
    const json = (await r.json()) as { places?: any[] };
    return (json.places || []).map((p) => ({
      google_place_id: p.id as string,
      name: (p.displayName?.text as string) || "Empresa",
      address: p.formattedAddress as string | undefined,
      latitude: p.location?.latitude as number | undefined,
      longitude: p.location?.longitude as number | undefined,
      rating: p.rating as number | undefined,
      reviews_count: p.userRatingCount as number | undefined,
      phone: p.nationalPhoneNumber as string | undefined,
      website: p.websiteUri as string | undefined,
      category: p.primaryTypeDisplayName?.text as string | undefined,
      business_status: p.businessStatus as string | undefined,
      maps_url: p.googleMapsUri as string | undefined,
      has_website: Boolean(p.websiteUri),
      has_phone: Boolean(p.nationalPhoneNumber),
      source: "google_places",
    }));
  });
