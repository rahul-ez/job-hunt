-- agent_logs table
-- Human-readable log entries written by the agent during runs.
-- job_id is optional — only set when the log is about a specific job.

create table public.agent_logs (
  id          uuid          primary key default gen_random_uuid(),
  run_id      uuid          references public.agent_runs(id) on delete cascade,
  user_id     uuid          not null references public.profiles(id) on delete cascade,
  message     text          not null,
  level       text          not null check (level in ('info', 'success', 'warning', 'error')) default 'info',
  job_id      uuid          references public.jobs(id) on delete set null,
  created_at  timestamptz   not null default now()
);

-- Index for fetching logs for a run in order
create index agent_logs_run_id_created_at_idx on public.agent_logs (run_id, created_at asc);

-- Enable Row Level Security
alter table public.agent_logs enable row level security;

-- Policy: users can only read their own log entries
create policy "agent_logs: own rows only"
  on public.agent_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
