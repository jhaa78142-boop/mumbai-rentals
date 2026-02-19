/** CONFIG **/
const SHEET_LEADS = "Leads_CRM";   // must match your tab name exactly
const SHEET_EVENTS = "Events";     // create this tab for funnel events

// Notifications (FREE via Gmail)
const AGENT_EMAILS = [
  "youremail@gmail.com", // TODO: replace
  // "agent2@gmail.com",
];

const SLA_MINUTES = 20;   // reminder if still New after 20 minutes
const DIGEST_HOUR = 21;   // 9 PM
const DIGEST_MINUTE = 0;

const PROP_ASSIGNED_INDEX_KEY = "RR_AGENT_INDEX";

/** Response helpers **/
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Utils **/
function normalizePhone(p) {
  if (!p) return "";
  const digits = String(p).replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function computeScore(moveIn) {
  const v = (moveIn || "").toLowerCase();
  if (v.includes("immediate") || v.includes("7") || v.includes("15")) return "Hot";
  if (v.includes("30")) return "Warm";
  return "Cold";
}

function nextFollowUpDate(score) {
  const d = new Date();
  if (score === "Hot") return d; // Day 0
  if (score === "Warm") { d.setDate(d.getDate() + 1); return d; } // +1 day
  d.setDate(d.getDate() + 3); return d; // +3 days
}

function generateLeadId(n) {
  return `LD-${String(n).padStart(4, "0")}`;
}

function safe(v) {
  return v === null || v === undefined ? "" : String(v);
}

function fmtDate_(d) {
  try {
    return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  } catch (_) {
    return safe(d);
  }
}

/** Round-robin agent assignment **/
function getNextAgentEmail_() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(PROP_ASSIGNED_INDEX_KEY);
  const idx = raw ? parseInt(raw, 10) : 0;

  const email = AGENT_EMAILS[idx % AGENT_EMAILS.length];
  props.setProperty(PROP_ASSIGNED_INDEX_KEY, String((idx + 1) % AGENT_EMAILS.length));
  return email;
}

function sendLeadToAgent_(agentEmail, leadId, lead) {
  const phone = normalizePhone(lead.phone);
  const wa = `https://wa.me/91${phone}?text=${encodeURIComponent(
    `Hi ${lead.name}, got your request (Lead ${leadId}). Confirm: ${lead.area} ${lead.bhk}BHK, budget ${lead.budgetRange}, move-in ${lead.moveIn}, profile ${lead.profile}.`
  )}`;

  const subject = `New Lead Assigned: ${leadId} • ${lead.area} • ${lead.bhk}BHK • ${lead.budgetRange}`;
  const body =
    `Assigned Lead\n\n` +
    `Lead ID: ${leadId}\n` +
    `Created: ${fmtDate_(lead.createdAt || new Date())}\n` +
    `Name: ${safe(lead.name)}\n` +
    `Phone: ${phone}\n` +
    `Area: ${safe(lead.area)}\n` +
    (lead.locality ? `Locality: ${safe(lead.locality)}\n` : "") +
    `Budget: ${safe(lead.budgetRange)}\n` +
    `BHK: ${safe(lead.bhk)}\n` +
    `Furnishing: ${safe(lead.furnishing)}\n` +
    `Move-in: ${safe(lead.moveIn)}\n` +
    `Profile: ${safe(lead.profile)}\n` +
    `Notes: ${safe(lead.notes)}\n\n` +
    `Quick Actions:\n` +
    `Call: tel:+91${phone}\n` +
    `WhatsApp: ${wa}\n\n` +
    `Landing: ${safe(lead.landingUrl)}\n` +
    `Variant: ${safe(lead.abVariant)}\n`;

  MailApp.sendEmail(agentEmail, subject, body);
}

function ensureLeadColumns_(sheet, requiredCols) {
  const cur = sheet.getMaxColumns();
  if (cur < requiredCols) {
    sheet.insertColumnsAfter(cur, requiredCols - cur);
  }
}

/** Triggers (run once manually) **/
function createTriggers_() {
  ScriptApp.newTrigger("slaReminderSweep_").timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger("dailyDigest_")
    .timeBased()
    .atHour(DIGEST_HOUR)
    .nearMinute(DIGEST_MINUTE)
    .everyDays(1)
    .create();
}

