"use client";

import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiCalendar } from "react-icons/fi";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { MottoBlock } from "@/components/common/MottoBlock";
import type { ReactNode } from "react";

interface PostContentProps {
  meta: PostMeta;
  children: ReactNode;
}

export function PostContent({ meta, children }: PostContentProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back to posts
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="mb-4 text-[1.75rem] leading-[1.35] font-semibold sm:text-[1.875rem]">
            {meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <FiCalendar size={14} />
              {formatDate(meta.date)}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              {meta.readingTime}
            </span>
          </div>
          {meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded bg-[var(--accent-light)] text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div id="post-content" data-analytics-article={meta.slug} data-analytics-reading-seconds={meta.readingSeconds} data-analytics-links="article_body" className="prose max-w-none">
          {children}
        </div>
      </motion.article>

      <MottoBlock text="The only true wisdom is in knowing you know nothing." />

      <GiscusComments />

      <ArticleToc />
    </div>
  );
}
