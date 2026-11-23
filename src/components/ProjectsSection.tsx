import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, FolderGit2, Github, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'motion/react';
import {
  CONTACT_INFO,
  FEATURED_PROJECTS,
  GITHUB_PROJECTS,
  GITHUB_PROJECT_CATEGORIES,
  type GitHubProjectCategory,
  type ProjectItem,
} from '../data/portfolioData';
import {
  buildRepoCaseStudyProject,
  filterGitHubProjectsByCategory,
  filterProjectsByTechnology,
} from '../utils/voxelPortraitMath';
import type { GitHubPublicSummary } from '../utils/githubProfile';
import { ProjectVisualPreview } from './ProjectVisualPreview';
import { ProjectModal } from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_FILTERS = ['All', 'LangGraph', 'RAG', 'Gemini API', 'n8n Automation', 'FastAPI'];

export function ProjectsSection() {
  const [techFilter, setTechFilter] = useState<string>('All');
  const [repoCategory, setRepoCategory] = useState<GitHubProjectCategory>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [githubSummary, setGithubSummary] = useState<GitHubPublicSummary | null>(null);
  const [githubLoadState, setGithubLoadState] = useState<'loading' | 'ready' | 'unavailable'>(
    'loading'
  );
  const shouldReduceMotion = useReducedMotion();
  const hasMountedFilterSyncRef = useRef(false);
  const repoGridRef = useRef<HTMLDivElement | null>(null);

  const visibleProjects = useMemo(
    () => filterProjectsByTechnology(FEATURED_PROJECTS, techFilter),
    [techFilter]
  );

  const visibleRepos = useMemo(
    () => filterGitHubProjectsByCategory(GITHUB_PROJECTS, repoCategory),
    [repoCategory]
  );

  const fetchGitHubSummary = useCallback(() => {
    setGithubLoadState('loading');
    fetch('/api/github')
      .then((res) => (res.ok ? (res.json() as Promise<GitHubPublicSummary>) : null))
      .then((data) => {
        if (data) {
          setGithubSummary(data);
          setGithubLoadState(data.available ? 'ready' : 'unavailable');
        } else {
          setGithubLoadState('unavailable');
        }
      })
      .catch(() => {
        setGithubLoadState('unavailable');
      });
  }, []);

  useEffect(() => {
    fetchGitHubSummary();
  }, [fetchGitHubSummary]);

  useEffect(() => {
    if (!hasMountedFilterSyncRef.current) {
      hasMountedFilterSyncRef.current = true;
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [techFilter, repoCategory, githubSummary]);

  const handleExploreAllRepos = () => {
    setRepoCategory('All');
    repoGridRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const maxDailyEvents = useMemo(() => {
    if (!githubSummary?.activityWindowDays.length) return 1;
    return Math.max(1, ...githubSummary.activityWindowDays.map((d) => d.count));
  }, [githubSummary]);

  return (
    <section
      id="projects"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-white py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Heading & Stack Filter */}
        <div
          data-stagger-group
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              04. Featured Projects
            </p>
            <h2
              data-stagger-item
              className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[#172033] sm:mt-3 sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Autonomous Agents &amp; AI Systems
            </h2>
            <p
              data-stagger-item
              className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:mt-3 sm:text-base dark:text-zinc-400"
            >
              Selected agentic workflows, RAG assistants, and automated research pipelines built
              with Python, LangGraph, Gemini API, FastAPI, and n8n.
            </p>
          </div>

          <div
            data-stagger-item
            role="tablist"
            aria-label="Filter projects by technology"
            className="flex flex-wrap items-center gap-1 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-1 shadow-[var(--shadow-card)] lg:shrink-0 dark:border-white/10 dark:bg-[#111116]"
          >
            {PROJECT_FILTERS.map((tech) => {
              const active = techFilter === tech;
              return (
                <button
                  key={tech}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setTechFilter(tech)}
                  className={`min-h-[40px] sm:min-h-[36px] rounded-sm px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F97316] text-[#172033] font-semibold dark:bg-[#FF5A1F] dark:text-[#070709]'
                      : 'text-[#64748B] hover:bg-white hover:text-[#172033] dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-white'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Architecture Project Grid */}
        <div className="mt-7 sm:mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, idx) => {
            const isLead = idx === 0 && techFilter === 'All';

            return (
              <article
                key={project.id}
                data-cursor="project"
                className={`group flex flex-col justify-between overflow-hidden rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-white shadow-[var(--shadow-card)] transition-all duration-200 active:scale-[0.99] sm:active:scale-100 hover:-translate-y-1 hover:border-[#F97316]/60 hover:shadow-[var(--shadow-card-hover)] dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]/50 ${
                  isLead ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div data-clip-reveal="panel">
                    <ProjectVisualPreview
                      variant={project.visualVariant}
                      nodes={project.pipelineNodes}
                      title={project.title}
                    />
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                      <span className="font-mono font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                        {project.index} · {project.category}
                      </span>
                    </div>

                    <h3 className="mt-2.5 sm:mt-3 font-display text-xl font-bold text-[#172033] sm:text-2xl dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:mt-2.5 dark:text-zinc-400">
                      {project.shortDescription}
                    </p>

                    <p className="mt-3.5 sm:mt-4 font-mono text-xs leading-relaxed text-[#334155] dark:text-zinc-300">
                      {project.technologies.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-[#E2E8F0] px-4 py-3.5 sm:px-6 sm:py-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="inline-flex min-h-[44px] sm:min-h-[38px] items-center gap-1.5 text-xs font-semibold text-[#172033] transition-colors hover:text-[#C2410C] dark:text-white dark:hover:text-[#FF5A1F] cursor-pointer"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="h-4 w-4 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                    </button>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View GitHub repositories for ${project.title}`}
                      className="inline-flex min-h-[42px] sm:min-h-[38px] items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 sm:px-3 sm:py-1.5 text-xs font-medium text-[#172033] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] dark:border-white/10 dark:bg-[#17171F] dark:text-zinc-300 dark:hover:bg-[#17171F] dark:hover:text-white"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* GitHub Integration Profile & Live Activity Overview */}
        <div
          data-stagger-group
          className="mt-12 sm:mt-20 rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-[var(--shadow-card)] sm:p-8 dark:border-white/10 dark:bg-[#0D0D12]"
        >
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub Integration</span>
                <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
                <span className="text-[#64748B] dark:text-zinc-400">
                  @{githubSummary?.username || 'ranausman831'}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold tracking-tight text-[#172033] dark:text-white">
                Open-Source Code &amp; Public Repositories
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B] dark:text-zinc-400">
                Explore Muhammad Usman&apos;s public source code spanning Agentic AI tools, MCP
                servers, LangChain/Gemini applications, n8n automations, web builds, and Android.
              </p>

              {githubLoadState === 'loading' && (
                <p className="mt-4 font-mono text-xs text-[#64748B] dark:text-zinc-400">
                  Loading live GitHub profile telemetry...
                </p>
              )}

              {githubLoadState === 'unavailable' && (
                <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-[#64748B] dark:text-zinc-400">
                  <span>Live GitHub activity feed is temporarily unavailable.</span>
                  <button
                    type="button"
                    onClick={fetchGitHubSummary}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#172033] transition-colors hover:border-[#F97316] hover:text-[#C2410C] dark:border-white/15 dark:bg-[#14141A] dark:text-zinc-200 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {githubSummary?.available && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#475569] tabular-nums dark:text-zinc-300">
                  {githubSummary.publicRepos !== null && (
                    <span>
                      Public Repositories:{' '}
                      <strong className="text-[#172033] dark:text-white">
                        {githubSummary.publicRepos}
                      </strong>
                    </span>
                  )}
                  {githubSummary.followers !== null && (
                    <>
                      <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
                      <span>
                        Followers:{' '}
                        <strong className="text-[#172033] dark:text-white">
                          {githubSummary.followers}
                        </strong>
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
                  <span>
                    Recent Public Events:{' '}
                    <strong className="text-[#C2410C] dark:text-[#FF8C42]">
                      {githubSummary.recentEventsCount}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center lg:shrink-0">
              <a
                href={CONTACT_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] sm:min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-md sm:rounded-sm bg-[#F97316] px-4 py-2.5 sm:py-2 text-xs font-semibold text-[#172033] shadow-[0_6px_16px_-6px_rgba(249,115,22,0.45)] whitespace-nowrap shrink-0 transition-colors hover:bg-[#EA580C] dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38]"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <a
                href={CONTACT_INFO.githubRepositoriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] sm:min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-white px-4 py-2.5 sm:py-2 text-xs font-semibold text-[#172033] shadow-2xs whitespace-nowrap shrink-0 transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] dark:border-white/15 dark:bg-[#14141A] dark:text-white dark:shadow-none dark:hover:bg-[#14141A] dark:hover:text-[#FF8C42]"
              >
                <span>GitHub Repositories</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={handleExploreAllRepos}
                className="inline-flex min-h-[44px] sm:min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#CBD5E1] bg-white px-4 py-2.5 sm:py-2 text-xs font-semibold text-[#172033] whitespace-nowrap shrink-0 transition-colors hover:border-[#F97316] hover:text-[#C2410C] dark:border-white/15 dark:bg-transparent dark:text-zinc-200 dark:hover:border-white/35 dark:hover:bg-transparent dark:hover:text-white cursor-pointer"
              >
                <span>Explore All Public Projects</span>
                <ArrowDown className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Live 14-Day GitHub Public Activity Strip (rendered strictly from real API events) */}
          {githubSummary?.available && githubSummary.activityWindowDays.length > 0 && (
            <div className="mt-6 border-t border-[#E2E8F0] pt-5 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-[#64748B] dark:text-zinc-400">
                  Recent Public GitHub Activity (Last 14 Days)
                </p>
                {githubSummary.recentRepos.length > 0 && (
                  <p className="font-mono text-[11px] text-[#64748B] [overflow-wrap:anywhere] dark:text-zinc-500">
                    Active repos: {githubSummary.recentRepos.join(' · ')}
                  </p>
                )}
              </div>

              <div
                aria-label="Recent 14-day public GitHub event activity"
                className="mt-3 grid grid-cols-14 gap-1 sm:gap-1.5 items-end h-12"
              >
                {githubSummary.activityWindowDays.map((day) => {
                  const heightPct =
                    day.count === 0 ? 18 : Math.round(28 + (day.count / maxDailyEvents) * 72);
                  return (
                    <div
                      key={day.date}
                      title={`${day.label}: ${day.count} public ${day.count === 1 ? 'event' : 'events'}`}
                      className="flex h-full flex-col justify-end"
                    >
                      <span
                        style={{ height: `${heightPct}%` }}
                        className={`block w-full rounded-[2px] transition-colors ${
                          day.count > 0
                            ? 'bg-[#F97316] dark:bg-[#FF5A1F]'
                            : 'bg-[#E2E8F0] dark:bg-white/10'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Open-Source GitHub Repositories Showcase (18 Repositories) */}
        <div id="github-projects-grid" ref={repoGridRef} className="mt-12 sm:mt-16 scroll-mt-20 sm:scroll-mt-24">
          <div
            data-stagger-group
            className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                data-stagger-item
                className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
              >
                GitHub Archive · {GITHUB_PROJECTS.length} Repositories
              </p>
              <h3
                data-stagger-item
                className="mt-2 font-display text-2xl font-bold tracking-tight text-[#172033] sm:mt-2.5 sm:text-3xl [text-wrap:balance] dark:text-white"
              >
                Public GitHub Projects
              </h3>
              <p
                data-stagger-item
                className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B] dark:text-zinc-400"
              >
                Browse repositories across AI &amp; Machine Learning, Agentic AI &amp; MCP,
                automation workflows, web builds, and Android development.
              </p>
            </div>

            <div
              data-stagger-item
              role="tablist"
              aria-label="Filter GitHub projects by category"
              className="flex flex-wrap items-center gap-1 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-1 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-[#111116]"
            >
              {GITHUB_PROJECT_CATEGORIES.map((category) => {
                const active = repoCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setRepoCategory(category)}
                    className={`min-h-[40px] sm:min-h-[36px] rounded-sm px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F97316] text-[#172033] font-semibold dark:bg-[#FF5A1F] dark:text-[#070709]'
                        : 'text-[#64748B] hover:bg-white hover:text-[#172033] dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-5 sm:mt-6 font-mono text-xs text-[#64748B] tabular-nums dark:text-zinc-500">
            Showing {visibleRepos.length} of {GITHUB_PROJECTS.length} repositories
            {repoCategory !== 'All' ? ` in ${repoCategory}` : ''}
          </p>

          <motion.div
            key={repoCategory}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 sm:mt-5 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleRepos.map((repo) => {
              const repoCaseStudy = buildRepoCaseStudyProject(repo);
              return (
                <article
                  key={repo.id}
                  data-cursor="project"
                  className="group flex flex-col justify-between rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[var(--shadow-card)] transition-all duration-200 active:scale-[0.99] sm:active:scale-100 hover:-translate-y-1 hover:border-[#F97316]/60 hover:shadow-[var(--shadow-card-hover)] dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]/50"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                        {repo.index} · {repo.category}
                      </span>
                      <FolderGit2
                        className="h-4 w-4 shrink-0 text-[#94A3B8] transition-colors duration-200 group-hover:text-[#C2410C] dark:text-zinc-600 dark:group-hover:text-[#FF8C42]"
                        aria-hidden="true"
                      />
                    </div>

                    <h4 className="mt-2.5 sm:mt-3 font-display text-lg font-bold text-[#172033] transition-colors group-hover:text-[#C2410C] dark:text-white dark:group-hover:text-[#FFB088]">
                      {repo.title}
                    </h4>

                    <p className="mt-2 text-sm leading-relaxed text-[#64748B] dark:text-zinc-400">
                      {repo.description}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5">
                    {repo.technologies.length > 0 && (
                      <p className="mb-3.5 sm:mb-4 font-mono text-xs leading-relaxed text-[#334155] dark:text-zinc-300">
                        {repo.technologies.join(' · ')}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3.5 sm:pt-4 dark:border-white/10">
                      {repoCaseStudy ? (
                        <button
                          type="button"
                          onClick={() => setActiveProject(repoCaseStudy)}
                          className="inline-flex min-h-[42px] sm:min-h-[36px] items-center gap-1 text-xs font-semibold text-[#172033] transition-colors hover:text-[#C2410C] dark:text-white dark:hover:text-[#FF8C42] cursor-pointer"
                        >
                          <span>Case Study</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="max-w-[140px] truncate font-mono text-[11px] text-[#64748B] sm:max-w-none dark:text-zinc-500">
                          /{repo.repoName}
                        </span>
                      )}

                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${repo.title} repository on GitHub`}
                        className="group/btn inline-flex min-h-[42px] sm:min-h-[36px] shrink-0 items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-[#172033] transition-all duration-150 hover:border-[#F97316] hover:bg-[#F97316] hover:text-[#172033] dark:border-white/15 dark:bg-[#17171F] dark:text-zinc-200 dark:hover:border-[#FF5A1F] dark:hover:bg-[#FF5A1F] dark:hover:text-[#070709]"
                      >
                        <Github className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>GitHub</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
