import { highSchool } from "@/content/reading/high-school";
import { university } from "@/content/reading/university";

export interface ReadingCluster {
  key: string;
  /** 书脊图例、标签上的短名 */
  short: string;
  title: string;
  thesis: string;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  cover?: string;
  /** 它真正想表达什么 */
  theme: string;
  /** 我可以带走什么。选读、未读完时可以不写 */
  takeaway?: string;
  /** 现在回头看的一句话 */
  hindsight?: string;
  /** 所属主线 key，第一个决定书脊颜色 */
  clusters: string[];
  /** 未写时视为读完 */
  progress?: "finished" | "partial";
}

export interface ReadingStage {
  key: string;
  label: string;
  labelEn: string;
  period: string;
  premise: string;
  clusters: ReadingCluster[];
  summary: string[];
  books: Book[];
  afterword?: string;
  status?: "reading" | "done";
}

/** 越晚读的排越前。 */
export const readingStages: ReadingStage[] = [university, highSchool];
