-- FlixPick: shared match challenges (run in Supabase SQL Editor)

create table if not exists matches (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text,
  backdrop_path text,
  mood text not null,
  platforms text[],
  media_type text default 'movie',
  share_count integer default 0,
  created_at timestamp with time zone default now()
);

alter table matches enable row level security;

drop policy if exists "Public can read matches" on matches;
create policy "Public can read matches"
  on matches for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert matches" on matches;
create policy "Public can insert matches"
  on matches for insert
  to anon, authenticated
  with check (true);

create index if not exists matches_code_idx on matches (code);
