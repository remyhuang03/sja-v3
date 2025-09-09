import type { Metadata,Viewport } from "next";

import "./globals.css";
// import "./homepage.module.css"

import Header from "@/app/components/layout/Header";
import ModernFooter from "@/app/components/layout/ModernFooter";
import RouteTransition from "@/app/components/RouteTransition";

import { mainFont } from "./fonts/mainFont";

export const metadata: Metadata = {
  title: "SJA 分析器",
  description: "SJA分析器为您快速分析Scratch作品文件、提供抄袭比对、数据看板等多样化功能。",
  icons: {
    icon: "/meta/main-logo.svg",
    shortcut: "/meta/favicon.ico",
  },
  other: {
    "og:image": "/meta/seo-meta.png",
    charset: "UTF-8",
  }
};

export const viewport:Viewport = {
  width:"device-width",
  initialScale:1.0,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="dark">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional" 
        />
      </head>

      {/* <script src="/assets/js/news-list.js" defer></script> */}

      <body className={`${mainFont.className}`}>
        <Header />
        <main className="relative">
          <RouteTransition>
            {children}
          </RouteTransition>
        </main>
        <ModernFooter />
      </body>
    </html>
  );
}
