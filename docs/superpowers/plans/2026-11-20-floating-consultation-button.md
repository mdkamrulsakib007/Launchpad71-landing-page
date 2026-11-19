# Floating Consultation Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating lime "Free consultation" pill (design 4) to the bottom-right corner of the landing page on every screen size.

**Architecture:** The markup is one `<a>` at the end of `index.html`'s `<body>`, the styling is one CSS block appended to `style.css`, and the show/hide logic is one IIFE appended to `script.js`. The IIFE uses an `IntersectionObserver` that toggles an `is-visible` class.

**Tech Stack:** Static HTML/CSS/vanilla JS on Cloudflare Pages. There is no build step and no test framework, so verification is done in the browser on the Cloudflare preview deploy.

**Spec:** `docs/superpowers/specs/2026-11-20-floating-consultation-button-design.md`

## Global Constraints
- Link `href="/consultation/"` exactly. The existing tracker selects `a[href="/consultation/"]`.
- Colours: pill `#cbe86c` (`--lime`), text `#0e2a22`, badge `#015a49` (`--green`), arrow `#cbe86c`.
- Label text "Free consultation". Accessible name "Free consultation with Launchpad71".
- Offset 16px on screens under 768px and 24px from 768px up, plus `env(safe-area-inset-bottom)`.
- `z-index: 80`, which is below `.nav` (90).
- Pulse runs every ~3s and is disabled under `prefers-reduced-motion: reduce`.
- Landing page only.

## Review Focus
- **Hero partly visible on a tall desktop viewport.** The button stays hidden until the hero's lime CTA has fully left the viewport.
- **The ☰ menu opened while the button is visible.** The button hides at once and comes back when the menu closes.
- **Cost calculator inputs near the bottom of a 375px screen.** The button must not sit over the input the user is typing in. Accept it if the input can still be scrolled clear. Check this on the preview.
- **Jumping straight to `#faq` or another anchor link.** The button is visible on arrival, not only after a scroll event.
- **Hidden state and keyboard users.** Tabbing never focuses the button while it is hidden.

---

### Task 1: Button markup and styles

**Files:**
- Modify: `index.html`. Insert just before `<script src="script.js"></script>` (line ~796).
- Modify: `style.css`. Append a new block at the end of the file.

**Interfaces:**
- Produces: `<a class="a71-float-cta" id="a71-float-cta" href="/consultation/" aria-label="Book a free Launchpad71 consultation">` containing `<span class="a71-float-cta-label">Free consultation</span><span class="a71-float-cta-icon" aria-hidden="true">↗</span>`. Visible only when it has the class `is-visible`.

- [ ] **Step 1:** Add the markup above.
- [ ] **Step 2:** Add CSS:
  - `position:fixed`, `right`/`bottom` per Global Constraints, `min-height:48px`, pill radius, label 15px/600.
  - Hidden by default: `opacity:0; transform:translateY(12px); visibility:hidden; pointer-events:none`.
  - `.is-visible` reverses all four, with a 200ms transition.
  - Pulse via a `::before` ring (`rgba(203,232,108,.45)`) animated with `@keyframes a71-float-pulse` (scale 1→1.25, fade out, 3s infinite).
  - Light-theme `box-shadow: 0 10px 28px rgba(1,90,73,.28)`.
  - `:root[data-theme="dark"]` sets `box-shadow:none`.
  - The reduced-motion query sets `animation:none` and `transition:none`.
- [ ] **Step 3: Verify.** Temporarily add `is-visible` in DevTools. At 375px and 1280px it renders as in mockup 4, in both themes.
- [ ] **Step 4: Commit.** Message: `Add floating consultation pill markup and styles`.

### Task 2: Show/hide behaviour

**Files:**
- Modify: `script.js`. Append a new IIFE at the end of the file.

**Interfaces:**
- Consumes: `#a71-float-cta` from Task 1, `.hero-actions`, `.final-cta`, `#area71-footer`, and `#mobile-menu` (open when it has the class `open`).

- [ ] **Step 1:** Implement the IIFE.
  - Track a `Set` of "blocking" elements (`.hero-actions`, `.final-cta`, `#area71-footer`) that are intersecting, using `IntersectionObserver` with `threshold: 0`.
  - Use a `MutationObserver` on `#mobile-menu` `class` to track `menuOpen`.
  - Apply `button.classList.toggle('is-visible', blocking.size === 0 && !menuOpen)`.
  - If `IntersectionObserver` is missing, add `is-visible` permanently.
- [ ] **Step 2: Verify on the preview at 375, 768 and 1280.**
  - Hidden on first load at the hero.
  - Appears after scrolling past the hero buttons.
  - Hidden at the final section and the footer.
  - Hides when the ☰ menu opens.
  - Visible right after `/#faq` loads.
  - Tab order skips it while hidden.
  - Clicking it opens `/consultation/` and fires `Launchpad71ConsultationClick`. Check with `fbq` in the console or the network request to `facebook.com/tr`.
- [ ] **Step 3: Commit.** Message: `Show floating consultation pill outside hero, final section and footer`.
