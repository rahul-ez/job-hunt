-- agent_runs table
-- One row per job discovery run triggered by the user.
-- Tracks status and results of each Adzuna search.

create table public.agent_runs (
  id                  uuid          primary key default gen_random_uuid(),
  user_id             uuid          not null references public.profiles(id) on delete cascade,
  status              text          not null check (status in ('running', 'completed', 'failed')) default 'running',
  job_title_searched  text,
  location_searched   text,
  jobs_found          integer       default 0,
  started_at          timestamptz   not null default now(),
  completed_at        timestamptz
);

-- Enable Row Level Security
alter table public.agent_runs enable row level security;

-- Policy: users can only read and write their own agent_runs rows
create policy "agent_runs: own rows only"
  on public.agent_runs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
