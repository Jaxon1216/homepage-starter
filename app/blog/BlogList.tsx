"use client";

import { clickAttributes } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiTag } from "react-icons/fi";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
}

export function BlogList({ posts, tags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  const changeTag = (tag: string | null) => {
    if (tag === activeTag) return;
    trackEvent("blog_filter_change", { from_tag: activeTag ?? "all", to_tag: tag ?? "all", result_count: tag ? posts.filter(post => post.tags.includes(tag)).length : posts.length });
    setActiveTag(tag);
  };

  return (
    <>
      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => changeTag(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTag === null
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--card)] text-[var(--muted)] border border-[var(--card-border)] hover:text-[var(--foreground)]"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => changeTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activeTag === tag
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--card)] text-[var(--muted)] border border-[var(--card-border)] hover:text-[var(--foreground)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTag || "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {filtered.length === 0 ? (
            <p className="text-center text-[var(--muted)] py-12">
              {posts.length === 0
                ? "No posts yet. Add an .mdx file under content/posts/."
                : "No posts under this tag."}
            </p>
          ) : (
            filtered.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  {...clickAttributes("article_open_click", { article_slug: post.slug, position: i + 1, active_tag: activeTag ?? "all", placement: "blog_list" })}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--accent)]/30 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h2>

                    {post.description && (
                      <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      <span>{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {post.readingTime}
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <FiTag size={12} />
                          {post.tags.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {post.cover && (
                    <div
                      className="relative shrink-0 overflow-hidden rounded-lg bg-[var(--card-border)]/50"
                      style={{
                        width: "var(--blog-thumb-w)",
                        height: "var(--blog-thumb-h)",
                      }}
                    >
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="var(--blog-thumb-w)"
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
