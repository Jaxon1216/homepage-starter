"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Book, ReadingCluster } from "@/lib/reading";
import { BookDetail } from "./BookDetail";

function hashTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 33 + title.charCodeAt(i)) >>> 0;
  return hash;
}

function spineMetrics(title: string) {
  const hash = hashTitle(title);
  const chars = Array.from(`《${title}》`).length;
  const height = Math.max(168 + (hash % 3) * 22, chars * 16 + 32);
  const width = 40 + ((hash >> 3) % 3) * 6;
  return { height, width };
}

function toneOf(book: Book, clusters: ReadingCluster[]) {
  const index = clusters.findIndex((cluster) => cluster.key === book.clusters[0]);
  const slot = index >= 0 ? (index % 4) + 1 : (hashTitle(book.title) % 4) + 1;
  return {
    background: `var(--spine-${slot})`,
    ink: `var(--spine-${slot}-ink)`,
  };
}

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

export function Bookshelf({
  stageKey,
  books,
  clusters,
  selectedTitle,
  onSelect,
  activeCluster,
  pinnedCluster,
  onClusterHover,
  onClusterPin,
}: {
  stageKey: string;
  books: Book[];
  clusters: ReadingCluster[];
  selectedTitle: string | null;
  onSelect: (title: string | null, reason?: string) => void;
  activeCluster: string | null;
  pinnedCluster: string | null;
  onClusterHover: (key: string | null) => void;
  onClusterPin: (key: string) => void;
}) {
  const reduce = useReducedMotion();
  const selected = books.find((book) => book.title === selectedTitle) ?? null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onSelect(null, "escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onSelect]);

  useEffect(() => {
    if (!selectedTitle) return;
    document.getElementById(`reading-detail-${stageKey}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [selectedTitle, stageKey, reduce]);

  if (books.length === 0) {
    return (
      <div>
        <div className="flex items-end gap-2 px-1 pt-4">
          {[78, 96, 70].map((height) => (
            <div
              key={height}
              aria-hidden
              className="book-spine-placeholder shrink-0"
              style={{ height, width: 28 }}
            />
          ))}
          <p className="pb-2 pl-3 text-sm text-[var(--muted)]">在读中</p>
        </div>
        <div className="shelf-board" />
      </div>
    );
  }

  return (
    <div>
      {clusters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" role="toolbar" aria-label="按主线筛选">
          {clusters.map((cluster, index) => {
            const active = activeCluster === cluster.key;
            return (
              <button
                key={cluster.key}
                type="button"
                aria-pressed={pinnedCluster === cluster.key}
                onMouseEnter={() => onClusterHover(cluster.key)}
                onMouseLeave={() => onClusterHover(null)}
                onFocus={() => onClusterHover(cluster.key)}
                onBlur={() => onClusterHover(null)}
                onClick={() => onClusterPin(cluster.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--foreground)]"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `var(--spine-${index + 1})` }}
                  aria-hidden
                />
                {cluster.short}
              </button>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar pt-4 pb-5 md:overflow-visible">
        <div className="w-max">
          <div className="bookshelf-row flex items-end gap-2 px-1">
            {books.map((book) => {
              const { height, width } = spineMetrics(book.title);
              const tone = toneOf(book, clusters);
              const dimmed = activeCluster !== null && !book.clusters.includes(activeCluster);
              const open = selected?.title === book.title;
              const partial = book.progress === "partial";

              return (
                <div
                  key={book.title}
                  className={`book-slot ${dimmed ? "is-dimmed" : ""}`}
                  style={{ height, width }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onSelect(open ? null : book.title)}
                    animate={reduce ? undefined : { y: open ? -12 : 0 }}
                    whileHover={reduce || open ? undefined : { y: -10, rotateX: 8 }}
                    transition={spring}
                    className={`book-spine h-full w-full ${open ? "is-open" : ""}`}
                          style={{ backgroundColor: tone.background, color: tone.ink, borderRadius: 8 }}
                    aria-pressed={open}
                    aria-label={`《${book.title}》${book.author ? `，${book.author}` : ""}${partial ? "，部分阅读" : ""}`}
                  >
                    <span className="book-spine-title">《{book.title}》</span>
                  </motion.button>
                </div>
              );
            })}
          </div>
          <div className="shelf-board" aria-hidden />
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] md:hidden">横向滑动，点开一本书</p>

      {selected && (
        <div id={`reading-detail-${stageKey}`} className="book-detail-shell mt-6">
          <BookDetail
            key={selected.title}
            book={selected}
            clusters={clusters}
            tone={toneOf(selected, clusters).background}
            onClose={() => onSelect(null, "button")}
          />
        </div>
      )}
    </div>
  );
}
