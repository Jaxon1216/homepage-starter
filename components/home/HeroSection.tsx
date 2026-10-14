"use client";

import { clickAttributes } from "@/lib/analytics/events";
import { motion } from "framer-motion";
import { FiGithub, FiMail, FiFileText, FiCode, FiBookOpen } from "react-icons/fi";
import { SiX } from "react-icons/si";
import { siteConfig } from "@/lib/site-config";

const nameChars = siteConfig.name.split("");

const roles = ["Frontend Developer", "Lifelong Learner", "Open Source Enthusiast"];

const socials = [
  {
    icon: FiGithub,
    href: `https://github.com/${siteConfig.github}`,
    label: "GitHub",
  },
  {
    icon: SiX,
    href: siteConfig.x,
    label: "X",
  },
  ...(siteConfig.email
    ? [{ icon: FiMail, href: `mailto:${siteConfig.email}`, label: "Email" }]
    : []),
  { icon: FiFileText, href: "/resume", label: "Resume" },
];

export function HeroSection({ postCount }: { postCount: number }) {
  const stats = [
    { label: "Projects", value: String(siteConfig.projects.length), icon: FiCode },
    { label: "Posts", value: String(postCount), icon: FiBookOpen },
    { label: "GitHub", value: siteConfig.github, icon: FiGithub },
  ];

  return (
    <section className="min-h-[calc(100dvh-4rem)] flex flex-col items-center text-center px-4">
      {/* Main content - vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Subtitle line */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[var(--muted)] mb-6"
        >
          Developer &middot; Builder &middot; Explorer
        </motion.p>

        {/* Animated name */}
        <div className="flex gap-1 sm:gap-2 mb-3">
          {nameChars.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.12,
                type: "spring",
                stiffness: 150,
              }}
              className="text-6xl sm:text-8xl font-bold text-[var(--foreground)]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* English name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-xl sm:text-2xl text-[var(--muted)] mb-8"
        >
          {siteConfig.nameEn}
        </motion.p>

        {/* Role tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {roles.map((text, i) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.15, duration: 0.4 }}
              className="px-4 py-1.5 rounded-full text-sm bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20"
            >
              {text}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)]"
            >
              <stat.icon size={20} className="text-[var(--accent)]" />
              <div className="text-left">
                <p className="text-lg font-bold leading-tight">{stat.value}</p>
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="flex gap-3"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              {...(social.href === "/resume" ? {} : clickAttributes("contact_click", { channel: social.label.toLowerCase(), placement: "hero" }))}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="p-3 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors"
              aria-label={social.label}
            >
              <social.icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - in normal flow, always visible at section bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="shrink-0 pb-4"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[var(--muted)] tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-[var(--muted)]/50 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-[var(--muted)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
