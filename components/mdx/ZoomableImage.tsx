"use client";

import { mediaId, trackEvent } from "@/lib/analytics/client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { FiMaximize2, FiMinus, FiPlus, FiX } from "react-icons/fi";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fitDiagramSvg(svg: string) {
  const viewBox = svg.match(/viewBox="([^"]+)"/i)?.[1];
  const parts = viewBox?.trim().split(/[\s,]+/).map(Number);
  const width = parts && parts.length === 4 && parts[2] > 0 ? Math.ceil(parts[2]) : 1200;
  const height = parts && parts.length === 4 && parts[3] > 0 ? Math.ceil(parts[3]) : 800;
  const suffix = "-zoom";
  // Mermaid scopes fills and label colors to #svg-id. Renaming the id without
  // updating those selectors drops the theme, and SVG rects fall back to black.
  const ids = [...new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))].sort(
    (a, b) => b.length - a.length
  );

  let next = svg;
  for (const id of ids) {
    const escaped = escapeRegExp(id);
    next = next.replace(new RegExp(`#${escaped}(?![\\w-])`, "g"), `#${id}${suffix}`);
    next = next.replace(new RegExp(`\\bid="${escaped}"`, "g"), `id="${id}${suffix}"`);
  }

  return next.replace(/<svg\b([^>]*)>/i, (_, attrs: string) => {
    const cleaned = attrs.replace(/\s(?:width|height|style)="[^"]*"/gi, "");
    return `<svg${cleaned} width="${width}" height="${height}" style="display:block;width:auto;height:auto;max-width:calc(100vw - 2rem);max-height:calc(100vh - 8rem);">`;
  });
}

export function Lightbox({
  src,
  svg,
  alt,
  onClose,
}: {
  src?: string;
  svg?: string;
  alt: string;
  onClose: (reason: "escape" | "overlay" | "button") => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const scaleRef = useRef(1);

  const changeScale = useCallback((delta: number) => {
    const next = clamp(
      Math.round((scaleRef.current + delta) * 100) / 100,
      MIN_SCALE,
      MAX_SCALE
    );
    scaleRef.current = next;
    setScale(next);
    if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose("escape");
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeScale(0.5);
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        changeScale(-0.5);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      changeScale(event.deltaY < 0 ? 0.25 : -0.25);
    };

    const node = dialogRef.current;
    node?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      node?.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [changeScale, onClose]);

  const toggleZoom = () => {
    if (scaleRef.current > MIN_SCALE) {
      changeScale(MIN_SCALE - scaleRef.current);
      return;
    }
    changeScale(1);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-lightbox-controls]")) return;
    if (scale <= MIN_SCALE) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (Math.hypot(dx, dy) <= 4) return;
    suppressClick.current = true;
    setDragging(true);
    setOffset({ x: current.originX + dx, y: current.originY + dy });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest("[data-lightbox-controls], [data-lightbox-image]")) return;
    onClose("overlay");
  };

  const controlClass =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "图片预览"}
      tabIndex={-1}
      className={`lightbox-fade fixed inset-0 z-[100] flex touch-none flex-col bg-black/90 outline-none ${
        dragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-zoom-out"
      }`}
      onClick={onOverlayClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <p className="sr-only">
        按 Esc 关闭。可使用加号、减号、滚轮或双击继续缩放，放大后可拖动查看。
      </p>
      <div
        data-lightbox-controls
        className="z-20 flex shrink-0 items-center justify-end gap-2 px-4 pt-4"
      >
        <button
          type="button"
          className={`${controlClass} ${scale <= MIN_SCALE ? "cursor-default opacity-35" : ""}`}
          aria-label="缩小"
          aria-disabled={scale <= MIN_SCALE}
          onClick={() => {
            if (scale <= MIN_SCALE) return;
            changeScale(-0.5);
          }}
        >
          <FiMinus size={18} />
        </button>
        <span
          className="min-w-12 text-center text-xs tabular-nums text-white/80"
          aria-hidden="true"
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          className={`${controlClass} ${scale >= MAX_SCALE ? "cursor-default opacity-35" : ""}`}
          aria-label="放大"
          aria-disabled={scale >= MAX_SCALE}
          onClick={() => {
            if (scale >= MAX_SCALE) return;
            changeScale(0.5);
          }}
        >
          <FiPlus size={18} />
        </button>
        <button type="button" className={controlClass} aria-label="关闭" onClick={() => onClose("button")}>
          <FiX size={18} />
        </button>
      </div>
      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-4 py-3">
        {svg ? (
          <div
            data-lightbox-image
            className={`rounded-lg bg-white p-3 dark:bg-[#0f172a] ${
              dragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
            }`}
            onDoubleClick={toggleZoom}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              transition: dragging ? "none" : "transform 150ms ease",
            }}
            dangerouslySetInnerHTML={{ __html: fitDiagramSvg(svg) }}
          />
        ) : (
          /* Native img keeps the original file so zoom stays sharp. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            data-lightbox-image
            src={src}
            alt={alt}
            draggable={false}
            className={`max-h-full min-h-0 max-w-full min-w-0 object-contain select-none ${
              dragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
            }`}
            onDoubleClick={toggleZoom}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
              transition: dragging ? "none" : "transform 150ms ease",
            }}
          />
        )}
      </div>
      {alt ? (
        <p className="pointer-events-none line-clamp-2 shrink-0 px-6 pb-4 text-center text-sm text-white/75">
          {alt}
        </p>
      ) : (
        <div className="h-4 shrink-0" />
      )}
    </div>
  );
}

export function ZoomableImage({
  className,
  alt,
  src,
  style,
  onClick,
  onKeyDown,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const [open, setOpen] = useState(false);
  const trackedId = useRef("");
  const close = useCallback((reason: "escape" | "overlay" | "button") => {
    trackEvent("media_close", { media_type: "image", media_id: trackedId.current, reason });
    setOpen(false);
  }, []);
  const openImage = (element: Element) => {
    if (open) return;
    trackedId.current = mediaId(element);
    setOpen(true);
  };

  if (typeof src !== "string" || src.length === 0) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={src}
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <>
      <span className="zoomable-frame group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...props}
          src={src}
          alt={alt ?? ""}
          draggable={false}
          className={[
            className,
            "cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ ...style, margin: 0 }}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label={alt ? `放大查看：${alt}` : "放大查看图片"}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            if (event.currentTarget.closest("a")) return;
            openImage(event.currentTarget);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.currentTarget.closest("a")) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openImage(event.currentTarget);
            }
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/55 text-white opacity-80 shadow-sm sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
        >
          <FiMaximize2 size={14} />
        </span>
      </span>
      {open
        ? createPortal(
            <Lightbox src={src} alt={alt ?? ""} onClose={close} />,
            document.body
          )
        : null}
    </>
  );
}
