import type { ReadingStage } from "@/lib/reading";

export const university = {
  key: "demo-learning",
  label: "学习阅读示例",
  labelEn: "Learning Demo",
  period: "",
  premise: "按自己的阅读主题替换这些演示数据。",
  clusters: [],
  summary: [],
  books: [
    {
      id: "demo-learning-book",
      title: "示例技术读物",
      author: "示例作者",
      progress: "partial",
      clusters: [],
      theme: "展示正在阅读的状态。",
    },
  ],
} satisfies ReadingStage;
