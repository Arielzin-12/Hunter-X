import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

type Lead = { name: string; category?: string; city?: string; website?: string; rating?: number; reviews_count?: number; phone?: string };

export function buildApproach(l: Lead) {
  const seg = l.category || "seu negócio";
  const proof = l.rating ? `Vi que vocês têm nota ${l.rating} com ${l.reviews_count || 0} avaliações no Google — parabéns, isso mostra que os clientes gostam do trabalho.` : "Encontrei vocês no Google e gostei do que vi.";
  const pain = l.website
    ? "Dei uma olhada no site de vocês e vi alguns pontos que podem estar fazendo vocês perderem clientes no celular e no Google (velocidade, botão de WhatsApp, aparecer nas buscas)."
    : "Percebi que vocês ainda não têm um site próprio. Hoje, muita gente pesquisa no Google antes de escolher e acaba indo para o concorrente que tem site.";
  const offer = l.website ? "Posso te mostrar uma versão nova, moderna e pensada para gerar contatos." : "Posso criar um site profissional para vocês, com WhatsApp direto, mapa e serviços, pronto em poucos dias.";
  return {
    whatsapp: `Olá, tudo bem? Aqui é [seu nome]. ${proof}\n\n${pain}\n\n${offer} Posso te enviar um exemplo sem compromisso?`,
    call: `1. Apresentação: "Oi, falo com o responsável pela ${l.name}? Sou [seu nome], trabalho com sites para ${seg}."\n2. Elogio: ${proof}\n3. Problema: ${pain}\n4. Proposta: ${offer}\n5. Fechamento: "Posso te mandar um exemplo pelo WhatsApp hoje ainda?"`,
    objections: [
      ["Já tenho Instagram", "O Instagram é ótimo, mas quem pesquisa no Google não encontra vocês lá. O site trabalha 24h trazendo clientes novos."],
      ["Está caro", "Um único cliente novo por mês já paga o investimento. E posso parcelar."],
      ["Agora não", "Sem problema! Posso te mandar um exemplo para você ver com calma e falamos semana que vem?"],
    ] as [string, string][],
  };
}

function CopyBox({ title, text }: { title: string; text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="rounded-xl bg-white/[.03] p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-white/50">
        {title}
        <button onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1">
          {ok ? <Check size={12} /> : <Copy size={12} />}{ok ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm text-white/75">{text}</p>
    </div>
  );
}

export function SalesApproach({ lead }: { lead: Lead }) {
  const a = buildApproach(lead);
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
      <div className="flex items-center gap-2 font-semibold"><Sparkles size={17} className="text-primary" />Abordagem para vender o site</div>
      <p className="mt-1 text-xs text-white/45">Lead qualificado — use estes roteiros para fazer o primeiro contato.</p>
      <div className="mt-4 space-y-3">
        <CopyBox title="Mensagem de WhatsApp" text={a.whatsapp} />
        <CopyBox title="Roteiro de ligação" text={a.call} />
        <div className="rounded-xl bg-white/[.03] p-4">
          <div className="mb-2 text-xs text-white/50">Respostas para objeções</div>
          {a.objections.map(([q, r]) => <div key={q} className="mt-2 text-sm"><b className="text-white/80">"{q}"</b><div className="text-white/60">{r}</div></div>)}
        </div>
      </div>
    </div>
  );
}
