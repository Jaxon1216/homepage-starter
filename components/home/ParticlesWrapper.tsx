"use client";

import dynamic from "next/dynamic";

const ParticlesBg = dynamic(
  () => import("@/components/home/ParticlesBg").then((mod) => mod.ParticlesBg),
  { ssr: false }
);

export function ParticlesWrapper() {
  return <ParticlesBg />;
}
