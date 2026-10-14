import type { Metadata } from "next";
import { DocumentLang } from "@/components/common/DocumentLang";

export const metadata: Metadata = {
  openGraph: {
    locale: "zh_CN",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocumentLang lang="zh-CN" />
      {children}
    </>
  );
}
