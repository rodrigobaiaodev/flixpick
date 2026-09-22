import type { Metadata } from "next";
import { CookiesClient } from "@/components/institutional/CookiesClient";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How flixpick.app uses cookies and similar technologies, and how you can manage your preferences.",
};

export default function CookiePolicyPage() {
  return <CookiesClient />;
}
