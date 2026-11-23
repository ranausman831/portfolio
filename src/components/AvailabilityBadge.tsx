import { AVAILABILITY_CONFIG } from '../data/portfolioData';

interface AvailabilityBadgeProps {
  variant?: 'hero' | 'card';
}

export function AvailabilityBadge({ variant = 'hero' }: AvailabilityBadgeProps) {
  if (!AVAILABILITY_CONFIG.isActive) {
    return null;
  }

  if (variant === 'card') {
    return (
      <div className="rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-[#101015]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.65)]" />
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {AVAILABILITY_CONFIG.primaryStatus}
          </span>
        </div>
        <ul className="mt-2.5 space-y-1 text-xs text-[#475569] dark:text-zinc-300">
          {AVAILABILITY_CONFIG.statuses.slice(1).map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#F97316] dark:bg-[#FF5A1F]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={`Work status: ${AVAILABILITY_CONFIG.statuses.join(', ')}`}
      className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-sm border border-emerald-500/25 bg-emerald-50/70 px-3 py-1.5 text-xs dark:border-emerald-500/25 dark:bg-emerald-950/25"
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
      </span>
      <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-300">
        {AVAILABILITY_CONFIG.primaryStatus}
      </span>
      <span aria-hidden="true" className="hidden text-emerald-600/50 sm:inline dark:text-emerald-400/40">
        ·
      </span>
      <span className="hidden text-[#334155] sm:inline dark:text-zinc-300">
        Open to AI Engineering Internships &amp; Freelance Projects
      </span>
    </div>
  );
}
