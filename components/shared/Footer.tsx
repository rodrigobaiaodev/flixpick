import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookies" },
  { href: "/terms-of-service", label: "Terms of Service" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#07070b]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-slate-100">
            Flix<span className="text-[#e50914]">Pick</span>
            <span className="ml-2 text-sm font-normal text-slate-500">
              flixpick.app
            </span>
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#e50914]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          &copy; {year} flixpick.app. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
