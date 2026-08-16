# PostHog Self-driving Setup Report

**Project:** JobPilot — AI-powered job hunting assistant  
**Date:** 2026-08-16  
**Inbox:** https://eu.posthog.com/project/249734/inbox

## Summary

PostHog Self-driving was configured for JobPilot: GitHub was connected, six signal sources were enabled (error tracking, session replay, health checks, conversations, and the scout gate), and a five-scout troop was tuned to the product's most-used surfaces. Two Replay Vision scanners were armed to watch the job search and job details flow. Findings will start appearing in the Self-driving inbox at https://eu.posthog.com/project/249734/inbox within approximately 30 minutes.

---

## AI Data Processing

**Status:** Approved. Organization-level AI data processing was approved before this run started.

---

## GitHub

**Status:** Connected during this run.  
**Integration:** `rahul-ez` (integration id: 78258)  
**Repos granted:** all repos accessible to the GitHub App install.  
Self-driving uses this to research findings in code and open fix PRs.

---

## Products Enabled

The `products-enable` MCP tool was not available on this deployment. All three products need to be enabled manually in PostHog settings.

| Product | Status | Notes |
|---|---|---|
| Session Replay | **Follow-up required** | Enable in Settings → Session replay → "Record user sessions". The `posthog.init` in `instrumentation-client.ts` does not set `disable_session_recording`, so the server flip is enough. |
| Error Tracking | **Follow-up required** | Enable in Settings → Error tracking → "Enable exception autocapture". The `posthog.init` already sets `capture_exceptions: true`, so the SDK side is ready. |
| Support (Conversations) | **Follow-up required** | Enable from the product sidebar. Tickets only arrive once an inbound channel (email / inbox / Slack) is connected — see Follow-ups. |

**`posthog.init` override check:** Clean. `instrumentation-client.ts` sets `capture_exceptions: true` and does not set `disable_session_recording` — no overrides were needed.

---

## Signal Sources

| source_product | source_type | Action | Notes |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | **On by default** | Scout findings reach the inbox with no config row needed. |
| `health_checks` | `health_issue` | **Enabled** (id: `01a00901-ce7e-77ac-8df8-e4213f44c3b1`) | Always enabled — instrumentation issues are always actionable. |
| `error_tracking` | `issue_created` | **Enabled** (id: `01a00901-d134-7f1d-a741-067ec90f47be`) | Enable by default — costs nothing until errors arrive. |
| `error_tracking` | `issue_reopened` | **Enabled** (id: `01a00901-d6c8-7fdb-8376-d9a3f69ae43c`) | Enable by default. |
| `error_tracking` | `issue_spiking` | **Enabled** (id: `01a00901-d9a3-7dcb-97a4-f7831bd14c29`) | Enable by default. |
| `session_replay` | `session_analysis_cluster` | **Enabled** (id: `01a00901-dc1a-7beb-809b-e9d36c961361`) | sample_rate: 0.1 (server default). Costs nothing until recordings exist. |
| `conversations` | `ticket` | **Enabled** (id: `01a00901-df5e-7488-a724-562846c6de8d`) | Stays dormant until an inbound channel is connected — see Follow-ups. |
| `replay_vision` | — | **Skipped** | Replay Vision scanners are self-authorizing via `emits_signals` on the scanner — no source config row needed. |

---

## Connected Tools

No external tools were selected during setup.

| Tool | Status |
|---|---|
| GitHub Issues | Not used (not selected) |
| Linear | Not used (not selected) |
| Jira | Not used (not selected) |
| Sentry | Not used (not selected) |
| Zendesk | Not used (not selected) |

Connected tools can be added later at https://eu.posthog.com/project/249734/pipeline/new/source.

---

## Scout Troop

**Run budget:** 100 runs/day (early-access default). 0 runs used today.  
**Banner:** "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

### Enabled (5 scouts)

| Scout | What it watches |
|---|---|
| `signals-scout-general` | Cross-product correlations and surfaces no specialist covers. Already enabled at sync. |
| `signals-scout-product-analytics` | Conversion and retention regressions in saved funnel insights — job search → match → apply flows as insights are created. |
| `signals-scout-web-analytics` | Homepage traffic drops, attribution breakage, and landing-page bounce anomalies. |
| `signals-scout-observability-gaps` | Events firing with no insight, dashboard, or alert coverage — high value on a fresh project. |
| `signals-scout-health-checks` | PostHog instrumentation issues worth acting on — SDK misconfiguration, proxy gaps, stale SDKs. |

