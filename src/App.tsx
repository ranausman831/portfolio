import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { AiArchitectureSection } from './components/AiArchitectureSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TerminalSection } from './components/TerminalSection';
import { TimelineSection } from './components/TimelineSection';
import { TechnicalInsightsSection } from './components/TechnicalInsightsSection';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { BackToTopButton } from './components/BackToTopButton';
import { BrandIntroSplash } from './components/BrandIntroSplash';
import { initPortfolioScrollChoreography } from './utils/scrollChoreography';
import {
  computeCircularRevealMetrics,
  resolveInitialTheme,
  resolveOriginFromElement,
  supportsViewTransition,
  THEME_STORAGE_KEY,
  toggleThemeMode,
  type ThemeMode,
} from './utils/theme';

gsap.registerPlugin(ScrollTrigger);

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition?: () => void;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (updateCallback: () => void) => ViewTransitionLike;
};

function applyThemeToDocument(nextTheme: ThemeMode) {
  const root = document.documentElement;
  const isDark = nextTheme === 'dark';
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', nextTheme);
  root.style.colorScheme = nextTheme;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', isDark ? '#070709' : '#F8FAFC');
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export default function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const activeTransitionRef = useRef<ViewTransitionLike | null>(null);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      return resolveInitialTheme(stored, false);
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
      }
      document.documentElement.classList.remove('theme-transitioning', 'theme-smooth-fallback');
    };
  }, []);

  const handleToggleTheme = useCallback(
    (sourceElement?: HTMLElement | null) => {
      const nextTheme = toggleThemeMode(theme);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const doc = document as DocumentWithViewTransition;

      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      document.documentElement.classList.remove('theme-smooth-fallback');

      if (supportsViewTransition(doc, prefersReducedMotion) && doc.startViewTransition) {
        try {
          if (activeTransitionRef.current?.skipTransition) {
            activeTransitionRef.current.skipTransition();
          }

          const origin = resolveOriginFromElement(sourceElement?.getBoundingClientRect(), {
            width: window.innerWidth,
            height: window.innerHeight,
          });
          const { x, y, endRadius } = computeCircularRevealMetrics(origin, {
            width: window.innerWidth,
            height: window.innerHeight,
          });

          document.documentElement.classList.add('theme-transitioning');

          const transition = doc.startViewTransition(() => {
            flushSync(() => {
              setTheme(nextTheme);
            });
            applyThemeToDocument(nextTheme);
          });
          activeTransitionRef.current = transition;

          transition.ready
            .then(() => {
              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 640,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  pseudoElement: '::view-transition-new(root)',
                  fill: 'both',
                }
              );
            })
            .catch(() => {
              // Ignore aborted transitions cleanly
            });

          transition.finished
            .catch(() => {
              // Ignore aborted transitions cleanly
            })
            .finally(() => {
              if (activeTransitionRef.current === transition) {
                activeTransitionRef.current = null;
              }
              document.documentElement.classList.remove('theme-transitioning');
            });
          return;
        } catch {
          document.documentElement.classList.remove('theme-transitioning');
        }
      }

      if (!prefersReducedMotion) {
        document.documentElement.classList.add('theme-smooth-fallback');
        fallbackTimerRef.current = window.setTimeout(() => {
          document.documentElement.classList.remove('theme-smooth-fallback');
          fallbackTimerRef.current = null;
        }, 320);
      }

      setTheme(nextTheme);
      applyThemeToDocument(nextTheme);
    },
    [theme]
  );

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    if (!prefersReducedMotion) {
      // Smooth scrolling via Lenis synced to GSAP ticker & ScrollTrigger
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    const teardownChoreography = initPortfolioScrollChoreography(rootEl);

    return () => {
      teardownChoreography();
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const headerOffset = window.innerWidth < 640 ? -58 : -66;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: headerOffset,
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      ScrollTrigger.refresh();
    }
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#172033] transition-colors duration-200 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <BrandIntroSplash />
      <ScrollProgressBar />
      <CustomCursor theme={theme} />
      <Navbar onNavigate={handleNavigate} theme={theme} onToggleTheme={handleToggleTheme} />
      <main>
        <HeroSection onNavigate={handleNavigate} theme={theme} />
        <AboutSection />
        <SkillsSection />
        <AiArchitectureSection />
        <ProjectsSection />
        <TerminalSection />
        <TimelineSection />
        <TechnicalInsightsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer onNavigate={handleNavigate} />
      <BackToTopButton onScrollTop={() => handleNavigate('home')} />
    </div>
  );
}
