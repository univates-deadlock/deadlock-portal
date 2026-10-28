# Portal Interactions Implementation Plan

> **For agentic workers:** Implement inline with superpowers:executing-plans. Steps use checkbox syntax for tracking.

**Goal:** Add polished interaction feedback and an accessible project screenshot gallery, identify Mateus as DevOps, and push the verified changes to main.

**Architecture:** Preserve the existing static HTML/CSS/JavaScript portal. Enhance screenshot links with a native dialog while retaining direct image links when JavaScript is unavailable.

**Tech Stack:** HTML, CSS, browser JavaScript, optional Playwright browser validation, Docker/Caddy.

**Spec:** User requests in this session: richer interactions and hover states, Mateus also works in DevOps, English single-line Conventional Commits, push to main.

## Global Constraints

- Preserve the current visual identity, real project captures, and GitHub profile data.
- Add no runtime dependencies or backend.
- Support touch, keyboard focus, Escape, and reduced motion.
- Keep the portal container running at http://127.0.0.1:8081.

## Review Focus

- Native dialog must trap focus and return it to the originating screenshot link.
- Gallery must close with Escape, its close button, and an outside click.
- Modified clicks and JavaScript-disabled navigation must preserve the original image links.
- Hover motion must not get overridden by scroll reveal transforms or run on touch devices.
- Opening a gallery must not move the underlying page or introduce horizontal overflow.

## Implementation

- [x] Add and run browser regression checks to reproduce the missing gallery behavior.
- [x] Update Mateus's visible role and the team documentation to DevOps and backend.
- [x] Add native screenshot gallery markup, scoped styling, and progressive enhancement JavaScript.
- [x] Add coordinated image, card, button, and link feedback with keyboard and reduced-motion equivalents.
- [x] Rebuild the running container; verify static checks, desktop, mobile, gallery controls, focus restoration, and direct-link fallbacks.
- [x] Review the final changes and address material findings before the authorized commit and push to main.

## Verification record

- Static references, JavaScript syntax, Compose configuration, and whitespace checks passed.
- Chromium browser checks passed at 1440, 390, and 320 pixels, including reduced motion.
- Gallery checks covered keyboard and touch controls, focus trapping/restoration, scroll locking, outside click, Escape, modified clicks, and JavaScript-disabled links.
- Independent read-only review found no Critical, Important, or Minor issues.
- Existing typography and glow warnings were kept outside this refinement; no detector ignores were added.
- Validation used Chromium and touch emulation; physical mobile devices and other browser engines were not tested.

**Delivery:** One-line English Conventional Commit, followed by the user-authorized push to `origin/main`.
