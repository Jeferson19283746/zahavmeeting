"use client";

import { useState } from "react";
import { BadgeCheck, CheckCircle2, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

const scope = [
  "Planejamento e gestão de campanhas Meta Ads",
  "CRM comercial com funil de ponta a ponta",
  "IA para primeiro atendimento, qualificação e agenda",
  "Follow-ups e lembretes automáticos",
  "Dashboard de indicadores e acompanhamento",
  "Implantação, treinamento e otimização inicial",
];

export default function PublicProposal() {
  const [approved, setApproved] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="card overflow-hidden p-7 md:p-10">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black">Z</div>
            <div><div className="font-black">Zahav Digital</div><div className="text-xs muted">Proposta privada</div></div>
          </div>
          <div className="mt-12 max-w-3xl">
            <div className="kicker">Clínica Sorriso Prime</div>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Da geração do lead ao tratamento fechado.</h1>
            <p className="mt-5 text-lg leading-8 muted">Estrutura comercial para unir tráfego, CRM e IA com foco em avaliações qualificadas, velocidade de atendimento e acompanhamento real da conversão.</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2"><span className="pill"><ShieldCheck size={14}/> Acesso privado</span><span className="pill"><Sparkles size={14}/> Criada a partir da reunião</span></div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="card p-6"><div className="kicker">O que identificamos</div><h2 className="mt-2 text-2xl font-bold">Dois gargalos principais</h2><div className="mt-5 space-y-3"><div className="card-soft p-4"><strong>Resposta lenta</strong><p className="mt-1 text-sm muted">Leads podem esfriar antes do primeiro contato da equipe.</p></div><div className="card-soft p-4"><strong>Falta de rastreio</strong><p className="mt-1 text-sm muted">Hoje falta visibilidade do lead desde o anúncio até o tratamento fechado.</p></div></div></div>
          <div className="card p-6"><div className="kicker">Objetivo</div><h2 className="mt-2 text-2xl font-bold">Criar uma operação previsível</h2><p className="mt-4 leading-7 muted">Gerar demanda, responder imediatamente, qualificar, agendar e acompanhar cada oportunidade em um único fluxo, respeitando os limites clínicos e comerciais definidos pela equipe.</p></div>
        </section>

        <section className="card p-6 md:p-8"><div className="kicker">Escopo Zahav</div><h2 className="mt-2 text-2xl font-bold">O que será implantado</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{scope.map(item => <div key={item} className="card-soft flex gap-3 p-4"><CheckCircle2 className="mt-0.5 text-emerald-400" size={18}/><span>{item}</span></div>)}</div></section>

        <section className="grid gap-5 md:grid-cols-[1fr_.9fr]">
          <div className="card p-6"><div className="kicker">Investimento</div><div className="mt-4 grid gap-3"><Price label="Implantação" value="R$ 1.500"/><Price label="Mensalidade Zahav" value="R$ 797"/><Price label="Verba Meta sugerida" value="R$ 1.500" note="Pago diretamente à plataforma de anúncios"/></div></div>
          <div className="card p-6"><div className="kicker">Próximo passo</div><h2 className="mt-2 text-2xl font-bold">Aprovar e iniciar implantação</h2><p className="mt-3 text-sm leading-6 muted">Ao aprovar, o sistema gera automaticamente o plano de implantação, checklist de materiais, configuração de CRM, regras da IA e plano inicial de campanha.</p>{approved ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100"><div className="flex items-center gap-2 font-bold"><BadgeCheck size={18}/> Proposta aprovada</div><p className="mt-1 text-sm">A aprovação foi registrada nesta demonstração.</p></div> : <button onClick={() => setApproved(true)} className="btn btn-primary mt-5 w-full">Aprovar proposta</button>}</div>
        </section>

        <section className="card p-6"><div className="flex items-center gap-2 font-bold"><MessageSquareText size={17}/> Comentário ou pedido de ajuste</div><textarea className="mt-3" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Escreva o que gostaria de ajustar..."/><button className="btn mt-3" onClick={()=>setComment("")}>Enviar comentário</button></section>
      </div>
    </main>
  );
}

function Price({label,value,note}:{label:string;value:string;note?:string}) { return <div className="card-soft p-4"><div className="text-sm muted">{label}</div><div className="mt-1 text-2xl font-black">{value}</div>{note && <div className="mt-1 text-xs muted">{note}</div>}</div>; }
