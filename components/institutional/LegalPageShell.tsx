"use client";

import type { ReactNode } from "react";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";
import type { ExtraKey } from "@/lib/i18n/extra";

interface LegalPageShellProps {
  titleKey: ExtraKey;
  updatedKey: ExtraKey;
  introKey: ExtraKey;
  children: ReactNode;
}

export function LegalPageShell({
  titleKey,
  updatedKey,
  introKey,
  children,
}: LegalPageShellProps) {
  const te = useExtraTranslations();

  return (
    <InstitutionalLayout title={te(titleKey)} subtitle={te(updatedKey)}>
      <section>
        <p>{te(introKey)}</p>
      </section>
      {children}
      <section>
        <h2>{te("legal.contactUs")}</h2>
        <p>
          <a href="mailto:privacy@flixpick.app" className="text-[#e50914]">
            privacy@flixpick.app
          </a>
        </p>
      </section>
    </InstitutionalLayout>
  );
}
