# Zahav Meeting OS — Arquitetura do Produto

## Princípio central

O coração do sistema não é a proposta. É a **Decisão Confirmada da Reunião**.

Fluxo:

1. Conversa bruta
2. Fatos extraídos
3. Confirmação
4. Decisões oficiais
5. Fechamento
6. Proposta
7. Aprovação
8. Implantação

## Camadas

### Meeting Engine
Captura respostas digitadas, notas, gravação por pergunta e gravação integral.

### Memory Engine
Mantém fatos com origem, timestamp, confiança e status.

### Intelligence Engine
Detecta lacunas, riscos, contradições, dores, objeções e oportunidades.

### Commercial Engine
Monta argumentos de fechamento, proposta e versões.

### Implementation Engine
Transforma decisões aprovadas em tarefas, configurações e entregáveis.

## Status de informação

- confirmed_by_client
- typed_by_consultant
- extracted_from_audio
- ai_suggested
- awaiting_confirmation
- conflict

## Entidades previstas

organizations, users, clients, contacts, segments, services, playbooks, playbook_sections, questions, meetings, meeting_answers, audio_segments, transcripts, extracted_facts, decisions, contradictions, opportunities, objections, proposals, proposal_versions, proposal_items, approvals, implementations, implementation_tasks, generated_assets, ai_profiles, campaign_plans, funnel_templates, followup_sequences, metric_definitions, responsibilities, attachments, activity_logs.

## Multiempresa

Toda entidade de negócio deve pertencer a organization_id. O banco futuro deverá aplicar isolamento de tenant e RLS.

## Áudio

O MVP visual está preparado para duas modalidades:

- gravação de resposta por pergunta;
- gravação completa da reunião.

Cada segmento de áudio deverá suportar source, transcript, speaker, timestamp_start, timestamp_end, linked_question_id, confidence e confirmation_status.

## Regra de segurança de IA

A IA nunca deve sobrescrever silenciosamente uma decisão aprovada. Alterações posteriores devem gerar nova versão, conflito ou pedido de confirmação.
