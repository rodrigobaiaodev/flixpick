import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/shared/AdBanner";
import { MovieCard } from "@/components/shared/MovieCard";
import { getMoodDefinition, MOOD_DEFINITIONS } from "@/lib/moods";
import {
  getTmdbDiscoverIdsBySlug,
  STREAMING_PLATFORMS,
} from "@/lib/streaming-platforms";
import { getMoviesByMood, getTVByMood } from "@/lib/tmdb";
import type { ContentItem } from "@/types/movie";

export const revalidate = 86400;

const AD_CLIENT = "ca-pub-XXXXXXXX";
const AD_SLOTS = {
  top: "3333333333",
  middle: "4444444444",
  bottom: "5555555555",
} as const;

const CURRENT_YEAR = new Date().getFullYear();

/** SEO keyword phrase used in titles and H1s (e.g. "Mind-Bending Sci-Fi"). */
const MOOD_SEO_PHRASE: Record<string, string> = {
  "adrenaline-rush": "Adrenaline Rush Action",
  "need-a-good-laugh": "Comedy That Makes You Laugh",
  "hopeless-romantic": "Romantic Movies & Shows",
  "keep-me-awake": "Horror & Thrillers",
  "mind-bending": "Mind-Bending Sci-Fi",
  "emotional-journey": "Emotional Drama",
  "cozy-and-family": "Family & Feel-Good",
  "true-stories": "True Stories & Documentaries",
  whodunnit: "Crime & Mystery Whodunnits",
  "epic-fantasy": "Epic Fantasy Worlds",
};

interface PageProps {
  params: Promise<{ provider: string; mood: string }>;
}

export function generateStaticParams() {
  return STREAMING_PLATFORMS.flatMap((platform) =>
    MOOD_DEFINITIONS.map((mood) => ({
      provider: platform.id,
      mood: mood.slug,
    })),
  );
}

function resolveCombo(providerSlug: string, moodSlug: string) {
  const platform = STREAMING_PLATFORMS.find((p) => p.id === providerSlug);
  const mood = getMoodDefinition(moodSlug);
  if (!platform || !mood) return null;
  return { platform, mood };
}

function seoPhrase(moodSlug: string, moodLabel: string): string {
  return MOOD_SEO_PHRASE[moodSlug] ?? moodLabel;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { provider, mood: moodSlug } = await params;
  const combo = resolveCombo(provider, moodSlug);

  if (!combo) {
    return { title: "Not Found" };
  }

  const phrase = seoPhrase(combo.mood.slug, combo.mood.label);
  const title = `Best ${phrase} on ${combo.platform.name} — Movies & Shows (${CURRENT_YEAR})`;
  const description = `Discover the best ${phrase.toLowerCase()} movies and TV shows streaming on ${combo.platform.name} right now. Curated ${combo.mood.label.toLowerCase()} picks updated for ${CURRENT_YEAR}.`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `https://flixpick.app/what-to-watch/${provider}/${moodSlug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://flixpick.app/what-to-watch/${provider}/${moodSlug}`,
    },
  };
}

async function fetchTopPicks(
  moodSlug: string,
  providerIds: number[],
): Promise<ContentItem[]> {
  const [movies, tv] = await Promise.all([
    getMoviesByMood(moodSlug, providerIds, 1),
    getTVByMood(moodSlug, providerIds, 1),
  ]);

  return [...movies.results, ...tv.results]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);
}

function buildIntro(
  platformName: string,
  moodLabel: string,
  phrase: string,
  moodDescription: string,
): string {
  return `Looking for the best ${phrase.toLowerCase()} on ${platformName}? You are in the right place. FlixPick curated this guide for anyone who opens ${platformName}, scrolls for twenty minutes, and still cannot decide what to watch. When you are in a ${moodLabel.toLowerCase()} mood—${moodDescription.toLowerCase()}—the catalog can feel endless. Algorithms push whatever is trending, not necessarily what matches how you feel tonight. That is why we filter ${platformName}'s library through a ${moodLabel.toLowerCase()} lens and surface titles that actually fit. Our picks mix popular hits with underrated gems so you get variety without the paralysis of choice. Every title below is confirmed available on ${platformName} in the United States, ranked by real viewer interest, and refreshed regularly so the list stays current through ${CURRENT_YEAR}. Whether you want a quick movie night or a multi-episode binge, these ${phrase.toLowerCase()} recommendations on ${platformName} are built to get you from browsing to watching in minutes. Skip the endless scroll—start with this shortlist and press play with confidence.`;
}

