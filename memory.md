# Memory — Feature 04 Database Schema

Last updated: 2026-08-16

## What was built

- Logged into InsForge CLI and linked the project (JobPilot, `t3bkeev8.ap-southeast`).
- InsForge agent skills and `find-skills` installed globally via the link command.
- Created and applied 4 migration files in `migrations/`:
  - `20260816055305_profiles.sql` — profiles table + RLS
  - `20260816055328_agent-runs.sql` — agent_runs table + RLS
  - `20260816055337_jobs.sql` — jobs table + 2 indexes + RLS
  - `20260816055347_agent-logs.sql` — agent_logs table + index + RLS
- Created the `resumes` storage bucket as **private** via `insforge storage create-bucket resumes --private`.
- Updated `context/progress-tracker.md` — Feature 04 marked complete, next is Feature 05.

## Decisions made

- Used `insforge db migrations` (new → up --all) instead of raw SQL import — keeps schema version-controlled and replayable.
- Migration names use hyphens not underscores — CLI enforces lowercase letters, numbers, and hyphens only.
- `resumes` bucket set to private (not public) — InsForge handles access control at the bucket level for private buckets. No separate `storage.objects` RLS policies needed.
- Storage policies migration was written then discarded — InsForge's storage schema uses `bucket`/`key` columns (not Supabase's `bucket_id`/`name`), and private bucket access is enforced at bucket level, not via RLS.

## Problems solved

- PowerShell does not support `&&` for chaining commands — ran each migration command separately.
- CLI rejects underscores in migration names — used hyphens (`agent-runs`, `agent-logs`).
- InsForge `storage.objects` has different column names than Supabase (`bucket` not `bucket_id`, `key` not `name`) — discovered by querying `information_schema.columns`.
- `insforge db migrations up` requires an explicit mode flag — correct command is `up --all`.

## Current state

- All 4 tables exist in the live InsForge project with RLS enabled and scoped to `auth.uid() = user_id`.
- `resumes` storage bucket exists, is private, 0 objects.
- Phase 1 fully complete (01 Homepage, 02 Auth, 03 PostHog, 04 Database Schema).
- Phase 2 not started.

## Next session starts with

- Feature 05 — Profile Page Full UI.
- Build the complete profile page with mock data first (no save logic yet).
- Sections: profile completion banner, resume upload area, profile form (Personal Info, Professional Info, Work Experience, Education, Job Preferences), Save Profile button.
- Run `/architect` before starting if the session is fresh.

## Open questions

- None — schema is clean and matches `architecture.md` exactly (with the InsForge storage column name difference documented above).
