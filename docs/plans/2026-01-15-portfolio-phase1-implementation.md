# Portfolio Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the test portfolio into a professional online CV with work experience timeline and education cards.

**Architecture:** Complete redesign of the home page with fixed header (domain + socials + theme toggle), vertical timeline for work experience, responsive grid cards for education, and minimal footer. Content managed via Astro content collections with Markdown files.

**Tech Stack:** Astro 5, Preact, CSS Variables for theming, Astro Content Collections

---

## Task 1: Setup CSS Variables Theme System

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Replace global.css with new theme system**

Replace entire contents of `src/styles/global.css` with:

```css
:root {
  --bg-primary: #fafafa;
  --bg-secondary: #f5f5f5;
  --text-primary: #171717;
  --text-secondary: #525252;
  --border: #e5e5e5;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:root.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --text-primary: #e5e5e5;
  --text-secondary: #737373;
  --border: #262626;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
  transition: background-color 0.2s, color 0.2s;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

a {
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.7;
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: setup CSS variables theme system"
```

---

## Task 2: Add Work and Education Content Collections

**Files:**
- Modify: `src/content/config.ts`
- Create: `src/content/work/.gitkeep`
- Create: `src/content/education/.gitkeep`

**Step 1: Update content config with work and education schemas**

Replace entire contents of `src/content/config.ts` with:

```typescript
import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }),
    tags: z.array(z.string())
  })
});

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/work" }),
  schema: z.object({
    position: z.string(),
    company: z.string(),
    companyUrl: z.string().url(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    order: z.number().optional()
  })
});

const education = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/education" }),
  schema: z.object({
    title: z.string(),
    institution: z.string(),
    institutionUrl: z.string().url(),
    startYear: z.number(),
    endYear: z.number().nullable(),
    order: z.number().optional()
  })
});

export const collections = { blog, work, education };
```

**Step 2: Create content directories**

Run:
```bash
mkdir -p src/content/work src/content/education
touch src/content/work/.gitkeep src/content/education/.gitkeep
```

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully (content synced)

**Step 4: Commit**

```bash
git add src/content/config.ts src/content/work/.gitkeep src/content/education/.gitkeep
git commit -m "feat: add work and education content collections"
```

---

## Task 3: Redesign Header Component

**Files:**
- Modify: `src/components/Header.astro`
- Delete: `src/components/Navigation.astro` (no longer needed)
- Delete: `src/components/Hamburger.astro` (no longer needed)
- Modify: `src/components/Social.astro`

**Step 1: Update Social component for icon-only display**

Replace entire contents of `src/components/Social.astro` with:

```astro
---
export interface Props {
  platform: 'github' | 'x' | 'linkedin';
}

const { platform } = Astro.props;

const platformConfig = {
  github: {
    url: 'https://github.com/youssefmzouri',
    label: 'GitHub',
    icon: `<path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>`
  },
  x: {
    url: 'https://x.com/youssefmcd',
    label: 'X',
    icon: `<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`
  },
  linkedin: {
    url: 'https://linkedin.com/in/youssefmcd',
    label: 'LinkedIn',
    icon: `<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`
  }
};

const config = platformConfig[platform];
---

<a href={config.url} target="_blank" rel="noopener noreferrer" aria-label={config.label} class="social-icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" set:html={config.icon} />
</a>

<style>
  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: color 0.2s;
  }

  .social-icon:hover {
    color: var(--text-primary);
    opacity: 1;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 640px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
</style>
```

**Step 2: Replace Header component**

Replace entire contents of `src/components/Header.astro` with:

