import type { AdBannerProps } from "@/types/ui";

function isRealAdSenseConfig(adClient?: string, adSlot?: string): boolean {
  if (!adClient || !adSlot) return false;
  if (adClient.includes("XXXXXXXX")) return false;
  if (!adClient.startsWith("ca-pub-")) return false;
  if (!/^\d{8,}$/.test(adSlot)) return false;
  return true;
}

/** Renders nothing until a real AdSense client + slot are configured. */
export function AdBanner({
  adSlot,
  adClient,
  className = "",
  label = "Advertisement",
}: AdBannerProps) {
  if (!isRealAdSenseConfig(adClient, adSlot)) {
    return null;
  }

  return (
    <aside
      className={`flex w-full justify-center ${className}`}
      aria-label={label}
    >
      <div className="hidden w-full max-w-[728px] md:flex md:justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 728, height: 90 }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      </div>

      <div className="flex w-full max-w-[320px] justify-center md:hidden">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 320, height: 50 }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
