create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  status text not null default 'draft',
  location_label text not null,
  radius_km integer not null default 5,
  candidate_limit integer not null default 18,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  display_name text not null,
  identity_type text not null default 'guest',
  is_online boolean not null default false,
  joined_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  external_source text not null,
  external_id text not null,
  name text not null,
  address text not null,
  rating numeric,
  review_count integer,
  price_level integer,
  categories text[] not null default '{}',
  open_now boolean,
  photo_url text,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(room_id, external_source, external_id)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  room_member_id uuid not null references public.room_members(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  vote_value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(room_id, room_member_id, restaurant_id)
);

alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.restaurants enable row level security;
alter table public.votes enable row level security;

create index if not exists idx_room_members_room_id on public.room_members(room_id);
create index if not exists idx_restaurants_room_id on public.restaurants(room_id);
create index if not exists idx_votes_room_id on public.votes(room_id);