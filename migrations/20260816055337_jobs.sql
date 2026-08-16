-- jobs table
-- One row per discovered job. Linked to an agent_run.
-- company_research jsonb is populated separately by the research agent.
-- source is always 'search' for Adzuna jobs.

create table public.jobs (
  id                  uuid          primary key default gen_random_uuid(),
  run_id              uuid          references public.agent_runs(id) on delete set null,
  user_id             uuid          not null references public.profiles(id) on delete cascade,
  source              text          not null check (source in ('search', 'url')) default 'search',
  source_url          text,
  external_apply_url  text,
  title               text          not null,
  company             text          not null,
  location            text,
  salary              text,
  job_type            text          check (job_type in ('fulltime', 'parttime', 'contract')) default 'fulltime',
  about_role          text,
  responsibilities    text[]        default '{}',
  requirements        text[]        default '{}',
  nice_to_have        text[]        default '{}',
  benefits            text[]        default '{}',
  about_company       text,
  match_score         integer       check (match_score >= 0 and match_score <= 100),
  match_reason        text,
  matched_skills      text[]        default '{}',
  missing_skills      text[]        default '{}',
  company_research    jsonb,
  found_at            timestamptz   not null default now()
);

-- Index for common query patterns
create index jobs_user_id_found_at_idx on public.jobs (user_id, found_at desc);
create index jobs_match_score_idx on public.jobs (user_id, match_score desc);

-- Enable Row Level Security
alter table public.jobs enable row level security;

-- Policy: users can only read and write their own jobs rows
create policy "jobs: own rows only"
  on public.jobs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
