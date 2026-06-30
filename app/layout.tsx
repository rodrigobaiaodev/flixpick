import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { AuthProvider } from "@/components/shared/AuthProvider";
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
    default: "FlixPick — Stop scrolling. Start watching.",
    template: "%s | FlixPick",
  },
  description:
    "Premium movie recommendations tailored to your mood. Discover what to watch next on FlixPick.",
  metadataBase: new URL("https://flixpick.app"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlixPick",
  },
  icons: {
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
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
        <AuthProvider>
          <ServiceWorkerRegistration />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginModal />
          <InstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
