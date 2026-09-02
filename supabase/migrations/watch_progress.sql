-- FlixPick: episode tracking for "Currently Watching"
alter table public.user_lists add column if not exists watch_season integer;
alter table public.user_lists add column if not exists watch_episode integer;
