const xUrl = "https://example.com/social";
export const siteConfig = {
  name: "示例作者",
  nameEn: "Demo Author",
  avatar: "/avatar.svg",
  title: "Homepage Starter",
  description: "A configurable blog and personal homepage starter.",
  url: "https://example.com",
  github: "octocat",
  email: "hello@example.com",
  x: xUrl,
  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Resume", href: "/resume" },
    { label: "Inner World", href: "/inner-world" },
    { label: "About", href: "/about" },
  ],
  footer: {
    contactLinks: [
      { label: "GitHub", href: "https://github.com/octocat", type: "github" as const },
      { label: "hello@example.com", href: "mailto:hello@example.com", type: "email" as const },
    ],
    friendLinks: [{ label: "Example Site", href: "https://example.com" }],
  },
  particles: { enabled: true, pages: ["/"], mobileParticleCount: 30, desktopParticleCount: 100 },
  projects: [
    { id: "starter", name: "Homepage Starter", description: "A demo project for a personal blog.", tags: ["Next.js", "TypeScript"], link: "https://example.com", github: "https://github.com/octocat", category: "ForStudy" as const },
    { id: "demo-tool", name: "Demo Tool", description: "A fictional project showing the project card layout.", tags: ["React"], link: "https://example.com/tool", github: "https://github.com/octocat", category: "resume" as const },
  ],
  projectCategories: [
    { key: "resume", label: "Portfolio" },
    { key: "vibecoding", label: "Experiments" },
    { key: "ForStudy", label: "Learning" },
    { key: "Developing", label: "In Progress" },
  ],
};
export type Project = (typeof siteConfig)["projects"][number];
