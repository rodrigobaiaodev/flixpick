import type { Metadata } from "next";
import { PrivacyClient } from "@/components/institutional/PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FlixPick collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyClient />;
}
