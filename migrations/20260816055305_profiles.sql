-- profiles table
-- One row per user. References auth.users managed by InsForge Auth.
-- is_complete is set to true by the profile save action when all required fields are filled.

create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  full_name           text,
  email               text,
  phone               text,
  location            text,
  current_title       text,
  experience_level    text check (experience_level in ('junior', 'mid', 'senior', 'lead')),
  years_experience    integer,
  skills              text[]        default '{}',
  industries          text[]        default '{}',
  work_experience     jsonb         default '[]',
  education           jsonb         default '{}',
  job_titles_seeking  text[]        default '{}',
  remote_preference   text check (remote_preference in ('remote', 'onsite', 'hybrid', 'any')),
  preferred_locations text[]        default '{}',
  salary_expectation  text,
  cover_letter_tone   text check (cover_letter_tone in ('formal', 'casual', 'enthusiastic')),
  linkedin_url        text,
  portfolio_url       text,
  work_authorization  text check (work_authorization in ('citizen', 'permanent_resident', 'visa_required')),
  resume_pdf_url      text,
  resume_pdf_key      text,
  is_complete         boolean       not null default false,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: users can only read and write their own profile row
create policy "profiles: own row only"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
