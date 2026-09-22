"use client";

import { LegalPageShell } from "@/components/institutional/LegalPageShell";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";

export function TermsClient() {
  const te = useExtraTranslations();

  return (
    <LegalPageShell
      titleKey="terms.title"
      updatedKey="terms.updated"
      introKey="terms.intro"
    >
      <section>
        <h2>{te("terms.eligibilityTitle")}</h2>
        <p>{te("terms.eligibilityBody")}</p>
      </section>
      <section>
        <h2>{te("terms.accountsTitle")}</h2>
        <p>{te("terms.accountsBody")}</p>
      </section>
      <section>
        <h2>{te("terms.useTitle")}</h2>
        <p>{te("terms.useBody")}</p>
      </section>
      <section>
        <h2>{te("terms.contentTitle")}</h2>
        <p>{te("terms.contentBody")}</p>
      </section>
      <section>
        <h2>{te("terms.disclaimerTitle")}</h2>
        <p>{te("terms.disclaimerBody")}</p>
      </section>
    </LegalPageShell>
  );
}
