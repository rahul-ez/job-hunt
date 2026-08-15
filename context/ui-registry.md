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
