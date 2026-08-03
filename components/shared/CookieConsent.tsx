"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "flixpick:cookie-consent";

type ConsentValue = "accepted" | "declined";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted" && stored !== "declined") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore quota / private mode */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0a0a0f]/95 px-4 py-3 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
          We use cookies for essential features and, with your OK, for ads and
          analytics. See our{" "}
          <Link
            href="/cookie-policy"
            className="text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => save("declined")}
            className="min-h-[40px] rounded-lg border border-white/15 px-4 text-xs font-medium text-slate-300 transition hover:border-white/25 hover:text-white sm:text-sm"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => save("accepted")}
            className="min-h-[40px] rounded-lg bg-[#e50914] px-4 text-xs font-semibold text-white transition hover:bg-[#f6121d] sm:text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
