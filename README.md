# Mumbai Rentals Landing (React + TS + Vite + Tailwind)

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

### Lead API
Set `VITE_LEAD_API_URL` in `.env`.

The form posts JSON as plain text:
- Method: POST
- Header: `Content-Type: text/plain;charset=utf-8`
- Body: JSON string with the lead payload

Expected API response (recommended):
- Success: `{ "leadId": "LEAD-12345" }` (or `{ "id": "..." }`)
- Error: `{ "message": "..." }`


## Ops + Growth (Apps Script)
This project can log:
- Leads -> `Leads_CRM` sheet
- Funnel events -> `Events` sheet (A/B hero + form/chat/whatsapp events)

See `apps-script/README.md` and `apps-script/Code.gs` for the full backend (FREE) setup:
- Round-robin agent assignment
- Instant email to assigned agent
- SLA reminder + daily digest triggers

### A/B Hero
Variant is assigned once per visitor and stored in localStorage. It is included in:
- all event logs
- lead payload (`abVariant`)

