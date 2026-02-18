# Apps Script Setup (Ops + Growth)

## What this adds
- Leads saved/updated in **Leads_CRM**
- Funnel events saved in **Events**
- Round-robin agent assignment + instant email
- SLA reminder after configurable minutes
- Daily digest email

## Steps
1) Open your Apps Script project linked to the Google Sheet.
2) Replace your existing code with `Code.gs` from this folder.
3) Update `AGENT_EMAILS` with your real Gmail(s).
4) Create an `Events` sheet tab (or the script will create it automatically on first event).
5) Deploy as Web App:
   - Execute as: **Me**
   - Who has access: **Anyone**
6) Run once manually: `createTriggers_()` to enable SLA + digest.
