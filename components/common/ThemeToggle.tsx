"use client";

import { trackEvent } from "@/lib/analytics/client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => { const next = resolvedTheme === "dark" ? "light" : "dark"; trackEvent("theme_change", { from_theme: resolvedTheme ?? theme ?? "system", to_theme: next }); setTheme(next); }}
      className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
