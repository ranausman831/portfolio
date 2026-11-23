import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import {
  ABOUT_CONTENT,
  AVAILABILITY_CONFIG,
  CONTACT_INFO,
  FEATURED_PROJECTS,
  GITHUB_PROJECTS,
  HERO_PROFILE,
  SKILLS_DATA,
  TIMELINE_DATA,
} from '../data/portfolioData';
import {
  executeTerminalCommand,
  TERMINAL_SUPPORTED_COMMANDS,
  type TerminalOutputLine,
  type TerminalPortfolioContext,
} from '../utils/terminalCommands';

interface TerminalHistoryEntry {
  id: number;
  command: string;
  lines: TerminalOutputLine[];
}

export function TerminalSection() {
  const portfolioContext = useMemo<TerminalPortfolioContext>(() => {
    const categories = ['AI & Agentic AI', 'Backend Development', 'AI Integration', 'Automation'];
    return {
      name: HERO_PROFILE.name,
      role: HERO_PROFILE.role,
      location: HERO_PROFILE.locationLabel,
      availabilityLabels: [...AVAILABILITY_CONFIG.statuses],
      aboutLead: ABOUT_CONTENT.lead,
      careerGoal: ABOUT_CONTENT.careerGoal,
      skillsByCategory: categories.map((cat) => ({
        category: cat,
        skills: SKILLS_DATA.filter((s) => s.category === cat).map((s) => s.name),
      })),
      featuredProjects: FEATURED_PROJECTS.map((p) => ({
        index: p.index,
        title: p.title,
        category: p.category,
        stack: p.technologies,
      })),
      githubRepoCount: GITHUB_PROJECTS.length,
      githubProfileUrl: CONTACT_INFO.githubUrl,
      educationEntries: TIMELINE_DATA.filter((t) => t.type === 'Education').map((t) => ({
        period: t.period,
        title: t.title,
        institution: t.institution,
      })),
      email: CONTACT_INFO.email,
      linkedinUrl: CONTACT_INFO.linkedinUrl,
    };
  }, []);

  const [entries, setEntries] = useState<TerminalHistoryEntry[]>(() => {
    const initial = executeTerminalCommand('about', portfolioContext);
    return [
      {
        id: 1,
        command: 'about',
        lines: initial.lines,
      },
    ];
  });
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(['about']);
  const [historyCursor, setHistoryCursor] = useState<number>(-1);
  const nextIdRef = useRef(2);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const runCommand = (rawCommand: string) => {
    const result = executeTerminalCommand(rawCommand, portfolioContext);

    if (result.action === 'clear') {
      setEntries([]);
      setInput('');
      setHistoryCursor(-1);
      return;
    }

    const trimmed = rawCommand.trim();
    if (trimmed) {
      setCommandHistory((prev) => [...prev.slice(-24), trimmed]);
    }
    setHistoryCursor(-1);

    setEntries((prev) => [
      ...prev.slice(-14),
      {
        id: nextIdRef.current++,
        command: result.command || rawCommand.trim(),
        lines: result.lines,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(input);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextCursor =
        historyCursor === -1 ? commandHistory.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(nextCursor);
      setInput(commandHistory[nextCursor] ?? '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor === -1) return;
      if (historyCursor >= commandHistory.length - 1) {
        setHistoryCursor(-1);
        setInput('');
      } else {
        const nextCursor = historyCursor + 1;
        setHistoryCursor(nextCursor);
        setInput(commandHistory[nextCursor] ?? '');
      }
    }
  };

  return (
    <section
      id="terminal"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-white py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 dark:border-white/10 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          data-stagger-group
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              Interactive Console
            </p>
            <h2
              data-stagger-item
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl dark:text-white"
            >
              Explore Portfolio via Developer Terminal
            </h2>
            <p
              data-stagger-item
              className="mt-2 max-w-2xl text-sm text-[#64748B] dark:text-zinc-400"
            >
              Inspect verified profile details, stack capabilities, projects, and education with
              shell commands or click any shortcut below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {TERMINAL_SUPPORTED_COMMANDS.map((item) => (
              <button
                key={item.command}
                type="button"
                onClick={() => {
                  runCommand(item.command);
                  inputRef.current?.focus();
                }}
                className="min-h-[38px] sm:min-h-[34px] rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 font-mono text-xs font-medium text-[#334155] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] active:scale-[0.98] dark:border-white/15 dark:bg-[#111116] dark:text-zinc-300 dark:hover:border-[#FF5A1F] dark:hover:text-[#FF8C42] cursor-pointer"
              >
                {item.command}
              </button>
            ))}
          </div>
        </div>

        {/* Always-Crisp Dark Monospace Terminal Window */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="mt-6 sm:mt-7 overflow-hidden rounded-lg sm:rounded-sm border border-[#CBD5E1] bg-[#0B0B10] text-zinc-200 shadow-[var(--shadow-elevated)] dark:border-white/15"
        >
          {/* Window Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#12121A] px-3.5 py-2.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-zinc-400">
              <TerminalIcon className="h-3.5 w-3.5 shrink-0 text-[#FF5A1F]" aria-hidden="true" />
              <span className="truncate">usman@agentic-ai: ~/portfolio</span>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-zinc-500">Type &quot;help&quot;</span>
          </div>

          {/* Output Buffer */}
          <div
            role="log"
            aria-live="polite"
            className="max-h-[340px] sm:max-h-[360px] overflow-y-auto px-3.5 py-3.5 font-mono text-xs leading-relaxed sm:px-6 sm:py-4 sm:text-[13px]"
          >
            {entries.length === 0 && (
              <p className="text-zinc-500">
                Terminal cleared. Type &quot;help&quot; or select a command chip above.
              </p>
            )}

            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id}>
                  <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                    <span className="font-semibold text-[#FF8C42] sm:hidden">~$</span>
                    <span className="hidden font-semibold text-[#FF8C42] sm:inline">usman@agentic-ai:~$</span>
                    <span className="[overflow-wrap:anywhere]">{entry.command}</span>
                  </div>
                  <div className="mt-1.5 space-y-1 pl-0 sm:pl-2">
                    {entry.lines.map((line, idx) => {
                      if (line.kind === 'link' && line.href) {
                        return (
                          <div key={idx}>
                            <a
                              href={line.href}
                              target={line.href.startsWith('http') ? '_blank' : undefined}
                              rel={line.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block [overflow-wrap:anywhere] text-[#FF8C42] underline decoration-[#FF8C42]/40 underline-offset-4 hover:text-[#FFB088]"
                            >
                              {line.text}
                            </a>
                          </div>
                        );
                      }

                      const colorClass =
                        line.kind === 'heading'
                          ? 'font-semibold text-white'
                          : line.kind === 'accent'
                            ? 'text-emerald-400'
                            : line.kind === 'error'
                              ? 'text-rose-400'
                              : line.kind === 'muted'
                                ? 'text-zinc-400'
                                : 'text-zinc-300';

                      return (
                        <p key={idx} className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${colorClass}`}>
                          {line.text}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Prompt Input */}
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
              <label htmlFor="portfolio-terminal-input" className="shrink-0 font-semibold text-[#FF8C42]">
                <span className="sm:hidden">~$</span>
                <span className="hidden sm:inline">usman@agentic-ai:~$</span>
              </label>
              <input
                ref={inputRef}
                id="portfolio-terminal-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Type "help" or a command...'
                aria-label="Portfolio terminal command input"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 w-full bg-transparent text-base sm:text-[13px] text-white placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
