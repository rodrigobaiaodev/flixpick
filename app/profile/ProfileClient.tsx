"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  Heart,
  Play,
  Sparkles,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { ListDbSetupBanner } from "@/components/shared/ListDbSetupBanner";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  memberSince: string;
  stats: {
    moviesWatched: number;
    showsWatched: number;
    favorites: number;
    totalList: number;
    watching: number;
    wantToWatch: number;
  };
  favoriteGenres: string[];
  dbReady: boolean;
}

export function ProfileClient({
  email,
  displayName: initialName,
  avatarUrl,
  memberSince,
  stats,
  favoriteGenres,
  dbReady,
}: ProfileClientProps) {
  const [displayName, setDisplayName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function saveDisplayName() {
    if (!draftName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const { error: authError } = await createClient().auth.updateUser({
        data: { full_name: draftName.trim() },
      });
      if (authError) throw authError;
      setDisplayName(draftName.trim());
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update name");
    } finally {
      setSaving(false);
    }
  }

  const statCards = [
    {
      label: "Movies Watched",
      value: stats.moviesWatched,
      icon: Sparkles,
      color: "text-amber-400",
    },
    {
      label: "Shows Watched",
      value: stats.showsWatched,
      icon: Play,
      color: "text-sky-400",
    },
    {
      label: "Favorites",
      value: stats.favorites,
      icon: Heart,
      color: "text-rose-400",
    },
    {
      label: "Total Saved",
      value: stats.totalList,
      icon: Bookmark,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 px-4 py-14 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e50914]/15 via-transparent to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="mx-auto size-28 rounded-full border-4 border-white/10 object-cover shadow-2xl shadow-black/50 ring-4 ring-[#e50914]/20"
              />
            ) : (
              <span className="mx-auto flex size-28 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br from-[#e50914] to-[#9b0000] text-4xl font-bold text-white shadow-2xl shadow-[#e50914]/20">
                {initials}
              </span>
            )}
          </div>

          {editing ? (
            <div className="mx-auto max-w-sm space-y-3">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#12121a] px-4 py-3 text-center text-lg text-white focus:border-[#e50914]/50 focus:outline-none"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => void saveDisplayName()}
                  disabled={saving}
                  className="min-h-[44px] rounded-lg bg-[#e50914] px-5 text-sm font-semibold text-white hover:bg-[#f6121d] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setDraftName(displayName);
                    setError(null);
                  }}
                  className="min-h-[44px] rounded-lg border border-white/15 px-5 text-sm text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl">
                {displayName}
              </h1>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-2 inline-flex items-center gap-1 text-sm text-[#e50914] hover:underline"
              >
                <User className="size-3.5" />
                Edit display name
              </button>
            </>
          )}

          <p className="mt-2 text-slate-400">{email}</p>
          <p className="mt-1 text-sm text-slate-500">
            Watching since {memberSince}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/my-list"
              className="min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              My List ({stats.totalList})
            </Link>
            <Link
              href="/watching"
              className="min-h-[44px] rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
            >
              Watching ({stats.watching})
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {!dbReady && <ListDbSetupBanner className="mb-10" />}

        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#12121a] p-5 text-center transition hover:border-white/15"
            >
              <stat.icon
                className={cn("mx-auto mb-2 size-5", stat.color)}
                aria-hidden
              />
              <p className="font-[family-name:var(--font-display)] text-3xl text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        {dbReady && stats.wantToWatch > 0 && (
          <section className="mb-10 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
            <p className="text-sm text-sky-200">
              🔖 You have{" "}
              <span className="font-semibold">{stats.wantToWatch}</span> titles
              on your want-to-watch list.
            </p>
            <Link
              href="/my-list"
              className="mt-3 inline-block text-sm font-medium text-sky-300 hover:underline"
            >
              View want-to-watch →
            </Link>
          </section>
        )}

        {favoriteGenres.length > 0 ? (
          <section className="rounded-2xl border border-white/10 bg-[#12121a] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white">
              Favorite Genres
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Based on your watched and loved titles
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {favoriteGenres.map((genre) => (
                <li
                  key={genre}
                  className="rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-4 py-1.5 text-sm font-medium text-[#ff8a8a]"
                >
                  {genre}
                </li>
              ))}
            </ul>
          </section>
        ) : dbReady ? (
          <section className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-slate-400">
              Watch and rate more titles to unlock your genre profile.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-[#e50914] hover:underline"
            >
              Find something to watch →
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}
