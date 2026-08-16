# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 3 — Find Jobs Page (next)
**Last completed:** 08 Resume PDF Generation from Profile
**Next:** 09 Find Jobs Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- **06 Profile Save Logic:** Used `insforge.database.from('profiles').upsert()` for profile mutations and `insforge.storage.from('resumes').upload()` for PDF uploads in Server Actions (`actions/profile.ts`). Created `calculateProfileCompletion` in `lib/profile-utils.ts` to compute missing fields dynamically.
- **07 AI Profile Extraction from Resume:** Created `POST /api/resume/extract` using `PDFParse` (`pdf-parse`) and `@google/genai` (`gemini-2.5-flash` with `GEMINI_API_KEY`). Form fields populate in client state via `ProfileContainer` for user review before saving.
- **08 Resume PDF Generation from Profile:** Created `POST /api/resume/generate` using Gemini API (`gemini-2.5-flash`) for resume copy synthesis and `@react-pdf/renderer` (`ResumePDF.tsx`) for rendering A4 PDF buffer. Buffer uploaded to InsForge Storage `resumes/{user_id}/resume.pdf` with `upsert: true`.

---

## Notes

- Profile page `app/(protected)/profile/page.tsx` fetches profile row using `insforge.database.from('profiles').select('*').eq('id', user.id).single()`.
