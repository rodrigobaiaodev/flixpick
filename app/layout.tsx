import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
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
    default: "FlixPick — Stop scrolling. Start watching.",
    template: "%s | FlixPick",
  },
  description:
    "Premium movie recommendations tailored to your mood. Discover what to watch next on FlixPick.",
  metadataBase: new URL("https://flixpick.app"),
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
