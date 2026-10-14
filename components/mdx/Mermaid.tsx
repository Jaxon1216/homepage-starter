"use client";

import { mediaId, trackEvent } from "@/lib/analytics/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { FiMaximize2 } from "react-icons/fi";
import { Lightbox } from "./ZoomableImage";

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const trackedId = useRef("");
  const close = useCallback((reason: "escape" | "overlay" | "button") => {
    trackEvent("media_close", { media_type: "mermaid", media_id: trackedId.current, reason });
    setOpen(false);
  }, []);
  const openDiagram = (element: Element) => {
    if (open) return;
    trackedId.current = mediaId(element);
    setOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        gantt: {
          useWidth: 800,
          barHeight: 20,
          barGap: 4,
          topPadding: 40,
          sectionFontSize: 13,
          numberSectionStyles: 4,
        },
      });
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      return mermaid.render(id, chart.trim()).then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      });
    }).catch(() => {
      if (!cancelled) trackEvent("resource_error", { resource_type: "mermaid", resource_id: "diagram", error_code: "render_failed" }, "mermaid-render");
    });
    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme]);

  if (!svg) {
    return <div data-analytics-media="mermaid" className="my-6 min-h-8" aria-hidden="true" />;
  }

  return (
    <>
      <div className="group relative my-6">
        <div
          className="cursor-zoom-in overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [&_svg]:max-w-full"
          data-analytics-media="mermaid"
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label="放大查看图表"
          onClick={(event) => openDiagram(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openDiagram(event.currentTarget);
            }
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/55 text-white opacity-80 shadow-sm sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
        >
          <FiMaximize2 size={14} />
        </span>
      </div>
      {open
        ? createPortal(
            <Lightbox svg={svg} alt="图表" onClose={close} />,
            document.body
          )
        : null}
    </>
  );
}
