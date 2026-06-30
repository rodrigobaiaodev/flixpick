"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center overflow-hidden rounded-full border border-white/15 bg-[#12121a] transition-all duration-300 ease-out",
          open
            ? "w-[min(72vw,16rem)] opacity-100 sm:w-64"
            : "pointer-events-none w-0 border-transparent opacity-0",
        )}
      >
        <Search className="ml-3 size-4 shrink-0 text-slate-500" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          aria-label="Search movies and TV shows"
          className="min-w-0 flex-1 bg-transparent py-2 pl-2 pr-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mr-2 flex size-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-white"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </form>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "btn-compact inline-flex size-11 items-center justify-center rounded-lg border transition",
          open
            ? "border-[#e50914]/50 bg-[#e50914]/15 text-[#e50914]"
            : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
        )}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
      >
        <Search className="size-5" />
      </button>
    </div>
  );
}
