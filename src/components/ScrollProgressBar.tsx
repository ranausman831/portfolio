import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[#E2E8F0]/80 dark:bg-white/5"
    >
      <motion.div
        data-testid="scroll-progress-bar"
        className="h-full w-full origin-left bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] dark:from-[#FF5A1F] dark:via-[#FF7A45] dark:to-[#FFB088] will-change-transform"
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
        }}
      />
    </div>
  );
}
