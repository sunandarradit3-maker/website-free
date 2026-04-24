create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  description text not null,
  image_url text not null,
  status text not null default 'ready' check (status in ('ready','sold out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  channel text not null,
  phone text,
  telegram text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key,
  promo_title text not null default 'promo spesial minggu ini',
  promo_subtitle text not null default 'diskon dan penawaran eksklusif untuk pelanggan premium',
  promo_active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, promo_title, promo_subtitle, promo_active)
values (1, 'promo spesial minggu ini', 'penawaran eksklusif hanya untuk pelanggan DiTz Store', true)
on conflict (id) do nothing;

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default true
);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.order_events enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;

create policy "public read products" on public.products for select using (true);
create policy "public read settings" on public.site_settings for select using (true);

-- admin only via service role / route handlers
