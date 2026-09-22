import type { Metadata } from "next";
import { AboutClient } from "@/components/institutional/AboutClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "FlixPick helps you stop scrolling and start watching with mood-based movie recommendations.",
};

export default function AboutPage() {
  return <AboutClient />;
}
