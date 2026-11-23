import { useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Github, Globe, Layers, ShieldAlert, Wrench, X } from 'lucide-react';
import type { ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const { caseStudy } = project;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#172033]/50 p-2 sm:items-center sm:p-6 backdrop-blur-xs dark:bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl sm:rounded-sm border border-[#E2E8F0] bg-white p-4 text-[#172033] shadow-2xl sm:p-8 dark:border-white/15 dark:bg-[#111116] dark:text-[#F4F4F6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4 sm:gap-4 sm:pb-5 dark:border-white/10">
          <div className="min-w-0">
            <p className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
              Project Case Study · {project.index} · {project.category}
            </p>
            <h3
              id="project-modal-title"
              className="mt-1.5 sm:mt-2 font-display text-xl font-bold text-[#172033] sm:text-3xl dark:text-white"
            >
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${project.title} case study`}
            className="inline-flex h-11 w-11 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] transition-colors hover:border-[#F97316] hover:text-[#172033] dark:border-white/15 dark:bg-[#181820] dark:text-zinc-300 dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 10-Part Case Study Sections */}
        <div className="mt-6 space-y-6">
          {/* 1. Project Overview */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
              01 · Project Overview
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[#334155] sm:text-base dark:text-zinc-200">
              {caseStudy.overview}
            </p>
          </div>

          {/* 2 & 3. Problem Statement & Proposed Solution */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-[#0B0B10]">
              <h4 className="font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                02 · Problem Statement
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#334155] dark:text-zinc-300">
                {caseStudy.problemStatement}
              </p>
            </div>

            <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-[#0B0B10]">
              <h4 className="font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                03 · Proposed Solution
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#334155] dark:text-zinc-300">
                {caseStudy.proposedSolution}
              </p>
            </div>
          </div>

          {/* 4. Technologies Used */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
              04 · Technologies Used
            </h4>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 font-mono text-xs font-medium text-[#172033] dark:border-white/10 dark:bg-[#17171F] dark:text-zinc-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 5. System Architecture & Pipeline */}
          <div>
            <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
              <Layers className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
              <span>05 · System Architecture</span>
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-zinc-300">
              {caseStudy.systemArchitecture}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {project.pipelineNodes.map((node, idx) => (
                <div
                  key={node.label}
                  className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 dark:border-white/10 dark:bg-[#0B0B0F]"
                >
                  <span className="font-mono text-[11px] font-medium text-[#C2410C] dark:text-[#FF8C42]">
                    Step 0{idx + 1}
                  </span>
                  <p className="mt-1 font-display text-sm font-semibold text-[#172033] dark:text-white">
                    {node.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748B] dark:text-zinc-400">{node.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6 & 7. Key Features & Development Challenges */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-[#0B0B10]">
              <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                <span>06 · Key Features</span>
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#334155] dark:text-zinc-300">
                {caseStudy.keyFeatures.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#F97316] dark:bg-[#FF5A1F]"
                      aria-hidden="true"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-[#0B0B10]">
              <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#64748B] dark:text-zinc-400">
                <ShieldAlert className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                <span>07 · Development Challenges</span>
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#334155] dark:text-zinc-300">
                {caseStudy.developmentChallenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#64748B] dark:bg-zinc-500"
                      aria-hidden="true"
                    />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 8. My Contribution */}
          <div className="rounded-sm border border-[#E2E8F0] bg-[#FFF7ED]/70 p-4 dark:border-[#FF5A1F]/25 dark:bg-[#171210]">
            <h4 className="flex items-center gap-2 font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
              <span>08 · My Contribution</span>
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[#172033] dark:text-zinc-200">
              {caseStudy.myContribution}
            </p>
          </div>
        </div>

        {/* 9 & 10. GitHub Repository & Live Demo Status */}
        <div className="mt-6 sm:mt-7 flex flex-col gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] sm:min-h-[40px] w-full sm:w-auto items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#172033] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] dark:border-white/15 dark:bg-[#181820] dark:text-zinc-200 dark:hover:text-white"
            >
              <Github className="h-3.5 w-3.5 text-[#C2410C] dark:text-[#FF8C42]" aria-hidden="true" />
              <span>09 · GitHub Repository</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            {caseStudy.liveDemoUrl ? (
              <a
                href={caseStudy.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] sm:min-h-[40px] w-full sm:w-auto items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#172033] transition-colors hover:border-[#F97316] hover:text-[#C2410C] dark:border-white/15 dark:bg-[#181820] dark:text-zinc-200"
              >
                <Globe className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                <span>10 · Live Demo</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex min-h-[40px] items-center justify-center sm:justify-start gap-2 rounded-md sm:rounded-sm border border-dashed border-[#CBD5E1] px-3.5 py-2 font-mono text-[11px] text-[#64748B] dark:border-white/15 dark:text-zinc-400">
                10 · Live Demo: Source Repository Only
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] sm:min-h-[40px] w-full sm:w-auto shrink-0 rounded-md sm:rounded-sm bg-[#F97316] px-5 py-2 text-xs font-semibold text-[#172033] transition-colors hover:bg-[#EA580C] dark:bg-[#FF5A1F] dark:text-[#070709] dark:hover:bg-[#FF6E38] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
