import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Download } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HERO_PROFILE } from '../data/portfolioData';
import type { ThemeMode } from '../utils/theme';
import { AvailabilityBadge } from './AvailabilityBadge';
import { VoxelPortraitStage } from './VoxelPortraitStage';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  theme: ThemeMode;
}

const CAPABILITIES_STRIP = [
  'Python',
  'LangGraph',
  'LangChain',
  'Model Context Protocol (MCP)',
  'Retrieval-Augmented Generation',
  'Google Gemini API',
  'FastAPI & Flask',
  'n8n Automation',
];

export function HeroSection({ onNavigate, theme }: HeroSectionProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [isEmbeddedFrame, setIsEmbeddedFrame] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      setIsEmbeddedFrame(window.self !== window.top);
    } catch {
      setIsEmbeddedFrame(true);
    }
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const intervalId = window.setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % HERO_PROFILE.rotatingFocus.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion]);

  const activeFocusLabel = HERO_PROFILE.rotatingFocus[focusIndex];

  return (
    <section
      id="home"
      className="relative scroll-mt-14 overflow-x-clip bg-[#F8FAFC] pt-[4.25rem] pb-10 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:pt-28 sm:pb-12 lg:min-h-screen lg:pt-32 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      {/* Subtle Architectural Pixel Grid + Soft Ambient Glow */}
      <div
        data-parallax="bg-grid"
        className="pixel-grid-bg pointer-events-none absolute inset-0 opacity-80 will-change-transform dark:opacity-70"
      />
      <div
        data-parallax="bg-glow"
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-[#F97316]/10 blur-[110px] will-change-transform sm:h-[420px] sm:w-[720px] sm:blur-[130px] dark:bg-[#FF5A1F]/10"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        {/* Top Metadata Line & Availability Status */}
        <div className="hero-reveal mb-4 flex flex-col items-start gap-2 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#64748B] dark:text-zinc-400">
            <span className="font-semibold text-[#C2410C] dark:text-[#FF8C42]">
              {HERO_PROFILE.role}
            </span>
            <span aria-hidden="true" className="text-[#CBD5E1] dark:text-zinc-600">·</span>
            <span>{HERO_PROFILE.locationLabel}</span>
            <span aria-hidden="true" className="hidden text-[#CBD5E1] sm:inline dark:text-zinc-600">·</span>
            <span className="w-full sm:w-auto">BS Computer Science (2026)</span>
          </div>

          <AvailabilityBadge variant="hero" />
        </div>

        {/* Asymmetric Split Hero Layout (Portrait-first on mobile, balanced 2-col split on desktop) */}
        <div className="grid grid-cols-1 items-center gap-5 sm:gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Typographic Composition */}
          <div className="order-last lg:order-first lg:col-span-7 flex flex-col justify-center">
            <p className="hero-reveal font-display text-base font-medium tracking-tight text-[#64748B] sm:text-xl dark:text-zinc-400">
              {HERO_PROFILE.name}
            </p>

            <h1 className="hero-reveal mt-2 font-display text-[clamp(1.9rem,7.5vw,3rem)] font-extrabold leading-[1.06] tracking-tight text-[#172033] [text-wrap:balance] sm:mt-3 sm:text-[clamp(2.5rem,5.2vw,4.75rem)] sm:leading-[1.03] dark:text-white">
              I BUILD INTELLIGENT{' '}
              <span className="text-[#EA580C] dark:text-[#FF5A1F]">AI</span> EXPERIENCES.
            </h1>

            {/* Animated Focus Highlight */}
            <div className="hero-reveal mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-mono sm:mt-5 sm:gap-x-2.5 sm:text-base">
              <span className="shrink-0 text-[#64748B] dark:text-zinc-500">Focus:</span>
              <div className="relative min-h-[24px] min-w-0 flex-1 overflow-y-hidden sm:min-h-[26px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={activeFocusLabel}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="block font-semibold text-[#C2410C] dark:text-[#FF8C42]"
                  >
                    {activeFocusLabel}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <p className="hero-reveal mt-2.5 max-w-xl text-[14px] leading-relaxed text-[#475569] sm:mt-4 sm:text-lg dark:text-zinc-300">
              {HERO_PROFILE.shortIntro}
            </p>

            {/* Primary, Contact & Resume CTAs (Mobile 2-col thumb-ready + Full desktop flex row) */}
            <div className="hero-reveal mt-5 grid grid-cols-2 gap-2.5 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md sm:rounded-sm bg-[#F97316] px-3.5 py-3 text-[13px] font-semibold text-[#172033] shadow-[0_8px_20px_-8px_rgba(249,115,22,0.55)] whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#EA580C] active:scale-[0.98] sm:px-6 sm:text-sm sm:gap-2.5 dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#CBD5E1] bg-white px-3.5 py-3 text-[13px] font-semibold text-[#172033] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] active:scale-[0.98] sm:order-3 sm:bg-white/80 sm:px-5 sm:text-sm dark:border-white/15 dark:bg-[#111116] dark:text-zinc-200 dark:hover:border-white/35 dark:sm:bg-transparent dark:hover:text-white cursor-pointer"
              >
                <span>Contact Me</span>
              </button>

              <a
                href={HERO_PROFILE.resumeUrl}
                download={
                  isEmbeddedFrame
                    ? undefined
                    : 'Muhammad-Usman-Agentic-AI-Engineer-Resume.pdf'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-white px-5 py-3 text-[13px] font-semibold text-[#172033] shadow-2xs whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] active:scale-[0.98] sm:order-2 sm:text-sm dark:border-white/15 dark:bg-[#111116] dark:text-white dark:shadow-none dark:hover:border-[#FF5A1F] dark:hover:bg-[#111116] dark:hover:text-[#FF8C42]"
              >
                <Download className="h-4 w-4 shrink-0 text-[#F97316] dark:text-[#FF8C42]" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Clean Typographic Focus Summary */}
            <div className="hero-reveal mt-7 grid grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-5 sm:mt-10 sm:grid-cols-3 sm:gap-6 sm:pt-6 dark:border-white/10">
              <div>
                <p className="text-xs font-medium text-[#64748B] dark:text-zinc-500">Core Focus</p>
                <p className="mt-1 text-sm font-semibold text-[#172033] dark:text-zinc-200">
                  Autonomous Agents
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#64748B] dark:text-zinc-500">Architecture</p>
                <p className="mt-1 text-sm font-semibold text-[#172033] dark:text-zinc-200">
                  RAG &amp; MCP Systems
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-medium text-[#64748B] dark:text-zinc-500">
                  Backend &amp; Automation
                </p>
                <p className="mt-1 text-sm font-semibold text-[#172033] dark:text-zinc-200">
                  FastAPI, Flask &amp; n8n
                </p>
              </div>
            </div>
          </div>

          {/* Right Centerpiece: 3D Voxel / Pixel-Art Real Identity Portrait */}
          <div
            data-parallax="hero-portrait"
            className="order-first lg:order-last lg:col-span-5 flex justify-center lg:justify-end will-change-transform"
          >
            <div
              data-clip-reveal="hero-portrait"
              className="w-full max-w-[224px] min-[375px]:max-w-[248px] sm:max-w-[360px] lg:max-w-[430px]"
            >
              <VoxelPortraitStage theme={theme} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#E2E8F0] pt-5 sm:mt-12 sm:pt-6 dark:border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-[#64748B] transition-colors hover:text-[#C2410C] dark:text-zinc-400 dark:hover:text-[#FF5A1F] cursor-pointer"
          >
            <ArrowDown className="h-4 w-4 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
            <span>Scroll to explore engineering work</span>
          </button>
          <span aria-hidden="true" className="hidden text-[#CBD5E1] sm:inline dark:text-zinc-700">·</span>
          <span className="hidden font-mono text-xs text-[#64748B] sm:inline dark:text-zinc-500">
            Interactive 3D Voxel Relief
          </span>
        </div>
      </div>

      {/* Editorial Marquee Capabilities Divider */}
      <div
        aria-hidden="true"
        className="mt-8 overflow-hidden border-y border-[#E2E8F0] bg-[#F1F5F9] py-3 sm:mt-12 sm:py-3.5 dark:border-white/10 dark:bg-[#0C0C10]"
      >
        <div className="animate-marquee flex items-center gap-8 text-xs font-medium tracking-wider text-[#475569] dark:text-zinc-400">
          {[...CAPABILITIES_STRIP, ...CAPABILITIES_STRIP].map((item, idx) => (
            <span key={`${item}-${idx}`} className="inline-flex items-center gap-8 whitespace-nowrap">
              <span className="transition-colors hover:text-[#172033] dark:hover:text-white">
                {item}
              </span>
              <span className="h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
