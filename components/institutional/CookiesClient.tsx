"use client";

import Link from "next/link";
import { LegalPageShell } from "@/components/institutional/LegalPageShell";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";

export function CookiesClient() {
  const te = useExtraTranslations();
  const manageParts = te("cookies.manageBody").split("{privacyLink}");

  return (
    <LegalPageShell
      titleKey="cookies.title"
      updatedKey="cookies.updated"
      introKey="cookies.intro"
    >
      <section>
        <h2>{te("cookies.essentialTitle")}</h2>
        <p>{te("cookies.essentialBody")}</p>
      </section>
      <section>
        <h2>{te("cookies.prefsTitle")}</h2>
        <p>{te("cookies.prefsBody")}</p>
      </section>
      <section>
        <h2>{te("cookies.adsTitle")}</h2>
        <p>{te("cookies.adsBody")}</p>
      </section>
      <section>
        <h2>{te("cookies.manageTitle")}</h2>
        <p>
          {manageParts[0]}
          <Link href="/privacy-policy">{te("cookies.privacyLink")}</Link>
          {manageParts[1] ?? ""}
        </p>
      </section>
    </LegalPageShell>
  );
}
