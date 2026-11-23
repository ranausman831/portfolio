import { useState } from 'react';
import { ArrowRight, Cpu, GitMerge } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AI_ARCHITECTURES } from '../data/portfolioData';

export function AiArchitectureSection() {
  const [activeId, setActiveId] = useState(AI_ARCHITECTURES[0].id);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const activeArchitecture =
    AI_ARCHITECTURES.find((arch) => arch.id === activeId) ?? AI_ARCHITECTURES[0];
  const activeNode =
    activeArchitecture.nodes[selectedNodeIdx] ?? activeArchitecture.nodes[0];

  const handleSelectArchitecture = (id: (typeof AI_ARCHITECTURES)[number]['id']) => {
    setActiveId(id);
    setSelectedNodeIdx(0);
  };

  return (
    <section
      id="architecture"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-[#F8FAFC] py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#09090D] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          data-stagger-group
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              03. AI Engineering &amp; Architecture
            </p>
            <h2
              data-stagger-item
              className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[#172033] sm:mt-3 sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              How My Autonomous AI Systems Work
            </h2>
            <p
              data-stagger-item
              className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:mt-3 sm:text-base dark:text-zinc-400"
            >
              Interactive blueprints illustrating component responsibilities, state routing,
              and data flow across LangGraph, RAG, Model Context Protocol (MCP), and multi-agent
              pipelines.
            </p>
          </div>
        </div>

        {/* Architecture Selector Tabs */}
        <div
          role="tablist"
          aria-label="Select AI system architecture diagram"
          className="mt-6 sm:mt-8 flex flex-wrap items-center gap-1.5 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-white p-1.5 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-[#111116]"
        >
          {AI_ARCHITECTURES.map((arch) => {
            const active = arch.id === activeId;
            return (
              <button
                key={arch.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => handleSelectArchitecture(arch.id)}
                className={`min-h-[40px] sm:min-h-[38px] rounded-sm px-3 sm:px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F97316] font-semibold text-[#172033] dark:bg-[#FF5A1F] dark:text-[#070709]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#172033] dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {arch.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Interactive Blueprint Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeArchitecture.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 sm:mt-6 rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-white p-4 shadow-[var(--shadow-card)] sm:p-8 dark:border-white/10 dark:bg-[#101015]"
          >
            {/* Header & Overview */}
            <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 sm:pb-6 lg:flex-row lg:items-start lg:justify-between dark:border-white/10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                  <GitMerge className="h-4 w-4" aria-hidden="true" />
                  <span>Architecture Overview</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#172033] dark:text-white">
                  {activeArchitecture.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#475569] dark:text-zinc-300">
                  {activeArchitecture.overview}
                </p>
              </div>
              <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 font-mono text-[11px] text-[#334155] lg:max-w-sm dark:border-white/10 dark:bg-[#0A0A0F] dark:text-zinc-300">
                <span className="block text-[10px] font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  End-to-End Data Flow
                </span>
                <span className="mt-1 block leading-relaxed">{activeArchitecture.dataFlowSummary}</span>
              </div>
            </div>

            {/* Interactive SVG & Node Flow Diagram */}
            <div className="mt-6">
              <p className="font-mono text-[11px] text-[#64748B] dark:text-zinc-400">
                Click any stage node below to inspect its responsibility and contract:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {activeArchitecture.nodes.map((node, idx) => {
                  const selected = idx === selectedNodeIdx;
                  return (
                    <div key={node.id} className="relative flex items-stretch gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedNodeIdx(idx)}
                        aria-pressed={selected}
                        className={`flex w-full flex-col justify-between rounded-sm border p-4 text-left transition-all cursor-pointer ${
                          selected
                            ? 'border-[#F97316] bg-[#FFF7ED] shadow-[0_6px_18px_-8px_rgba(249,115,22,0.35)] dark:border-[#FF5A1F] dark:bg-[#171210]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#F97316]/50 hover:bg-white dark:border-white/10 dark:bg-[#0B0B10] dark:hover:border-white/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-mono text-[11px] font-semibold tabular-nums ${
                                selected
                                  ? 'text-[#C2410C] dark:text-[#FF8C42]'
                                  : 'text-[#64748B] dark:text-zinc-500'
                              }`}
                            >
                              Node {node.step}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`h-2 w-2 rounded-xs ${
                                selected
                                  ? 'bg-[#F97316] dark:bg-[#FF5A1F]'
                                  : 'bg-[#CBD5E1] dark:bg-white/15'
                              }`}
                            />
                          </div>
                          <p className="mt-2 font-display text-base font-bold text-[#172033] dark:text-white">
                            {node.label}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-[#64748B] dark:text-zinc-400">
                            {node.role}
                          </p>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#475569] dark:text-zinc-300">
                          {node.responsibility}
                        </p>
                      </button>

                      {idx < activeArchitecture.nodes.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="hidden items-center justify-center text-[#F97316] lg:flex dark:text-[#FF5A1F]"
                        >
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Node Detail & Architectural Rationale */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-5 sm:pt-6 lg:grid-cols-12 dark:border-white/10">
              <div className="rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5 lg:col-span-6 dark:border-white/10 dark:bg-[#0B0B10]">
                <div className="flex items-center gap-2 font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                  <Cpu className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Selected Component: {activeNode.step} · {activeNode.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#334155] dark:text-zinc-300">
                  {activeNode.responsibility}
                </p>
                <p className="mt-3 font-mono text-xs text-[#64748B] dark:text-zinc-400">
                  Contract / Output:{' '}
                  <span className="font-medium text-[#172033] dark:text-white">{activeNode.io}</span>
                </p>
              </div>

              <div className="rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5 lg:col-span-6 dark:border-white/10 dark:bg-[#0B0B10]">
                <p className="font-mono text-xs font-medium text-[#64748B] dark:text-zinc-400">
                  Why This Pattern Matters
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#334155] dark:text-zinc-300">
                  {activeArchitecture.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
