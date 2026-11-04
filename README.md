# Area71 Launchpad71 Landing Page

Independent Launchpad71 website, adapted from the Area71 MPS landing-page design. MPS source and deployment remain unchanged.

## Pages
- `/` Launchpad71 overview, hero video placeholder, and four case-study placeholders.
- `/consultation/` free consultation request.
- `/thank-you/` confirmed lead thank-you page.

## Lead integration (required before launch)
The Cloudflare Pages Function at `/api/lead` requires two Launchpad-only environment secrets: `LAUNCHPAD_GOOGLE_APPS_SCRIPT_URL` and `LAUNCHPAD_LEAD_SHARED_SECRET`. The Google Apps Script endpoint must be configured and verified to write to the `Launchpad71 Leads` tab in the existing Area71 lead spreadsheet. Do **not** simply reuse the MPS webhook unchanged: it may route leads to the MPS tab. Failed or unconfigured submissions do not redirect to the thank-you page.

## Videos
Hero video and four case-study cards deliberately display placeholders until Launchpad-approved media is provided. No MPS promotional videos are used.

## Deployment
Connect this repository to a **new** Cloudflare Pages project; set its environment secrets separately. Do not modify the MPS Cloudflare Pages project.
