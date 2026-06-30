"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useAuth } from "@/components/shared/AuthProvider";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginModal() {
  const { loginModalOpen, closeLoginModal, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLoginModal();
    },
    [closeLoginModal],
  );

  useEffect(() => {
    if (!loginModalOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [loginModalOpen, handleKeyDown]);

  useEffect(() => {
    if (!loginModalOpen) {
      setEmail("");
      setPassword("");
      setError(null);
    }
  }, [loginModalOpen]);

  if (!loginModalOpen) return null;

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await createClient().auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      await refreshUser();
      closeLoginModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={closeLoginModal}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] shadow-2xl shadow-black/60">
        <button
          type="button"
          onClick={closeLoginModal}
          className="btn-compact absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="border-b border-white/10 bg-gradient-to-b from-[#e50914]/10 to-transparent px-8 pb-6 pt-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
            Flix<span className="text-[#e50914]">Pick</span>
          </p>
          <h2
            id="login-modal-title"
            className="mt-4 text-lg font-semibold text-white"
          >
            Sign up free — save your favorites forever
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Build your watchlist, track what you&apos;re watching, and never
            lose a great pick.
          </p>
        </div>

        <div className="space-y-4 p-8">
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleGoogleLogin()}
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10 disabled:opacity-50"
          >
            <GoogleIcon className="size-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={(e) => void handleEmailLogin(e)} className="space-y-4">
            <div>
              <label htmlFor="modal-email" className="sr-only">
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-xl border border-white/15 bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#e50914]/50 focus:outline-none focus:ring-1 focus:ring-[#e50914]/50"
              />
            </div>
            <div>
              <label htmlFor="modal-password" className="sr-only">
                Password
              </label>
              <input
                id="modal-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-white/15 bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#e50914]/50 focus:outline-none focus:ring-1 focus:ring-[#e50914]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "min-h-[44px] w-full rounded-xl bg-[#e50914] text-sm font-semibold text-white transition hover:bg-[#f6121d] disabled:opacity-50",
              )}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              onClick={closeLoginModal}
              className="font-medium text-[#e50914] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
