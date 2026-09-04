export type DecisionStatus = "confirmed" | "pending" | "conflict" | "suggested";
export type DecisionSource = "client" | "consultant" | "audio" | "ai";

export type Decision = {
  id: string;
  key: string;
  label: string;
  value: string;
  source: DecisionSource;
  status: DecisionStatus;
  confidence?: number;
  timestamp?: string;
};

export type PlaybookSection = {
  id: string;
  title: string;
  required: boolean;
  questions: { id: string; text: string; required: boolean; hint?: string }[];
};

export type Playbook = {
  id: string;
  segment: string;
  service: string;
  name: string;
  sections: PlaybookSection[];
};

export type Organization = { id: string; name: string; slug: string };
export type Client = { id: string; organizationId: string; name: string; city: string; segment: string };

export const demoOrganizations: Organization[] = [
  { id: "org-zahav", name: "Zahav Digital", slug: "zahav-digital" },
  { id: "org-demo", name: "Workspace Demonstração", slug: "demo" },
];

export const demoClient: Client = {
  id: "client-sorriso-prime",
  organizationId: "org-zahav",
  name: "Clínica Sorriso Prime",
  city: "Goiânia",
  segment: "Odontologia estética",
};

export const dentalPlaybook: Playbook = {
  id: "pb-dental-resina",
  segment: "Odontologia",
  service: "Lentes de Resina",
  name: "Tráfego Pago + CRM + IA",
  sections: [
    { id: "estrutura", title: "Estrutura e localização", required: true, questions: [
      { id: "q-endereco", text: "Qual é o endereço da clínica e quais regiões vocês querem atender?", required: true },
      { id: "q-horarios", text: "Quais dias e horários têm maior disponibilidade para avaliações?", required: true },
    ]},
    { id: "autoridade", title: "Autoridade e confiança", required: true, questions: [
      { id: "q-cases", text: "Quais provas de autoridade podem aparecer nos anúncios e atendimento?", required: true },
    ]},
    { id: "produto", title: "Produto / tratamento", required: true, questions: [
      { id: "q-nome", text: "Qual nomenclatura a clínica prefere usar para o tratamento?", required: true },
      { id: "q-preco", text: "A IA pode informar preço ou apenas encaminhar para avaliação?", required: true },
    ]},
    { id: "publico", title: "Paciente ideal", required: true, questions: [
      { id: "q-icp", text: "Quem é o paciente ideal e quem vocês não querem atrair?", required: true },
    ]},
    { id: "oferta", title: "Oferta", required: true, questions: [
      { id: "q-oferta", text: "Qual será a oferta principal para gerar a avaliação?", required: true },
    ]},
    { id: "comercial", title: "Comercial e capacidade", required: true, questions: [
      { id: "q-capacidade", text: "Quantas avaliações novas vocês conseguem atender por semana?", required: true, hint: "Impacta volume, mídia e agenda." },
      { id: "q-midia", text: "Qual verba mensal de mídia será aprovada para o teste inicial?", required: true },
    ]},
    { id: "ia", title: "IA e atendimento", required: true, questions: [
      { id: "q-humano", text: "Quando a IA precisar transferir uma conversa, quem deve assumir?", required: true },
      { id: "q-limites", text: "Quais assuntos exigem atendimento humano ou avaliação profissional?", required: true },
    ]},
    { id: "funil", title: "Funil e métricas", required: true, questions: [
      { id: "q-kpis", text: "Quais indicadores precisam aparecer no acompanhamento da clínica?", required: true },
    ]},
  ],
};

export const seedDecisions: Decision[] = [
  { id: "d1", key: "campaign", label: "Campanha", value: "Lentes em resina", source: "client", status: "confirmed", timestamp: "08:14" },
  { id: "d2", key: "region", label: "Região", value: "Goiânia e região próxima", source: "client", status: "confirmed", timestamp: "09:03" },
  { id: "d3", key: "weekly_capacity", label: "Capacidade", value: "10 a 12 avaliações/semana", source: "audio", status: "confirmed", confidence: .96, timestamp: "18:42" },
  { id: "d4", key: "best_days", label: "Melhores dias", value: "Terça e quinta", source: "audio", status: "confirmed", confidence: .94, timestamp: "18:49" },
  { id: "d5", key: "price_rule", label: "Regra de preço", value: "Não informar preço exato no WhatsApp", source: "client", status: "confirmed", timestamp: "21:10" },
  { id: "d6", key: "meta_budget", label: "Verba Meta", value: "R$ 1.500 ou R$ 800", source: "ai", status: "conflict", timestamp: "24:11" },
];

export const requiredDecisionKeys = ["campaign", "region", "weekly_capacity", "price_rule", "meta_budget", "human_owner"];

export function readinessScore(decisions: Decision[]) {
  const resolved = requiredDecisionKeys.filter(key => decisions.some(d => d.key === key && d.status === "confirmed")).length;
  return Math.round((resolved / requiredDecisionKeys.length) * 100);
}
