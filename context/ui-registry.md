# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout Components

#### LandingNavbar
**File:** [components/layout/LandingNavbar.tsx](../components/layout/LandingNavbar.tsx)
**Purpose:** Top navbar for homepage and public pages
**Responsive:** Hides nav items on mobile, shows logo + start button always
**Classes:** `border-b border-border-light bg-surface`, `h-16`, `max-w-[1128px] mx-auto`, `text-sm font-medium text-text-dark hover:text-accent`
**Button:** `rounded-sm bg-overlay px-4 h-9 text-xs font-medium text-accent-foreground`

#### LandingFooter
**File:** [components/layout/LandingFooter.tsx](../components/layout/LandingFooter.tsx)
**Purpose:** Footer with branding and navigation links
**Layout:** Full width footer with divider at top
**Classes:** `border-x border-border bg-surface`, `px-8 py-12 sm:flex-row sm:justify-between`, `text-sm font-medium text-text-dark hover:text-accent`

### Homepage Section Components

#### LandingHero
**File:** [components/homepage/LandingHero.tsx](../components/homepage/LandingHero.tsx)
**Purpose:** Hero section with headline, subheadline, CTAs, and dashboard preview image
**Background:** `landing-pastel` class (custom pastel gradient) + `bg-surface`
**Headline:** `text-[42px] sm:text-[54px] font-bold leading-[1.05] text-text-slate`
**Subheadline:** `text-sm font-medium leading-6 text-text-secondary`
**CTA Buttons:** Primary (dark) and secondary (border) styles with `rounded-md`, `h-10`, `px-5`
**Image:** `max-w-[1002px] w-full` with `landing-preview-shadow` class (custom shadow)

#### LandingFeatures
**File:** [components/homepage/LandingFeatures.tsx](../components/homepage/LandingFeatures.tsx)
**Purpose:** Two-column grid layout showing feature categories and benefits
**Layout:** `md:grid-cols-2` grid on desktop, stacked on mobile
**Section Title:** `text-[35px] font-bold leading-[1.08] text-text-slate`
**Feature List:** Renders as nested feature items with title and description
**Spacing:** `px-8 py-12 sm:px-14 md:px-16` for content areas
**Background:** Left column `bg-surface`, right column `bg-surface-muted`

#### LandingTestimonial
**File:** [components/homepage/LandingTestimonial.tsx](../components/homepage/LandingTestimonial.tsx)
**Purpose:** Success story / testimonial section with user quote and profile
**Label:** `text-xs font-semibold uppercase text-accent`
**Quote:** `text-[26px] font-semibold leading-[1.35] text-text-darker max-w-[760px]`
**User Profile:** Avatar (h-10 w-10 rounded-md) + name/title text
**Classes:** `bg-surface px-6 py-20 text-center border-x border-b border-border`

#### LandingCta
**File:** [components/homepage/LandingCta.tsx](../components/homepage/LandingCta.tsx)
**Purpose:** Bottom call-to-action section before footer
**Background:** `landing-pastel` class (custom pastel gradient) + dark overlay
**Heading:** `text-[38px] sm:text-[48px] font-bold leading-[1.08] text-text-slate`
**Subheading:** `text-sm font-medium leading-6 text-text-secondary max-w-[610px]`
**CTA Buttons:** Same pattern as hero (primary dark + secondary border)
**Spacing:** `px-6 py-20` with `flex flex-col sm:flex-row items-center gap-3`

### Auth Page Components

#### LoginCard
**File:** [app/(auth)/login/page.tsx](../app/(auth)/login/page.tsx)
**Purpose:** Centered login card with OAuth provider buttons and error messaging
**Last updated:** 2026-08-15

