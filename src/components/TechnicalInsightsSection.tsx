import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Clock, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  INSIGHT_TOPICS,
  TECHNICAL_INSIGHTS,
  type InsightTopic,
  type TechnicalInsightItem,
} from '../data/portfolioData';
import { filterInsightsByTopic } from '../utils/voxelPortraitMath';

gsap.registerPlugin(ScrollTrigger);

export function TechnicalInsightsSection() {
  const [activeTopic, setActiveTopic] = useState<InsightTopic>('All');
  const [activeNote, setActiveNote] = useState<TechnicalInsightItem | null>(null);
  const hasMountedFilterRef = useRef(false);

  const visibleInsights = useMemo(
    () => filterInsightsByTopic(TECHNICAL_INSIGHTS, activeTopic),
    [activeTopic]
  );

  useEffect(() => {
    if (!hasMountedFilterRef.current) {
      hasMountedFilterRef.current = true;
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeTopic]);

  useEffect(() => {
    if (!activeNote) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveNote(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote]);

  return (
    <section
      id="insights"
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
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              06. Technical Insights &amp; Engineering Notes
            </p>
            <h2
              data-stagger-item
              className="mt-3 font-display text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Applied Notes on Agentic AI &amp; Systems
            </h2>
            <p
              data-stagger-item
              className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-zinc-400"
            >
              Internal study notes and architectural takeaways captured while building Python,
              LangChain, LangGraph, RAG, FastAPI, MCP, and n8n workflows. Clearly marked as
              unpublished study drafts.
            </p>
          </div>
        </div>

        {/* Topic Filter */}
        <div
          role="tablist"
          aria-label="Filter technical insights by topic"
          className="mt-8 flex flex-wrap items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-white p-1.5 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-[#111116]"
        >
          {INSIGHT_TOPICS.map((topic) => {
            const active = activeTopic === topic;
            return (
              <button
                key={topic}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveTopic(topic)}
                className={`min-h-[40px] rounded-sm px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors sm:min-h-[36px] cursor-pointer ${
                  active
                    ? 'bg-[#F97316] font-semibold text-[#172033] dark:bg-[#FF5A1F] dark:text-[#070709]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#172033] dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {/* Insights Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleInsights.map((note) => (
            <article
              key={note.id}
              className="group flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-[#F97316]/60 hover:shadow-[var(--shadow-card-hover)] sm:rounded-sm sm:p-6 dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]/50"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                    {note.topic}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[#64748B] dark:text-zinc-500">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {note.readingTime}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#172033] transition-colors group-hover:text-[#C2410C] dark:text-white dark:group-hover:text-[#FFB088]">
                  {note.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] dark:text-zinc-400">
                  {note.summary}
                </p>
              </div>

              <div className="mt-5 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
                <p className="font-mono text-[11px] text-[#64748B] dark:text-zinc-500">
                  {note.statusLabel}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveNote(note)}
                  className="mt-3 inline-flex min-h-[42px] items-center gap-1.5 text-xs font-semibold text-[#172033] transition-colors hover:text-[#C2410C] sm:min-h-[38px] dark:text-white dark:hover:text-[#FF8C42] cursor-pointer"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                  <span>Read Engineering Note</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeNote && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-reader-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#172033]/50 p-2 backdrop-blur-xs sm:items-center sm:p-6 dark:bg-black/80"
          onClick={() => setActiveNote(null)}
        >
          <div
            className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-4 text-[#172033] shadow-2xl sm:rounded-sm sm:p-8 dark:border-white/15 dark:bg-[#111116] dark:text-[#F4F4F6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4 sm:gap-4 sm:pb-5 dark:border-white/10">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                    {activeNote.topic}
                  </span>
                  <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
                  <span className="text-[#64748B] dark:text-zinc-400">{activeNote.readingTime}</span>
                </div>
                <h3
                  id="insight-reader-title"
                  className="mt-2 font-display text-xl font-bold text-[#172033] sm:text-2xl dark:text-white"
                >
                  {activeNote.title}
                </h3>
                <p className="mt-2 font-mono text-[11px] text-[#64748B] dark:text-zinc-500">
                  {activeNote.statusLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                aria-label={`Close ${activeNote.title}`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] transition-colors hover:border-[#F97316] hover:text-[#172033] sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#181820] dark:text-zinc-300 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <p className="text-sm leading-relaxed text-[#334155] sm:text-base dark:text-zinc-300">
                {activeNote.summary}
              </p>

              <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-[#0B0B10]">
                <h4 className="font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FF8C42]">
                  Key Engineering Takeaways
                </h4>
                <ul className="mt-2.5 space-y-1.5 text-sm text-[#334155] dark:text-zinc-300">
                  {activeNote.keyTakeaways.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#F97316] dark:bg-[#FF5A1F]"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeNote.sections.map((section) => (
                <div key={section.heading}>
                  <h4 className="font-display text-lg font-bold text-[#172033] dark:text-white">
                    {section.heading}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-zinc-300">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#E2E8F0] pt-4 sm:mt-7 dark:border-white/10">
              <button
                type="button"
                onClick={() => setActiveNote(null)}
                className="min-h-[44px] w-full rounded-sm bg-[#F97316] px-5 py-2 text-xs font-semibold text-[#172033] transition-colors hover:bg-[#EA580C] sm:min-h-[40px] sm:w-auto dark:bg-[#FF5A1F] dark:text-[#070709] dark:hover:bg-[#FF6E38] cursor-pointer"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
