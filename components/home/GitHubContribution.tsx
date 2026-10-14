"use client";

import { clickAttributes, viewAttributes } from "@/lib/analytics/events";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { siteConfig } from "@/lib/site-config";

const CHART_SRC = `https://ghchart.rshah.org/2563eb/${siteConfig.github}`;

export function GitHubContribution() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      // Sentinel is ~150px below the fold. 200px (comments) would still fetch on first paint.
      { rootMargin: "80px" }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16"
    >
      <h2 className="text-2xl font-bold text-center mb-8">GitHub</h2>

      <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6 overflow-x-auto">
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
        <div className="w-full max-w-3xl mx-auto aspect-[8/1]">
          {isVisible ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={CHART_SRC}
              alt="GitHub Contribution Graph"
              data-analytics-resource-id="github_contribution"
              {...viewAttributes("github_chart_view", { placement: "home_github" })}
              width={896}
              height={112}
              className="w-full h-auto dark:brightness-90"
            />
          ) : null}
        </div>
      </div>

      <div className="text-center mt-4">
        <a
          href={`https://github.com/${siteConfig.github}`}
          {...clickAttributes("contact_click", { channel: "github", placement: "home_github" })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
        >
          <FiGithub size={16} />
          View GitHub
        </a>
      </div>
    </motion.section>
  );
}