```astro
---
import Social from './Social.astro';
import ThemeIcon from './ThemeIcon.astro';
---

<header>
  <div class="header-content">
    <a href="/" class="domain">youssefmzouri.dev</a>
    <div class="header-right">
      <nav class="social-links">
        <Social platform="linkedin" />
        <Social platform="x" />
        <Social platform="github" />
      </nav>
      <ThemeIcon />
    </div>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    height: 60px;
  }

  :global(:root:not(.dark)) header {
    background-color: rgba(250, 250, 250, 0.8);
  }

  .header-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .domain {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  @media (max-width: 640px) {
    header {
      height: 50px;
    }

    .header-right {
      gap: 12px;
    }

    .social-links {
      gap: 12px;
    }

    .domain {
      font-size: 0.875rem;
    }
  }
</style>
```

**Step 3: Delete unused components**

Run:
```bash
rm src/components/Navigation.astro src/components/Hamburger.astro
```

**Step 4: Update ThemeIcon styling**

Replace entire contents of `src/components/ThemeIcon.astro` with:

```astro
---
---
<button id="themeToggle" aria-label="Toggle theme">
  <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
  <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</button>

<style>
  #themeToggle {
    border: 0;
    background: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  #themeToggle:hover {
    color: var(--text-primary);
  }

  .sun-icon {
    display: block;
  }

  .moon-icon {
    display: none;
  }

  :global(.dark) .sun-icon {
    display: none;
  }

  :global(.dark) .moon-icon {
    display: block;
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 640px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
</style>

<script is:inline>
  const theme = (() => {
    const localStorageTheme = localStorage?.getItem("theme") ?? '';
    if (['dark', 'light'].includes(localStorageTheme)) {
      return localStorageTheme;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }

  window.localStorage.setItem('theme', theme);

  const handleToggleClick = () => {
    const element = document.documentElement;
    element.classList.toggle("dark");
    const isDark = element.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  document.getElementById("themeToggle")?.addEventListener("click", handleToggleClick);
</script>
```

**Step 5: Update BaseLayout for fixed header spacing**

Replace entire contents of `src/layouts/BaseLayout.astro` with:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

export interface Props {
  pageTitle: string;
}

const { pageTitle } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  main {
    padding-top: 80px;
  }

  @media (max-width: 640px) {
    main {
      padding-top: 70px;
    }
  }
</style>
```

**Step 6: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: redesign header with fixed position, social icons and theme toggle"
```

---

## Task 4: Redesign Footer Component

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Replace Footer component**

Replace entire contents of `src/components/Footer.astro` with:

```astro
---
const currentYear = new Date().getFullYear();
---

<footer>
  <p>Youssef Mzouri · {currentYear}</p>
</footer>

<style>
  footer {
    padding: 24px 1rem;
    text-align: center;
    border-top: 1px solid var(--border);
  }

  p {
    font-size: 14px;
    color: var(--text-secondary);
  }
</style>
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully

**Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: redesign footer with centered name and year"
```

---

## Task 5: Create Timeline Components

**Files:**
- Create: `src/components/Timeline.astro`
- Create: `src/components/TimelineItem.astro`

**Step 1: Create TimelineItem component**

Create `src/components/TimelineItem.astro`:

```astro
---
export interface Props {
  position: string;
  company: string;
  companyUrl: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
}

const { position, company, companyUrl, startDate, endDate, description } = Astro.props;

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const dateRange = endDate
  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
  : `${formatDate(startDate)} - Present`;
---

<div class="timeline-item">
  <div class="timeline-marker"></div>
  <div class="timeline-content">
    <span class="dates">{dateRange}</span>
    <h3 class="position">{position}</h3>
    <a href={companyUrl} target="_blank" rel="noopener noreferrer" class="company">
      {company}
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
    <div class="description" set:html={description} />
  </div>
</div>

<style>
  .timeline-item {
    position: relative;
    padding-left: 32px;
    padding-bottom: 32px;
  }

  .timeline-item::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 8px;
    bottom: 0;
    width: 2px;
    background-color: var(--border);
  }

  .timeline-item:last-child::before {
    display: none;
  }

  .timeline-marker {
    position: absolute;
    left: 0;
    top: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-secondary);
  }

  .timeline-content {
    padding-left: 16px;
  }

  .dates {
    display: block;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .position {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }

  .company {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .company:hover {
    text-decoration: underline;
    opacity: 1;
  }

  .company svg {
    opacity: 0.7;
  }

  .description {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .description :global(ul) {
    margin-top: 8px;
    padding-left: 20px;
  }

  .description :global(li) {
    margin-bottom: 4px;
  }
</style>
```

