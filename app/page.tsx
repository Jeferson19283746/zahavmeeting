"use client";

import { useMemo, useState } from "react";
import {
  AudioLines,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  FileText,
  Gauge,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  Play,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

type Screen = "dashboard" | "meeting" | "memory" | "closing" | "proposal" | "implementation";

type Fact = {
  label: string;
  value: string;
  source: string;
  status: string;
};

const facts: Fact[] = [
  { label: "Campanha", value: "Lentes em resina", source: "Cliente", status: "Confirmado" },
  { label: "Região", value: "Goiânia e região próxima", source: "Cliente", status: "Confirmado" },
  { label: "Capacidade", value: "10 a 12 avaliações/semana", source: "Áudio", status: "Confirmado" },
  { label: "Melhores dias", value: "Terça e quinta", source: "Áudio", status: "Confirmado" },
  { label: "Regra de preço", value: "Não informar preço exato no WhatsApp", source: "Cliente", status: "Confirmado" },
  { label: "Verba Meta", value: "R$ 1.500 ou R$ 800", source: "IA", status: "Conflito" },
];

const navItems = [
  ["dashboard", LayoutDashboard, "Visão geral"],
  ["meeting", Mic2, "Reunião"],
  ["memory", AudioLines, "Memória"],
  ["closing", Target, "Fechamento"],
  ["proposal", FileText, "Proposta"],
  ["implementation", ClipboardCheck, "Implantação"],
] as const;

export default function Home() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [recording, setRecording] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [approved, setApproved] = useState(false);
  const [setup, setSetup] = useState(1500);
  const [monthly, setMonthly] = useState(797);
  const [media, setMedia] = useState(1500);
  const [tasks, setTasks] = useState([true, true, false, false, false, false, false, false]);

  const readiness = confirmed ? 92 : 81;
  const implProgress = Math.round((tasks.filter(Boolean).length / tasks.length) * 100);
  const total = useMemo(() => setup + monthly + media, [setup, monthly, media]);

  return (
    <main className="min-h-screen p-4 md:p-5">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="card flex min-h-[calc(100vh-40px)] flex-col p-4">
          <div className="flex items-center gap-3 border-b border-white/5 px-2 pb-5 pt-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black">Z</div>
            <div>
              <div className="font-extrabold tracking-tight">Zahav Meeting OS</div>
              <div className="text-xs muted">Da reunião à implantação</div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => setScreen(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${screen === id ? "bg-blue-500/15 text-blue-200" : "text-slate-400 hover:bg-white/[.035] hover:text-white"}`}
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto card-soft p-3">
            <div className="kicker">Conta atual</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5"><Building2 size={15} /></div>
              <div>
                <div className="text-sm font-bold">Zahav Digital</div>
                <div className="text-xs muted">Workspace principal</div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          {screen === "dashboard" && (
            <div className="space-y-4">
              <header className="card p-6 md:p-7">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="kicker">Inteligência comercial</div>
                    <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Transforme reuniões em decisões que viram receita.</h1>
                    <p className="mt-2 max-w-3xl muted">O sistema acompanha a conversa, estrutura fatos, aponta lacunas, prepara o fechamento e transforma a proposta aprovada em implantação.</p>
                  </div>
                  <button onClick={() => setScreen("meeting")} className="btn btn-primary flex items-center gap-2 self-start xl:self-auto"><Play size={16}/> Iniciar reunião</button>
                </div>
              </header>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Metric icon={MessageSquareText} label="Reuniões abertas" value="4" detail="2 exigem ação" />
                <Metric icon={FileText} label="Propostas em decisão" value="3" detail="R$ 5.591 em recorrência" />
                <Metric icon={BriefcaseBusiness} label="Implantações ativas" value="6" detail="2 próximas do go-live" />
                <Metric icon={Gauge} label="Conversão proposta" value="68%" detail="+12% vs. período anterior" />
              </div>

              <div className="desktop-grid grid gap-4 xl:grid-cols-[1.5fr_.8fr]">
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="kicker">Prioridade agora</div>
                      <h2 className="mt-1 text-xl font-bold">Clínica Sorriso Prime</h2>
                    </div>
                    <span className="pill">Reunião 81%</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <Info label="Serviço" value="Tráfego + CRM + IA" />
                    <Info label="Campanha" value="Lentes em resina" />
                    <Info label="Região" value="Goiânia" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="pill"><BadgeCheck size={13}/> 5 decisões confirmadas</span>
                    <span className="pill"><CircleAlert size={13}/> 1 contradição</span>
                    <span className="pill"><Sparkles size={13}/> 2 oportunidades</span>
                  </div>
                  <button onClick={() => setScreen("meeting")} className="btn mt-5 flex items-center gap-2">Continuar reunião <ChevronRight size={15}/></button>
                </div>

                <div className="card p-5">
                  <div className="kicker">Alertas da IA</div>
                  <div className="mt-4 space-y-3">
                    <Alert title="Verba Meta em conflito" text="Foram mencionados R$ 1.500 e R$ 800. Confirme o valor final." tone="amber" />
                    <Alert title="Oportunidade comercial" text="Recepção demora para responder. IA + CRM atacam diretamente esse gargalo." tone="blue" />
                    <Alert title="Próxima ação" text="Definir quem assume transferências humanas antes de finalizar." tone="blue" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === "meeting" && (
            <div className="space-y-4">
              <header className="card p-5 md:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="kicker">Reunião ao vivo • Clínica Sorriso Prime</div>
                    <h1 className="mt-1 text-2xl font-black">Cockpit comercial</h1>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="pill">31:42</span>
                    <button onClick={() => setRecording(!recording)} className={`btn flex items-center gap-2 ${recording ? "border-red-400/30 bg-red-500/10" : ""}`}><Mic2 size={15}/>{recording ? "Parar gravação" : "Gravar reunião"}</button>
                    <button className="btn btn-primary">Finalizar reunião</button>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <div className="min-w-0 flex-1"><div className="progress"><div style={{width: `${readiness}%`}}/></div></div>
                  <strong className="text-sm">{readiness}% pronta</strong>
                </div>
              </header>

              <div className="desktop-grid grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_340px]">
                <aside className="card p-4">
                  <div className="kicker">Playbook</div>
                  <div className="mt-4 space-y-2">
                    {["Estrutura e localização","Autoridade","Produto","Paciente ideal","Oferta","Comercial e capacidade","IA e atendimento","Funil e métricas"].map((item, index) => (
                      <div key={item} className={`rounded-xl border px-3 py-2.5 text-sm ${index < 5 ? "border-emerald-500/10 bg-emerald-500/5 text-slate-300" : index === 5 ? "border-blue-400/25 bg-blue-500/10 text-blue-100" : "border-white/5 text-slate-500"}`}>
                        <div className="flex items-center gap-2">{index < 5 ? <CheckCircle2 size={14}/> : <span className="text-xs font-bold">{index + 1}</span>} {item}</div>
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="card p-5 md:p-6">
                  <div className="kicker">Pergunta 18 de 27</div>
                  <h2 className="mt-2 text-2xl font-bold">Quantas avaliações novas vocês conseguem atender por semana?</h2>
                  <p className="mt-2 text-sm muted">Essa informação impacta meta de volume, orçamento e agenda.</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["5–8", "10–12", "15+"].map(v => <button key={v} className="btn">{v}</button>)}
                  </div>

                  <textarea className="mt-4" defaultValue="Conseguimos de 10 a 12 avaliações por semana. Terça e quinta são os melhores dias." />

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <button className="btn flex items-center justify-center gap-2"><Mic2 size={16}/> Gravar só esta resposta</button>
                    <button className="btn flex items-center justify-center gap-2"><Sparkles size={16}/> Marcar momento importante</button>
                  </div>

                  <div className="card-soft mt-5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="kicker">IA extraiu</div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div><strong>Capacidade:</strong> 10–12 avaliações/semana</div>
                          <div><strong>Melhores dias:</strong> terça e quinta</div>
                        </div>
                      </div>
                      <span className="pill">Confiança alta</span>
                    </div>
                    <button onClick={() => setConfirmed(true)} className="btn btn-primary mt-4">{confirmed ? "Decisão confirmada ✓" : "Confirmar como decisão"}</button>
                  </div>
                </div>

                <aside className="card p-5">
                  <div className="flex items-center justify-between"><div className="font-bold">Copiloto IA</div><Sparkles size={17} className="text-blue-400"/></div>
                  <div className="mt-5 space-y-4">
                    <CopilotBlock label="O que falta" text="Confirmar verba Meta e responsável pelas transferências humanas." />
                    <CopilotBlock label="Risco" text="A clínica já mencionou dois valores de mídia diferentes." />
                    <CopilotBlock label="Oportunidade" text="Use a demora da recepção como ponte para mostrar o valor da IA no primeiro atendimento." />
                    <CopilotBlock label="Pergunta sugerida" text="Quando a IA precisar transferir uma conversa, quem deve assumir?" />
                  </div>
                </aside>
              </div>
            </div>
          )}

          {screen === "memory" && (
            <div className="card p-6">
              <div className="kicker">Fonte única da verdade</div>
              <h1 className="mt-2 text-3xl font-black">Memória da reunião</h1>
              <p className="mt-2 muted">Toda informação importante conserva origem, status e contexto antes de virar compromisso comercial.</p>
              <div className="mt-6 grid gap-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="card-soft grid gap-3 p-4 md:grid-cols-[180px_1fr_130px_120px] md:items-center">
                    <div className="text-sm muted">{fact.label}</div>
                    <div className="font-semibold">{fact.value}</div>
                    <span className="pill w-fit">{fact.source}</span>
                    <span className={`pill w-fit ${fact.status === "Conflito" ? "border-amber-400/30 text-amber-200" : "border-emerald-400/20 text-emerald-200"}`}>{fact.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "closing" && (
            <div className="space-y-4">
              <header className="card p-6">
                <div className="kicker">Fechamento personalizado</div>
                <h1 className="mt-2 text-3xl font-black">Venda usando o que o próprio cliente revelou.</h1>
                <p className="mt-2 muted">A IA conecta dor → impacto → solução Zahav → argumento recomendado.</p>
              </header>
              <div className="grid gap-4 lg:grid-cols-3">
                <ClosingCard type="Dor" title="Demora no primeiro atendimento" text="Leads podem esfriar enquanto aguardam resposta." />
                <ClosingCard type="Impacto" title="Perda de oportunidade" text="A clínica investe em mídia, mas não acompanha cada lead até o fechamento." />
                <ClosingCard type="Solução" title="IA + CRM + Meta Ads" text="Atendimento imediato, qualificação, agenda e acompanhamento do lead ao tratamento fechado." />
              </div>
              <div className="card p-6">
                <div className="kicker">Argumento sugerido</div>
                <p className="mt-3 text-lg leading-8 text-slate-200">“Hoje identificamos dois gargalos claros: demora no primeiro atendimento e falta de acompanhamento do lead até o tratamento fechado. A implantação da Zahav atua exatamente nesses dois pontos, conectando geração de demanda, resposta imediata com IA, qualificação, agendamento e acompanhamento comercial em um único processo.”</p>
                <button onClick={() => setScreen("proposal")} className="btn btn-primary mt-5">Gerar proposta a partir desta reunião</button>
              </div>
            </div>
          )}

          {screen === "proposal" && (
            <div className="space-y-4">
              <header className="card overflow-hidden p-0">
                <div className="bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent p-7 md:p-9">
                  <div className="kicker">Proposta comercial • versão 1</div>
                  <h1 className="mt-3 text-4xl font-black">Clínica Sorriso Prime</h1>
                  <p className="mt-2 max-w-2xl text-lg muted">Estrutura de aquisição e conversão para lentes em resina com Tráfego Pago, CRM e IA.</p>
                </div>
              </header>

              <div className="desktop-grid grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
                <div className="card p-6">
                  <div className="kicker">Plano recomendado</div>
                  <div className="mt-4 space-y-4">
                    <ProposalLine title="Aquisição" text="Campanhas Meta Ads para Goiânia e região, com foco em avaliação personalizada." />
                    <ProposalLine title="Atendimento" text="IA qualifica, responde dúvidas aprovadas e conduz até o agendamento sem diagnosticar." />
                    <ProposalLine title="CRM" text="Funil do lead novo ao tratamento fechado, com follow-ups, perdas e indicadores." />
                    <ProposalLine title="Gestão" text="Visão de investimento, agenda, conversão e faturamento do funil." />
                  </div>
                </div>

                <div className="card p-6">
                  <div className="kicker">Investimento</div>
                  <PriceInput label="Implantação" value={setup} onChange={setSetup} />
                  <PriceInput label="Mensalidade Zahav" value={monthly} onChange={setMonthly} />
                  <PriceInput label="Verba Meta" value={media} onChange={setMedia} />
                  <div className="mt-5 border-t border-white/5 pt-5">
                    <div className="text-sm muted">Investimento inicial estimado</div>
                    <div className="mt-1 text-3xl font-black">R$ {total.toLocaleString("pt-BR")}</div>
                    <div className="mt-1 text-xs muted">A verba de mídia permanece separada do serviço Zahav.</div>
                  </div>
                  <button onClick={() => setApproved(true)} className="btn btn-primary mt-5 w-full">{approved ? "Proposta aprovada ✓" : "Aprovar proposta"}</button>
                  <button onClick={() => approved && setScreen("implementation")} className={`btn mt-2 w-full ${!approved ? "cursor-not-allowed opacity-40" : ""}`}>Transformar em implantação</button>
                </div>
              </div>
            </div>
          )}

          {screen === "implementation" && (
            <div className="space-y-4">
              <header className="card p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="kicker">Execução automática</div>
                    <h1 className="mt-2 text-3xl font-black">Plano de implantação</h1>
                    <p className="mt-2 muted">Gerado a partir das decisões confirmadas da reunião e da proposta aprovada.</p>
                  </div>
                  <div className="min-w-[230px]"><div className="flex justify-between text-sm"><span className="muted">Progresso</span><strong>{implProgress}%</strong></div><div className="progress mt-2"><div style={{width: `${implProgress}%`}}/></div></div>
                </div>
              </header>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {["Marketing","CRM","IA","Cliente"].map((area, areaIndex) => (
                  <div key={area} className="card p-5">
                    <div className="font-bold">{area}</div>
                    <div className="mt-4 space-y-3">
                      {[0,1].map(offset => {
                        const index = areaIndex * 2 + offset;
                        const labels = ["Estratégia configurada","Criativos recebidos","Funil configurado","Responsáveis definidos","FAQ e objeções","SDR treinado","Acessos Meta","Materiais aprovados"];
                        return (
                          <label key={index} className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                            <input type="checkbox" checked={tasks[index]} onChange={() => setTasks(prev => prev.map((v,i) => i === index ? !v : v))} className="mt-1 h-4 w-4"/>
                            <span>{labels[index]}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({icon: Icon, label, value, detail}: {icon: any; label: string; value: string; detail: string}) {
  return <div className="card p-5"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Icon size={17}/></span><span className="text-xs muted">Agora</span></div><div className="mt-4 text-3xl font-black">{value}</div><div className="mt-1 text-sm font-semibold">{label}</div><div className="mt-1 text-xs muted">{detail}</div></div>;
}
function Info({label,value}:{label:string;value:string}) { return <div className="card-soft p-3"><div className="text-xs muted">{label}</div><div className="mt-1 text-sm font-bold">{value}</div></div>; }
function Alert({title,text,tone}:{title:string;text:string;tone:"amber"|"blue"}) { return <div className={`rounded-xl border p-3 ${tone === "amber" ? "border-amber-500/15 bg-amber-500/5" : "border-blue-500/15 bg-blue-500/5"}`}><div className="text-sm font-bold">{title}</div><div className="mt-1 text-xs leading-5 muted">{text}</div></div>; }
function CopilotBlock({label,text}:{label:string;text:string}) { return <div><div className="text-xs font-bold uppercase tracking-wider text-blue-300">{label}</div><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div>; }
function ClosingCard({type,title,text}:{type:string;title:string;text:string}) { return <div className="card p-5"><div className="kicker">{type}</div><div className="mt-2 text-lg font-bold">{title}</div><p className="mt-2 text-sm leading-6 muted">{text}</p></div>; }
function ProposalLine({title,text}:{title:string;text:string}) { return <div className="card-soft p-4"><div className="font-bold">{title}</div><p className="mt-1 text-sm leading-6 muted">{text}</p></div>; }
function PriceInput({label,value,onChange}:{label:string;value:number;onChange:(value:number)=>void}) { return <label className="mt-4 block"><span className="text-xs font-semibold muted">{label}</span><div className="mt-1 flex items-center rounded-xl border border-white/10 bg-white/[.025] px-3"><span className="text-sm muted">R$</span><input className="border-0 bg-transparent px-2 shadow-none focus:shadow-none" type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)}/></div></label>; }
