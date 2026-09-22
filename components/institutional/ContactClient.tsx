"use client";

import Link from "next/link";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";

export function ContactClient() {
  const te = useExtraTranslations();

  const channels = [
    {
      label: te("contact.general"),
      email: "hello@flixpick.app",
    },
    {
      label: te("contact.support"),
      email: "support@flixpick.app",
    },
    {
      label: te("contact.privacy"),
      email: "privacy@flixpick.app",
    },
    {
      label: te("contact.legal"),
      email: "legal@flixpick.app",
    },
  ];

  return (
    <InstitutionalLayout
      title={te("contact.title")}
      subtitle={te("contact.subtitle")}
    >
      <section>
        <ul className="!ml-0 !list-none space-y-6">
          {channels.map(({ label, email }) => (
            <li
              key={email}
              className="!list-none rounded-lg border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="!mt-0 text-base font-semibold text-slate-100">
                {label}
              </h3>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block font-medium text-[#e50914]"
              >
                {email}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{te("contact.message")}</h2>
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
              {te("contact.name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder={te("contact.placeholderName")}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              {te("contact.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder={te("contact.placeholderEmail")}
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              {te("contact.subject")}
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full rounded-lg border border-white/15 bg-[#12121a] px-4 py-2.5 text-slate-100 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              defaultValue="support"
            >
              <option value="support">{te("contact.support")}</option>
              <option value="privacy">{te("contact.privacy")}</option>
              <option value="legal">{te("contact.legal")}</option>
              <option value="other">{te("browse.all")}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-slate-200"
            >
              {te("contact.message")}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-[#e50914] focus:outline-none focus:ring-1 focus:ring-[#e50914]"
              placeholder={te("contact.placeholderMessage")}
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#e50914] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#f6121d]"
          >
            {te("contact.send")}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          <Link href="/privacy-policy" className="text-[#e50914] hover:underline">
            {te("privacy.title")}
          </Link>
        </p>
      </section>
    </InstitutionalLayout>
  );
}
