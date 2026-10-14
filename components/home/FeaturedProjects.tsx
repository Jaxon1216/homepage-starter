"use client";

import { clickAttributes, viewAttributes } from "@/lib/analytics/events";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { siteConfig, type Project } from "@/lib/site-config";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  resume: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  vibecoding: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  ForStudy: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  Developing: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
};

function getCategoryLabel(key: string) {
  return siteConfig.projectCategories.find((c) => c.key === key)?.label ?? key;
}

export function FeaturedProjects() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16"
    >
      <h2 className="text-2xl font-bold text-center mb-8">Selected Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {siteConfig.projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </motion.section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const colors = categoryColors[project.category] ?? categoryColors.resume;
  const categoryLabel = getCategoryLabel(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      {...viewAttributes("project_impression", { project_id: project.id, category: project.category })}
      className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--accent)]/30 transition-colors group flex flex-col"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
          {project.name}
        </h3>
        <div className="flex gap-2 shrink-0 ml-2">
          {project.github && (
            <a
              href={project.github}
              {...clickAttributes("project_click", { project_id: project.id, category: project.category, destination: "github", placement: "home_projects" })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={16} />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              {...clickAttributes("project_click", { project_id: project.id, category: project.category, destination: "demo", placement: "home_projects" })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="Live link"
            >
              <FiExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <span
          className={`px-2 py-0.5 text-xs rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {categoryLabel}
        </span>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded bg-[var(--accent-light)] text-[var(--accent)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
