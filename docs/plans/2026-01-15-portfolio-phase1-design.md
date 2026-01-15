# Portfolio Phase 1 - Design Document

**Date:** 2026-01-15
**Status:** Approved
**Objective:** Transform the test portfolio into a mature, scalable online CV/portfolio

---

## Overview

Redesign the home page to showcase work experience and education in a clean, professional dark theme without hero section.

---

## Structure

```
src/
├── content/
│   ├── config.ts          # Schemas for work + education
│   ├── work/              # Work experience (Markdown)
│   │   └── company-x.md
│   └── education/         # Education & certifications (Markdown)
│       └── item-x.md
├── components/
│   ├── Header.astro       # Fixed header (redesigned)
│   ├── Footer.astro       # Simple footer (redesigned)
│   ├── Timeline.astro     # Timeline component
│   ├── TimelineItem.astro # Individual timeline item
│   └── EducationCard.astro # Education/certification card
├── layouts/
│   └── BaseLayout.astro   # Main layout
└── pages/
    └── index.astro        # Home page
```

---

## Header

**Layout:**
- Fixed position with high z-index
- Height: 60px desktop, 50px mobile
- Semi-transparent dark background with subtle blur (glassmorphism)

**Content:**
- Left: "youssefmzouri.dev" (text, no logo)
- Right: Social icons (LinkedIn, X, GitHub) + theme toggle
- Icon size: 24px desktop, 20px mobile
- Gap between icons: 16px desktop, 12px mobile

**Mobile:**
- Same layout but more compact
- Smaller icons

---

## Work Experience (Timeline)

**Layout:**
- Vertical timeline with line always on the left (2px, `#262626`)
- Circle marker (8px) for each experience
- Content always to the right of the line

**Item Structure:**
```
●───┬─────────────────────────────────┐
    │  Jan 2022 - Present             │  ← Dates (small, gray)
    │  Senior Frontend Developer      │  ← ROLE (bold, highlighted)
    │  Company Name ↗                 │  ← Company (link, new tab)
    │                                 │
    │  Brief description of the role  │
    │  and main responsibilities.     │
    │                                 │
    │  • Key achievement              │
    │  • Another relevant point       │
    └─────────────────────────────────┘
```

**Typography:**
- Dates: 14px, gray (`#737373`)
- Role: 18px, bold, light gray (`#e5e5e5`)
- Company: 16px, normal weight, hover underline

**Frontmatter Schema:**
```yaml
---
position: "Senior Frontend Developer"
company: "Company Name"
companyUrl: "https://company.com"
startDate: 2022-01-15
endDate: null  # null = "Present"
order: 1
---

Brief description of the role and responsibilities.

- Key achievement or technology
- Another relevant point
```

**Behavior:**
- Ordered by startDate descending (most recent first)
- Dates formatted in English: "Jan 2022 - Present"
- Subtle scroll animation (fade + slide)

---

## Education & Certifications (Cards)

**Layout:**
- Grid: 2 columns desktop, 1 column mobile
- Gap: 20px
- Auto height (not forced equal)

**Card Structure:**
```
┌────────────────────────────────┐  ┌────────────────────────────────┐
│  2018 - 2022                   │  │  2023                          │
│  Bachelor's Degree in CS       │  │  AWS Solutions Architect       │
│  University Name ↗             │  │  Amazon Web Services ↗         │
│                                │  │                                │
│                                │  │  Cloud architecture design     │
│                                │  │  and deployment certification. │
└────────────────────────────────┘  └────────────────────────────────┘
```

**Style:**
- Border: 1px `#262626`
- Padding: 20px
- Background: slightly lighter than body (`#111111`) or none
- Hover: border slightly more visible (`#333333`)

**Frontmatter Schema:**
```yaml
---
title: "AWS Solutions Architect"
institution: "Amazon Web Services"
institutionUrl: "https://aws.amazon.com"
startYear: 2018
endYear: 2022  # same year for single certifications
order: 1
---

Optional description for certifications or relevant details.
```

**Notes:**
- Generic `title` field (works for degree or certification)
- Generic `institution` field (university or certifying entity)
- Optional description in Markdown body
- Ordered by endYear descending

---

## Footer

**Layout:**
- Minimum height: 60px
- Content centered horizontally and vertically
- Top border (`#262626`) or wide margin separation

**Content:**
```
─────────────────────────────────────────────
              Youssef Mzouri · 2025
─────────────────────────────────────────────
```

**Details:**
- Name and year separated by `·` (middle dot)
- Year dynamically generated: `new Date().getFullYear()`
- Typography: 14px, gray (`#737373`)
- Vertical padding: 24px

---

## Theme System

**Behavior:**
- Dark mode as default
- Toggle in header (sun/moon icon)
- Preference saved in localStorage
- Respects system `prefers-color-scheme` on first visit

**Dark Mode Palette:**
- Background: `#0a0a0a`
- Primary text: `#e5e5e5`
- Secondary text: `#737373`
- Borders: `#262626`

**Light Mode Palette:**
- Background: `#fafafa`
- Primary text: `#171717`
- Secondary text: `#525252`
- Borders: `#e5e5e5`

**CSS Variables:**
```css
:root {
  --bg-primary: #fafafa;
  --text-primary: #171717;
  --text-secondary: #525252;
  --border: #e5e5e5;
}

:root.dark {
  --bg-primary: #0a0a0a;
  --text-primary: #e5e5e5;
  --text-secondary: #737373;
  --border: #262626;
}
```

**Transition:**
- Smooth color transitions: `transition: background-color 0.2s, color 0.2s`

**Icons:**
- Sun when in dark mode (indicates "switch to light")
- Moon when in light mode (indicates "switch to dark")
