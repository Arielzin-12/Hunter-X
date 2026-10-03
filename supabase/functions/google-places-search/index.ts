const cors={ "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type" };
Deno.serve(async req=>{
if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
try{
const auth=req.headers.get("Authorization")||"",anon=Deno.env.get("SUPABASE_ANON_KEY"),supabaseUrl=Deno.env.get("SUPABASE_URL");
if(!auth.startsWith("Bearer ")||!anon||!supabaseUrl)return new Response(JSON.stringify({error:"Faça login para pesquisar."}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
const userRes=await fetch(supabaseUrl+"/auth/v1/user",{headers:{apikey:anon,Authorization:auth}});
if(!userRes.ok)return new Response(JSON.stringify({error:"Sessão inválida ou expirada."}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
const key=Deno.env.get("GOOGLE_PLACES_API_KEY");
if(!key)return new Response(JSON.stringify({error:"GOOGLE_PLACES_API_KEY não configurada no backend."}),{status:503,headers:{...cors,"Content-Type":"application/json"}});
const body=await req.json(),query=String(body.query||"").trim(),location=String(body.location||"").trim();
if(!query||!location)return new Response(JSON.stringify({error:"query e location são obrigatórios."}),{status:400,headers:{...cors,"Content-Type":"application/json"}});
const r=await fetch("https://places.googleapis.com/v1/places:searchText",{method:"POST",headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":"places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.businessStatus,places.types,places.googleMapsUri,places.regularOpeningHours"},body:JSON.stringify({textQuery:query+" em "+location,maxResultCount:20,languageCode:"pt-BR"})});
const data=await r.json();if(!r.ok)return new Response(JSON.stringify({error:"Google Places retornou um erro."}),{status:r.status,headers:{...cors,"Content-Type":"application/json"}});
const leads=(data.places||[]).map((p:any)=>({google_place_id:p.id,name:p.displayName?.text||"Sem nome",address:p.formattedAddress||null,latitude:p.location?.latitude??null,longitude:p.location?.longitude??null,rating:p.rating??null,reviews_count:p.userRatingCount??0,phone:p.nationalPhoneNumber??null,website:p.websiteUri??null,business_status:p.businessStatus??null,types:p.types||[],maps_url:p.googleMapsUri??null,has_website:Boolean(p.websiteUri),has_phone:Boolean(p.nationalPhoneNumber),source:"google_places"}));
return new Response(JSON.stringify({leads,count:leads.length}),{headers:{...cors,"Content-Type":"application/json"}});
}catch(e){return new Response(JSON.stringify({error:e instanceof Error?e.message:"Falha ao consultar o provedor."}),{status:500,headers:{...cors,"Content-Type":"application/json"}})}});