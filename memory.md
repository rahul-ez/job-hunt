# Memory — Phase 2 Profile Page Complete (Features 06, 07, 08)

Last updated: 2026-08-16 23:11

## What was built

- **Feature 06 — Profile Save Logic**:
  - Created `lib/profile-utils.ts` for dynamic profile completion percentage and missing fields calculation (`calculateProfileCompletion`).
  - Created `actions/profile.ts` with `saveProfile` and `uploadResumeAction` Server Actions using `@insforge/sdk/ssr`.
  - Updated `app/(protected)/profile/page.tsx` to fetch the authenticated user's `profiles` record server-side using `createInsforgeServer()`.
  - Updated `ProfileBanner.tsx`, `ResumeSection.tsx`, and `ProfileForm.tsx` to handle dynamic profile saving and resume PDF storage uploads.

- **Feature 07 — AI Profile Extraction from Resume**:
  - Installed `@google/genai` and `pdf-parse`.
  - Created `POST /api/resume/extract` using Gemini API (`gemini-2.5-flash` via `@google/genai`) with base64 PDF `inlineData`.
  - Created `components/profile/ProfileContainer.tsx` client bridge component to manage state between `ResumeSection` and `ProfileForm`.
  - Updated `ResumeSection.tsx` with "Extract from Resume" CTA button.
  - Updated `ProfileForm.tsx` to auto-fill extracted fields and display a review notification banner.

- **Feature 08 — Resume PDF Generation from Profile**:
  - Installed `@react-pdf/renderer`.
  - Created `components/pdf/ResumePDF.tsx` server-side React-PDF document template styled with project design tokens (`#7C5CFC` accent, Helvetica font, 32pt padding).
  - Created `POST /api/resume/generate` using Gemini 2.5 Flash to synthesize high-impact professional summary and bullet points, and `@react-pdf/renderer` (`renderToBuffer()`) to generate binary A4 PDF buffer.
  - Saves generated PDF to InsForge Storage bucket `resumes` at `resumes/{user_id}/resume.pdf` with `upsert: true` and updates `profiles.resume_pdf_url`.
  - Connected "Generate Resume from Profile" CTA in `ResumeSection.tsx`.

## Decisions made

- **Server-side data fetching & Server Actions**: Profile data fetched server-side in `app/(protected)/profile/page.tsx`. Mutations handled via Server Actions in `actions/profile.ts`.
- **Client router re-hydration**: Called `router.refresh()` from `next/navigation` in `ProfileForm.tsx` and `ResumeSection.tsx` after Server Actions to instantly refresh server component `ProfileBanner.tsx`.
- **Multimodal AI PDF Parsing**: Used Gemini 2.5 Flash's native PDF `inlineData` base64 parser for AI profile extraction instead of third-party Node.js PDF text extractors.
- **Base64 payload sanitization**: Sanitized base64 PDF payload (`pdfBase64.replace(/[\r\n\s]/g, '')`) before sending to `inlineData`.
- **React-PDF Server Rendering**: Used `@react-pdf/renderer` server-side with `renderToBuffer()` to generate binary PDF buffers uploaded directly to InsForge Storage.

## Problems solved

- `pdf-parse` v2 failed in Next.js server runtime due to `pdfjs-dist` worker dynamic import issues; resolved by using Gemini 2.5 Flash's native PDF multimodal base64 `inlineData` parser.
- "View uploaded PDF" link in `ResumeSection.tsx` was a non-clickable `<div>` inside a drop zone container; converted to `<a href={resumeUrl} target="_blank" rel="noopener noreferrer">` with `onClick={(e) => e.stopPropagation()}`.
- `EXPERIENCE` missing field tag remained stuck when work roles were added; updated `calculateProfileCompletion` to check `yearsExperience > 0 || workRoles.length > 0`.
- `renderToBuffer` type mismatch in TypeScript `.ts` file resolved using `React.createElement(ResumePDF, { data }) as unknown as React.ReactElement<DocumentProps>`.

## Current state

- Phase 1 (Foundation) & Phase 2 (Profile Page) are 100% complete (01 Homepage, 02 Auth, 03 PostHog, 04 Database Schema, 05 Profile Page UI, 06 Profile Save Logic, 07 AI Profile Extraction from Resume, 08 Resume PDF Generation from Profile).
- All code compiles cleanly with `npx tsc --noEmit` (0 errors).

## Next session starts with

- Feature 09 — Find Jobs Page — Full UI.
- Build the complete Find Jobs page UI with mock data first (search controls, filter tabs, jobs table, pagination).
- Run `/architect feature 09` before starting implementation.

## Open questions

- None — Profile page flow and resume AI operations are complete and fully working.
