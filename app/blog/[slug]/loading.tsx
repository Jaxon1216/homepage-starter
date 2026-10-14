export default function BlogPostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-28 rounded bg-[var(--card)] mb-8" />

      {/* Title */}
      <div className="mb-8">
        <div className="h-9 w-3/4 rounded bg-[var(--card)] mb-4" />
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded bg-[var(--card)]" />
          <div className="h-4 w-20 rounded bg-[var(--card)]" />
        </div>
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-14 rounded bg-[var(--card)]" />
          <div className="h-5 w-18 rounded bg-[var(--card)]" />
          <div className="h-5 w-12 rounded bg-[var(--card)]" />
        </div>
      </div>

      {/* Content paragraphs */}
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-[var(--card)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--card)]" />
        <div className="h-4 w-full rounded bg-[var(--card)]" />
        <div className="h-4 w-4/6 rounded bg-[var(--card)]" />

        <div className="h-6 w-1/3 rounded bg-[var(--card)] mt-8" />

        <div className="h-4 w-full rounded bg-[var(--card)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--card)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--card)]" />

        {/* Code block placeholder */}
        <div className="h-32 w-full rounded-lg bg-[var(--card)] border border-[var(--card-border)] mt-4" />

        <div className="h-4 w-full rounded bg-[var(--card)]" />
        <div className="h-4 w-2/3 rounded bg-[var(--card)]" />
      </div>
    </div>
  );
}
