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
