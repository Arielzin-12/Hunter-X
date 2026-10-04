import { getSession } from "@/lib/auth";
import { searchPlaces } from "@/lib/places.functions";
export type PlaceLead = Awaited<ReturnType<typeof searchPlaces>>[number];
export async function searchGooglePlaces(query: string, location: string): Promise<PlaceLead[]> {
  const token = getSession()?.access_token;
  if (!token) throw new Error("Faça login para pesquisar.");
  return searchPlaces({ data: { token, query, location } });
}
