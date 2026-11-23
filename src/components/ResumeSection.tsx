import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, GraduationCap, Layers } from 'lucide-react';
import {
  CONTACT_INFO,
  FEATURED_PROJECTS,
  GITHUB_PROJECTS,
  HERO_PROFILE,
  SKILL_CATEGORIES,
  SKILLS_DATA,
  TIMELINE_DATA,
} from '../data/portfolioData';

export function ResumeSection() {
  const [isEmbeddedFrame, setIsEmbeddedFrame] = useState(false);

  useEffect(() => {
    try {
      setIsEmbeddedFrame(window.self !== window.top);
    } catch {
      setIsEmbeddedFrame(true);
    }
  }, []);

  const educationEntries = TIMELINE_DATA.filter((entry) => entry.type === 'Education');
  const developmentEntries = TIMELINE_DATA.filter((entry) => entry.type === 'Development');
  const highlightedRepos = GITHUB_PROJECTS.slice(0, 6);

  return (
    <section
      id="resume"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-white py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          data-stagger-group
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              07. Resume &amp; Credentials
            </p>
            <h2
              data-stagger-item
              className="mt-3 font-display text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Structured Resume Overview
            </h2>
            <p
              data-stagger-item
              className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-zinc-400"
            >
              Review Muhammad Usman&apos;s verified education, core AI engineering stack, and
              selected projects directly on the page or download the official PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:shrink-0">
            <a
              href={HERO_PROFILE.resumeUrl}
              download={
                isEmbeddedFrame
                  ? undefined
                  : 'Muhammad-Usman-Agentic-AI-Engineer-Resume.pdf'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm bg-[#F97316] px-5 py-2.5 text-xs font-semibold text-[#172033] shadow-[0_6px_18px_-6px_rgba(249,115,22,0.5)] whitespace-nowrap shrink-0 transition-colors hover:bg-[#EA580C] sm:min-h-[44px] sm:w-auto dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download Resume PDF</span>
            </a>

            <a
              href={HERO_PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#172033] whitespace-nowrap shrink-0 transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] sm:min-h-[44px] sm:w-auto dark:border-white/15 dark:bg-[#111116] dark:text-zinc-200 dark:hover:border-[#FF5A1F] dark:hover:text-white"
            >
              <ExternalLink className="h-4 w-4 text-[#F97316] dark:text-[#FF8C42]" aria-hidden="true" />
              <span>View Full PDF</span>
            </a>
          </div>
        </div>

        {/* Structured Resume Sheet */}
        <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] sm:mt-10 sm:rounded-sm sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#0D0D12]">
          {/* Resume Identity Banner */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-end sm:pb-6 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#C2410C] dark:text-[#FF8C42]">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Curriculum Vitae Preview</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-[#172033] sm:text-2xl dark:text-white">
                {HERO_PROFILE.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#475569] dark:text-zinc-300">
                {HERO_PROFILE.role} · {HERO_PROFILE.locationLabel}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[#475569] [overflow-wrap:anywhere] sm:gap-x-4 dark:text-zinc-400">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-[#C2410C] dark:hover:text-[#FF8C42]"
              >
                {CONTACT_INFO.email}
              </a>
              <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
              <a
                href={CONTACT_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C2410C] dark:hover:text-[#FF8C42]"
              >
                {CONTACT_INFO.githubLabel}
              </a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Education & Technical Skills */}
            <div className="space-y-8 lg:col-span-5">
              <div>
                <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  <span>Education</span>
                </h4>
                <div className="mt-4 space-y-4">
                  {educationEntries.map((edu) => (
                    <div
                      key={edu.id}
                      className="rounded-sm border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#101015]"
                    >
                      <span className="font-mono text-[11px] font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                        {edu.period}
                      </span>
                      <p className="mt-1 font-display text-base font-bold text-[#172033] dark:text-white">
                        {edu.title}
                      </p>
                      <p className="text-xs font-medium text-[#64748B] dark:text-zinc-400">
                        {edu.institution}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#475569] dark:text-zinc-300">
                        {edu.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  <span>Technical Skills</span>
                </h4>
                <div className="mt-4 space-y-3">
                  {SKILL_CATEGORIES.filter((c) => c !== 'All').map((category) => {
                    const names = SKILLS_DATA.filter((s) => s.category === category).map(
                      (s) => s.name
                    );
                    return (
                      <div
                        key={category}
                        className="rounded-sm border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#101015]"
                      >
                        <p className="font-mono text-[11px] font-semibold text-[#172033] dark:text-white">
                          {category}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#475569] dark:text-zinc-400">
                          {names.join(' · ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Engineering Practice & Key Projects */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <h4 className="font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  Applied Development Experience
                </h4>
                <div className="mt-4 space-y-4">
                  {developmentEntries.map((dev) => (
                    <div
                      key={dev.id}
                      className="rounded-sm border border-[#E2E8F0] bg-white p-5 dark:border-white/10 dark:bg-[#101015]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-base font-bold text-[#172033] dark:text-white">
                          {dev.title}
                        </p>
                        <span className="font-mono text-[11px] text-[#64748B] dark:text-zinc-400">
                          {dev.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-[#64748B] dark:text-zinc-400">
                        {dev.institution}
                      </p>
                      <p className="mt-2.5 text-xs leading-relaxed text-[#475569] dark:text-zinc-300">
                        {dev.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  Selected AI &amp; Open-Source Projects
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {FEATURED_PROJECTS.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="rounded-sm border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#101015]"
                    >
                      <p className="font-display text-sm font-bold text-[#172033] dark:text-white">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-zinc-400">
                        {project.shortDescription}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-[#C2410C] dark:text-[#FF8C42]">
                        {project.technologies.join(' · ')}
                      </p>
                    </div>
                  ))}
                  {highlightedRepos.slice(0, 2).map((repo) => (
                    <div
                      key={repo.id}
                      className="rounded-sm border border-[#E2E8F0] bg-white p-4 dark:border-white/10 dark:bg-[#101015]"
                    >
                      <p className="font-display text-sm font-bold text-[#172033] dark:text-white">
                        {repo.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-zinc-400">
                        {repo.description}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-[#475569] dark:text-zinc-300">
                        {repo.technologies.join(' · ') || repo.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
