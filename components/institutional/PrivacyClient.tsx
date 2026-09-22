"use client";

import Link from "next/link";
import { LegalPageShell } from "@/components/institutional/LegalPageShell";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";

export function PrivacyClient() {
  const te = useExtraTranslations();
  const moreParts = te("privacy.moreBody").split(/\{cookieLink\}|\{contactLink\}/);

  return (
    <LegalPageShell
      titleKey="privacy.title"
      updatedKey="privacy.updated"
      introKey="privacy.intro"
    >
      <section>
        <h2>{te("privacy.collectTitle")}</h2>
        <p>{te("privacy.collectBody")}</p>
      </section>
      <section>
        <h2>{te("privacy.useTitle")}</h2>
        <p>{te("privacy.useBody")}</p>
      </section>
      <section>
        <h2>{te("privacy.shareTitle")}</h2>
        <p>{te("privacy.shareBody")}</p>
      </section>
      <section>
        <h2>{te("privacy.rightsTitle")}</h2>
        <p>{te("privacy.rightsBody")}</p>
      </section>
      <section>
        <h2>{te("privacy.moreTitle")}</h2>
        <p>
          {moreParts[0]}
          <Link href="/cookie-policy">{te("privacy.cookieLink")}</Link>
          {moreParts[1] ?? " "}
          <Link href="/contact">{te("privacy.contactLink")}</Link>
          {moreParts[2] ?? ""}
        </p>
      </section>
    </LegalPageShell>
  );
}
