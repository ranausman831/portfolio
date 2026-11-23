import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  onScrollTop: () => void;
}

export function BackToTopButton({ onScrollTop }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 520);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onScrollTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-3 left-3 z-40 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E2E8F0] bg-white/95 text-[#172033] shadow-[var(--shadow-card)] backdrop-blur-xs transition-all hover:-translate-y-0.5 hover:border-[#F97316] hover:text-[#C2410C] sm:bottom-6 sm:left-6 sm:rounded-sm dark:border-white/15 dark:bg-[#111116]/95 dark:text-zinc-200 dark:hover:border-[#FF5A1F] dark:hover:text-[#FF8C42] cursor-pointer"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
