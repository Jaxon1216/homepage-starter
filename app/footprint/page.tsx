import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "足迹",
  description: "我的旅行足迹",
};

export default function FootprintPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-8">足迹地图</h1>
      <div className="p-12 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
        <p className="text-[var(--muted)] text-lg mb-2">Coming Soon</p>
        <p className="text-sm text-[var(--muted)]">
          这里将展示我的旅行足迹地图，敬请期待
        </p>
      </div>
    </div>
  );
}
