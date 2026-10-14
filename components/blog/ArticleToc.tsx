"use client";

import { useEffect, useRef, useState } from "react";
import { FiList } from "react-icons/fi";
import { ARTICLE_HEADING_OFFSET, getActiveHeadingIndex, getTocScrollTop } from "@/lib/article-toc";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function ArticleToc() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [indicatorStyle, setIndicatorStyle] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const [followPaused, setFollowPaused] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const allHeadingElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#post-content h1, #post-content h2, #post-content h3, #post-content h4, #post-content h5, #post-content h6"
      )
    );

    const availableLevels = allHeadingElements
      .map((element) => Number(element.tagName.replace("H", "")))
      .filter((level) => Number.isFinite(level));

    const topLevel = availableLevels.length > 0 ? Math.min(...availableLevels) : null;
    const secondLevel = topLevel !== null && topLevel < 6 ? topLevel + 1 : null;

    if (topLevel === null) return;

    const elements = allHeadingElements
      .map((element) => {
        const level = Number(element.tagName.replace("H", ""));
        const text = element.textContent?.trim() ?? "";

        if (
          !element.id ||
          !text ||
          (level !== topLevel && level !== secondLevel)
        ) {
          return null;
        }

        return {
          id: element.id,
          text,
          level,
        };
      })
      .filter((item): item is HeadingItem => item !== null);

    if (elements.length === 0) return;
    const initFrame = requestAnimationFrame(() => {
      setHeadings(elements);
    });

    const observers = elements
      .map((item) => document.getElementById(item.id))
      .filter((item): item is HTMLElement => item !== null);

    const article = document.getElementById("post-content");
    let frame = 0;
    const updateActiveHeading = () => {
      frame = 0;
      const articleRect = article?.getBoundingClientRect();
      // Use the end of the article, rather than the comments/footer below it.
      const atArticleEnd = !!articleRect && articleRect.top < ARTICLE_HEADING_OFFSET &&
        articleRect.bottom <= window.innerHeight;
      const index = getActiveHeadingIndex(
        observers.map((element) => element.getBoundingClientRect().top),
        ARTICLE_HEADING_OFFSET,
        atArticleEnd
      );
      setActiveId(observers[index]?.id ?? "");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveHeading);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    if (article) resizeObserver.observe(article);
    scheduleUpdate();

    return () => {
      cancelAnimationFrame(initFrame);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => () => {
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const updateIndicator = () => {
      const nav = navRef.current;
      const activeItem = itemRefs.current[activeId];
      if (!nav || !activeItem || nav.clientHeight === 0) return;

      // The indicator and items share one positioned, scrollable content layer.
      setIndicatorStyle({
        top: activeItem.offsetTop + 4,
        height: Math.max(20, activeItem.offsetHeight - 8),
      });
      if (followPaused) return;
      const top = getTocScrollTop(
        nav.scrollTop, nav.clientHeight, activeItem.offsetTop,
        activeItem.offsetHeight, nav.scrollHeight
      );
      if (Math.abs(top - nav.scrollTop) > 1) {
        nav.scrollTo({ top, behavior: "instant" });
      }
    };

    const frame = requestAnimationFrame(updateIndicator);
    const resizeObserver = new ResizeObserver(updateIndicator);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (navRef.current) resizeObserver.observe(navRef.current);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [activeId, headings, followPaused]);

  const pauseFollowing = () => {
    setFollowPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setFollowPaused(false), 1800);
  };

  if (headings.length === 0) {
    return null;
  }

  const topLevel = Math.min(...headings.map((heading) => heading.level));
  const secondLevel = topLevel < 6 ? topLevel + 1 : null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top = window.scrollY + element.getBoundingClientRect().top - ARTICLE_HEADING_OFFSET;
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    setFollowPaused(false);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <aside className="hidden min-[1400px]:block fixed top-28 left-[calc(50%+26rem)] w-64">
      <div>
        <div className="mb-4">
          <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <FiList aria-hidden="true" size={16} />
            On this page
          </p>
        </div>

        <nav
          ref={navRef}
          aria-label="Table of contents"
          tabIndex={0}
          onWheel={pauseFollowing}
          onTouchMove={pauseFollowing}
          onPointerDown={pauseFollowing}
          onKeyDown={(event) => {
            if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab"].includes(event.key)) {
              pauseFollowing();
            }
          }}
          className="no-scrollbar max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain pr-2"
        >
          <div ref={containerRef} className="relative pl-6">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-[var(--card-border)]" />
            {indicatorStyle && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 w-0.5 bg-[var(--accent)] transition-[top,height] duration-200 motion-reduce:transition-none"
                style={indicatorStyle}
              />
            )}
            <ul className="space-y-1">
              {headings.map((heading) => {
                const isActive = heading.id === activeId;

                return (
                  <li
                    key={heading.id}
                    ref={(node) => {
                      itemRefs.current[heading.id] = node;
                    }}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToHeading(heading.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={[
                        "group flex w-full items-start rounded-md py-1.5 text-left text-sm leading-5 transition-colors",
                        heading.level === secondLevel
                          ? "pl-4 font-normal"
                          : "font-medium",
                        isActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]",
                      ].join(" ")}
                    >
                      <span className="min-w-0 flex-1 break-words">{heading.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
