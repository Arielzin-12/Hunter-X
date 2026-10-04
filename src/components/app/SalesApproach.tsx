import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

type Lead = {
  name: string;
  category?: string;
  city?: string;
  website?: string;
  rating?: number;
  reviews_count?: number;
  phone?: string;
};

const SITE_OFFER_PRICE = "R$ 997";

export function buildApproach(l: Lead) {
  const seg = l.category || "seu negócio";
  const local = l.city ? ` em ${l.city}` : "";
  const proof = l.rating
    ? `Vi que vocês têm nota ${l.rating} com ${l.reviews_count || 0} avaliações no Google — isso mostra que já existe confiança dos clientes.`
    : `Encontrei a empresa de vocês no Google e vi uma oportunidade de melhorar a forma como novos clientes conhecem o negócio.`;

  const pain = l.website
    ? "Dei uma olhada na presença digital de vocês e vejo espaço para um site mais focado em transformar visitas em contatos, principalmente no celular, com serviços claros, prova social e WhatsApp bem destacado."
    : "Hoje vocês podem estar deixando clientes na mesa porque quem pesquisa no Google não encontra uma página própria com serviços, diferenciais, prova social e um caminho direto para pedir orçamento.";

  const offer = l.website
    ? `Posso criar uma nova versão do site, mais rápida, profissional e focada em gerar contatos pelo WhatsApp.`
    : `Posso criar um site profissional para vocês, com serviços, localização, prova social e WhatsApp direto para orçamento.`;

  return {
    first: `Olá, tudo bem? Aqui é [seu nome]. ${proof} Trabalho criando sites para empresas de ${seg}${local} e identifiquei uma oportunidade na presença online de vocês. Posso te mostrar uma ideia rápida?`,
    middle: `${pain}\n\n${offer}\n\nA ideia não é só ter um site bonito: é facilitar para a pessoa que acabou de encontrar vocês entender o serviço, confiar na empresa e chamar no WhatsApp. Posso montar uma prévia para vocês verem como ficaria antes de decidir.`,
    end: `O projeto completo fica em ${SITE_OFFER_PRICE}, incluindo desenvolvimento, versão para celular e estrutura pensada para gerar contatos. Se fizer sentido para vocês, posso começar pela prévia e te enviar ainda hoje. Quer que eu prepare?`,
  };
}

function CopyBox({ title, text }: { title: string; text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="rounded-xl bg-white/[.03] p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-white/50">
        <span>{title}</span>
        <button onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1">
          {ok ? <Check size={12}/> : <Copy size={12}/>} {ok ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm leading-6 text-white/75">{text}</p>
    </div>
  );
}

export function SalesApproach({ lead }: { lead: Lead }) {
  const a = buildApproach(lead);
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
      <div className="flex items-center gap-2 font-semibold"><Sparkles size={17} className="text-primary"/>Abordagem persuasiva</div>
      <p className="mt-1 text-xs text-white/45">Roteiro personalizado para vender o site deste negócio.</p>
      <div className="mt-4 space-y-3">
        <CopyBox title="1 — Primeira mensagem" text={a.first}/>
        <CopyBox title="2 — Meio · parte mais importante" text={a.middle}/>
        <CopyBox title="3 — Fim · valor e oferta" text={a.end}/>
      </div>
      <p className="mt-4 text-[11px] text-white/30">O valor do site está definido no código como {SITE_OFFER_PRICE}; altere a constante SITE_OFFER_PRICE quando definir seu preço comercial.</p>
    </div>
  );
}
