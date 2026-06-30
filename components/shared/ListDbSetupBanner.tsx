"use client";

import { useState } from "react";
import { AlertCircle, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { USER_LISTS_SETUP_SQL } from "@/lib/list-db";
import { cn } from "@/lib/utils";

const SUPABASE_PROJECT_REF = "gnvpvepuafkeebzmvnsw";
const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`;

interface ListDbSetupBannerProps {
  className?: string;
}

export function ListDbSetupBanner({ className }: ListDbSetupBannerProps) {
  const [copied, setCopied] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);

  async function copySql() {
    try {
      await navigator.clipboard.writeText(USER_LISTS_SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setSetupMessage("Could not copy — select and copy the SQL manually.");
    }
  }

  async function tryAutoSetup() {
    setSettingUp(true);
    setSetupMessage(null);
    try {
      const response = await fetch("/api/setup-list-table", { method: "POST" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setSetupMessage("Database ready! Refreshing…");
        window.location.reload();
        return;
      }
      setSetupMessage(
        data.error ??
          "Auto-setup unavailable. Use the Supabase SQL Editor button below.",
      );
    } catch {
      setSetupMessage("Setup failed. Please use the Supabase SQL Editor.");
    } finally {
      setSettingUp(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-[#12121a] p-6 sm:p-8",
        className,
      )}
      role="alert"
    >
      <div className="flex gap-4">
        <AlertCircle className="mt-0.5 size-6 shrink-0 text-amber-400" />
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
            One-time setup required
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Your watchlist table hasn&apos;t been created in Supabase yet.
            Run the SQL below once — then My List, Watching, and Profile will
            work fully.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={SQL_EDITOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#e50914] px-5 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
            >
              <ExternalLink className="size-4" />
              Open Supabase SQL Editor
            </a>
            <button
              type="button"
              onClick={() => void copySql()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy SQL
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void tryAutoSetup()}
              disabled={settingUp}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 px-5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              {settingUp ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Setting up…
                </>
              ) : (
                "Try auto-setup"
              )}
            </button>
          </div>

          {setupMessage && (
            <p className="mt-4 text-sm text-amber-200/90">{setupMessage}</p>
          )}

          <details className="mt-5">
            <summary className="cursor-pointer text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-400">
              Show SQL to paste
            </summary>
            <pre className="mt-3 max-h-48 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[11px] leading-relaxed text-slate-400">
              {USER_LISTS_SETUP_SQL.trim()}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
