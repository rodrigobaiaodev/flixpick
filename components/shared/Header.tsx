"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse/movies", label: "Movies" },
  { href: "/browse/tv", label: "TV Shows" },
  { href: "/browse", label: "Browse" },
  { href: "/my-list", label: "My List" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-slate-100 transition-opacity hover:opacity-90 sm:text-3xl"
          onClick={() => setMobileOpen(false)}
        >
          Flix<span className="text-[#e50914]">Pick</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden lg:block">
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

      {/* Mobile menu panel */}
      <nav
        aria-label="Mobile navigation"
        className={cn(
          "overflow-hidden border-t border-white/10 bg-[#0a0a0f]/98 transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
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
        </ul>
      </nav>
    </header>
  );
}
