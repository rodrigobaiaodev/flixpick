import type { Metadata } from "next";
import { TermsClient } from "@/components/institutional/TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using FlixPick.",
};

export default function TermsOfServicePage() {
  return <TermsClient />;
}
