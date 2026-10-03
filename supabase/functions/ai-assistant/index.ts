const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const json=(b:any,s=200)=>new Response(JSON.stringify(b),{status:s,headers:{...cors,"Content-Type":"application/json"}});
Deno.serve(async req=>{
if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
try{
const auth=req.headers.get("Authorization")||"",supabaseUrl=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),key=Deno.env.get("GEMINI_API_KEY");
if(!auth.startsWith("Bearer ")||!supabaseUrl||!anon)return json({error:"Faça login para usar a IA."},401);
const userRes=await fetch(supabaseUrl+"/auth/v1/user",{headers:{apikey:anon,Authorization:auth}});
if(!userRes.ok)return json({error:"Sessão inválida ou expirada."},401);
const user=await userRes.json();if(!user?.id)return json({error:"Sessão inválida."},401);
if(!key)return json({error:"IA não configurada. Configure GEMINI_API_KEY no Supabase."},503);
const body=await req.json(),lead=body.lead||{};
const prompt="Você é o LeadHunter AI do HunterX. Analise somente os dados fornecidos. Nunca invente fatos, necessidades, serviços, telefone, site ou informações. Responda somente JSON no formato {summary:string,opportunities:string[],approach:string,caveats:string[]}. Lead: "+JSON.stringify(lead);
const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({system_instruction:{parts:[{text:"Analista comercial objetivo. Use somente dados presentes no input."}]},contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json"}})});
const data=await r.json();if(!r.ok)return json({error:"O provedor de IA não respondeu."},502);
const text=data.candidates?.[0]?.content?.parts?.[0]?.text;if(!text)return json({error:"A IA não retornou uma análise."},502);
let analysis;try{analysis=JSON.parse(text)}catch{return json({error:"A resposta da IA não pôde ser estruturada."},502)}
await fetch(supabaseUrl+"/rest/v1/ai_analyses",{method:"POST",headers:{apikey:anon,Authorization:auth,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({user_id:user.id,lead_id:lead.id||null,type:"lead_analysis",input:lead,output:analysis})}).catch(()=>{});
return json(analysis);
}catch(e){return json({error:e instanceof Error?e.message:"Falha na análise."},500)}});