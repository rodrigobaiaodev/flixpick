import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the FlixPick team.",
};

const contactChannels = [
  {
    label: "General inquiries",
    email: "hello@flixpick.app",
    description: "Questions, feedback, and partnership ideas.",
  },
  {
    label: "Customer support",
    email: "support@flixpick.app",
    description: "Account issues, bugs, and help using the product.",
  },
  {
    label: "Privacy requests",
    email: "privacy@flixpick.app",
    description: "Data access, deletion, and privacy-related questions.",
  },
  {
    label: "Legal",
    email: "legal@flixpick.app",
    description: "Terms, compliance, and legal notices.",
  },
] as const;

export default function ContactPage() {
  return (
    <InstitutionalLayout
      title="Contact Us"
      subtitle="We typically respond within 2 business days."
    >
      <section>
        <p>
          Have a question, suggestion, or press inquiry? We would love to hear from
          you. Choose the channel that best fits your message, or use the form
          below to send us a note.
        </p>
      </section>

      <section>
        <h2>Email</h2>
        <ul className="!list-none !ml-0 space-y-6">
          {contactChannels.map(({ label, email, description }) => (
            <li key={email} className="!list-none rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <h3 className="!mt-0 text-base font-semibold text-slate-100">
                {label}
              </h3>
              <p className="!mt-1 text-sm text-slate-400">{description}</p>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block text-[#e50914] font-medium"
              >
                {email}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Send a Message</h2>
        <form
          className="space-y-5"
          action="mailto:support@flixpick.app"
          method="post"
          encType="text/plain"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full rounded-lg border border-white/15 bg-[#12121a] px-4 py-2.5 text-slate-100 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              defaultValue="support"
            >
              <option value="support">Support</option>
              <option value="feedback">Product feedback</option>
              <option value="partnership">Partnership / press</option>
              <option value="privacy">Privacy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#e50914] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#f6121d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e50914]"
          >
            Send message
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          By submitting, you agree to our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. For urgent security
          issues, email{" "}
          <a href="mailto:security@flixpick.app">security@flixpick.app</a>.
        </p>
      </section>
    </InstitutionalLayout>
  );
}