**Step 2: Create Timeline component**

Create `src/components/Timeline.astro`:

```astro
---
import { getCollection } from 'astro:content';
import TimelineItem from './TimelineItem.astro';

const workEntries = await getCollection('work');

const sortedWork = workEntries.sort((a, b) => {
  return b.data.startDate.getTime() - a.data.startDate.getTime();
});
---

<section class="timeline-section">
  <h2>Experience</h2>
  <div class="timeline">
    {sortedWork.map(async (entry) => {
      const { Content } = await entry.render();
      const htmlContent = await entry.render().then(r => r.Content);
      return (
        <TimelineItem
          position={entry.data.position}
          company={entry.data.company}
          companyUrl={entry.data.companyUrl}
          startDate={entry.data.startDate}
          endDate={entry.data.endDate}
          description={entry.body || ''}
        />
      );
    })}
  </div>
</section>

<style>
  .timeline-section {
    margin-bottom: 48px;
  }

  h2 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .timeline {
    position: relative;
  }
</style>
```

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully

**Step 4: Commit**

```bash
git add src/components/Timeline.astro src/components/TimelineItem.astro
git commit -m "feat: create timeline components for work experience"
```

---

## Task 6: Create Education Card Component

**Files:**
- Create: `src/components/EducationCard.astro`
- Create: `src/components/EducationGrid.astro`

**Step 1: Create EducationCard component**

Create `src/components/EducationCard.astro`:

```astro
---
export interface Props {
  title: string;
  institution: string;
  institutionUrl: string;
  startYear: number;
  endYear: number | null;
  description?: string;
}

const { title, institution, institutionUrl, startYear, endYear, description } = Astro.props;

const yearRange = endYear
  ? startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`
  : `${startYear} - Present`;
---

<div class="education-card">
  <span class="years">{yearRange}</span>
  <h3 class="title">{title}</h3>
  <a href={institutionUrl} target="_blank" rel="noopener noreferrer" class="institution">
    {institution}
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  </a>
  {description && <p class="description">{description}</p>}
</div>

