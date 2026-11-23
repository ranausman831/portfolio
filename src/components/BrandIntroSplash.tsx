import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HERO_PROFILE } from '../data/portfolioData';

export function BrandIntroSplash() {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autostart = new URLSearchParams(window.location.search).get('autostart') === '1';
    return !reduced && !autostart;
  });

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC] dark:bg-[#070709]"
        >
          <div className="flex items-center gap-3">
            <span className="grid grid-cols-2 gap-1 border border-[#E2E8F0] bg-white p-1.5 dark:border-white/15 dark:bg-[#14141A]">
              <span className="h-2 w-2 bg-[#F97316] dark:bg-[#FF5A1F]" />
              <span className="h-2 w-2 bg-[#172033] dark:bg-white/80" />
              <span className="h-2 w-2 bg-[#CBD5E1] dark:bg-white/30" />
              <span className="h-2 w-2 bg-[#F97316] dark:bg-[#FF5A1F]" />
            </span>
            <div className="text-left">
              <p className="font-display text-sm font-bold tracking-tight text-[#172033] dark:text-white">
                {HERO_PROFILE.brand}
              </p>
              <p className="font-mono text-[11px] text-[#C2410C] dark:text-[#FF8C42]">
                {HERO_PROFILE.role}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
