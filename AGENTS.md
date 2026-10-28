# Deadlock Portal

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Caddy (static container server)

Do not introduce frameworks, runtime dependencies, or build tooling unless explicitly requested. Keep fonts, images, and icons self-hosted inside `assets/` with zero external CDN requests at runtime.

## Required Skill

For frontend work, read:

`.agents/skills/developing-vanilla-web-interfaces/SKILL.md`

Project rules in this file take precedence over generic skill guidance.

## Project Structure

- `index.html` → main portal landing page
- `404.html` → custom Caddy error page
- `css/variables.css` → design tokens
- `css/global.css` → local font declarations, reset, global styles, and utilities
- `css/components/` → reusable UI components
- `css/pages/` → page-specific styles (`home.css`, `404.css`)
- `js/main.js` → mobile navigation, dynamic year, and scroll reveal initialization
- `js/gallery.js` → accessible project preview dialog controller
- `assets/` → self-hosted logos, variable font, project screenshots, and team avatars
- `tests/` → static link validation (`check_site.py`) and browser regression checks (`check_interactions.cjs`)

## CSS Conventions

Use BEM:

- `.block`
- `.block__element`
- `.block--modifier`

Use `.is-*` for transient JavaScript state:

- `.is-open`
- `.is-visible`
- `.is-motion-ready`
- `.is-scroll-locked`

Prefer variables from `css/variables.css` instead of hard-coded design values.

Do not duplicate component styles inside page stylesheets, and avoid deep descendant selectors or `!important` outside `prefers-reduced-motion` safeguards.

## Components

Before creating a component:

1. Check whether an equivalent already exists.
2. Reuse existing tokens and patterns.
3. Put reusable styles in `css/components/`.
4. Keep page-specific section layout in `css/pages/`.

Existing reusable components include:

- `brand`
- `button` and `text-link`
- `site-header`
- `site-footer`
- `section-heading`
- `project-card`
- `member-card`
- `project-gallery`

Do not introduce custom elements or Web Components for static one-off markup unless cross-page markup reuse explicitly warrants it.

## Responsive Design

Follow existing desktop-first responsive conventions.

Current primary breakpoints:

- `1060px`
- `760px`
- `460px`
- `360px` (hero display heading safeguard only)

Do not add new breakpoints without a layout-specific reason.

## Content

User-facing content should be written in Brazilian Portuguese.

Code identifiers, filenames, branches, and commit messages must be in English.

## Git

Use single-line Conventional Commits in English.

Examples:

- `feat: add project preview gallery`
- `fix: restore trigger focus when closing gallery`
- `refactor: extract reusable project card styles`
- `chore: update agent skills`

Branch names:

- `feat/project-gallery`
- `fix/mobile-navigation`
- `refactor/bem-stylesheets`
- `chore/add-agent-skills`

Use lowercase English names with hyphen-separated words.

## Scope

Do not refactor unrelated code while implementing a task.

Preserve existing architecture and browser-native implementation unless the task explicitly requires otherwise.

## Before Finishing

Verify:

- desktop, tablet, and mobile behavior (`1440px`, `1060px`, `760px`, `460px`, `320px`)
- `python3 tests/check_site.py` and `node --check js/main.js` / `node --check js/gallery.js` succeed
- no browser console errors
- existing components and tokens were reused where appropriate
- no unnecessary dependency or external runtime asset was introduced
- accessibility and semantic HTML follow the installed frontend skill
