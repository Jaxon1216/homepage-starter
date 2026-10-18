"use client";

import { useEffect } from "react";

const DEFAULT_LANG = "en";

export function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = DEFAULT_LANG;
    };
  }, [lang]);

  return null;
}
