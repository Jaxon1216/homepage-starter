import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: `More about ${siteConfig.nameEn}`,
};

export default function AboutPage() {
  return <AboutContent />;
}
