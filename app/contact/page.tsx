import type { Metadata } from "next";
import { ContactClient } from "@/components/institutional/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the FlixPick team.",
};

export default function ContactPage() {
  return <ContactClient />;
}
