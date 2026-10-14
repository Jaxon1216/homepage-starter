import type { ResumeVersion } from "@/types/resume";
import { siteConfig } from "@/lib/site-config";

const header = {
  name: siteConfig.name,
  email: siteConfig.email,
  github: siteConfig.github,
  blog: new URL(siteConfig.url).host,
};

export const resumeVersions: ResumeVersion[] = [
  {
    key: "demo-current",
    label: "示例简历 · 当前版",
    date: "2026-01",
    header,
    sections: {
      summary: "这是虚构的演示简历，用于展示布局与版本切换，请替换为自己的内容。",
      education: [
        {
          school: "示例大学（虚构）",
          degree: "计算机相关专业",
          gpa: "",
          period: "2022 - 2026",
          details: ["课程与经历仅为演示。"],
        },
      ],
      skills: ["TypeScript、React 与 Next.js（示例技能）"],
      experience: [
        {
          title: "开发实习生（虚构）",
          company: "示例公司（虚构）",
          period: "2025",
          summary: "用于展示经历列表的演示记录。",
          points: ["参与示例网站的页面开发。", "未使用真实业务指标或内部信息。"],
        },
      ],
      projects: [
        {
          name: "Homepage Starter",
          tech: "Next.js, React, TypeScript",
          summary: "演示项目",
          points: ["通过配置替换站点身份。", "通过 MDX 编写文章。"],
        },
      ],
    },
  },
  {
    key: "demo-previous",
    label: "示例简历 · 初始版",
    date: "2025-01",
    header,
    sections: {
      summary: "这是虚构的历史版本，用于验证切换交互。",
      education: [
        {
          school: "示例大学（虚构）",
          degree: "计算机相关课程（示例）",
          gpa: "",
          period: "2022 - 2026",
          details: ["仅用于演示历史简历的教育信息。"],
        },
      ],
      skills: ["HTML、CSS、JavaScript（示例技能）"],
      experience: [],
      projects: [
        {
          name: "Demo Tool",
          tech: "React",
          points: ["演示项目条目的布局。"],
        },
      ],
    },
  },
];
