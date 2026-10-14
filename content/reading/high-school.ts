import type { ReadingStage } from "@/lib/reading";

export const highSchool = {
  key: "demo-literature",
  label: "文学阅读示例",
  labelEn: "Literature Demo",
  period: "",
  premise: "这是虚构阅读记录，用于演示书架布局。",
  clusters: [
    {
      key: "literature",
      short: "文学",
      title: "文学示例",
      thesis: "按主题组织阅读记录。",
    },
  ],
  summary: ["读书笔记为演示内容。"],
  books: [
    {
      id: "demo-literature-book",
      title: "示例文学作品",
      author: "示例作者",
      clusters: ["literature"],
      theme: "展示书籍主题字段。",
      takeaway: "展示读后收获字段。",
    },
  ],
} satisfies ReadingStage;
