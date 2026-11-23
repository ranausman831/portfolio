import { CONTACT_INFO, HERO_PROFILE } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#F1F5F9] pt-10 pb-16 text-[#172033] transition-colors duration-200 dark:border-white/10 dark:bg-[#050507] dark:text-[#F4F4F6]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-display text-sm font-bold tracking-tight text-[#172033] dark:text-white">
            {HERO_PROFILE.brand}
          </p>
          <p className="mt-1 text-xs text-[#475569] dark:text-zinc-500">
            Agentic AI Engineer · {HERO_PROFILE.locationLabel}
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#475569] sm:gap-6 dark:text-zinc-400"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="inline-flex min-h-[32px] items-center transition-colors hover:text-[#172033] dark:hover:text-white"
          >
            Home
          </a>
          <a
            href="#architecture"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('architecture');
            }}
            className="inline-flex min-h-[32px] items-center transition-colors hover:text-[#172033] dark:hover:text-white"
          >
            Architecture
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('projects');
            }}
            className="inline-flex min-h-[32px] items-center transition-colors hover:text-[#172033] dark:hover:text-white"
          >
            Projects
          </a>
          <a
            href="#insights"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('insights');
            }}
            className="inline-flex min-h-[32px] items-center transition-colors hover:text-[#172033] dark:hover:text-white"
          >
            Insights
          </a>
          <a
            href="#resume"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('resume');
            }}
            className="inline-flex min-h-[32px] items-center transition-colors hover:text-[#172033] dark:hover:text-white"
          >
            Resume
          </a>
          <a
            href={CONTACT_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[32px] items-center text-[#334155] transition-colors hover:text-[#C2410C] dark:text-zinc-300 dark:hover:text-[#FF8C42]"
          >
            GitHub
          </a>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="inline-flex min-h-[32px] items-center text-[#334155] transition-colors hover:text-[#C2410C] dark:text-zinc-300 dark:hover:text-[#FF8C42]"
          >
            Email
          </a>
          <a
            href={CONTACT_INFO.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[32px] items-center font-medium text-[#C2410C] transition-colors hover:text-[#F97316] dark:text-[#FF8C42]"
          >
            LinkedIn
          </a>
        </nav>

        <p className="text-xs text-[#475569] tabular-nums dark:text-zinc-500">
          © 2026 Muhammad Usman
        </p>
      </div>
    </footer>
  );
}
