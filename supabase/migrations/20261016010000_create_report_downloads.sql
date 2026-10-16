create table if not exists public.report_downloads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  report_slug text not null default 'ghana-living-wage-report-2025',
  created_at timestamptz not null default now()
);

alter table public.report_downloads enable row level security;

revoke all on table public.report_downloads from anon, authenticated;
grant insert on table public.report_downloads to anon;

drop policy if exists "Allow anonymous report lead capture"
  on public.report_downloads;

create policy "Allow anonymous report lead capture"
  on public.report_downloads
  for insert
  to anon
  with check (
    char_length(full_name) between 2 and 120
    and char_length(email) between 5 and 254
    and report_slug = 'ghana-living-wage-report-2025'
  );

create index if not exists report_downloads_created_at_idx
  on public.report_downloads (created_at desc);

comment on table public.report_downloads is
  'Lead records created when a visitor requests the Ghana Living Wage Report.';
