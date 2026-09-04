"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AudioLines, BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, ChevronRight,
  CircleAlert, ClipboardCheck, FileText, Gauge, LayoutDashboard, LibraryBig,
  MessageSquareText, Mic2, Play, Settings2, Sparkles, Target, Users
} from "lucide-react";
import { dentalPlaybook, demoClient, demoOrganizations, Decision, readinessScore, seedDecisions } from "../lib/domain";
import { loadLocal, saveLocal, storageKeys } from "../lib/storage";
import { useMeetingRecorder } from "../hooks/useMeetingRecorder";

type Screen = "dashboard" | "meeting" | "memory" | "closing" | "proposal" | "implementation" | "playbooks";
type ProposalState = { setup:number; monthly:number; media:number; approved:boolean; version:number };
type Task = { id:string; area:string; title:string; owner:"Zahav"|"Cliente"; done:boolean };

const navItems = [
  ["dashboard", LayoutDashboard, "Visão geral"], ["meeting", Mic2, "Reunião"],
  ["memory", AudioLines, "Memória"], ["closing", Target, "Fechamento"],
  ["proposal", FileText, "Proposta"], ["implementation", ClipboardCheck, "Implantação"],
  ["playbooks", LibraryBig, "Playbooks"],
] as const;

const initialTasks: Task[] = [
  {id:"t1",area:"Marketing",title:"Definir campanha e região",owner:"Zahav",done:true},
  {id:"t2",area:"Marketing",title:"Receber fotos e vídeos autorizados",owner:"Cliente",done:false},
  {id:"t3",area:"CRM",title:"Criar funil comercial",owner:"Zahav",done:true},
  {id:"t4",area:"CRM",title:"Configurar responsáveis e SLA",owner:"Zahav",done:false},
  {id:"t5",area:"IA",title:"Gerar FAQ e objeções",owner:"Zahav",done:false},
  {id:"t6",area:"IA",title:"Treinar SDR e regras de transferência",owner:"Zahav",done:false},
  {id:"t7",area:"Cliente",title:"Liberar acesso Meta",owner:"Cliente",done:false},
  {id:"t8",area:"Agenda",title:"Validar horários e lembretes",owner:"Cliente",done:false},
  {id:"t9",area:"QA",title:"Executar teste ponta a ponta",owner:"Zahav",done:false},
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [organizationId, setOrganizationId] = useState("org-zahav");
  const [decisions, setDecisions] = useState<Decision[]>(seedDecisions);
  const [proposal, setProposal] = useState<ProposalState>({setup:1500,monthly:797,media:1500,approved:false,version:1});
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [hydrated, setHydrated] = useState(false);
  const recorder = useMeetingRecorder();
  const [transcript, setTranscript] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("Conseguimos de 10 a 12 avaliações por semana. Terça e quinta são os melhores dias.");

  const questions = dentalPlaybook.sections.flatMap(section => section.questions.map(question => ({...question, section:section.title})));
  const question = questions[questionIndex];
  const readiness = readinessScore(decisions);
  const total = proposal.setup + proposal.monthly + proposal.media;
  const implProgress = Math.round((tasks.filter(t=>t.done).length / tasks.length) * 100);
  const confirmedCount = decisions.filter(d=>d.status === "confirmed").length;
  const conflictCount = decisions.filter(d=>d.status === "conflict").length;

  useEffect(()=>{
    setDecisions(loadLocal(storageKeys.decisions, seedDecisions));
    setProposal(loadLocal(storageKeys.proposal, {setup:1500,monthly:797,media:1500,approved:false,version:1}));
    setTasks(loadLocal(storageKeys.implementation, initialTasks));
    setOrganizationId(loadLocal(storageKeys.organization, "org-zahav"));
    setHydrated(true);
  },[]);
  useEffect(()=>{ if(hydrated) saveLocal(storageKeys.decisions, decisions); },[decisions,hydrated]);
  useEffect(()=>{ if(hydrated) saveLocal(storageKeys.proposal, proposal); },[proposal,hydrated]);
  useEffect(()=>{ if(hydrated) saveLocal(storageKeys.implementation, tasks); },[tasks,hydrated]);
  useEffect(()=>{ if(hydrated) saveLocal(storageKeys.organization, organizationId); },[organizationId,hydrated]);

  async function transcribeLastClip() {
    if (!recorder.lastClip) return;
    setTranscribing(true);
    try {
      const form = new FormData();
      form.append("audio", recorder.lastClip.blob, "meeting.webm");
      form.append("questionId", question.id);
      const response = await fetch("/api/transcribe", {method:"POST", body:form});
      const data = await response.json();
      setTranscript(data.transcript || "");
      if (data.transcript) setAnswer(data.transcript);
    } finally { setTranscribing(false); }
  }

  function confirmCurrentDecision() {
    const capacity: Decision = {id:crypto.randomUUID(),key:"weekly_capacity",label:"Capacidade",value:"10 a 12 avaliações/semana",source:recorder.lastClip?"audio":"consultant",status:"confirmed",confidence:recorder.lastClip?.blob?0.96:undefined,timestamp:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})};
    const days: Decision = {id:crypto.randomUUID(),key:"best_days",label:"Melhores dias",value:"Terça e quinta",source:recorder.lastClip?"audio":"consultant",status:"confirmed",confidence:0.94};
    setDecisions(current=>[...current.filter(d=>!["weekly_capacity","best_days"].includes(d.key)),capacity,days]);
  }

  function resolveBudget() {
    setDecisions(current=>[...current.filter(d=>d.key!=="meta_budget"),{id:crypto.randomUUID(),key:"meta_budget",label:"Verba Meta",value:"R$ 1.500/mês",source:"client",status:"confirmed"}]);
  }

  function confirmHumanOwner() {
    setDecisions(current=>[...current.filter(d=>d.key!=="human_owner"),{id:crypto.randomUUID(),key:"human_owner",label:"Transferência humana",value:"Mariana assume negociações especiais",source:"client",status:"confirmed"}]);
  }

  return <main className="min-h-screen p-4 md:p-5">
    <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-4 lg:grid-cols-[255px_minmax(0,1fr)]">
      <aside className="card flex min-h-[calc(100vh-40px)] flex-col p-4 lg:sticky lg:top-5">
        <div className="flex items-center gap-3 border-b border-white/5 px-2 pb-5 pt-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black">Z</div>
          <div><div className="font-extrabold tracking-tight">Zahav Meeting OS</div><div className="text-xs muted">Da reunião à implantação</div></div>
        </div>
        <nav className="mt-5 space-y-1">{navItems.map(([id,Icon,label])=><button key={id} onClick={()=>setScreen(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${screen===id?"bg-blue-500/15 text-blue-200":"text-slate-400 hover:bg-white/[.035] hover:text-white"}`}><Icon size={17}/>{label}</button>)}</nav>
        <div className="mt-auto card-soft p-3">
          <div className="kicker">Workspace</div>
          <select value={organizationId} onChange={e=>setOrganizationId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0d1a2b] px-3 py-2 text-sm">{demoOrganizations.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>
          <div className="mt-3 flex items-center gap-2"><Building2 size={15}/><span className="text-xs muted">Dados isolados por organização</span></div>
        </div>
      </aside>

      <section className="min-w-0">
        {screen==="dashboard"&&<Dashboard onStart={()=>setScreen("meeting")} readiness={readiness} confirmed={confirmedCount} conflicts={conflictCount}/>} 
        {screen==="meeting"&&<div className="space-y-4">
          <header className="card p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><div className="kicker">Reunião ao vivo • {demoClient.name}</div><h1 className="mt-1 text-2xl font-black">Cockpit comercial inteligente</h1></div><div className="flex flex-wrap gap-2"><span className="pill">{readiness}% pronta</span><button onClick={recorder.toggle} className={`btn flex items-center gap-2 ${recorder.isRecording?"border-red-400/30 bg-red-500/10":""}`}><Mic2 size={15}/>{recorder.isRecording?"Parar gravação":"Gravar reunião"}</button><button onClick={()=>setScreen("memory")} className="btn btn-primary">Finalizar e revisar</button></div></div>
            <div className="mt-5 progress"><div style={{width:`${readiness}%`}}/></div>
            {recorder.error&&<div className="mt-3 text-sm text-red-300">{recorder.error}</div>}
          </header>
          <div className="desktop-grid grid gap-4 xl:grid-cols-[225px_minmax(0,1fr)_350px]">
            <aside className="card p-4"><div className="kicker">Playbook ativo</div><div className="mt-4 space-y-2">{dentalPlaybook.sections.map((s,i)=><div key={s.id} className={`rounded-xl border px-3 py-2.5 text-sm ${s.title===question.section?"border-blue-400/25 bg-blue-500/10 text-blue-100":"border-white/5 text-slate-400"}`}><div className="flex items-center gap-2"><span className="text-xs font-bold">{i+1}</span>{s.title}</div></div>)}</div></aside>
            <div className="card p-5 md:p-6">
              <div className="kicker">{question.section} • pergunta {questionIndex+1} de {questions.length}</div>
              <h2 className="mt-2 text-2xl font-bold">{question.text}</h2>{question.hint&&<p className="mt-2 text-sm muted">{question.hint}</p>}
              <textarea className="mt-5" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Digite ou grave a resposta..."/>
              <div className="mt-4 grid gap-3 md:grid-cols-2"><button onClick={recorder.toggle} className="btn flex items-center justify-center gap-2"><Mic2 size={16}/>{recorder.isRecording?"Parar resposta":"Gravar esta resposta"}</button><button className="btn flex items-center justify-center gap-2"><Sparkles size={16}/>Marcar momento importante</button></div>
              {recorder.lastClip&&<div className="card-soft mt-4 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="kicker">Áudio capturado</div><audio className="mt-2 max-w-full" controls src={recorder.lastClip.url}/></div><button onClick={transcribeLastClip} className="btn">{transcribing?"Transcrevendo...":"Transcrever"}</button></div>{transcript&&<div className="mt-3 text-sm leading-6 muted">{transcript}</div>}</div>}
              <div className="card-soft mt-4 p-4"><div className="kicker">Extração estruturada</div><div className="mt-2 text-sm"><strong>Capacidade:</strong> 10–12 avaliações/semana<br/><strong>Melhores dias:</strong> terça e quinta</div><button onClick={confirmCurrentDecision} className="btn btn-primary mt-4">Confirmar como decisão</button></div>
              <div className="mt-5 flex justify-between"><button className="btn" onClick={()=>setQuestionIndex(i=>Math.max(0,i-1))}>Anterior</button><button className="btn" onClick={()=>setQuestionIndex(i=>Math.min(questions.length-1,i+1))}>Próxima</button></div>
            </div>
            <aside className="card p-5"><div className="flex items-center justify-between"><div className="font-bold">Copiloto IA</div><Sparkles size={17} className="text-blue-400"/></div><div className="mt-5 space-y-4"><Copilot label="O que falta" text="Confirmar verba Meta e responsável pelas transferências humanas."/><Copilot label="Risco" text={conflictCount?"Há conflito na verba de mídia. Não finalize sem resolver.":"Nenhum conflito crítico aberto."}/><Copilot label="Oportunidade" text="Use a demora da recepção como ponte para demonstrar o valor da IA no primeiro atendimento."/><Copilot label="Próxima ação" text="Fechar decisões essenciais antes de gerar a proposta."/></div><div className="mt-5 grid gap-2"><button onClick={resolveBudget} className="btn text-left">✓ Confirmar mídia em R$ 1.500</button><button onClick={confirmHumanOwner} className="btn text-left">✓ Mariana assume transferências</button></div></aside>
          </div>
        </div>}

        {screen==="memory"&&<div className="space-y-4"><header className="card p-6"><div className="kicker">Fonte única da verdade</div><h1 className="mt-2 text-3xl font-black">Memória e decisões confirmadas</h1><p className="mt-2 muted">Sugestões da IA nunca se misturam silenciosamente com decisões do cliente.</p></header><div className="card p-5"><div className="grid gap-3">{decisions.map(d=><div key={d.id} className="card-soft grid gap-3 p-4 md:grid-cols-[170px_1fr_130px_130px] md:items-center"><div className="text-sm muted">{d.label}</div><div className="font-semibold">{d.value}</div><span className="pill w-fit">{sourceLabel(d.source)}</span><span className={`pill w-fit ${d.status==="conflict"?"border-amber-400/30 text-amber-200":d.status==="confirmed"?"border-emerald-400/20 text-emerald-200":""}`}>{statusLabel(d.status)}</span></div>)}</div><button onClick={()=>setScreen("closing")} className="btn btn-primary mt-5">Preparar fechamento</button></div></div>}

        {screen==="closing"&&<div className="space-y-4"><header className="card p-6"><div className="kicker">Fechamento personalizado</div><h1 className="mt-2 text-3xl font-black">Venda usando o que o cliente revelou.</h1><p className="mt-2 muted">Dor → impacto → solução Zahav → argumento recomendado.</p></header><div className="grid gap-4 lg:grid-cols-3"><Closing type="Dor" title="Demora no primeiro atendimento" text="Leads podem esfriar enquanto aguardam resposta."/><Closing type="Impacto" title="Investimento sem rastreio" text="A clínica não acompanha cada oportunidade até o tratamento fechado."/><Closing type="Solução" title="IA + CRM + Meta Ads" text="Resposta imediata, qualificação, agenda e acompanhamento comercial."/></div><div className="card p-6"><div className="kicker">Argumento sugerido</div><p className="mt-3 text-lg leading-8">Hoje identificamos dois gargalos: demora no primeiro atendimento e falta de acompanhamento do lead até o fechamento. Nossa implantação conecta geração de demanda, resposta imediata com IA, qualificação, agenda e CRM para que a clínica enxergue o caminho completo da oportunidade.</p><button onClick={()=>setScreen("proposal")} className="btn btn-primary mt-5">Montar proposta</button></div></div>}

        {screen==="proposal"&&<div className="space-y-4"><header className="card p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="kicker">Proposta comercial • v{proposal.version}</div><h1 className="mt-2 text-3xl font-black">{demoClient.name}</h1><p className="mt-2 muted">Tráfego Pago + CRM + IA • Lentes de Resina</p></div><span className={`pill ${proposal.approved?"border-emerald-400/20 text-emerald-200":""}`}>{proposal.approved?"Aprovada":"Em edição"}</span></div></header><div className="desktop-grid grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><div className="card p-6"><div className="kicker">Plano recomendado</div><div className="mt-4 space-y-3"><ProposalLine title="Objetivo" text="Gerar avaliações qualificadas e acompanhar o lead do anúncio ao tratamento fechado."/><ProposalLine title="Tráfego" text="Campanha local para Goiânia e região, com criativos educativos e prova de autoridade."/><ProposalLine title="CRM" text="Pipeline completo, indicadores, agenda, confirmação e histórico da oportunidade."/><ProposalLine title="IA" text="Primeiro atendimento, qualificação, follow-up e transferência humana conforme regras confirmadas."/></div><div className="mt-5 flex flex-wrap gap-2"><Link className="btn" href="/proposta/demo-sorriso-prime" target="_blank">Abrir modo cliente</Link><button className="btn" onClick={()=>setProposal(p=>({...p,version:p.version+1}))}>Salvar nova versão</button></div></div><div className="card p-6"><div className="kicker">Investimento</div><Price label="Implantação" value={proposal.setup} onChange={v=>setProposal(p=>({...p,setup:v}))}/><Price label="Mensalidade" value={proposal.monthly} onChange={v=>setProposal(p=>({...p,monthly:v}))}/><Price label="Verba Meta" value={proposal.media} onChange={v=>setProposal(p=>({...p,media:v}))}/><div className="card-soft mt-5 p-4"><div className="text-xs muted">Inicial estimado</div><div className="mt-1 text-3xl font-black">{money(total)}</div><div className="mt-1 text-xs muted">A verba Meta é separada do serviço Zahav.</div></div>{!proposal.approved?<button className="btn btn-primary mt-5 w-full" onClick={()=>setProposal(p=>({...p,approved:true}))}>Aprovar proposta</button>:<button className="btn btn-primary mt-5 w-full" onClick={()=>setScreen("implementation")}>Transformar em implantação</button>}</div></div></div>}

        {screen==="implementation"&&<div className="space-y-4"><header className="card p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="kicker">Implantação gerada da proposta</div><h1 className="mt-2 text-3xl font-black">{demoClient.name}</h1></div><strong>{implProgress}% concluída</strong></div><div className="mt-5 progress"><div style={{width:`${implProgress}%`}}/></div></header><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from(new Set(tasks.map(t=>t.area))).map(area=><div key={area} className="card p-5"><div className="kicker">{area}</div><div className="mt-4 space-y-3">{tasks.filter(t=>t.area===area).map(task=><label key={task.id} className="card-soft flex cursor-pointer gap-3 p-3"><input type="checkbox" checked={task.done} onChange={()=>setTasks(current=>current.map(t=>t.id===task.id?{...t,done:!t.done}:t))}/><div><div className="text-sm font-semibold">{task.title}</div><div className="mt-1 text-xs muted">Responsável: {task.owner}</div></div></label>)}</div></div>)}</div></div>}

        {screen==="playbooks"&&<div className="space-y-4"><header className="card p-6"><div className="flex items-center justify-between gap-4"><div><div className="kicker">Motor reutilizável</div><h1 className="mt-2 text-3xl font-black">Segmento → Serviço → Playbook</h1><p className="mt-2 muted">É isso que permite levar o Meeting OS para odontologia, imobiliária, delivery, supermercados e outros mercados.</p></div><Settings2 className="text-blue-400"/></div></header><div className="card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">{dentalPlaybook.segment} › {dentalPlaybook.service}</div><div className="mt-1 text-sm muted">{dentalPlaybook.name}</div></div><span className="pill">{questions.length} perguntas</span></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{dentalPlaybook.sections.map(section=><div key={section.id} className="card-soft p-4"><div className="font-bold">{section.title}</div><div className="mt-2 text-sm muted">{section.questions.length} perguntas • {section.required?"obrigatório":"opcional"}</div></div>)}</div></div></div>}
      </section>
    </div>
  </main>;
}

function Dashboard({onStart,readiness,confirmed,conflicts}:{onStart:()=>void;readiness:number;confirmed:number;conflicts:number}) { return <div className="space-y-4"><header className="card p-6 md:p-7"><div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div className="kicker">Inteligência comercial</div><h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">Transforme cada reunião em uma operação pronta para executar.</h1><p className="mt-3 max-w-3xl muted">Capture áudio e texto, confirme decisões, feche com contexto, gere a proposta e transforme o acordo em implantação.</p></div><button onClick={onStart} className="btn btn-primary flex items-center gap-2 self-start"><Play size={16}/>Iniciar reunião</button></div></header><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric icon={MessageSquareText} label="Reuniões abertas" value="4" detail="2 exigem ação"/><Metric icon={FileText} label="Propostas em decisão" value="3" detail="R$ 5.591 em recorrência"/><Metric icon={BriefcaseBusiness} label="Implantações ativas" value="6" detail="2 perto do go-live"/><Metric icon={Gauge} label="Prontidão atual" value={`${readiness}%`} detail={`${confirmed} decisões confirmadas`}/></div><div className="desktop-grid grid gap-4 xl:grid-cols-[1.4fr_.8fr]"><div className="card p-5"><div className="flex items-center justify-between"><div><div className="kicker">Prioridade agora</div><h2 className="mt-1 text-xl font-bold">Clínica Sorriso Prime</h2></div><span className="pill">{readiness}% pronta</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Info label="Serviço" value="Tráfego + CRM + IA"/><Info label="Campanha" value="Lentes em resina"/><Info label="Região" value="Goiânia"/></div><div className="mt-5 flex flex-wrap gap-2"><span className="pill"><BadgeCheck size={13}/>{confirmed} decisões</span><span className="pill"><CircleAlert size={13}/>{conflicts} conflito</span><span className="pill"><Sparkles size={13}/>2 oportunidades</span></div><button onClick={onStart} className="btn mt-5 flex items-center gap-2">Continuar reunião <ChevronRight size={15}/></button></div><div className="card p-5"><div className="kicker">Alertas da IA</div><div className="mt-4 space-y-3"><Alert title="Verba Meta" text={conflicts?"Há dois valores mencionados. Confirme o final.":"Valor de mídia confirmado."} tone={conflicts?"amber":"blue"}/><Alert title="Oportunidade" text="Recepção demora para responder. IA + CRM atacam diretamente esse gargalo." tone="blue"/><Alert title="Arquitetura" text="As decisões ficam persistidas no navegador neste MVP e o schema Supabase já está preparado." tone="blue"/></div></div></div></div>; }
function Metric({icon:Icon,label,value,detail}:{icon:any;label:string;value:string;detail:string}) { return <div className="card p-5"><div className="flex items-center justify-between"><div className="text-sm muted">{label}</div><Icon size={17} className="text-blue-400"/></div><div className="mt-2 text-3xl font-black">{value}</div><div className="mt-1 text-xs muted">{detail}</div></div>; }
function Info({label,value}:{label:string;value:string}) { return <div className="card-soft p-3"><div className="text-xs muted">{label}</div><div className="mt-1 text-sm font-bold">{value}</div></div>; }
function Alert({title,text,tone}:{title:string;text:string;tone:"amber"|"blue"}) { return <div className={`rounded-2xl border p-3 ${tone==="amber"?"border-amber-400/15 bg-amber-500/5":"border-blue-400/10 bg-blue-500/5"}`}><div className="text-sm font-bold">{title}</div><div className="mt-1 text-xs leading-5 muted">{text}</div></div>; }
function Copilot({label,text}:{label:string;text:string}) { return <div className="border-b border-white/5 pb-4 last:border-0"><div className="kicker">{label}</div><p className="mt-2 text-sm leading-6 muted">{text}</p></div>; }
function Closing({type,title,text}:{type:string;title:string;text:string}) { return <div className="card p-5"><div className="kicker">{type}</div><div className="mt-2 text-lg font-bold">{title}</div><p className="mt-2 text-sm leading-6 muted">{text}</p></div>; }
function ProposalLine({title,text}:{title:string;text:string}) { return <div className="card-soft p-4"><div className="font-bold">{title}</div><p className="mt-1 text-sm leading-6 muted">{text}</p></div>; }
function Price({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}) { return <label className="mt-4 block"><span className="text-xs font-semibold muted">{label}</span><div className="mt-1 flex items-center rounded-xl border border-white/10 bg-white/[.025] px-3"><span className="text-sm muted">R$</span><input className="border-0 bg-transparent px-2 shadow-none focus:shadow-none" type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)}/></div></label>; }
function money(value:number) { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(value); }
function sourceLabel(source:Decision["source"]) { return ({client:"Cliente",consultant:"Consultor",audio:"Áudio",ai:"IA"})[source]; }
function statusLabel(status:Decision["status"]) { return ({confirmed:"Confirmado",pending:"Pendente",conflict:"Conflito",suggested:"Sugerido"})[status]; }