/** Event logging **/
function ensureSheet_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function logEvent_(ss, ev) {
  const sh = ensureSheet_(ss, SHEET_EVENTS);
  if (sh.getLastRow() === 0) {
    sh.appendRow(["Timestamp", "Event", "LeadId", "Area", "Locality", "BHK", "BudgetRange", "Profile", "MoveIn", "Variant", "UTM Source", "UTM Medium", "UTM Campaign", "URL", "Device", "Payload"]);
  }
  sh.appendRow([
    new Date(),
    safe(ev.event),
    safe(ev.leadId),
    safe(ev.area),
    safe(ev.locality),
    safe(ev.bhk),
    safe(ev.budgetRange),
    safe(ev.profile),
    safe(ev.moveIn),
    safe(ev.abVariant),
    safe(ev.utm_source || (ev.utm && ev.utm.utm_source) || (ev.utm && ev.utm.source)),
    safe(ev.utm_medium || (ev.utm && ev.utm.utm_medium) || (ev.utm && ev.utm.medium)),
    safe(ev.utm_campaign || (ev.utm && ev.utm.utm_campaign) || (ev.utm && ev.utm.campaign)),
    safe(ev.url || ev.landingUrl),
    safe(ev.device),
    JSON.stringify(ev),
  ]);
}

