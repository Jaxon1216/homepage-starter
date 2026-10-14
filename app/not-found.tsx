import Link from "next/link";

export default function NotFound() {
  return (
    <div data-analytics-page="not_found" className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="text-8xl font-bold text-[var(--accent)] animate-fade-up">
        404
      </p>

      <h1 className="mt-6 text-2xl font-bold animate-fade-up [animation-delay:0.1s]">
        Page not found
      </h1>

      <p className="mt-3 text-[var(--muted)] animate-fade-up [animation-delay:0.2s]">
        This page doesn&apos;t exist. It may have been moved, or the link is wrong.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4 animate-fade-up [animation-delay:0.3s]">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back home
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-lg border border-[var(--card-border)] text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
        >
          Read the blog
        </Link>
      </div>
    </div>
  );
}
