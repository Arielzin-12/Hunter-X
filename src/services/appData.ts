import {supabaseFetch} from "@/lib/supabase";import {getSession} from "@/lib/auth";
export type LeadRow={id:string;name:string;category?:string;city?:string;phone?:string;website?:string;rating?:number;reviews_count?:number;status:string;notes?:string;source?:string;created_at:string};
const uid=()=>getSession()?.user?.id;
export async function listMyLeads(){const id=uid();if(!id)return [];return supabaseFetch<LeadRow[]>("leads?user_id=eq."+id+"&order=created_at.desc&limit=200")}
export async function updateLead(id:string,patch:any){return supabaseFetch("leads?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify(patch)})}
export async function createList(name:string,description=""){const id=uid();if(!id)throw new Error("Faça login.");return supabaseFetch("lists",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify({user_id:id,name,description})})}
export async function listLists(){const id=uid();if(!id)return [];return supabaseFetch<any[]>("lists?user_id=eq."+id+"&order=created_at.desc")}
export async function createCampaign(name:string){const id=uid();if(!id)throw new Error("Faça login.");return supabaseFetch("campaigns",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify({user_id:id,name,status:"draft"})})}
export async function listCampaigns(){const id=uid();if(!id)return [];return supabaseFetch<any[]>("campaigns?user_id=eq."+id+"&order=created_at.desc")}

export async function saveLead(lead:any){const id=uid();if(!id)throw new Error("Faça login.");const row={user_id:id,google_place_id:lead.google_place_id||null,name:lead.name||"Sem nome",business_name:lead.name||null,category:lead.category||null,phone:lead.phone||null,website:lead.website||null,address:lead.address||null,city:lead.city||lead.location||null,latitude:lead.latitude||null,longitude:lead.longitude||null,rating:lead.rating||null,reviews_count:lead.reviews_count||null,maps_url:lead.maps_url||null,status:"new",source:lead.source||"web_search"};return supabaseFetch("leads",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(row)})}
