# Ghana Living Wage Report 2025

Dynamic Next.js edition of the Ghana Living Wage landing page.

## What changed

- The existing blue visual design is preserved in React.
- Report requests are validated by a server route and saved to Supabase.
- The PDF is stored as an encrypted deployment asset rather than a public file.
- A five-minute signed URL is issued only after the lead record is accepted.

## Environment variables

Copy `.env.example` to `.env.local` and configure:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `DOWNLOAD_TOKEN_SECRET` (at least 32 characters)
- `REPORT_ENCRYPTION_KEY` (base64-encoded 32-byte key)

Never commit `.env.local` or disclose these values.

## Database

Apply `supabase/migrations/20261016010000_create_report_downloads.sql`. The table
allows anonymous inserts through RLS but grants no anonymous read, update, or
delete access.

## Report encryption

Run the encryption script with the same `REPORT_ENCRYPTION_KEY` configured in
the deployment:

```bash
npm run encrypt-report -- source.pdf private/ghana-living-wage-report-2025.pdf.enc
```

Commit only the encrypted `.enc` asset. Do not add the plain PDF to the public
repository.
