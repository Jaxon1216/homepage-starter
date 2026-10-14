"use client";

import { MotionConfig } from "framer-motion";
import type { ReadingStage } from "@/lib/reading";
import { StageSection } from "./StageSection";

export function InnerWorldContent({ stages }: { stages: ReadingStage[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-16">
          <p className="mb-4 text-xs tracking-[0.28em] text-[var(--muted)] uppercase">Inner World</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">读过的书</h1>
        </header>

        <div className="space-y-20">
          {stages.map((stage) => (
            <StageSection key={stage.key} stage={stage} />
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}
