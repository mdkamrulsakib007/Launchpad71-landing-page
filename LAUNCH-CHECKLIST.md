# Launchpad71 — Cloudflare Pages & Google Sheets launch checklist

This is **separate from MPS**. Do not change the existing MPS Pages project or Apps Script.

## 1. Launchpad Google Apps Script (required for form leads)
1. Open https://script.google.com/ and create a **new standalone project**, named `Area71 Launchpad71 Leads`.
2. Paste the contents of `integrations/launchpad71-apps-script.gs` into `Code.gs`; save.
3. In **Project Settings > Script Properties**, add `LEAD_SHARED_SECRET` with a long unique random value. Keep it private.
4. Click **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**; authorize the spreadsheet permissions under the Area71 Google account. Copy the resulting `https://script.google.com/macros/s/.../exec` URL.
5. This webhook writes only to the existing spreadsheet tab **Launchpad71 Leads**; MPS data stays separate. If you update Apps Script later, publish a new deployment version.

## 2. Cloudflare Pages
1. Cloudflare dashboard > **Workers & Pages > Create > Pages > Connect to Git**.
2. Choose GitHub repository `mdkamrulsakib007/Launchpad71-landing-page` and branch `main`. Create a **new** Pages project (`launchpad71` if available).
3. Framework preset: **None**. Build command: **leave blank**. Build output directory: **/** (repository root); if the dashboard requires a directory, use `.`.
4. Under **Settings > Variables and Secrets**, create production Secrets:
   - `LAUNCHPAD_GOOGLE_APPS_SCRIPT_URL` = the full Apps Script web app `/exec` URL.
   - `LAUNCHPAD_LEAD_SHARED_SECRET` = the same private secret you set in Script Properties.
5. Redeploy the latest production deployment after setting variables.
6. **Verify** the actual Cloudflare Pages hostname. This repository currently uses `https://launchpad71.pages.dev/` for canonical and OG metadata; change those URLs if the project has a different hostname. Never assume project-name availability.

## 3. Smoke-test before launch
1. Check desktop/mobile: Home `/`, consultation `/consultation/`, and thank you `/thank-you/`.
2. Ensure the home page has the hero video **placeholder**, **four** Case Study placeholders, and **eight** Launchpad services.
3. Submit a real **authorized test lead** from `/consultation/`.
4. Check the exact corresponding row appears on **Launchpad71 Leads** and **not** MPS Website Leads.
5. Confirm that only successful saves redirect to `/thank-you/`.
6. Refresh the thank-you page and check there is **no duplicate lead**, and confirm pixel configuration with the media buyer before enabling any Lead conversion counting.
7. Verify the Meta Pixel is the correct pixel for Launchpad campaigns and that your thank-you-page custom conversion is scoped to **this site's hostname**.
8. Remove the authorized test row only if appropriate for your lead-management policy.

## Videos
Placeholders are intentional. When media is approved, replace the hero video's placeholder with a Launchpad71 video and populate the four case-study YouTube cards. Do not use the MPS introduction video.

## Troubleshooting
- **Form says not configured**: missing Cloudflare production Secrets or redeploy.
- **Unable to save**: confirm Apps Script deployment URL, permissions, shared secret, and tab name; inspect Cloudflare Functions logs and Apps Script executions.
- **Thank-you redirects back to form when opened directly**: intended behavior; the page requires a successful submission marker.
- **404 on /api/lead**: deploy as Cloudflare Pages with the `functions/` directory; generic local static preview does not execute Pages Functions.
