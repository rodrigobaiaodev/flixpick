import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { LoginModal } from "@/components/shared/LoginModal";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "flixpick.app — Stop scrolling. Start watching.",
    template: "%s | flixpick.app",
  },
  description:
    "Mood-based movie and TV recommendations. Discover what to watch next on Netflix, Prime Video, Max, Disney+, and more — on flixpick.app.",
  metadataBase: new URL("https://flixpick.app"),
  applicationName: "flixpick.app",
  keywords: [
    "what to watch",
    "movie recommendations",
    "TV shows",
    "Netflix",
    "streaming",
    "flixpick",
  ],
  authors: [{ name: "flixpick.app", url: "https://flixpick.app" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flixpick.app",
    siteName: "flixpick.app",
    title: "flixpick.app — Stop scrolling. Start watching.",
    description:
      "Mood-based movie and TV recommendations across major streaming platforms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "flixpick.app — Stop scrolling. Start watching.",
    description:
      "Mood-based movie and TV recommendations across major streaming platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "flixpick.app",
  },
  icons: {
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
  alternates: {
    canonical: "https://flixpick.app",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "flixpick.app",
  alternateName: "FlixPick",
  url: "https://flixpick.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://flixpick.app/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body
        className={`${dmSans.className} flex min-h-full flex-col bg-[#0a0a0f] text-slate-100`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AuthProvider>
          <ServiceWorkerRegistration />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginModal />
          <InstallPrompt />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
