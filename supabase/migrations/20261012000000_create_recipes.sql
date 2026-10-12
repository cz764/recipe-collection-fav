-- Recipe records and public recipe images.
-- Vocabulary enums mirror src/constants/recipe.ts; update both together.

create type public.cuisine_type as enum (
  'italian', 'chinese', 'latin-american', 'mexican', 'american', 'french',
  'japanese', 'korean', 'modern', 'fusion', 'unknown'
);

create type public.meal_type as enum (
  'breakfast', 'lunch', 'dinner', 'snack', 'dessert'
);

create type public.dish_type as enum (
  'appetizer', 'soup', 'bakery', 'entree', 'side dish', 'other'
);

create type public.recipe_tag as enum (
  'vegetarian', 'high-protein', 'bread', 'cake', 'pastry', 'muffin',
  'cookie', 'dough', 'one-pot'
);

create type public.recipe_language as enum ('en', 'ch');

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  -- Dashed name for a future /details/<slug> route.
  slug text not null unique,
  name text not null,
  description text not null,
  tags public.recipe_tag[] not null default '{}',
  source text not null,
  language public.recipe_language not null default 'en',
  total_time_minutes integer not null check (total_time_minutes > 0),
  yield_servings integer not null check (yield_servings > 0),
  equipments text[] not null default '{}',
  cuisine public.cuisine_type not null default 'unknown',
  meal public.meal_type not null,
  type public.dish_type[] not null check (cardinality(type) > 0),
  -- Array of { name: string, amount: number | string, unit?: string }.
  ingredients jsonb not null default '[]'::jsonb
    check (jsonb_typeof(ingredients) = 'array'),
  -- Object path inside the recipe-images bucket, or an absolute URL.
  picture_path text not null,
  prep text[] not null default '{}',
  -- Array of { detail: string, image_path?: string | null }.
  steps jsonb not null default '[]'::jsonb
    check (jsonb_typeof(steps) = 'array'),
  credit_to text,
  author_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- Anyone may read recipes. Writes happen through the dashboard or the
-- service-role seed script, which bypass row level security.
alter table public.recipes enable row level security;

create policy "Public can read recipes"
  on public.recipes for select
  to anon, authenticated
  using (true);

-- Public image bucket; objects are readable by anyone, written only by the
-- service role.
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

create policy "Public can read recipe images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'recipe-images');
