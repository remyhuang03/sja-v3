import { getTranslations, getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata, Viewport } from "next";

import "./globals.css";

import Header from "@/app/components/layout/Header";
import ModernFooter from "@/app/components/layout/ModernFooter";
import RouteTransition from "@/app/components/RouteTransition";

import { mainFont } from "./fonts/mainFont";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ui");

  return {
    metadataBase: new URL("https://sja.remya.top"),
    title: t("sjaAnalyzer"),
    description: t(
      "analyzeScratchProjectsCompareTheirStructureAndDiscoverUseful",
    ),
    icons: {
      icon: "/meta/main-logo.svg",
      shortcut: "/meta/favicon.ico",
    },
    other: {
      "og:image": "/meta/seo-meta.png",
      charset: "UTF-8",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale === "zh" ? "zh-Hans" : locale} className="dark">
      <body className={`${mainFont.className}`}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="UTC"
        >
          <Header />
          <main className="relative">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <ModernFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
