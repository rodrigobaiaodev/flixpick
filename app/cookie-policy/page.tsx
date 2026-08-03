import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How flixpick.app uses cookies and similar technologies, and how you can manage your preferences.",
};

export default function CookiePolicyPage() {
  return (
    <InstitutionalLayout
      title="Cookie Policy"
      subtitle="Last updated: August 3, 2026"
    >
      <section>
        <p>
          This Cookie Policy explains how flixpick.app (&quot;FlixPick,&quot;
          &quot;we,&quot; or &quot;us&quot;) uses cookies and similar technologies
          when you visit our website. It should be read together with our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help the site remember preferences, keep you signed in,
          understand how the product is used, and—when you consent—support
          advertising partners such as Google AdSense.
        </p>
      </section>

      <section>
        <h2>Cookies We Use</h2>
        <ul>
          <li>
            <strong>Essential:</strong> required for authentication, security,
            and core features (for example session cookies from our auth
            provider). These cannot be switched off in our systems.
          </li>
          <li>
            <strong>Preferences:</strong> remember choices such as selected mood
            or streaming platforms on your device (often via local storage).
          </li>
          <li>
            <strong>Analytics &amp; advertising:</strong> used only after you
            accept cookies in our banner. These may include Google AdSense and
            related measurement cookies to show relevant ads and understand
            performance.
          </li>
        </ul>
      </section>

      <section>
        <h2>Managing Cookies</h2>
        <p>
          You can accept or decline non-essential cookies using the cookie notice
          on flixpick.app. You can also clear or block cookies in your browser
          settings. Blocking essential cookies may affect sign-in and saved-list
          features.
        </p>
        <p>
          To opt out of personalized ads from Google, visit{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about cookies or privacy? Email{" "}
          <a href="mailto:privacy@flixpick.app">privacy@flixpick.app</a> or
          visit our <Link href="/contact">Contact</Link> page.
        </p>
      </section>
    </InstitutionalLayout>
  );
}
