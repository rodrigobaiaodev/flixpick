export function isMissingUserListsTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("user_lists") &&
    (lower.includes("could not find the table") ||
      lower.includes("does not exist") ||
      lower.includes("schema cache") ||
      lower.includes("pgrst205"))
  );
}

export const USER_LISTS_SETUP_SQL = `-- FlixPick: user watchlists
create table if not exists public.user_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content_id integer not null,
  content_type text not null check (content_type in ('movie', 'tv')),
  content_title text not null,
  poster_path text,
  backdrop_path text,
  rating numeric,
  status text not null check (status in ('want_to_watch', 'watching', 'watched', 'loved')),
  added_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, content_id, content_type)
);

alter table public.user_lists enable row level security;

drop policy if exists "Users can manage their own list" on public.user_lists;
create policy "Users can manage their own list"
  on public.user_lists
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists user_lists_user_id_idx on public.user_lists(user_id);
create index if not exists user_lists_status_idx on public.user_lists(user_id, status);
`;
