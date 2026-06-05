import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse/movies", label: "Movies" },
  { href: "/browse/tv", label: "TV Shows" },
  { href: "/browse", label: "Browse" },
  { href: "/my-list", label: "My List" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-slate-100 transition-opacity hover:opacity-90 sm:text-3xl"
        >
          Flix<span className="text-[#e50914]">Pick</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-2 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-100 sm:px-3 sm:text-sm lg:px-4 lg:text-base"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
