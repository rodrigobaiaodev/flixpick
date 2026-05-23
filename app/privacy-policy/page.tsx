import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FlixPick collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <InstitutionalLayout
      title="Privacy Policy"
      subtitle="Last updated: May 23, 2026"
    >
      <section>
        <p>
          FlixPick (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates
          flixpick.app and is committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you use our movie recommendation service.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account information:</strong> email address, display name,
            and authentication credentials when you create an account.
          </li>
          <li>
            <strong>Usage data:</strong> pages viewed, features used, search
            queries, mood selections, watchlist activity, and interaction with
            recommendations.
          </li>
          <li>
            <strong>Device and technical data:</strong> IP address, browser type,
            operating system, referring URLs, and general location derived from
            IP (country/region level).
          </li>
          <li>
            <strong>Cookies and similar technologies:</strong> see the Cookies
            section below.
          </li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide, personalize, and improve movie recommendations</li>
          <li>Maintain your watchlist and preferences across sessions</li>
          <li>Send service-related communications (e.g., account verification)</li>
          <li>Analyze usage to improve product quality and performance</li>
          <li>Display relevant advertising where applicable</li>
          <li>Comply with legal obligations and prevent fraud or abuse</li>
        </ul>
      </section>

      <section>
        <h2>Legal Bases (EEA/UK Users)</h2>
        <p>
          Where applicable, we process personal data based on: performance of a
          contract (providing the Service), legitimate interests (analytics and
          product improvement), consent (marketing and non-essential cookies), and
          legal obligation.
        </p>
      </section>

      <section>
        <h2>Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share data with:
        </p>
        <ul>
          <li>
            Service providers (hosting, analytics, email) under contractual
            confidentiality obligations
          </li>
          <li>
            Content and metadata partners (e.g., movie database APIs) as needed
            to display titles, artwork, and availability
          </li>
          <li>Advertising partners when you consent to personalized ads</li>
          <li>Authorities when required by law or to protect rights and safety</li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication and security, and optional
          cookies for analytics and advertising. You can manage preferences through
          your browser settings. Disabling certain cookies may limit functionality.
        </p>
      </section>

      <section>
        <h2>Data Retention</h2>
        <p>
          We retain personal information only as long as necessary for the purposes
          described in this policy, unless a longer retention period is required by
          law. You may request deletion of your account data subject to applicable
          exceptions.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, port, or restrict processing of your personal data, and to
          object to certain processing or withdraw consent. California residents
          may have additional rights under the CCPA/CPRA. To exercise these rights,
          contact us at{" "}
          <a href="mailto:privacy@flixpick.app">privacy@flixpick.app</a>.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          FlixPick is not directed to children under 13 (or 16 in the EEA where
          applicable). We do not knowingly collect personal information from
          children. If you believe we have collected such data, please contact us
          promptly.
        </p>
      </section>

      <section>
        <h2>International Transfers</h2>
        <p>
          Your information may be processed in the United States and other countries
          where our service providers operate. We implement appropriate safeguards
          for cross-border transfers as required by applicable law.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          revised version on this page with an updated effective date. Material
          changes may be communicated via email or in-app notice where required.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          Questions about this Privacy Policy? Email{" "}
          <a href="mailto:privacy@flixpick.app">privacy@flixpick.app</a> or visit
          our <a href="/contact">Contact</a> page.
        </p>
      </section>
    </InstitutionalLayout>
  );
}
