import type React from "react";

export interface Experience {
  title: string;
  company: string;
  companyIcon?: React.ComponentType<{ size?: number; className?: string }>;
  period: string;
  summary?: string;
  points: string[];
}

export interface ResumeProject {
  name: string;
  role?: string;
  tech: string;
  summary?: string;
  points: string[];
}

export interface ResumeVersion {
  key: string;
  label: string;
  date: string;
  hidden?: boolean; // 用于控制是否展示该版本
  header: { name: string; email: string; github: string; blog: string };
  sections: {
    summary: string;
    personalEvaluation?: string[];
    education: { school: string; degree: string; gpa: string; period: string; details: string[] }[];
    skills: string[];
    experience: Experience[];
    projects: ResumeProject[];
    openSource?: ResumeProject[];
  };
}