| Property | Class |
|----------|-------|
| Container | `min-h-screen bg-background flex items-center justify-center px-6 py-12` |
| Max width | `max-w-[420px] w-full` |
| **Card** | |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-lg` |
| Padding | `px-8 py-10` |
| Shadow | `shadow-sm` |
| **Logo** | |
| Text | `text-2xl font-bold text-text-slate` |
| Margin | `mb-12 text-center` |
| Subtitle | `text-sm font-medium text-text-secondary mt-2` |
| **Heading** | |
| Main title | `text-[28px] font-bold leading-tight text-text-slate` |
| Margin | `mb-3` |
| Description | `text-sm font-medium text-text-secondary` |
| **Error message** | |
| Background | `bg-error-light` |
| Border | `border border-error` |
| Border radius | `rounded-md` |
| Padding | `p-3` |
| Text | `text-sm font-medium text-error-foreground` |
| Container margin | `mb-6` |
| **OAuth buttons** | |
| Button height | `h-10` |
| Button padding | `px-4` |
| Border radius | `rounded-md` |
| Border | `border border-border-light` |
| Background | `bg-surface` |
| Hover | `hover:bg-surface-secondary` |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Transition | `transition-colors` |
| Text | `font-medium text-sm text-text-dark` |
| Layout | `flex items-center justify-center gap-2` |
| Icon size | `w-5 h-5` |
| Button spacing | `space-y-3` |
| **Divider** | |
| Border | `border-t border-border-light` |
| Layout | `flex items-center gap-3` |
| Text | `text-xs font-medium text-text-muted uppercase` |
| Container margin | `my-6` |
| **Footer text** | |
| Font | `text-xs font-medium text-text-muted` |
| Alignment | `text-center` |
| **Links** | |
| Text color | `text-accent` |
| Hover | `hover:text-accent-dark` |
| Transition | `transition-colors` |
| Bottom link | `text-sm font-medium text-accent hover:text-accent-dark` |
| Bottom margin | `mt-6` |

**Pattern notes:**
- Login card uses minimal spacing (px-6 py-12) for centered layout
- OAuth buttons are full-width and use `bg-surface` with light border for secondary button style
- Error messages use error token colors (`bg-error-light`, `border-error`, `text-error-foreground`)
- All text colors use design tokens (text-text-slate, text-text-secondary, text-text-muted, text-text-dark)
- No hardcoded hex values — all colors come from Tailwind design system
- Loading state uses `disabled:opacity-50` + `disabled:cursor-not-allowed`
- Divider uses light border (`border-border-light`) to distinguish from card border
- Link hover states follow accent color pattern used across app

---

## Patterns & Conventions

### Landing Page Layout
- All sections: `border-x border-b border-border` for consistent grid layout
- Full-width container with max-w applied inside Next.js layout
- Pastel sections use custom `landing-pastel` class (gradient background)
- CTA buttons: Dark (overlay bg) for primary, bordered for secondary

### Typography Patterns
- Large headlines: 38px-54px, font-bold, leading 1.05-1.08
- Section titles: 35px, font-bold
- Quotes/testimonials: 26px, font-semibold
- Body text: 14px, font-medium
- Labels: 12px, font-semibold, uppercase, text-accent
- Muted text: 12px, font-normal, text-text-muted

### Responsive Patterns
- Mobile-first: sm: breakpoint for tablet+, md: for desktop
- Navigation: Always show logo/button, hide nav items until md breakpoint
- Text sizing: Step up at sm: and md: breakpoints
- Grid: Switch from 1-col to 2-col at md: breakpoint
- Padding: Increase from px-6 (mobile) → sm:px-12/px-14 → md:px-16

### Custom Classes
- `landing-pastel` — gradients for hero/CTA sections
- `landing-section-grid` — grid section class
- `landing-preview-shadow` — shadow effect on dashboard preview image
- `landing-divider` — divider styling for footer

---

### Profile Page Components

#### AppNavbar
File: [components/layout/AppNavbar.tsx](../components/layout/AppNavbar.tsx)
Last updated: 2026-08-16

| Property         | Class                                      |
| ---------------- | ------------------------------------------ |
| Background       | `bg-surface`                               |
| Border           | `border-b border-border-light`             |
| Border radius    | none                                       |
| Text — active    | `text-accent`                              |
| Text — inactive  | `text-text-dark`                           |
| Spacing          | `h-16 px-6`                               |
| Hover state      | `hover:text-accent`                        |
| Shadow           | none                                       |
| Accent usage     | `text-accent` on the active nav item       |

**Pattern notes:**
- Active state is colour-only (`text-accent`) — no underline, no background change
- Nav icons are lucide-react at size 15, strokeWidth 2, displayed inline with label
- Same header shell as LandingNavbar (`border-b border-border-light bg-surface h-16 max-w-[1128px] mx-auto px-6`) — keep these identical
- Nav items use `gap-8` between links; each link is `flex items-center gap-1.5`

---

#### ProfileBanner
File: [components/profile/ProfileBanner.tsx](../components/profile/ProfileBanner.tsx)
Last updated: 2026-08-16

| Property         | Class                                                         |
| ---------------- | ------------------------------------------------------------- |
| Background       | `bg-surface`                                                  |
| Border           | `border border-border`                                        |
| Border radius    | `rounded-2xl`                                                 |
| Text — primary   | `text-base font-semibold text-text-primary`                   |
| Text — secondary | `text-sm font-medium text-text-secondary`                     |
| Spacing          | `p-6`                                                         |
| Hover state      | none                                                          |
| Shadow           | `shadow-sm`                                                   |
| Accent usage     | `bg-accent-light text-accent` on missing-field badges         |

**Pattern notes:**
- Card layout: `flex items-center justify-between gap-6` — text left, ring right
- SVG ring: 96×96px, radius 36, strokeWidth 8, track uses `var(--color-border)`, fill uses `var(--color-error)`, `strokeLinecap="round"`, `rotate-90` transform
- Percent label: `text-base font-semibold text-text-primary` positioned `absolute` in SVG centre
- Missing field badges: `px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-accent-light text-accent`
- Warning icon: AlertCircle from lucide-react, size 16, `text-error`
- Returns `<></>` (nothing) when `completionPercent === 100`

---

#### ResumeSection
File: [components/profile/ResumeSection.tsx](../components/profile/ResumeSection.tsx)
Last updated: 2026-08-16

| Property         | Class                                                              |
| ---------------- | ------------------------------------------------------------------ |
| Background       | `bg-surface`                                                       |
| Border           | `border border-border`                                             |
| Border radius    | `rounded-2xl`                                                      |
| Text — primary   | `text-base font-semibold text-text-primary`                        |
| Text — secondary | `text-sm font-medium text-text-secondary`                          |
| Spacing          | `p-6`                                                              |
| Hover state      | Drop zone: `hover:border-accent hover:bg-accent-muted`             |
| Shadow           | `shadow-sm`                                                        |
| Accent usage     | `border-accent bg-accent-muted` on drag-active drop zone; `bg-accent` on generate button |

**Pattern notes:**
- Drop zone: `border-2 border-dashed rounded-xl py-10 px-6 cursor-pointer transition-colors`
  - Idle: `border-border bg-surface-secondary`
  - Drag active: `border-accent bg-accent-muted`
  - Click targets `inputRef.current?.click()` — hidden `<input type="file" accept="application/pdf">`
- Upload icon: CloudUpload from lucide-react, size 32, strokeWidth 1.5, `text-accent`
- Selected state shows FileText icon + filename + size
- Select Resume button: **secondary** — `px-4 py-2 rounded-md border border-border bg-surface text-sm font-medium text-text-primary hover:bg-surface-secondary`
- Generate Resume button: **primary** — `flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-dark`
- Divider between select and generate rows: `border-t border-border-light pt-5 mt-5`
- Generate row: `flex items-center justify-between` — description text left, button right

---

#### ProfileForm
File: [components/profile/ProfileForm.tsx](../components/profile/ProfileForm.tsx)
Last updated: 2026-08-16

| Property         | Class                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| Background       | `bg-surface`                                                                 |
| Border           | `border border-border`                                                       |
| Border radius    | `rounded-2xl`                                                                |
| Text — primary   | `text-text-primary`                                                          |
| Text — secondary | `text-text-secondary`                                                        |
| Spacing          | Header `px-8 pt-8 pb-6`, body `px-8 py-8`, footer `px-8 py-6`              |
| Hover state      | Inputs: `focus:ring-1 focus:ring-accent focus:border-accent`                 |
| Shadow           | `shadow-sm`                                                                  |
| Accent usage     | Focus rings (`focus:ring-accent`), Save button (`bg-accent`), Add role link (`text-accent`) |

**Pattern notes:**
- Card: `bg-surface border border-border rounded-2xl shadow-sm overflow-hidden` — `overflow-hidden` required so the footer border aligns flush
- Header: `px-8 pt-8 pb-6 border-b border-border-light` — title `text-base font-semibold text-text-primary`, description `text-sm font-medium text-text-secondary mt-1`
- Body: `px-8 py-8 space-y-12` — sections separated by `space-y-12`
- Section headings: `text-base font-semibold text-text-primary mb-5`
- Field labels: `text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5` (component renders as `<Label>`)
- Input/Textarea/Select base: `w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors`
- Select adds: `appearance-none pr-8` + absolute `ChevronDown` icon (lucide, size 14, `text-text-muted`) at `right-3`
- Textarea adds: `resize-none`; disabled input adds: `bg-surface-secondary text-text-muted`
- Tag chips: `flex items-center gap-1 px-3 py-1 rounded-full bg-surface-tertiary border border-border text-xs font-medium text-text-dark` + `X` icon (lucide, size 11, strokeWidth 2.5)
- Tag input row: flex with `flex-1` input + `Add` secondary button (`px-4 py-2 rounded-md bg-surface border border-border text-sm font-medium text-text-primary hover:bg-surface-secondary`)
- Two-column field grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Work role card: `border border-border rounded-xl p-5 space-y-4`
- Add role link: `flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark` with `Plus` icon (size 14, strokeWidth 2.5)
- Footer: `px-8 py-6 border-t border-border-light`
- Save button: `w-full rounded-md bg-accent py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-dark transition-colors`
- Wired to `saveProfile` Server Action in `actions/profile.ts` with saving state (`Loader2` spinner) and success/error alert feedback banner

---

#### Profile Page Layout
File: [app/(protected)/profile/page.tsx](../app/(protected)/profile/page.tsx)
Last updated: 2026-08-16

| Property         | Class                               |
| ---------------- | ----------------------------------- |
| Background       | `bg-background`                     |
| Border           | none (page level)                   |
| Border radius    | none (page level)                   |
| Text — primary   | inherited from cards                |
| Text — secondary | inherited from cards                |
| Spacing          | `py-8 px-6`                         |
| Hover state      | none (page level)                   |
| Shadow           | none (page level)                   |
| Accent usage     | inherited from cards                |

**Pattern notes:**
- Page container: `min-h-screen bg-background`
- Content width: `max-w-[1128px] mx-auto px-6 py-8` — same outer bound as all pages
- Column width: `max-w-[720px] mx-auto` — single centred column for profile content
- Card stack: `space-y-6` between ProfileBanner, ResumeSection, ProfileForm
- AppNavbar sits above `<main>` — not inside the content column
- Async Server Component fetching `profiles` row via `createInsforgeServer()` and computing profile completion via `calculateProfileCompletion` in `lib/profile-utils.ts`

---

#### ProfileContainer
File: [components/profile/ProfileContainer.tsx](../components/profile/ProfileContainer.tsx)
Last updated: 2026-08-16

| Property         | Class                               |
| ---------------- | ----------------------------------- |
| Layout           | `max-w-[720px] mx-auto space-y-6`   |
| State management | Connects `ResumeSection` AI extraction callback to `ProfileForm` `extractedData` prop |

---

#### ResumePDF
File: [components/pdf/ResumePDF.tsx](../components/pdf/ResumePDF.tsx)
Last updated: 2026-08-16

| Property         | Class / Style                       |
| ---------------- | ----------------------------------- |
| Framework        | `@react-pdf/renderer`               |
| Font             | Helvetica, 10pt body, 22pt title    |
| Padding          | 32pt                                |
| Accent           | `#7C5CFC` for title, header, skills |




