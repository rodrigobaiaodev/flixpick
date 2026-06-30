"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "flixpick:installPromptDismissed";
const LAST_PICK_KEY = "flixpick:lastPick";

function readLastPickSavedAt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_PICK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: string };
    return parsed.savedAt ?? null;
  } catch {
    return null;
  }
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const [eligible, setEligible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const baselineSavedAt = useRef<string | null>(null);

  useEffect(() => {
    baselineSavedAt.current = readLastPickSavedAt();
  }, []);

  useEffect(() => {
    if (isDismissed()) return;

    const checkSpin = () => {
      const savedAt = readLastPickSavedAt();
      if (!savedAt || savedAt === baselineSavedAt.current) return;
      setEligible(true);
    };

    const interval = window.setInterval(checkSpin, 400);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setEligible(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* quota or private mode */
    }
    setEligible(false);
  }, []);

  if (!eligible || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-prompt-title"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md",
        "rounded-2xl border border-white/10 bg-[#12121a]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-md",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e50914]/15">
          <Download className="size-5 text-[#e50914]" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p
            id="install-prompt-title"
            className="font-semibold text-white"
          >
            Add FlixPick to your home screen
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Install the app for quick access to your movie roulette.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleInstall()}
              className="rounded-full bg-[#e50914] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#f40612]"
            >
              Install
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
          aria-label="Dismiss install prompt"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
