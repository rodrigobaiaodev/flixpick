import type { AdBannerProps } from "@/types/ui";

const DESKTOP_SIZE = "728×90";
const MOBILE_SIZE = "320×50";

export function AdBanner({
  adSlot,
  adClient,
  className = "",
  label = "Advertisement",
}: AdBannerProps) {
  const isConfigured = Boolean(adSlot && adClient);

  return (
    <aside
      className={`flex w-full justify-center ${className}`}
      aria-label={label}
    >
      {/* Desktop leaderboard — 728×90 */}
      <div className="hidden w-full max-w-[728px] md:flex md:justify-center">
        {isConfigured ? (
          <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width: 728, height: 90 }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        ) : (
          <div
            className="flex h-[90px] w-full max-w-[728px] items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-xs text-slate-500"
            data-ad-format="leaderboard"
            data-ad-size={DESKTOP_SIZE}
            role="presentation"
          >
            Ad slot {DESKTOP_SIZE} (desktop)
          </div>
        )}
      </div>

      {/* Mobile banner — 320×50 */}
      <div className="flex w-full max-w-[320px] justify-center md:hidden">
        {isConfigured ? (
          <ins
            className="adsbygoogle"
            style={{ display: "inline-block", width: 320, height: 50 }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        ) : (
          <div
            className="flex h-[50px] w-full max-w-[320px] items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-xs text-slate-500"
            data-ad-format="mobile-banner"
            data-ad-size={MOBILE_SIZE}
            role="presentation"
          >
            Ad slot {MOBILE_SIZE} (mobile)
          </div>
        )}
      </div>
    </aside>
  );
}
