"use client";

import Link from "next/link";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";

export function AboutClient() {
  const te = useExtraTranslations();

  return (
    <InstitutionalLayout title={te("about.title")} subtitle={te("about.subtitle")}>
      <section>
        <p>{te("about.intro")}</p>
      </section>

      <section>
        <h2>{te("about.mission")}</h2>
        <p className="text-xl text-slate-200">{te("about.missionLead")}</p>
        <p>{te("about.missionBody")}</p>
      </section>

      <section>
        <h2>{te("about.offer")}</h2>
        <ul>
          <li>
            <strong>{te("about.offer1").split(":")[0]}:</strong>{" "}
            {te("about.offer1").includes(":")
              ? te("about.offer1").slice(te("about.offer1").indexOf(":") + 1)
              : ""}
          </li>
          <li>
            <strong>{te("about.offer2").split(":")[0]}:</strong>{" "}
            {te("about.offer2").includes(":")
              ? te("about.offer2").slice(te("about.offer2").indexOf(":") + 1)
              : ""}
          </li>
          <li>
            <strong>{te("about.offer3").split(":")[0]}:</strong>{" "}
            {te("about.offer3").includes(":")
              ? te("about.offer3").slice(te("about.offer3").indexOf(":") + 1)
              : ""}
          </li>
          <li>
            <strong>{te("about.offer4").split(":")[0]}:</strong>{" "}
            {te("about.offer4").includes(":")
              ? te("about.offer4").slice(te("about.offer4").indexOf(":") + 1)
              : ""}
          </li>
        </ul>
      </section>

      <section>
        <h2>{te("about.how")}</h2>
        <p>{te("about.howBody")}</p>
      </section>

      <section>
        <h2>{te("about.values")}</h2>
        <ul>
          <li>
            <strong>{te("about.value1").split(":")[0]}:</strong>{" "}
            {te("about.value1").includes(":")
              ? te("about.value1").slice(te("about.value1").indexOf(":") + 1)
              : ""}
          </li>
          <li>
            <strong>{te("about.value2").split(":")[0]}:</strong>{" "}
            {te("about.value2").includes(":")
              ? te("about.value2").slice(te("about.value2").indexOf(":") + 1)
              : ""}
          </li>
        </ul>
      </section>

      <section>
        <h2>{te("about.contact")}</h2>
        <p>
          {te("about.contactBody")}{" "}
          <Link href="/contact" className="text-[#e50914] hover:underline">
            {te("contact.title")}
          </Link>
          .
        </p>
      </section>
    </InstitutionalLayout>
  );
}
