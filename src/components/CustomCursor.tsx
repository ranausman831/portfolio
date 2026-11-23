import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import {
  resolveCursorInteraction,
  shouldEnableCustomCursor,
  type CursorInteractionState,
} from '../utils/cursorFollower';

import type { ThemeMode } from '../utils/theme';

const INITIAL_STATE: CursorInteractionState = {
  variant: 'default',
  label: null,
};

interface CustomCursorProps {
  theme: ThemeMode;
}

export function CustomCursor({ theme }: CustomCursorProps) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interaction, setInteraction] = useState<CursorInteractionState>(INITIAL_STATE);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);
  const lastVariantKeyRef = useRef('default:');

  useEffect(() => {
    const finePointerMq = window.matchMedia('(pointer: fine)');
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCapability = () => {
      setEnabled(shouldEnableCustomCursor(finePointerMq.matches, reducedMotionMq.matches));
    };

    syncCapability();
    finePointerMq.addEventListener('change', syncCapability);
    reducedMotionMq.addEventListener('change', syncCapability);

    return () => {
      finePointerMq.removeEventListener('change', syncCapability);
      reducedMotionMq.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!ringEl || !dotEl) return;

    // Center transforms once via GSAP and drive XY with quickTo (compositor-only)
    gsap.set([ringEl, dotEl], { xPercent: -50, yPercent: -50 });

    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.28, ease: 'power3.out' });
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.28, ease: 'power3.out' });
    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power2.out' });

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);

      const nextState = resolveCursorInteraction(e.target as Element | null);
      const nextKey = `${nextState.variant}:${nextState.label ?? ''}`;
      if (nextKey !== lastVariantKeyRef.current) {
        lastVariantKeyRef.current = nextKey;
        setInteraction(nextState);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const handlePointerDown = () => {
      gsap.to(ringEl, { scale: 0.86, duration: 0.1, ease: 'power2.out' });
    };

    const handlePointerUp = () => {
      gsap.to(ringEl, { scale: 1, duration: 0.18, ease: 'power2.out' });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf([ringEl, dotEl]);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const isAction = interaction.variant === 'action';
  const isProject = interaction.variant === 'project';
  const isPortrait = interaction.variant === 'portrait';
  const isInput = interaction.variant === 'input';

  const ringSize = isProject
    ? 64
    : isPortrait
    ? 56
    : isAction
    ? 40
    : isInput
    ? 14
    : 24;

  const isLight = theme === 'light';

  return (
    <div
      data-testid="custom-cursor"
      data-variant={interaction.variant}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Trailing Reticle Frame (GSAP quickTo position + Framer Motion reactive state) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 will-change-transform"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            borderRadius: isProject || isPortrait ? 4 : isAction ? 2 : 2,
            borderColor:
              isAction || isProject || isPortrait
                ? isLight
                  ? 'rgba(249, 115, 22, 0.92)'
                  : 'rgba(255, 90, 31, 0.9)'
                : isLight
                ? 'rgba(23, 32, 51, 0.36)'
                : 'rgba(255, 255, 255, 0.32)',
            backgroundColor: isProject
              ? isLight
                ? 'rgba(23, 32, 51, 0.92)'
                : 'rgba(7, 7, 9, 0.86)'
              : isAction
              ? 'rgba(249, 115, 22, 0.12)'
              : isPortrait
              ? 'rgba(249, 115, 22, 0.08)'
              : 'rgba(7, 7, 9, 0)',
            opacity: isInput ? 0.35 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 30,
            mass: 0.6,
          }}
          className="relative flex items-center justify-center border"
        >
          {/* Pixel Corner Accents on Project / Portrait hover */}
          {(isProject || isPortrait) && (
            <>
              <span className="absolute -top-0.5 -left-0.5 h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
            </>
          )}

          <AnimatePresence mode="wait">
            {interaction.label && (
              <motion.span
                key={interaction.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.14 }}
                className="font-mono text-[10px] font-semibold tracking-wider text-[#FFB088] uppercase select-none"
              >
                {interaction.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Crisp Center Pixel Indicator */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 will-change-transform"
        style={{ opacity: visible && !isProject && !isPortrait ? 1 : 0 }}
      >
        <motion.div
          animate={{
            scale: isAction ? 1.4 : isInput ? 0.5 : 1,
            backgroundColor: isAction ? (isLight ? '#F97316' : '#FF5A1F') : isLight ? '#172033' : '#F4F4F6',
          }}
          transition={{ duration: 0.15 }}
          className="h-1.5 w-1.5"
        />
      </div>
    </div>
  );
}
