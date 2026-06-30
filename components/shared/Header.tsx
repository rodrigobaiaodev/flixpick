"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/components/shared/AuthProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse/movies", label: "Movies" },
  { href: "/browse/tv", label: "TV Shows" },
  { href: "/browse", label: "Browse" },
] as const;

function getUserInitials(
  name: string | undefined,
  email: string | undefined,
): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return (email?.slice(0, 2) ?? "U").toUpperCase();
}

export function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "User";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = getUserInitials(
    user?.user_metadata?.full_name as string | undefined,
    user?.email,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 font-[family-name:var(--font-display)] text-2xl tracking-wide text-slate-100 transition-opacity hover:opacity-90 sm:text-3xl"
          onClick={() => setMobileOpen(false)}
        >
          Flix<span className="text-[#e50914]">Pick</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-4 py-2 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-2">
          {!loading && !user && (
            <Link
              href="/auth/login"
              className="hidden min-h-[44px] items-center justify-center rounded-lg bg-[#e50914] px-5 text-sm font-semibold text-white transition hover:bg-[#f6121d] sm:inline-flex"
            >
              Sign In
            </Link>
          )}

          {!loading && user && (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="btn-compact flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 transition hover:border-white/25 hover:bg-white/10"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#e50914] text-xs font-bold text-white">
                    {initials}
                  </span>
                )}
                <span className="max-w-[100px] truncate text-sm font-medium text-slate-200">
                  {displayName}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-slate-400 transition",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-white/15 bg-[#12121a] py-1 shadow-2xl shadow-black/50"
                >
                  <Link
                    href="/my-list"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    My List
                  </Link>
                  <Link
                    href="/watching"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Watching
                  </Link>
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-white/10" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleSignOut()}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="btn-compact inline-flex size-11 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:border-white/20 hover:bg-white/5 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <nav
        aria-label="Mobile navigation"
        className={cn(
          "overflow-hidden border-t border-white/10 bg-[#0a0a0f]/98 transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="flex flex-col px-4 py-3">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}

          {!loading && !user && (
            <li className="mt-2 border-t border-white/10 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center justify-center rounded-lg bg-[#e50914] px-3 text-base font-semibold text-white"
              >
                Sign In
              </Link>
            </li>
          )}

          {!loading && user && (
            <>
              <li className="mt-2 border-t border-white/10 pt-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt=""
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#e50914] text-xs font-bold text-white">
                      {initials}
                    </span>
                  )}
                  <span className="text-sm font-medium text-white">
                    {displayName}
                  </span>
                </div>
              </li>
              <li>
                <Link
                  href="/my-list"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-base text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  My List
                </Link>
              </li>
              <li>
                <Link
                  href="/watching"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-base text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Watching
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-base text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 text-base text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
