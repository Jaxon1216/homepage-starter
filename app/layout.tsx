import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { umamiConfig } from "@/lib/analytics/config";
import { integrationConfig } from "@/lib/integrations";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.nameEn}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.nameEn,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
        {integrationConfig.vercelAnalytics ? <Analytics /> : null}
        <AnalyticsProvider
          articlePaths={getAllPosts().map((post) => `/blog/${post.slug}`)}
          release={(process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 12)}
          enabled={
            umamiConfig.enabled &&
            process.env.NODE_ENV === "production" &&
            process.env.VERCEL_ENV !== "preview" &&
            process.env.VERCEL_ENV !== "development"
          }
        />
      </body>
    </html>
  );
}
