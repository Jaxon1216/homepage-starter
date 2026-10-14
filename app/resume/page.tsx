import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { DocumentLang } from "@/components/common/DocumentLang";
import { ResumeContent } from "./ResumeContent";

export const metadata: Metadata = {
  title: "在线简历",
  description: `${siteConfig.name}的在线简历`,
  openGraph: {
    locale: "zh_CN",
  },
};

export default function ResumePage() {
  return (
    <>
      <DocumentLang lang="zh-CN" />
      <ResumeContent />
    </>
  );
}
