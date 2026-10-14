"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { integrationConfig } from "@/lib/integrations";

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    if (!integrationConfig.giscus.enabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleIntersection]);

  useEffect(() => {
    if (!integrationConfig.giscus.enabled) return;
    if (!isVisible || !containerRef.current) return;

    const container = containerRef.current;
    const existing = container.querySelector("iframe.giscus-frame");

    if (existing) {
      const iframe = existing as HTMLIFrameElement;
      const theme = resolvedTheme === "dark" ? "dark" : "light";
      iframe.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app"
      );
      return;
    }

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", integrationConfig.giscus.repo);
    script.setAttribute("data-repo-id", integrationConfig.giscus.repoId);
    script.setAttribute("data-category", integrationConfig.giscus.category);
    script.setAttribute("data-category-id", integrationConfig.giscus.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute(
      "data-theme",
      resolvedTheme === "dark" ? "dark" : "light"
    );
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
  }, [isVisible, resolvedTheme]);

  if (!integrationConfig.giscus.enabled) return null;

  return (
    <div className="mt-12">
      <div ref={sentinelRef} />
      <div ref={containerRef} />
    </div>
  );
}
