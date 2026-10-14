"use client";

import { trackEvent } from "@/lib/analytics/client";
import { useState } from "react";
import type { Book, ReadingStage } from "@/lib/reading";
import { Bookshelf } from "./Bookshelf";

function readingCount(books: Book[]) {
  const partial = books.filter((book) => book.progress === "partial").length;
  const finished = books.length - partial;
  if (partial === 0) return `${books.length} 本`;
  if (finished === 0) return `${partial} 本选读`;
  return `${finished} 本读完 · ${partial} 本选读`;
}

export function StageSection({ stage }: { stage: ReadingStage }) {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [pinnedCluster, setPinnedCluster] = useState<string | null>(null);
  const activeCluster = hoveredCluster ?? pinnedCluster;

  const selectBook = (title: string | null, reason = "toggle") => {
    if (title === selectedTitle) return;
    const previous = stage.books.find(book => book.title === selectedTitle);
    const next = stage.books.find(book => book.title === title);
    if (previous) trackEvent("book_close", { book_id: previous.id, stage_id: stage.key, reason: next ? "switch" : reason });
    if (next) trackEvent("book_open", { book_id: next.id, stage_id: stage.key, cluster_id: pinnedCluster ?? "all" });
    setSelectedTitle(title);
  };

  return (
    <section id={`stage-${stage.key}`} className="scroll-mt-24">
      <div className="mb-6 border-b border-[var(--card-border)] pb-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">
            {stage.label}
            {stage.period ? (
              <span className="font-normal text-[var(--muted)]"> · {stage.period}</span>
            ) : null}
          </h2>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {stage.books.length > 0 && (
              <span className="tracking-normal normal-case">{readingCount(stage.books)}</span>
            )}
            <span>{stage.labelEn}</span>
          </div>
        </div>
        {stage.premise ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{stage.premise}</p>
        ) : null}
      </div>

      <Bookshelf
        stageKey={stage.key}
        books={stage.books}
        clusters={stage.clusters}
        selectedTitle={selectedTitle}
        onSelect={selectBook}
        activeCluster={activeCluster}
        pinnedCluster={pinnedCluster}
        onClusterHover={setHoveredCluster}
        onClusterPin={(key) => setPinnedCluster((prev) => prev === key ? null : key)}
      />

    </section>
  );
}
