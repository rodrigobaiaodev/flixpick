import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalLayout } from "@/components/shared/InstitutionalLayout";

export const metadata: Metadata = {
  title: "About",
  description:
    "FlixPick helps you stop scrolling and start watching with mood-based movie recommendations.",
};

export default function AboutPage() {
  return (
    <InstitutionalLayout
      title="About FlixPick"
      subtitle="We help you stop scrolling and start watching."
    >
      <section>
        <p>
          Every night, millions of people open a streaming app and spend more time
          browsing than watching. FlixPick was built to end that loop. We combine
          mood-based discovery, smart filters, and real availability data so you can
          pick a film in minutes—not hours.
        </p>
      </section>

      <section>
        <h2>Our Mission</h2>
        <p className="text-xl text-slate-200">
          We help you stop scrolling and start watching.
        </p>
        <p>
          Great entertainment should feel effortless. Whether you want something
          uplifting after a long day, a tense thriller for date night, or a
          comfort classic, FlixPick surfaces options that match how you feel—then
          shows you where to stream them in your region.
        </p>
      </section>

      <section>
        <h2>What We Offer</h2>
        <ul>
          <li>
            <strong>Mood-first discovery:</strong> Start with how you want to feel,
            not endless grids of thumbnails.
          </li>
          <li>
            <strong>Personal watchlist:</strong> Save titles across services and
            come back when you are ready to watch.
          </li>
          <li>
            <strong>Where to watch:</strong> See streaming, rental, and purchase
            options so you spend less time searching elsewhere.
          </li>
          <li>
            <strong>Global catalog:</strong> Built for viewers in the US and
            worldwide, with region-aware availability when data is available.
          </li>
        </ul>
      </section>

      <section>
        <h2>How Recommendations Work</h2>
        <p>
          FlixPick uses a mix of editorial mood categories, genre signals, ratings,
          and popularity trends to suggest titles. We continuously refine our
          algorithms based on aggregate usage patterns while respecting your privacy.
          Recommendations are guides—not guarantees—and taste is personal. We
          encourage you to rate, save, and explore until you find your next favorite.
        </p>
      </section>

      <section>
        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Clarity over clutter:</strong> A focused interface that respects
            your time.
          </li>
          <li>
            <strong>Transparency:</strong> Clear attribution for third-party movie
            data and honest disclosure about ads and affiliates.
          </li>
          <li>
            <strong>Inclusivity:</strong> Diverse stories and genres represented in
            our mood and browse experiences.
          </li>
        </ul>
      </section>

      <section>
        <h2>Get in Touch</h2>
        <p>
          We love feedback from fellow movie fans. Reach out through our{" "}
          <Link href="/contact">Contact</Link> page for partnerships, press, or
          support—or email{" "}
          <a href="mailto:hello@flixpick.app">hello@flixpick.app</a>.
        </p>
      </section>
    </InstitutionalLayout>
  );
}