/** Web **/
function doGet() {
  return jsonResponse({ ok: true, message: "Lead API running" });
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "";
    const body = raw ? JSON.parse(raw) : {};

    // Route events
    if (body && body.type === "event") {
      logEvent_(ss, body);
      return jsonResponse({ ok: true });
    }

    // Leads
    const sheet = ss.getSheetByName(SHEET_LEADS);
    if (!sheet) return jsonResponse({ ok: false, error: `Sheet not found: ${SHEET_LEADS}` });

    const name = (body.name || "").trim();
    const phone = normalizePhone(body.phone);
    const area = (body.area || "").trim();
    const locality = (body.locality || "").trim();
    const budgetRange = (body.budgetRange || "40–60k").trim();
    const bhk = (body.bhk || "").trim();
    const furnishing = (body.furnishing || "").trim();
    const moveIn = (body.moveIn || "").trim();
    const profile = (body.profile || "").trim();
    const notes = (body.notes || "").trim();
    const source = (body.source || "Website").trim();

    const abVariant = (body.abVariant || "").trim();
    const landingUrl = (body.landingUrl || body.url || "").trim();
    const device = (body.device || "").trim();

    // UTM can be nested or flattened
    const utm_source = (body.utm_source || (body.utm && (body.utm.utm_source || body.utm.source)) || "").trim();
    const utm_medium = (body.utm_medium || (body.utm && (body.utm.utm_medium || body.utm.medium)) || "").trim();
    const utm_campaign = (body.utm_campaign || (body.utm && (body.utm.utm_campaign || body.utm.campaign)) || "").trim();

    if (!name) return jsonResponse({ ok: false, error: "Name is required" });
    if (!phone || phone.length !== 10) return jsonResponse({ ok: false, error: "Valid 10-digit phone is required" });
    if (!area) return jsonResponse({ ok: false, error: "Area is required" });
    if (!bhk) return jsonResponse({ ok: false, error: "BHK is required" });
    if (!moveIn) return jsonResponse({ ok: false, error: "Move-in is required" });
    if (!profile) return jsonResponse({ ok: false, error: "Profile is required" });

    // Find existing by phone (Phone column is D = 4)
    const lastRow = sheet.getLastRow();
    let existingRow = null;
    if (lastRow >= 2) {
      const phones = sheet.getRange(2, 4, lastRow - 1, 1).getValues().flat();
      const idx = phones.findIndex(p => normalizePhone(p) === phone);
      if (idx >= 0) existingRow = idx + 2;
    }

    const createdAt = new Date();
    const score = computeScore(moveIn);
    const stage = "New";
    const nextFU = nextFollowUpDate(score);
    const msgDraft =
      `Hi ${name}, thanks for the enquiry. Confirm: ${area}${locality ? ` (${locality})` : ""} (E/W?), ${bhk}, move-in ${moveIn}, ${profile}. Furnishing: ${furnishing || "any"}?`;
    const needsWA = "Yes";

    // Columns (keep existing first 17):
    // 1 Lead ID, 2 Created At, 3 Name, 4 Phone, 5 Source, 6 Area, 7 Budget, 8 BHK, 9 Furnishing, 10 Move-in,
    // 11 Profile, 12 Score, 13 Stage, 14 Notes, 15 Next Follow-up, 16 Message Draft, 17 Needs WA,
    // 18 Assigned To, 19 AB Variant, 20 UTM Source, 21 UTM Medium, 22 UTM Campaign, 23 Landing URL, 24 Device
    // 25 Locality
    ensureLeadColumns_(sheet, 25);
    const rowValues = [
      "", createdAt, name, phone, source, area, budgetRange, bhk, furnishing,
      moveIn, profile, score, stage, notes, nextFU, msgDraft, needsWA,
      "", abVariant, utm_source, utm_medium, utm_campaign, landingUrl, device,
      locality
    ];

    // Lead obj for notifications
    const leadObj = { name, phone, area, locality, budgetRange, bhk, furnishing, moveIn, profile, notes, landingUrl, abVariant, createdAt };

    if (existingRow) {
      const leadIdExisting = sheet.getRange(existingRow, 1).getValue();
      const createdExisting = sheet.getRange(existingRow, 2).getValue();
      const assignedExisting = sheet.getRange(existingRow, 18).getValue();

      rowValues[0] = leadIdExisting || "";
      rowValues[1] = createdExisting || createdAt;
      rowValues[17] = assignedExisting || "";

      sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);

      // Notify agent only if not assigned yet
      const leadId = rowValues[0] || leadIdExisting || null;
      if (!rowValues[17]) {
        const agentEmail = getNextAgentEmail_();
        sheet.getRange(existingRow, 18).setValue(agentEmail);
        sendLeadToAgent_(agentEmail, leadId, leadObj);
      }

      return jsonResponse({ ok: true, updated: true, leadId });
    } else {
      sheet.appendRow(rowValues);
      const rowNumber = sheet.getLastRow();
      const leadId = generateLeadId(rowNumber - 1); // row2 => LD-0001
      sheet.getRange(rowNumber, 1).setValue(leadId);

      // Assign + notify
      const agentEmail = getNextAgentEmail_();
      sheet.getRange(rowNumber, 18).setValue(agentEmail);
      sendLeadToAgent_(agentEmail, leadId, leadObj);

      return jsonResponse({ ok: true, created: true, leadId });
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** SLA reminders **/
function slaReminderSweep_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 24).getValues();
  const now = new Date();

  data.forEach((r, i) => {
    const rowNum = i + 2;
    const leadId = r[0];
    const createdAt = r[1];
    const name = r[2];
    const phone = r[3];
    const source = r[4];
    const area = r[5];
    const budgetRange = r[6];
    const bhk = r[7];
    const moveIn = r[9];
    const profile = r[10];
    const stage = r[12];
    const assignedTo = r[17] || AGENT_EMAILS[0];

    if (!leadId || !createdAt) return;
    if (stage !== "New") return;

    const ageMin = (now.getTime() - new Date(createdAt).getTime()) / 60000;
    if (ageMin < SLA_MINUTES) return;

    MailApp.sendEmail(
      assignedTo,
      `SLA Reminder: Lead still NEW (${leadId})`,
      `Lead ${leadId} is still in stage NEW after ~${Math.floor(ageMin)} min.\n\n` +
      `Name: ${name}\nPhone: ${phone}\nArea: ${area}\nBudget: ${budgetRange}\nBHK: ${bhk}\nMove-in: ${moveIn}\nProfile: ${profile}\nSource: ${source}\n`
    );

    sheet.getRange(rowNum, 13).setValue("SLA Alerted"); // avoid repeated reminders
  });
}

function dailyDigest_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_LEADS);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, 24).getValues();
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let newToday = 0;
  let pending = 0;

  data.forEach(r => {
    const createdAt = r[1];
    const stage = r[12];
    if (createdAt && new Date(createdAt) >= dayStart) newToday++;
    if (stage === "New" || stage === "SLA Alerted") pending++;
  });

  const body =
    `Daily Digest (${Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd")})\n\n` +
    `New leads today: ${newToday}\n` +
    `Pending (New/SLA Alerted): ${pending}\n\n` +
    `Open the sheet to review and update stages.\n`;

  MailApp.sendEmail(AGENT_EMAILS[0], "Daily Leads Digest", body);
}
