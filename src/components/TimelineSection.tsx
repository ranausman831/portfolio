import { TIMELINE_DATA } from '../data/portfolioData';

export function TimelineSection() {
  return (
    <section
      id="timeline"
      data-scroll-section="pin-host"
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-[#F8FAFC] py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#0A0A0E] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          data-pin-container="timeline"
          className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Sticky / Pinned Header */}
          <div data-pin-col="timeline" data-stagger-group className="lg:col-span-4">
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              05. Experience &amp; Education
            </p>
            <h2
              data-stagger-item
              className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[#172033] sm:mt-3 sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Academic Foundation &amp; AI Focus
            </h2>
            <p
              data-stagger-item
              className="mt-3 text-sm leading-relaxed text-[#64748B] sm:mt-4 sm:text-base dark:text-zinc-400"
            >
              Combining formal Computer Science study with hands-on engineering in autonomous
              agents, retrieval systems, and automation pipelines.
            </p>
          </div>

          {/* Right Vertical Architectural Timeline */}
          <div className="lg:col-span-8">
            <div
              data-stagger-group
              className="relative space-y-6 sm:space-y-10 border-l border-[#CBD5E1] pl-5 sm:pl-10 dark:border-white/15"
            >
              {TIMELINE_DATA.map((entry) => (
                <article
                  key={entry.id}
                  data-stagger-item
                  className="relative rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[var(--shadow-card)] transition-all duration-150 hover:border-[#F97316]/50 hover:shadow-[var(--shadow-card-hover)] dark:border-white/10 dark:bg-[#101015] dark:hover:border-white/25"
                >
                  {/* Pixel Square Node on Timeline Rail */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[26px] top-6 h-3 w-3 sm:-left-[46px] sm:top-7 ${
                      entry.type === 'Development'
                        ? 'bg-[#F97316] dark:bg-[#FF5A1F]'
                        : 'border-2 border-[#F97316] bg-[#F8FAFC] dark:border-[#FF5A1F] dark:bg-[#0A0A0E]'
                    }`}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                      {entry.period}
                    </span>
                    <span className="font-mono text-[#64748B] dark:text-zinc-500">{entry.type}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-[#172033] sm:mt-2.5 sm:text-xl dark:text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-[#334155] dark:text-zinc-300">
                    {entry.institution}
                  </p>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] sm:mt-3 dark:text-zinc-400">
                    {entry.summary}
                  </p>

                  <p className="mt-3.5 font-mono text-xs leading-relaxed text-[#334155] sm:mt-4 dark:text-zinc-300">
                    {entry.highlights.join(' · ')}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
