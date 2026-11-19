# Floating consultation button — design

## Intent
A booking button should be on screen at every point of the scroll, on phones, tablets and desktop. Most visitors arrive from Meta ads on phones. On phones and tablets the header's "Book a Consultation" button is hidden inside the ☰ menu, so between the hero and the final section there is no visible way to book.

## Goals / non-goals
- Goal: one floating "Free consultation" button in the bottom-right corner on every screen size, linking to `/consultation/`.
- Non-goal: changing the rest of the mobile and tablet layout. That's a separate piece of work if wanted later.
- Anti-goal: the button must not cover form fields, the menu or other booking buttons, and must not feel like a chat widget or a pop-up ad.

## Approaches considered
1. **Sticky bottom bar** on phones and tablets. Most prominent, but costs a full-width strip of screen.
2. **Booking button in the sticky header**. Never covers content, but too small on a 375px phone next to the logo, theme toggle and menu.
3. **Floating corner button**: **chosen.** Compact and present on all screen sizes. Of the four mockups, the user picked **design 4: lime pill with pulse ring**.

## Design (decided by the user)
- A lime pill (`--lime #cbe86c`) with dark green text reading "Free consultation", followed by a round green (`--green #015a49`) badge holding a lime ↗ arrow. This matches the hero button.
- A soft lime ring that pulses around the pill.
- Bottom-right corner, on every screen size.

## Builder's calls (Claude's proposals, open to correction)
- **Position:** 16px from the right and bottom edges on phones, 24px on tablet and desktop. Respects the iPhone home-bar safe area (`env(safe-area-inset-bottom)`).
- **Size:** about 48px tall with a 44px+ tap target. Label 15px, semibold.
- **When it shows:**
  - Hidden while the hero's own booking buttons are on screen.
  - Hidden while the final consultation section or the footer is on screen, since those already have booking buttons.
  - Hidden while the mobile ☰ menu is open.
  - Visible everywhere else.
  - Fades and slides in and out over 200ms.
- **Pulse:** a gentle ring every ~3s. Turned off for people who choose reduced motion in their system settings.
- **Light and dark mode:** the lime pill reads well on both. On the light theme it gets a soft shadow so it lifts off white sections.
- **Stacking:** `z-index` 80, below the sticky header (90), so menus and the header always sit on top.
- **Tracking:** it's a plain `<a href="/consultation/">`, so the existing `Launchpad71ConsultationClick` Meta Pixel event fires with no new code.
- **Accessibility:** the link's accessible name is "Book a free Launchpad71 consultation". When hidden it's removed from keyboard focus (`visibility:hidden`).
- **Scope:** landing page (`index.html`, `style.css`, `script.js`) only. Not shown on `/consultation/` or `/thank-you/`.

## Verification
Push a branch, open the Cloudflare preview, and check:
- Widths 375, 768 and 1280.
- Light and dark themes.
- That the show/hide rules work at the hero, mid-page and the final section.
- That the button doesn't cover the cost calculator inputs.
