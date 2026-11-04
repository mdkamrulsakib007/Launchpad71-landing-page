/**
 * Area71 Launchpad71 — standalone Google Apps Script webhook.
 *
 * Deploy as a Web App: Execute as Me, access Anyone.
 * In Apps Script -> Project Settings -> Script properties:
 * LEAD_SHARED_SECRET = <a long random secret>
 *
 * Set the SAME value as Cloudflare's LAUNCHPAD_LEAD_SHARED_SECRET.
 * Do not paste credentials into this public repository.
 */
const SPREADSHEET_ID = "1WKYiv1fTSeVP0RvrO1f8AN3KJC2dLU7IHiU6jOlvsVQ";
const SHEET_NAME = "Launchpad71 Leads";
const COLUMNS = 13;

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeText_(value) {
  const str = String(value == null ? "" : value).trim();
  // Avoid spreadsheet formula injection if visitor-controlled text begins with =,+,-,@.
  return /^[=+\-@]/.test(str) ? "'" + str : str;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.parameter) return respond_({success:false});
    const p = e.parameter;
    const secret = PropertiesService.getScriptProperties().getProperty("LEAD_SHARED_SECRET");
    if (!secret || p.token !== secret) return respond_({success:false});
    if (p.program !== "Launchpad71") return respond_({success:false});

    const id = String(p.submissionId || "").trim();
    if (!/^[a-zA-Z0-9_-]{8,90}$/.test(id)) return respond_({success:false});
    if (!p.fullName || !p.email || !p.phone || p.consent !== "true") {
      return respond_({success:false});
    }
    if (!lock.tryLock(20000)) return respond_({success:false});
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return respond_({success:false});

    // Retry-safe: the web client intentionally reuses the same submissionId.
    const last = sheet.getLastRow();
    if (last >= 2) {
      const existing = sheet.getRange(2, 2, last - 1, 1)
        .createTextFinder(id).matchEntireCell(true).findNext();
      if (existing) return respond_({success:true,duplicate:true});
    }

    const row = [
      new Date(), id, safeText_(p.fullName), safeText_(p.phone),
      safeText_(p.email), safeText_(p.interest), safeText_(p.message),
      "Area71 Launchpad71 landing page", p.consent === "true" ? "Yes" : "No",
      safeText_(p.phoneCountryCode), safeText_(p.residenceCountry),
      safeText_(p.preferredCallTime), safeText_(p.profession)
    ];
    if (row.length !== COLUMNS) throw new Error("Column mismatch");
    sheet.appendRow(row);
    return respond_({success:true});
  } catch (err) {
    console.error("Launchpad71 lead error", err);
    return respond_({success:false});
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}
