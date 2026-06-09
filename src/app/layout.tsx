import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { ThemeScript } from "@/lib/theme/script";
import { SoundProvider } from "@/lib/sound/provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/components/providers/page-transition";
import { PageEntrance } from "@/components/providers/page-entrance";
import { Preloader } from "@/components/site/preloader";
// Persistent fixed UI — must live OUTSIDE PageEntrance so its transform
// doesn't trap position:fixed elements inside a containing block.
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { ScrollSpy } from "@/components/site/scroll-spy";
import { DotGridBg } from "@/components/site/dot-grid-bg";
import { FloatingShapes } from "@/components/site/floating-shapes";
import { AuroraFlow } from "@/components/site/aurora-flow";
import { SparkleDrift } from "@/components/site/sparkle-drift";
import { CursorSpotlight } from "@/components/site/cursor-spotlight";
import { Header } from "@/components/site/header";
import { StickyHireCTA } from "@/components/site/sticky-hire-cta";

const sans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lê Phương Nam - Account Intern | UEH",
  description:
    "Lê Phương Nam - sinh viên UEH, ENFP, đang tìm vị trí Account Intern tại Event Agency. GO BIG OR GO HOME.",
  metadataBase: new URL("https://example.com"),
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Lê Phương Nam - Account Intern",
    description:
      "Sinh viên UEH · ENFP · 4 cuộc thi đạt giải · GO BIG OR GO HOME.",
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lê Phương Nam - Account Intern",
    description:
      "Sinh viên UEH · ENFP · GO BIG OR GO HOME.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full overflow-x-hidden bg-background text-foreground theme-fade">
        <ThemeProvider>
          <LocaleProvider>
            <SoundProvider>
              <SmoothScrollProvider>
                <Preloader />

                {/* ─── Persistent fixed UI (viewport-relative) ─── */}
                {/* Atmospheric layers — deepest behind everything */}
                <AuroraFlow />
                <DotGridBg />
                <FloatingShapes />
                <SparkleDrift />
                <CursorSpotlight />
                {/* Foreground fixed UI */}
                <ScrollProgress />
                <ScrollSpy />
                <Cursor />
                <Header />
                <StickyHireCTA />

                {/* ─── Main content area — wrapped in entrance animation ─── */}
                <PageEntrance>
                  <PageTransition>{children}</PageTransition>
                </PageEntrance>
              </SmoothScrollProvider>
            </SoundProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