function buildEditorial(
  platformName: string,
  moodLabel: string,
  phrase: string,
  titles: string[],
): string {
  const sample =
    titles.length >= 3
      ? `${titles[0]}, ${titles[1]}, and ${titles[2]}`
      : titles.length > 0
        ? titles.join(", ")
        : `standout ${phrase.toLowerCase()} titles`;

  return `Why these picks? We do not dump every ${phrase.toLowerCase()} title on ${platformName} into a giant grid. Instead, FlixPick cross-checks mood-matched genres with live availability data, then ranks by popularity and audience scores so the top of the list rewards quality and relevance. A ${moodLabel.toLowerCase()} night should feel intentional: the pacing, tone, and themes ought to line up with what you asked for, not with whatever the homepage carousel happens to feature. Titles like ${sample} illustrate the range inside this mood—some lean spectacle, others lean character, but all sit comfortably under the ${moodLabel.toLowerCase()} umbrella. We also balance movies and TV shows because a single evening and a weekend binge call for different runtime commitments. Availability matters just as much as taste: every recommendation here streams on ${platformName} now, so you will not chase a title only to hit a rent-or-buy wall. Rankings shift as audiences move, so returning to this page later in ${CURRENT_YEAR} can reveal fresh entries without you hunting through menus. Think of this list as an editorial shortlist from a friend who knows both the ${platformName} catalog and the ${moodLabel.toLowerCase()} vibe you want tonight—not a cold dump of search results. If something does not click, jump to a related mood below and try a neighboring energy without starting from zero.`;
}

function buildFaq(
  platformName: string,
  moodLabel: string,
  phrase: string,
): { question: string; answer: string }[] {
  return [
    {
      question: `What are the best ${phrase.toLowerCase()} movies and shows on ${platformName} right now?`,
      answer: `The titles featured on this page are FlixPick's current top ${moodLabel.toLowerCase()} recommendations for ${platformName}, ranked by popularity and filtered for US streaming availability. They are updated regularly so you always see strong ${phrase.toLowerCase()} options without scrolling the full catalog.`,
    },
    {
      question: `Are these ${moodLabel.toLowerCase()} picks actually available on ${platformName}?`,
      answer: `Yes. Each recommendation is discovered through ${platformName}'s watch-provider data for the United States. Catalogs change over time, so if a title leaves ${platformName}, it will drop off this list on the next refresh.`,
    },
    {
      question: `How does FlixPick choose ${phrase.toLowerCase()} titles for ${platformName}?`,
      answer: `We map the ${moodLabel} mood to matching genres, query ${platformName}'s library, and sort by popularity while applying quality filters. The result is a short, editorial-style list designed to end decision fatigue—not an unfiltered dump of every related title.`,
    },
  ];
}

export default async function WhatToWatchPage({ params }: PageProps) {
  const { provider, mood: moodSlug } = await params;
  const combo = resolveCombo(provider, moodSlug);

  if (!combo) {
    notFound();
  }

  const { platform, mood } = combo;
  const phrase = seoPhrase(mood.slug, mood.label);
  const providerIds = getTmdbDiscoverIdsBySlug(platform.id);
  const picks = await fetchTopPicks(mood.slug, providerIds);

  const intro = buildIntro(
    platform.name,
    mood.label,
    phrase,
    mood.description,
  );
  const editorial = buildEditorial(
    platform.name,
    mood.label,
    phrase,
    picks.map((p) => p.title),
  );
  const faq = buildFaq(platform.name, mood.label, phrase);

  const relatedMoods = MOOD_DEFINITIONS.filter((m) => m.slug !== mood.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0f] px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AdBanner
            adClient={AD_CLIENT}
            adSlot={AD_SLOTS.top}
            className="mb-8 sm:mb-10"
          />

          <header className="mb-8 sm:mb-10">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#e50914]">
              What to watch · {platform.name}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white sm:text-4xl lg:text-5xl">
              Best {phrase} on {platform.name}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300">
              {intro}
            </p>
          </header>

          <section aria-labelledby="top-picks-heading" className="mb-12">
            <h2
              id="top-picks-heading"
              className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white"
            >
              Top {picks.length || 12} picks on {platform.name}
            </h2>
            {picks.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {picks.map((item, index) => (
                  <MovieCard
                    key={`${item.mediaType}-${item.id}`}
                    movie={item}
                    priority={index < 6}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-400">
                No titles matched this mood on {platform.name} right now. Try a
                related mood below or check back soon.
              </p>
            )}
          </section>

          <AdBanner
            adClient={AD_CLIENT}
            adSlot={AD_SLOTS.middle}
            className="mb-12"
          />

          <section aria-labelledby="why-picks-heading" className="mb-12">
            <h2
              id="why-picks-heading"
              className="mb-4 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white"
            >
              Why these picks?
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-slate-300">
              {editorial}
            </p>
          </section>

          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white"
            >
              Frequently asked questions
            </h2>
            <dl className="mx-auto max-w-3xl space-y-6">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="text-lg font-semibold text-white">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-slate-300">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="related-moods-heading" className="mb-12">
            <h2
              id="related-moods-heading"
              className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white"
            >
              Related moods on {platform.name}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {relatedMoods.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/what-to-watch/${platform.id}/${related.slug}`}
                    className="inline-block border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:border-[#e50914]/50 hover:text-white"
                  >
                    {related.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <AdBanner
            adClient={AD_CLIENT}
            adSlot={AD_SLOTS.bottom}
            className="pb-4"
          />
        </div>
      </div>
    </>
  );
}
