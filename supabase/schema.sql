-- Zahav Meeting OS — schema inicial para Supabase/Postgres
-- Todas as entidades de negócio carregam organization_id para isolamento multiempresa.

create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  segment text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  segment text not null,
  service text not null,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists playbook_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  playbook_id uuid not null references playbooks(id) on delete cascade,
  title text not null,
  position integer not null default 0,
  required boolean not null default true
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  section_id uuid not null references playbook_sections(id) on delete cascade,
  text text not null,
  hint text,
  required boolean not null default true,
  position integer not null default 0
);

create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  playbook_id uuid references playbooks(id),
  status text not null default 'draft',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists meeting_answers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  meeting_id uuid not null references meetings(id) on delete cascade,
  question_id uuid references questions(id),
  answer_text text,
  source text not null default 'consultant',
  confirmation_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists audio_segments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  meeting_id uuid not null references meetings(id) on delete cascade,
  linked_question_id uuid references questions(id),
  storage_path text,
  transcript text,
  speaker text,
  timestamp_start numeric,
  timestamp_end numeric,
  confidence numeric,
  confirmation_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  meeting_id uuid not null references meetings(id) on delete cascade,
  decision_key text not null,
  label text not null,
  value_text text not null,
  source text not null,
  status text not null default 'pending',
  confidence numeric,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  meeting_id uuid references meetings(id),
  public_token uuid not null default gen_random_uuid() unique,
  status text not null default 'draft',
  setup_amount numeric(12,2) not null default 0,
  monthly_amount numeric(12,2) not null default 0,
  media_amount numeric(12,2) not null default 0,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists proposal_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  proposal_id uuid not null references proposals(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(proposal_id, version)
);

create table if not exists implementations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  proposal_id uuid not null references proposals(id),
  status text not null default 'onboarding',
  created_at timestamptz not null default now()
);

create table if not exists implementation_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  implementation_id uuid not null references implementations(id) on delete cascade,
  area text not null,
  title text not null,
  owner_type text not null default 'zahav',
  status text not null default 'todo',
  due_at timestamptz,
  dependency_task_id uuid references implementation_tasks(id),
  evidence text,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_org on clients(organization_id);
create index if not exists idx_meetings_org on meetings(organization_id);
create index if not exists idx_decisions_meeting on decisions(meeting_id);
create index if not exists idx_proposals_org on proposals(organization_id);
create index if not exists idx_impl_org on implementations(organization_id);

-- RLS deve ser ativado quando autenticação Supabase for conectada.
-- A política recomendada é resolver organization_id por membership do auth.uid().
