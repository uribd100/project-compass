-- מצפן בריאות — Supabase schema + Row Level Security
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
-- Every table is private to its owner via RLS (user_id = auth.uid()).

create extension if not exists "pgcrypto";

create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists cravings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists hydration (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists flares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists days (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  date date not null,
  data jsonb not null,
  primary key (user_id, date)
);

-- Enable RLS + owner-only policy on every table
do $$
declare t text;
begin
  foreach t in array array['profiles','workouts','cravings','sleep_logs','meals','hydration','metrics','flares','appointments','days']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "own rows" on %I;', t);
    execute format('create policy "own rows" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end$$;
