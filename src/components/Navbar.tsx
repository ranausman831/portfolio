import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HERO_PROFILE } from '../data/portfolioData';
import type { ThemeMode } from '../utils/theme';
import { ThemeToggleButton } from './ThemeToggleButton';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  theme: ThemeMode;
  onToggleTheme: (sourceElement?: HTMLElement | null) => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'projects', label: 'Projects' },
  { id: 'insights', label: 'Insights' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
] as const;

type NavSectionId = (typeof NAV_LINKS)[number]['id'];

export function Navbar({ onNavigate, theme, onToggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const trackedIds = [
      'home',
      'about',
      'skills',
      'architecture',
      'projects',
      'terminal',
      'timeline',
      'insights',
      'resume',
      'contact',
    ];

    const updateActiveFromScroll = () => {
      const markerY = window.scrollY + 140;
      let current: NavSectionId = 'home';

      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= markerY) {
          if (id === 'skills') current = 'about';
          else if (id === 'terminal' || id === 'timeline') current = 'projects';
          else current = id as NavSectionId;
        }
      }

      setActiveSection(current);
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);
    return () => {
      window.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleLinkClick = (sectionId: string) => {
    setMobileOpen(false);
    if (NAV_LINKS.some((link) => link.id === sectionId)) {
      setActiveSection(sectionId as NavSectionId);
    }
    // Slight frame deferral lets drawer begin closing cleanly before smooth scroll triggers
    window.requestAnimationFrame(() => {
      onNavigate(sectionId);
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#E2E8F0] bg-white/92 shadow-[0_1px_12px_rgba(23,32,51,0.04)] backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#070709]/92 dark:shadow-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-8 sm:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="inline-flex min-h-[44px] items-center gap-2 font-display text-[15px] font-bold tracking-tight text-[#172033] sm:gap-2.5 sm:text-base dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F97316] dark:focus-visible:outline-[#FF5A1F]"
        >
          <span
            aria-hidden="true"
            className="grid grid-cols-2 gap-0.5 border border-[#E2E8F0] bg-[#F8FAFC] p-1 dark:border-white/10 dark:bg-[#14141A]"
          >
            <span className="h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
            <span className="h-1.5 w-1.5 bg-[#172033] dark:bg-white/80" />
            <span className="h-1.5 w-1.5 bg-[#CBD5E1] dark:bg-white/30" />
            <span className="h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
          </span>
          <span>{HERO_PROFILE.brand}</span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links with Animated Indicator */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-[#64748B] dark:text-zinc-400"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F97316] dark:focus-visible:outline-[#FF5A1F] ${
                  isActive
                    ? 'text-[#C2410C] dark:text-white font-semibold'
                    : 'hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : 'nav-active-indicator'}
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] dark:bg-[#FF5A1F]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action + Animated Mobile Hamburger Trigger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />

          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-sm bg-[#F97316] px-4 py-2 text-xs font-semibold tracking-wide text-[#172033] shadow-[0_6px_16px_-6px_rgba(249,115,22,0.5)] whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#EA580C] active:scale-[0.98] dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] cursor-pointer"
          >
            <span>Contact Me</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] text-[#172033] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] active:scale-[0.97] dark:border-white/15 dark:bg-[#111116] dark:text-zinc-200 dark:hover:border-[#FF5A1F] dark:hover:bg-[#111116] dark:hover:text-white lg:hidden cursor-pointer"
          >
            <span className="relative flex h-4 w-5 flex-col items-center justify-center" aria-hidden="true">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-out ${
                  mobileOpen ? 'translate-y-[2px] rotate-45' : '-translate-y-[4.5px]'
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-opacity duration-150 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-out ${
                  mobileOpen ? '-translate-y-[2px] -rotate-45' : 'translate-y-[4.5px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Drawer + Tap-Outside Scrim */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-x-0 top-14 bottom-0 z-40 bg-[#172033]/40 backdrop-blur-[2px] sm:top-16 dark:bg-black/65 lg:hidden"
            />
            <motion.nav
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              aria-label="Mobile Navigation"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-[#E2E8F0] bg-white px-4 py-4 shadow-xl sm:max-h-[calc(100dvh-4rem)] sm:px-6 dark:border-white/10 dark:bg-[#0B0B0F] dark:shadow-none lg:hidden"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link.id);
                        }}
                        className={`flex min-h-[46px] items-center justify-between rounded-md px-3.5 text-base font-medium transition-colors active:scale-[0.99] ${
                          isActive
                            ? 'bg-[#FFF7ED] text-[#C2410C] dark:bg-[#171210] dark:text-[#FF8C42]'
                            : 'text-[#172033] hover:bg-[#F8FAFC] hover:text-[#C2410C] dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-[#FF5A1F]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[11px] tabular-nums text-[#64748B] dark:text-zinc-500">
                            0{idx + 1}
                          </span>
                          <span>{link.label}</span>
                        </span>
                        <ArrowUpRight
                          className={`h-4 w-4 ${isActive ? 'text-[#F97316] dark:text-[#FF5A1F]' : 'text-[#64748B] dark:text-zinc-500'}`}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleLinkClick('contact')}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-[#F97316] px-4 py-3 text-sm font-semibold text-[#172033] shadow-[0_8px_20px_-8px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] hover:bg-[#EA580C] dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38] cursor-pointer"
                >
                  <span>Contact Me</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
