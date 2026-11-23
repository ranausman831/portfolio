import { ABOUT_CONTENT } from '../data/portfolioData';

export function AboutSection() {
  return (
    <section
      id="about"
      data-scroll-section="pin-host"
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-white py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          data-pin-container="about"
          className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Sticky / Pinned Editorial Lead */}
          <div data-pin-col="about" data-stagger-group className="lg:col-span-5">
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              01. About Me
            </p>
            <h2
              data-stagger-item
              className="mt-2.5 font-display text-2xl font-bold leading-tight tracking-tight text-[#172033] sm:mt-3 sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              {ABOUT_CONTENT.title}
            </h2>
            <p
              data-stagger-item
              className="mt-4 text-[15px] leading-relaxed text-[#475569] sm:mt-5 sm:text-base dark:text-zinc-300"
            >
              {ABOUT_CONTENT.lead}
            </p>

            {/* Explicit Career Goal & Engineering Direction */}
            <div
              data-stagger-item
              className="mt-5 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] sm:mt-6 dark:border-white/10 dark:bg-[#0D0D11]"
            >
              <p className="text-sm leading-relaxed text-[#334155] dark:text-zinc-300">
                {ABOUT_CONTENT.careerGoal}
              </p>
            </div>

            {/* Subtle Pixel Architecture Motif */}
            <div
              data-stagger-item
              data-parallax="motif"
              className="mt-6 flex items-center gap-4 border-t border-[#E2E8F0] pt-5 sm:mt-7 sm:pt-6 dark:border-white/10"
            >
              <div aria-hidden="true" className="grid grid-cols-4 gap-1 shrink-0">
                <span className="h-2 w-2 bg-[#F97316] dark:bg-[#FF5A1F]" />
                <span className="h-2 w-2 bg-[#F97316]/40 dark:bg-[#FF5A1F]/40" />
                <span className="h-2 w-2 bg-[#CBD5E1] dark:bg-white/20" />
                <span className="h-2 w-2 bg-transparent" />
                <span className="h-2 w-2 bg-[#CBD5E1] dark:bg-white/20" />
                <span className="h-2 w-2 bg-[#F97316] dark:bg-[#FF5A1F]" />
                <span className="h-2 w-2 bg-[#F97316]/40 dark:bg-[#FF5A1F]/40" />
                <span className="h-2 w-2 bg-[#E2E8F0] dark:bg-white/10" />
              </div>
              <p className="text-xs leading-relaxed text-[#64748B] dark:text-zinc-400">
                Focused on turning experimental LLM prototypes into dependable, tool-connected
                software.
              </p>
            </div>
          </div>

          {/* Right 2x2 Architectural Grid (Clip-Path Mask Reveal + Staggered Pillars) */}
          <div
            data-clip-reveal="panel"
            data-stagger-group
            className="lg:col-span-7 grid grid-cols-1 gap-px overflow-hidden rounded-lg sm:rounded-sm border border-[#E2E8F0] bg-[#E2E8F0] shadow-[var(--shadow-card)] sm:grid-cols-2 dark:border-white/10 dark:bg-white/10"
          >
            {ABOUT_CONTENT.pillars.map((pillar) => (
              <div
                key={pillar.index}
                data-stagger-item
                className="flex flex-col justify-between bg-[#F8FAFC] p-5 transition-colors duration-150 hover:bg-[#FFF7ED] sm:p-7 dark:bg-[#0D0D11] dark:hover:bg-[#121218]"
              >
                <div>
                  <span className="font-mono text-xs font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                    {pillar.index}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-[#172033] sm:mt-3 sm:text-xl dark:text-white">
                    {pillar.heading}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:mt-3 dark:text-zinc-400">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
