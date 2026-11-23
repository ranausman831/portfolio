import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers award-grade GSAP + ScrollTrigger scroll choreography across the portfolio.
 * Uses gsap.context() and gsap.matchMedia() for clean lifecycle teardown and
 * automatic prefers-reduced-motion compliance.
 */
export function initPortfolioScrollChoreography(rootEl: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  const ctx = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Hero Entrance: Staggered typography + Clip-path mask reveal on 3D Voxel Portrait
      gsap.from('.hero-reveal', {
        y: 26,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.fromTo(
        '[data-clip-reveal="hero-portrait"]',
        {
          clipPath: 'inset(7% 5% 7% 5%)',
          scale: 0.96,
          opacity: 0,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          opacity: 1,
          duration: 0.9,
          delay: 0.14,
          ease: 'power3.out',
          clearProps: 'clipPath,transform,opacity',
        }
      );

      // 2. Hero & Background Parallax Scrubs (>= 768px for crisp 60fps mobile touch scroll)
      mm.add('(min-width: 768px)', () => {
        const heroSection = rootEl.querySelector('#home');
        if (heroSection) {
          gsap.to('[data-parallax="bg-grid"]', {
            y: 52,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.1,
            },
          });

          gsap.to('[data-parallax="bg-glow"]', {
            y: 96,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });

          gsap.to('[data-parallax="hero-portrait"]', {
            y: -38,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.9,
            },
          });
        }
      });

      // 3. Consecutive Section Seam Continuity Lines
      const seams = gsap.utils.toArray<HTMLElement>('[data-scroll-seam]', rootEl);
      seams.forEach((seam) => {
        gsap.fromTo(
          seam,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: seam,
              start: 'top 92%',
              once: true,
            },
          }
        );
      });

      // 4. Major Section Shell Reveals (Fade + Vertical Movement + Subtle Scale)
      // Note: sections hosting a pinned column animate opacity only on the outer shell
      // so CSS transforms never create a containing block that offsets position:fixed pins.
      interface RevealEntry {
        el: HTMLElement;
        tween: gsap.core.Tween;
      }
      const revealEntries: RevealEntry[] = [];

      const syncVisibleReveals = () => {
        const viewportH = window.innerHeight;
        for (const entry of revealEntries) {
          if (entry.tween.progress() >= 1) continue;
          const rect = entry.el.getBoundingClientRect();
          if (rect.bottom < 0) {
            entry.tween.progress(1);
          } else if (rect.top < viewportH * 0.98) {
            if (!entry.tween.isActive() && entry.tween.progress() === 0) {
              entry.tween.play();
            }
          }
        }
      };

      const sections = gsap.utils.toArray<HTMLElement>('[data-scroll-section]', rootEl);
      sections.forEach((section) => {
        const isPinHost = section.getAttribute('data-scroll-section') === 'pin-host';
        const tween = isPinHost
          ? gsap.fromTo(
              section,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.42,
                ease: 'power3.out',
                paused: true,
                clearProps: 'opacity',
              }
            )
          : gsap.fromTo(
              section,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.42,
                ease: 'power3.out',
                paused: true,
                clearProps: 'transform,opacity',
              }
            );

        ScrollTrigger.create({
          trigger: section,
          start: 'top 97%',
          end: 'bottom top',
          once: true,
          onEnter: () => tween.play(),
          onLeave: () => tween.progress(1),
        });
        revealEntries.push({ el: section, tween });
      });

      // 5. Staggered Text, Headings, Descriptions & Button Groups
      const staggerGroups = gsap.utils.toArray<HTMLElement>('[data-stagger-group]', rootEl);
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
        if (items.length === 0) return;

        const tween = gsap.fromTo(
          items,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
            paused: true,
            clearProps: 'transform,opacity',
          }
        );

        ScrollTrigger.create({
          trigger: group,
          start: 'top 97%',
          end: 'bottom top',
          once: true,
          onEnter: () => tween.play(),
          onLeave: () => tween.progress(1),
        });
        revealEntries.push({ el: group, tween });
      });

      // 6. Clip-Path Mask Reveals for Architectural Visual Panels & Project Previews
      const clipTargets = gsap.utils.toArray<HTMLElement>('[data-clip-reveal="panel"]', rootEl);
      clipTargets.forEach((panel) => {
        const tween = gsap.fromTo(
          panel,
          {
            clipPath: 'inset(10% 0% 0% 0%)',
            opacity: 0,
            y: 12,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power3.out',
            paused: true,
            clearProps: 'clipPath,transform,opacity',
          }
        );

        ScrollTrigger.create({
          trigger: panel,
          start: 'top 97%',
          end: 'bottom top',
          once: true,
          onEnter: () => tween.play(),
          onLeave: () => tween.progress(1),
        });
        revealEntries.push({ el: panel, tween });
      });

      // Keep any scrolled/jumped viewport elements revealed on scroll or refresh
      let syncRafId = 0;
      const scheduleRevealSync = () => {
        if (syncRafId) return;
        syncRafId = window.requestAnimationFrame(() => {
          syncRafId = 0;
          syncVisibleReveals();
        });
      };

      window.addEventListener('scroll', scheduleRevealSync, { passive: true });
      ScrollTrigger.addEventListener('refresh', scheduleRevealSync);
      syncVisibleReveals();

      // 7. Subtle Parallax on Architectural Motifs (>= 768px)
      mm.add('(min-width: 768px)', () => {
        const motifs = gsap.utils.toArray<HTMLElement>('[data-parallax="motif"]', rootEl);
        motifs.forEach((motif) => {
          gsap.fromTo(
            motif,
            { y: 18 },
            {
              y: -18,
              ease: 'none',
              scrollTrigger: {
                trigger: motif,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
              },
            }
          );
        });
      });

      // 8. Selective Pinned Scroll Choreography (Desktop >= 1024px only, zero extra blank space)
      mm.add('(min-width: 1024px)', () => {
        const pinPairs: Array<{ containerSel: string; colSel: string }> = [
          {
            containerSel: '[data-pin-container="timeline"]',
            colSel: '[data-pin-col="timeline"]',
          },
          {
            containerSel: '[data-pin-container="about"]',
            colSel: '[data-pin-col="about"]',
          },
        ];

        pinPairs.forEach(({ containerSel, colSel }) => {
          const container = rootEl.querySelector<HTMLElement>(containerSel);
          const col = rootEl.querySelector<HTMLElement>(colSel);
          if (!container || !col) return;

          const getPinDistance = () => Math.max(0, container.offsetHeight - col.offsetHeight);
          if (getPinDistance() <= 24) return;

          ScrollTrigger.create({
            trigger: container,
            start: 'top 96px',
            end: () => `+=${getPinDistance()}`,
            pin: col,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        });
      });

      return () => {
        window.removeEventListener('scroll', scheduleRevealSync);
        ScrollTrigger.removeEventListener('refresh', scheduleRevealSync);
        if (syncRafId) window.cancelAnimationFrame(syncRafId);
      };
    });
  }, rootEl);

  // Automatically re-measure triggers whenever async content (e.g. GitHub API) or filters alter height
  let resizeRafId = 0;
  const resizeObserver =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          if (resizeRafId) return;
          resizeRafId = window.requestAnimationFrame(() => {
            resizeRafId = 0;
            ScrollTrigger.refresh();
          });
        })
      : null;

  resizeObserver?.observe(rootEl);

  // Refresh trigger measurements after fonts/layout stabilize
  const refreshTimer = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 150);

  return () => {
    window.clearTimeout(refreshTimer);
    if (resizeRafId) window.cancelAnimationFrame(resizeRafId);
    resizeObserver?.disconnect();
    mm.revert();
    ctx.revert();
  };
}
