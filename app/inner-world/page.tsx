import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import { DocumentLang } from "@/components/common/DocumentLang";
import { InnerWorldContent } from "@/components/inner-world/InnerWorldContent";
import { readingStages } from "@/lib/reading";

const serif = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  preload: false,
  fallback: ["Songti SC", "STSong", "PMingLiU", "serif"],
});

export const metadata: Metadata = {
  title: "Inner World",
  description: "阅读记录与书架展示示例。",
  openGraph: {
    locale: "zh_CN",
  },
};

export default function InnerWorldPage() {
  return (
    <div className={`${serif.variable} inner-world`}>
      <DocumentLang lang="zh-CN" />
      <InnerWorldContent stages={readingStages} />
    </div>
  );
}
