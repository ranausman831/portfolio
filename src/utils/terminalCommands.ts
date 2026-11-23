export type TerminalCommandName =
  | 'help'
  | 'about'
  | 'skills'
  | 'projects'
  | 'education'
  | 'contact'
  | 'clear';

export interface TerminalPortfolioContext {
  name: string;
  role: string;
  location: string;
  availabilityLabels: string[];
  aboutLead: string;
  careerGoal: string;
  skillsByCategory: Array<{ category: string; skills: string[] }>;
  featuredProjects: Array<{ index: string; title: string; category: string; stack: string[] }>;
  githubRepoCount: number;
  githubProfileUrl: string;
  educationEntries: Array<{ period: string; title: string; institution: string }>;
  email: string;
  linkedinUrl: string;
}

export interface TerminalOutputLine {
  kind: 'heading' | 'text' | 'accent' | 'muted' | 'error' | 'link';
  text: string;
  href?: string;
}

export interface TerminalExecutionResult {
  action: 'output' | 'clear';
  command: string;
  lines: TerminalOutputLine[];
}

export const TERMINAL_SUPPORTED_COMMANDS: ReadonlyArray<{
  command: TerminalCommandName;
  description: string;
}> = [
  { command: 'help', description: 'List all available terminal commands' },
  { command: 'about', description: 'Show role, location, availability, and focus' },
  { command: 'skills', description: 'Inspect AI, backend, and automation stack' },
  { command: 'projects', description: 'List featured AI agents & public repo count' },
  { command: 'education', description: 'Display academic timeline & BS CS details' },
  { command: 'contact', description: 'Show verified email, LinkedIn, and GitHub links' },
  { command: 'clear', description: 'Clear terminal history' },
];

const MAX_COMMAND_LENGTH = 120;

export function normalizeTerminalInput(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export function executeTerminalCommand(
  rawInput: string,
  ctx: TerminalPortfolioContext
): TerminalExecutionResult {
  const normalized = normalizeTerminalInput(rawInput);

  if (!normalized) {
    return {
      action: 'output',
      command: '',
      lines: [
        {
          kind: 'muted',
          text: 'No command entered. Type "help" to see supported commands.',
        },
      ],
    };
  }

  if (normalized.length > MAX_COMMAND_LENGTH) {
    return {
      action: 'output',
      command: normalized.slice(0, 40) + '...',
      lines: [
        {
          kind: 'error',
          text: `Input exceeds ${MAX_COMMAND_LENGTH} characters. Type "help" for valid commands.`,
        },
      ],
    };
  }

  const cmd = normalized.split(' ')[0].toLowerCase();

  switch (cmd) {
    case 'clear':
    case 'cls':
      return {
        action: 'clear',
        command: cmd,
        lines: [],
      };

    case 'help':
    case '?':
      return {
        action: 'output',
        command: cmd,
        lines: [
          { kind: 'heading', text: 'Available Portfolio Terminal Commands:' },
          ...TERMINAL_SUPPORTED_COMMANDS.map((entry) => ({
            kind: 'text' as const,
            text: `  ${entry.command.padEnd(11, ' ')} — ${entry.description}`,
          })),
          {
            kind: 'muted',
            text: 'Tip: Use Up/Down arrow keys to cycle command history or click a shortcut chip.',
          },
        ],
      };

    case 'about':
      return {
        action: 'output',
        command: cmd,
        lines: [
          { kind: 'heading', text: `${ctx.name} — ${ctx.role}` },
          { kind: 'muted', text: `Location: ${ctx.location}` },
          {
            kind: 'accent',
            text: `Status: ${ctx.availabilityLabels.join(' · ')}`,
          },
          { kind: 'text', text: ctx.aboutLead },
          { kind: 'text', text: ctx.careerGoal },
        ],
      };

    case 'skills':
      return {
        action: 'output',
        command: cmd,
        lines: [
          { kind: 'heading', text: 'Technical Stack & Architecture Capabilities:' },
          ...ctx.skillsByCategory.map((group) => ({
            kind: 'text' as const,
            text: `  [${group.category}] ${group.skills.join(', ')}`,
          })),
        ],
      };

    case 'projects':
      return {
        action: 'output',
        command: cmd,
        lines: [
          {
            kind: 'heading',
            text: `Featured AI Engineering Systems (${ctx.featuredProjects.length}) + ${ctx.githubRepoCount} Public GitHub Repos:`,
          },
          ...ctx.featuredProjects.map((project) => ({
            kind: 'text' as const,
            text: `  ${project.index}. ${project.title} (${project.category}) — ${project.stack.join(' · ')}`,
          })),
          {
            kind: 'link',
            text: `GitHub Repositories: ${ctx.githubProfileUrl}?tab=repositories`,
            href: `${ctx.githubProfileUrl}?tab=repositories`,
          },
        ],
      };

    case 'education':
      return {
        action: 'output',
        command: cmd,
        lines: [
          { kind: 'heading', text: 'Education & Academic Foundation:' },
          ...ctx.educationEntries.map((edu) => ({
            kind: 'text' as const,
            text: `  [${edu.period}] ${edu.title} — ${edu.institution}`,
          })),
        ],
      };

    case 'contact':
      return {
        action: 'output',
        command: cmd,
        lines: [
          { kind: 'heading', text: 'Verified Direct Channels:' },
          {
            kind: 'link',
            text: `  Email:    ${ctx.email}`,
            href: `mailto:${ctx.email}`,
          },
          {
            kind: 'link',
            text: `  LinkedIn: ${ctx.linkedinUrl}`,
            href: ctx.linkedinUrl,
          },
          {
            kind: 'link',
            text: `  GitHub:   ${ctx.githubProfileUrl}`,
            href: ctx.githubProfileUrl,
          },
        ],
      };

    default:
      return {
        action: 'output',
        command: cmd,
        lines: [
          {
            kind: 'error',
            text: `Command not found: "${cmd}".`,
          },
          {
            kind: 'muted',
            text: 'Run "help" to list valid commands: help, about, skills, projects, education, contact, clear.',
          },
        ],
      };
  }
}
