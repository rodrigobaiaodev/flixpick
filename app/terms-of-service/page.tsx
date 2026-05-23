import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using FlixPick.",
};

export default function TermsOfServicePage() {
  return (
    <InstitutionalLayout
      title="Terms of Service"
      subtitle="Last updated: May 23, 2026"
    >
      <section>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use
          of FlixPick at flixpick.app and related services (collectively, the
          &quot;Service&quot;). By using the Service, you agree to these Terms. If
          you do not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum age required in your
          jurisdiction) to use FlixPick. By using the Service, you represent that
          you meet this requirement and have the legal capacity to enter into
          these Terms.
        </p>
      </section>

      <section>
        <h2>Account Registration</h2>
        <p>
          Some features require an account. You are responsible for maintaining the
          confidentiality of your credentials and for all activity under your
          account. Notify us immediately at{" "}
          <a href="mailto:support@flixpick.app">support@flixpick.app</a> if you
          suspect unauthorized access.
        </p>
      </section>

      <section>
        <h2>License and Acceptable Use</h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable license
          to access and use the Service for personal, non-commercial purposes. You
          agree not to:
        </p>
        <ul>
          <li>Violate any applicable law or third-party rights</li>
          <li>Scrape, crawl, or reverse engineer the Service without permission</li>
          <li>Interfere with security, availability, or integrity of the Service</li>
          <li>Use automated means to access the Service except as we expressly allow</li>
          <li>Impersonate others or misrepresent your affiliation</li>
          <li>Upload malware or harmful code</li>
        </ul>
      </section>

      <section>
        <h2>Content and Recommendations</h2>
        <p>
          Movie metadata, images, trailers, and availability information may be
          provided by third parties. FlixPick does not guarantee accuracy,
          completeness, or availability of streaming options in your region.
          Recommendations are for informational purposes and do not constitute
          professional advice.
        </p>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          The Service, including its design, software, trademarks, and original
          content, is owned by FlixPick or its licensors. Third-party movie assets
          remain the property of their respective owners. You may not copy,
          modify, distribute, or create derivative works without authorization.
        </p>
      </section>

      <section>
        <h2>Advertising</h2>
        <p>
          The Service may display advertisements, including from Google AdSense or
          similar partners. Your interactions with ads are subject to the
          advertisers&apos; terms and privacy policies.
        </p>
      </section>

      <section>
        <h2>Third-Party Links and Services</h2>
        <p>
          The Service may link to streaming platforms, retailers, or other sites we
          do not control. We are not responsible for third-party content, policies,
          or practices. Your use of external services is at your own risk.
        </p>
      </section>

      <section>
        <h2>Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLIXPICK AND ITS AFFILIATES,
          OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
          LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
          OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE GREATER OF USD $50
          OR THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
        </p>
      </section>

      <section>
        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless FlixPick from claims arising out
          of your misuse of the Service, violation of these Terms, or infringement
          of third-party rights.
        </p>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          We may suspend or terminate your access at any time for violation of these
          Terms or for any reason with notice where practicable. Upon termination,
          provisions that by their nature should survive will remain in effect.
        </p>
      </section>

      <section>
        <h2>Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, United
          States, without regard to conflict-of-law principles. Disputes shall be
          resolved in the state or federal courts located in Delaware, except where
          mandatory consumer protection laws in your country provide otherwise.
        </p>
      </section>

      <section>
        <h2>Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. Continued use after changes become
          effective constitutes acceptance. If you do not agree to the revised Terms,
          you must stop using the Service.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions about these Terms, contact{" "}
          <a href="mailto:legal@flixpick.app">legal@flixpick.app</a> or our{" "}
          <a href="/contact">Contact</a> page.
        </p>
      </section>
    </InstitutionalLayout>
  );
}