### Disabled (22 scouts)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by the native error tracking source (step 4) — disabling intentional, not a gap. |
| `signals-scout-session-replay` | Covered by the native session replay source (step 4) — disabling intentional, not a gap. |
| `signals-scout-ai-observability` | No `$ai_*` events — app uses OpenAI via direct API calls, not PostHog AI observability SDK. Enable if you add LLM observability later. |
| `signals-scout-feature-flags` | No feature flags in use. Enable if you add flags. |
| `signals-scout-surveys` | No surveys in use (0 found). Enable if you add PostHog surveys. |
| `signals-scout-revenue-analytics` | No payment SDK or revenue events. Payments are explicitly out of scope for this project. |
| `signals-scout-experiments` | No A/B experiments configured. Enable if you add experiments. |
| `signals-scout-logs` | PostHog logs product not in use. |
| `signals-scout-csp-violations` | No CSP reporting configured. |
| `signals-scout-customer-analytics` | No group/accounts analytics — single-user B2C product. |
| `signals-scout-data-pipelines` | No CDP destinations, batch exports, or hog flows. |
| `signals-scout-data-warehouse` | No warehouse sources connected. |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry spans. |
| `signals-scout-conversations` | Conversations product enabled but no channel connected yet — enable this scout once tickets flow. |
| `signals-scout-anomaly-detection` | No dashboard/insight history yet — enable once dashboard insights accumulate data. |
| `signals-scout-replay-vision` | This scout reads trends across accumulated scanner observations; the scanners created in this run have no history yet. Enable after observations accumulate. |
| `signals-scout-inbox-validation` | Not appropriate for a fresh setup — no resolved reports to validate yet. |
| `signals-scout-insight-alerts` | No alerts configured yet. |
| `signals-scout-mcp-tool-calls` | Internal PostHog scout. |
| `signals-scout-skills-store` | Internal PostHog scout. |
| `signals-scout-tasks` | Not relevant for this project. |
| `signals-scout-web-vitals` | Enable if you want per-page Core Web Vitals monitoring. |

---

## Custom Scouts

Two custom scouts were proposed and declined:

| Proposed Scout | What it would watch | Why declined |
|---|---|---|
| Job search pipeline health | `job_search_started` vs `job_found` ratio — catch Adzuna API degradation or GPT-4o scoring failures | User declined |
| Match quality regression | `job_found` matchScore distribution — catch GPT-4o quality regression | User declined |

**Surfaces considered and ruled out:**
- Profile completion gate — no "user_signed_up" denominator event to compute a completion rate; absolute volume not discriminating enough.
- Company research reliability — graceful fallback means no hard failure signal without a separate "research_failed" event.

**Noise escape hatch:** If any enabled or future scout turns noisy, set `emit: false` on its config in PostHog to switch it to dry-run — it still runs and logs but writes nothing to the inbox.

---

## Replay Vision Scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find directly to the Self-driving inbox. They catch breakage that never throws a JavaScript error: blank screens, broken layouts, unresponsive buttons, stuck spinners. Findings arrive at half weight and need corroboration before being promoted into a report.

The project has no recordings yet (fresh setup). Both scanners are armed and start working the day recordings begin — no second setup needed.

Credit spend was not verified against org quota because the `creating-replay-vision-scanners` companion skill was not available on this deployment. Both scanners use conservative defaults and scoped queries.

| Scanner | Status | Query scope | Sampling | Model | Est. monthly credits |
|---|---|---|---|---|---|
| Broken experiences | **Created** (id: `01a00908-dee8-7730-9f8f-8d7f00dfd06c`) | `$current_url` icontains `/find-jobs` | 50% | gemini-3.7-flash | 0 (no recordings yet) |
| User frustration | **Created** (id: `01a00908-f9e7-74b0-9417-a9f3dd94d91a`) | Sessions with `$rageclick` event (no URL filter) | 100% | gemini-3.7-flash | 0 (no recordings yet) |

**Broken experiences** watches the `/find-jobs` path (covers both the job search list and individual job detail pages at `/find-jobs/[id]`). This is JobPilot's key completion flow — where users search, review match scores, research companies, and click Apply Now — so breakage here has the highest user impact.

**User frustration** is gated on `$rageclick` with no URL filter, so it watches any session where a user hammered an unresponsive element anywhere in the app. The `$rageclick` gate means it cannot overlap with Broken experiences (which is URL-scoped, not event-gated).

---

## Follow-ups

- [ ] **Enable Session Replay** in PostHog: Settings → Session replay → "Record user sessions". The SDK init is ready.
- [ ] **Enable Error Tracking** in PostHog: Settings → Error tracking → "Enable exception autocapture". The SDK init already sets `capture_exceptions: true`.
- [ ] **Enable Support (Conversations)** in PostHog via the product sidebar.
- [ ] **Connect an inbound channel to Support**: email, inbox, or Slack — tickets reach the inbox automatically once a channel exists. See PostHog Settings → Conversations.
- [ ] **Connect GitHub Issues** if you want open GitHub issues to feed the inbox and receive automatic draft fix PRs at $15/issue. Add the source at https://eu.posthog.com/project/249734/pipeline/new/source.
- [ ] **Enable `signals-scout-replay-vision`** once Replay Vision scanner observations accumulate — it reads trends across sessions rather than individual recordings.
- [ ] **Verify Replay Vision credit spend** against org quota once recordings begin (companion skill `creating-replay-vision-scanners` was unavailable during this run).
- [ ] **Add `$ai_*` event instrumentation** (via PostHog's LLM observability SDK helpers) if you want to track GPT-4o token costs, latency, and quality inside PostHog — then enable `signals-scout-ai-observability`.

---

## What Happens Next

The scout coordinator picks up fresh configs within ~30 minutes and dispatches the first runs. Each run draws from the project's daily budget (100 runs/day during early access). Findings cluster into reports in the inbox at https://eu.posthog.com/project/249734/inbox — immediately actionable ones can start coding tasks automatically.

To tune the troop later: enable/disable scouts individually from the inbox, or ask Claude Code to re-run this setup.
