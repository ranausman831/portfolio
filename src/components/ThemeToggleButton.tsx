import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ThemeMode } from '../utils/theme';

interface ThemeToggleButtonProps {
  theme: ThemeMode;
  onToggle: (sourceElement?: HTMLElement | null) => void;
}

const STAR_SPARKS = [
  { id: 'star-top-right', x: 7.5, y: -7, size: 5.5, delay: 0.08 },
  { id: 'star-top-left', x: -7.5, y: -5.5, size: 4, delay: 0.16 },
  { id: 'star-bottom-right', x: 6.5, y: 7, size: 3.5, delay: 0.22 },
] as const;

const SUN_RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

export function ThemeToggleButton({ theme, onToggle }: ThemeToggleButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      data-theme-mode={theme}
      onClick={(e) => onToggle(e.currentTarget)}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Dark Mode active — Switch to Light Mode' : 'Light Mode active — Switch to Dark Mode'}
      className="group relative inline-flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] text-[#172033] shadow-2xs transition-colors duration-200 hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] dark:border-white/15 dark:bg-[#111116] dark:text-zinc-100 dark:shadow-none dark:hover:border-[#FF5A1F] dark:hover:bg-[#171210] dark:hover:text-[#FF8C42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] dark:focus-visible:outline-[#FF5A1F] cursor-pointer"
    >
      {/* Subtle radial glow pulse matching active theme */}
      <AnimatePresence initial={false} mode="popLayout">
        {isDark ? (
          <motion.span
            key="dark-halo"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.25 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.55)_0%,transparent_72%)]"
          />
        ) : (
          <motion.span
            key="light-halo"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.35 }}
            animate={{ opacity: [0.55, 0.24], scale: [1.15, 1] }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.3 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0.5 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.38)_0%,rgba(251,146,60,0.12)_55%,transparent_78%)]"
          />
        )}
      </AnimatePresence>

      {/* Animated Moon + Stars (Dark Mode) vs Sun + Sunlight Rays (Light Mode) */}
      <AnimatePresence initial={false} mode="popLayout">
        {isDark ? (
          <motion.span
            key="moon-state"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { rotate: -70, scale: 0.55, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { rotate: 70, scale: 0.55, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-5 w-5 items-center justify-center"
          >
            {/* Crescent Moon SVG */}
            <svg
              viewBox="0 0 24 24"
              className="h-[17px] w-[17px] text-[#FF8C42] transition-transform duration-200 group-hover:scale-105"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.2 14.5A8.2 8.2 0 0 1 9.5 3.8a8.5 8.5 0 1 0 10.7 10.7Z" />
            </svg>

            {/* Subtle animated orange-white stars */}
            {STAR_SPARKS.map((star) => (
              <motion.svg
                key={star.id}
                viewBox="0 0 12 12"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  transform: `translate(${star.x}px, ${star.y}px)`,
                }}
                className="pointer-events-none absolute text-[#FF8C42]"
                fill="currentColor"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.2, rotate: -30 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.9, scale: 1, rotate: 0 }
                    : {
                        opacity: [0, 1, 0.72, 1],
                        scale: [0.2, 1.18, 0.9, 1],
                        rotate: [0, 15, 0],
                      }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.7,
                  delay: shouldReduceMotion ? 0 : star.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <path d="M6 0L7.4 4.6L12 6L7.4 7.4L6 12L4.6 7.4L0 6L4.6 4.6Z" />
              </motion.svg>
            ))}
          </motion.span>
        ) : (
          <motion.span
            key="sun-state"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { rotate: 75, scale: 0.55, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { rotate: -75, scale: 0.55, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-5 w-5 items-center justify-center"
          >
            {/* Subtle warm sunlight pulse ring */}
            <motion.span
              initial={shouldReduceMotion ? false : { scale: 0.45, opacity: 0.85 }}
              animate={shouldReduceMotion ? { scale: 1, opacity: 0 } : { scale: 1.55, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0 rounded-full border border-[#F97316]"
            />

            {/* Crisp Geometric Sun Core + Animated Sunlight Rays */}
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] text-[#EA580C] transition-transform duration-200 group-hover:rotate-12 group-hover:scale-105"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="4.1" fill="#F97316" fillOpacity="0.18" />
              {SUN_RAY_ANGLES.map((angle, index) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 12 + Math.cos(rad) * 7.1;
                const y1 = 12 + Math.sin(rad) * 7.1;
                const x2 = 12 + Math.cos(rad) * 9.6;
                const y2 = 12 + Math.sin(rad) * 9.6;
                return (
                  <motion.line
                    key={angle}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.28,
                      delay: shouldReduceMotion ? 0 : index * 0.02,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
