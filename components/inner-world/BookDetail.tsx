"use client";

import { FiX } from "react-icons/fi";
import type { Book, ReadingCluster } from "@/lib/reading";

function splitLead(text: string): { lead: string; rest: string } {
  const idx = text.indexOf("。");
  if (idx === -1 || idx > 28) return { lead: "", rest: text };
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 1).trim() };
}

export function BookDetail({
  book,
  clusters,
  tone,
  onClose,
}: {
  book: Book;
  clusters: ReadingCluster[];
  tone: string;
  onClose: () => void;
}) {
  const tags = book.clusters
    .map((key) => clusters.find((cluster) => cluster.key === key))
    .filter((cluster): cluster is ReadingCluster => Boolean(cluster));
  const takeaway = book.takeaway ? splitLead(book.takeaway) : null;

  return (
    <div className="relative p-5 sm:p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--accent-light)] hover:text-[var(--foreground)]"
        aria-label={`收起《${book.title}》`}
      >
        <FiX size={18} />
      </button>

      <div className="mb-4 flex flex-wrap items-center gap-2 pr-10">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: tone }} aria-hidden />
        {book.progress === "partial" && (
          <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]">
            部分阅读
          </span>
        )}
        {tags.map((tag) => (
          <span
            key={tag.key}
            className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]"
          >
            {tag.short}
          </span>
        ))}
      </div>

      <h3 className="text-2xl font-semibold">《{book.title}》</h3>
      {book.author && <p className="mt-1 text-sm text-[var(--muted)]">{book.author}</p>}

      <div className="mt-6 space-y-5">
        <section>
          <h4 className="mb-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">它真正想表达什么</h4>
          <p className="leading-relaxed">{book.theme}</p>
        </section>
        {takeaway && (
          <section>
            <h4 className="mb-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">我可以带走什么</h4>
            <p className="leading-relaxed">
              {takeaway.lead && <strong className="font-semibold">{takeaway.lead}</strong>}
              {takeaway.lead && takeaway.rest ? " " : null}
              {takeaway.rest}
            </p>
          </section>
        )}
        {book.hindsight && (
          <section>
            <h4 className="mb-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">现在回头看</h4>
            <blockquote className="border-l-2 border-[var(--accent)] pl-4 leading-relaxed text-[var(--foreground)]/90 italic">
              {book.hindsight}
            </blockquote>
          </section>
        )}
      </div>
    </div>
  );
}
