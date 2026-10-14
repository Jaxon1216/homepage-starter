"use client";

import { trackEvent } from "@/lib/analytics/client";
import { clickAttributes } from "@/lib/analytics/events";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBook,
  FiTool,
  FiBriefcase,
  FiFolder,
  FiMail,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import { MottoBlock } from "@/components/common/MottoBlock";

import { resumeVersions } from "@/content/profile/resume";

export function ResumeContent() {
  const visibleVersions = resumeVersions.filter((v) => !v.hidden);
  const [activeVersion, setActiveVersion] = useState(visibleVersions[0].key);
  const version = visibleVersions.find((v) => v.key === activeVersion)!;
  const v = version.sections;
  const h = version.header;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Left: Timeline */}
        <div className="sm:w-48 flex-shrink-0">
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-4">
            版本历史
          </h2>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[var(--card-border)]" />
            <div className="space-y-4">
              {visibleVersions.map((ver) => {
                const isActive = ver.key === activeVersion;
                return (
                  <button
                    key={ver.key}
                    onClick={() => { if (ver.key === activeVersion) return; trackEvent("resume_version_change", { from_version: activeVersion, to_version: ver.key }); setActiveVersion(ver.key); }}
                    className="relative flex items-center gap-3 w-full text-left group"
                  >
                    <div
                      className={`relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "bg-[var(--background)] border-[var(--card-border)] group-hover:border-[var(--accent)]"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium transition-colors ${
                          isActive
                            ? "text-[var(--accent)]"
                            : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                        }`}
                      >
                        {ver.label}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{ver.date}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Resume */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVersion}
              data-analytics-resume-version={activeVersion}
              data-analytics-links="resume_body"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="border-b-2 border-[var(--accent)] pb-4 mb-6">
                <h1 className="text-3xl font-bold mb-2">{h.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
                  {h.email && (
                    <a
                      href={`mailto:${h.email}`}
                      {...clickAttributes("contact_click", { channel: "email", placement: "resume_header", resume_version: activeVersion })}
                      className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                    >
                      <FiMail size={14} />
                      {h.email}
                    </a>
                  )}
                  <a
                    href={`https://github.com/${h.github}`}
                    {...clickAttributes("contact_click", { channel: "github", placement: "resume_header", resume_version: activeVersion })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                  >
                    <FiGithub size={14} />
                    {h.github}
                  </a>
                  {h.blog && (
                    <a
                      href={`https://${h.blog}`}
                      {...clickAttributes("contact_click", { channel: "blog", placement: "resume_header", resume_version: activeVersion })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                    >
                      <FiGlobe size={14} />
                      {h.blog}
                    </a>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6 text-sm text-[var(--muted)] leading-relaxed">
                {formatResumeText(v.summary)}
              </div>

              {/* Education */}
              <ResumeSection icon={FiBook} title="教育背景">
                {v.education.map((edu) => (
                  <div key={edu.school} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div>
                        <span className="font-medium">{edu.school}</span>
                        <span className="text-[var(--muted)] mx-2">{edu.degree}</span>
                        {edu.gpa && <span className="text-[var(--muted)]">{edu.gpa}</span>}
                      </div>
                      <span className="text-sm text-[var(--muted)]">{edu.period}</span>
                    </div>
                    {edu.details.length > 0 && (
                      <ul className="mt-1 text-sm text-[var(--muted)] list-disc list-inside marker:text-[var(--accent)]">
                        {edu.details.map((d, i) => (
                          <li key={i}>{formatResumeText(d)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ResumeSection>

              {/* Skills */}
              <ResumeSection icon={FiTool} title="专业技能">
                <ul className="space-y-1.5 text-sm">
                  {v.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                      <span>{formatResumeText(skill)}</span>
                    </li>
                  ))}
                </ul>
              </ResumeSection>

              {/* Experience */}
              {v.experience.length > 0 && (
                <ResumeSection icon={FiBriefcase} title="实习经历">
                  {v.experience.map((exp) => (
                    <div key={exp.title} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <div className="flex items-center gap-1.5">
                          {exp.companyIcon && (
                            <exp.companyIcon size={15} className="text-[var(--accent)]" />
                          )}
                          <span className="font-medium">{exp.company}</span>
                          <span className="text-[var(--muted)] mx-1">{exp.title}</span>
                        </div>
                        <span className="text-sm text-[var(--muted)]">{exp.period}</span>
                      </div>
                      {exp.summary && (
                        <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                          {formatResumeText(exp.summary)}
                        </p>
                      )}
                      <ul className="mt-2 text-sm text-[var(--muted)] list-disc list-inside marker:text-[var(--accent)] space-y-1">
                        {exp.points.map((p, i) => (
                          <li key={i}>{formatResumeText(p)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ResumeSection>
              )}

              {/* Projects */}
              {v.projects.length > 0 && (
                <ResumeSection icon={FiFolder} title="项目经历">
                  {v.projects.map((proj) => (
                    <div key={proj.name} className="mb-4 last:mb-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="font-medium">{proj.name}</h4>
                        {proj.role && (
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                            {proj.role}
                          </span>
                        )}
                        <span className="text-xs text-[var(--accent)]">{proj.tech}</span>
                      </div>
                      {proj.summary && (
                        <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
                          {formatResumeText(proj.summary)}
                        </p>
                      )}
                      <ul className="mt-2 text-sm text-[var(--muted)] list-disc list-inside marker:text-[var(--accent)] space-y-1">
                        {proj.points.map((p, i) => (
                          <li key={i}>{formatResumeText(p)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ResumeSection>
              )}

              {v.openSource && v.openSource.length > 0 && (
                <ResumeSection icon={FiGithub} title="开源贡献">
                  {v.openSource.map((project) => (
                    <div key={project.name} className="mb-4 last:mb-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="font-medium">{project.name}</h4>
                        <span className="text-xs text-[var(--accent)]">{project.tech}</span>
                      </div>
                      <ul className="mt-2 text-sm text-[var(--muted)] list-disc list-inside marker:text-[var(--accent)] space-y-1">
                        {project.points.map((point, i) => (
                          <li key={i}>{formatResumeText(point)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ResumeSection>
              )}

              {v.personalEvaluation && v.personalEvaluation.length > 0 && (
                <ResumeSection icon={FiUser} title="个人评价">
                  <ul className="space-y-1.5 text-sm">
                    {v.personalEvaluation.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--muted)]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                        <span>{formatResumeText(line)}</span>
                      </li>
                    ))}
                  </ul>
                </ResumeSection>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <MottoBlock text="This resume contains fictional demo content." />
    </div>
  );
}

function formatResumeText(content: string) {
  return (
    <>
      {content.split(/(\*\*.+?\*\*)/).map((part, index) => {
        const isEmphasized = part.startsWith("**") && part.endsWith("**");
        const text = isEmphasized ? part.slice(2, -2) : part;

        return (
          <Fragment key={index}>
            {isEmphasized ? (
              <strong className="font-semibold text-[var(--foreground)]">
                {formatResumeLinks(text)}
              </strong>
            ) : (
              formatResumeLinks(text)
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function formatResumeLinks(content: string) {
  return content.split(/(https?:\/\/[^\s|，。；、！？）】》]+)/g).map((part, index) => {
    if (!part.startsWith("http://") && !part.startsWith("https://")) {
      return part;
    }

    return (
      <a
        key={`${part}-${index}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
      >
        {part}
      </a>
    );
  });
}

function ResumeSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h3 className="flex items-center gap-2 text-base font-semibold mb-3 pb-2 border-b border-[var(--card-border)]">
        <Icon size={16} className="text-[var(--accent)]" />
        {title}
      </h3>
      {children}
    </section>
  );
}
