import type { ReactNode } from "react";

interface InstitutionalLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function InstitutionalLayout({
  title,
  subtitle,
  children,
}: InstitutionalLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 border-b border-white/10 pb-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-slate-100 sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg text-slate-400">{subtitle}</p>
        )}
      </header>
      <div className="prose-invert space-y-8 text-slate-300 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:text-slate-100 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-200 [&_a]:text-[#e50914] [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-2">
        {children}
      </div>
    </article>
  );
}
