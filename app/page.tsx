import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { MottoBlock } from "@/components/common/MottoBlock";
import { ParticlesWrapper } from "@/components/home/ParticlesWrapper";
import { getAllPosts } from "@/lib/mdx";

const GitHubContribution = dynamic(
  () => import("@/components/home/GitHubContribution").then((m) => m.GitHubContribution)
);

const FeaturedProjects = dynamic(
  () => import("@/components/home/FeaturedProjects").then((m) => m.FeaturedProjects)
);

export default function HomePage() {
  return (
    <>
      <ParticlesWrapper />
      <div className="relative z-10 max-w-5xl mx-auto px-4 particles-passthrough">
        <HeroSection postCount={getAllPosts().length} />
        <GitHubContribution />
        <FeaturedProjects />
        <MottoBlock text="Write, build, and share." />
      </div>
    </>
  );
}