<style>
  .education-card {
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: var(--bg-secondary);
    transition: border-color 0.2s;
  }

  .education-card:hover {
    border-color: var(--text-secondary);
  }

  .years {
    display: block;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px 0;
  }

  .institution {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .institution:hover {
    text-decoration: underline;
    opacity: 1;
  }

  .institution svg {
    opacity: 0.7;
  }

  .description {
    margin-top: 12px;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
</style>
```

**Step 2: Create EducationGrid component**

Create `src/components/EducationGrid.astro`:

```astro
---
import { getCollection } from 'astro:content';
import EducationCard from './EducationCard.astro';

const educationEntries = await getCollection('education');

const sortedEducation = educationEntries.sort((a, b) => {
  const aYear = a.data.endYear || a.data.startYear;
  const bYear = b.data.endYear || b.data.startYear;
  return bYear - aYear;
});
---

<section class="education-section">
  <h2>Education</h2>
  <div class="education-grid">
    {sortedEducation.map((entry) => (
      <EducationCard
        title={entry.data.title}
        institution={entry.data.institution}
        institutionUrl={entry.data.institutionUrl}
        startYear={entry.data.startYear}
        endYear={entry.data.endYear}
        description={entry.body || undefined}
      />
    ))}
  </div>
</section>

<style>
  .education-section {
    margin-bottom: 48px;
  }

  h2 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .education-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 640px) {
    .education-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully

**Step 4: Commit**

```bash
git add src/components/EducationCard.astro src/components/EducationGrid.astro
git commit -m "feat: create education card and grid components"
```

---

## Task 7: Add Sample Content

**Files:**
- Create: `src/content/work/example-company.md`
- Create: `src/content/education/example-degree.md`
- Create: `src/content/education/example-certification.md`

**Step 1: Create sample work experience**

Create `src/content/work/example-company.md`:

```markdown
---
position: "Frontend Developer"
company: "Example Company"
companyUrl: "https://example.com"
startDate: 2022-03-01
endDate: null
order: 1
---

Developed and maintained web applications using modern frontend technologies.

- Built responsive user interfaces with React and TypeScript
- Implemented CI/CD pipelines for automated testing and deployment
- Collaborated with design team to improve user experience
```

**Step 2: Create sample education entry**

Create `src/content/education/example-degree.md`:

```markdown
---
title: "Bachelor's Degree in Computer Science"
institution: "Example University"
institutionUrl: "https://example.edu"
startYear: 2018
endYear: 2022
order: 1
---
```

**Step 3: Create sample certification**

Create `src/content/education/example-certification.md`:

```markdown
---
title: "AWS Solutions Architect"
institution: "Amazon Web Services"
institutionUrl: "https://aws.amazon.com"
startYear: 2023
endYear: 2023
order: 2
---

Cloud architecture design and deployment certification.
```

**Step 4: Remove .gitkeep files**

Run:
```bash
rm src/content/work/.gitkeep src/content/education/.gitkeep
```

**Step 5: Verify build passes**

Run: `npm run build`
Expected: Build completes with content synced

**Step 6: Commit**

```bash
git add src/content/work/ src/content/education/
git commit -m "feat: add sample work and education content"
```

---

## Task 8: Redesign Home Page

**Files:**
- Modify: `src/pages/index.astro`
- Delete: `src/components/Greeting.jsx` (no longer needed)

**Step 1: Update home page**

Replace entire contents of `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Timeline from '../components/Timeline.astro';
import EducationGrid from '../components/EducationGrid.astro';
---

<BaseLayout pageTitle="Youssef Mzouri - Portfolio">
  <Timeline />
  <EducationGrid />
</BaseLayout>
```

**Step 2: Delete unused Greeting component**

Run:
```bash
rm src/components/Greeting.jsx
```

**Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes successfully with home page generated

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: redesign home page with timeline and education grid"
```

---

## Task 9: Clean Up and Final Verification

**Step 1: Delete old menu script**

Run:
```bash
rm src/scripts/menu.js
```

**Step 2: Run final build**

Run: `npm run build`
Expected: Build completes successfully, all 14 pages generated

**Step 3: Run dev server and verify visually**

Run: `npm run dev`
Expected: Site runs at localhost:4321, verify:
- Fixed header with domain, social icons, theme toggle
- Work experience timeline displays correctly
- Education cards in 2-column grid
- Footer centered with name and year
- Theme toggle works
- Mobile responsive

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: clean up unused files"
```

---

## Summary

**Total tasks:** 9
**Files created:** 8
**Files modified:** 7
**Files deleted:** 5

**New structure:**
```
src/
├── content/
│   ├── config.ts (updated)
│   ├── work/
│   │   └── example-company.md
│   └── education/
│       ├── example-degree.md
│       └── example-certification.md
├── components/
│   ├── Header.astro (redesigned)
│   ├── Footer.astro (redesigned)
│   ├── Social.astro (redesigned)
│   ├── ThemeIcon.astro (updated)
│   ├── Timeline.astro (new)
│   ├── TimelineItem.astro (new)
│   ├── EducationCard.astro (new)
│   └── EducationGrid.astro (new)
├── layouts/
│   └── BaseLayout.astro (updated)
├── pages/
│   └── index.astro (redesigned)
└── styles/
    └── global.css (redesigned)
```
