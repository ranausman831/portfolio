export interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface ValidatedChatPayload {
  message: string;
  history: ChatHistoryTurn[];
}

export type ChatValidationResult =
  | { valid: true; data: ValidatedChatPayload }
  | { valid: false; error: string };

export interface PortfolioPromptKnowledge {
  name: string;
  role: string;
  location: string;
  availabilityItems: string[];
  aboutLead: string;
  careerGoal: string;
  skills: Array<{ name: string; category: string; roleInStack: string }>;
  featuredProjects: Array<{
    title: string;
    category: string;
    shortDescription: string;
    architectureSummary: string;
    technologies: string[];
  }>;
  githubProjects: Array<{
    title: string;
    category: string;
    description: string;
    technologies: string[];
    githubUrl: string;
  }>;
  educationAndTimeline: Array<{
    period: string;
    title: string;
    institution: string;
    summary: string;
  }>;
  contact: {
    email: string;
    linkedinUrl: string;
    githubUrl: string;
  };
}

const MAX_USER_MESSAGE_CHARS = 600;
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_TURN_CHARS = 1200;

export function validateChatRequest(body: unknown): ChatValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const record = body as Record<string, unknown>;
  const rawMessage = typeof record.message === 'string' ? record.message.trim() : '';

  if (!rawMessage) {
    return { valid: false, error: 'Please enter a question for the portfolio assistant.' };
  }

  if (rawMessage.length > MAX_USER_MESSAGE_CHARS) {
    return {
      valid: false,
      error: `Question must be ${MAX_USER_MESSAGE_CHARS} characters or fewer.`,
    };
  }

  const sanitizedHistory: ChatHistoryTurn[] = [];
  if (Array.isArray(record.history)) {
    const sliced = record.history.slice(-MAX_HISTORY_TURNS);
    for (const item of sliced) {
      if (!item || typeof item !== 'object') continue;
      const turn = item as Record<string, unknown>;
      const role = turn.role === 'user' || turn.role === 'assistant' ? turn.role : null;
      const text = typeof turn.text === 'string' ? turn.text.trim() : '';
      if (!role || !text) continue;
      sanitizedHistory.push({
        role,
        text: text.slice(0, MAX_HISTORY_TURN_CHARS),
      });
    }
  }

  const normalizedHistory: ChatHistoryTurn[] = [];
  for (const turn of sanitizedHistory) {
    if (normalizedHistory.length === 0 && turn.role !== 'user') {
      continue;
    }
    const previous = normalizedHistory[normalizedHistory.length - 1];
    if (previous && previous.role === turn.role) {
      previous.text = `${previous.text}\n${turn.text}`.slice(0, MAX_HISTORY_TURN_CHARS);
    } else {
      normalizedHistory.push(turn);
    }
  }

  // Ensure the history right before the new 'user' turn ends on an 'assistant' turn when non-empty
  while (
    normalizedHistory.length > 0 &&
    normalizedHistory[normalizedHistory.length - 1].role === 'user'
  ) {
    normalizedHistory.pop();
  }

  return {
    valid: true,
    data: {
      message: rawMessage,
      history: normalizedHistory,
    },
  };
}

export function buildPortfolioSystemInstruction(knowledge: PortfolioPromptKnowledge): string {
  const skillList = knowledge.skills
    .map((s) => `- ${s.name} (${s.category}): ${s.roleInStack}`)
    .join('\n');

  const featuredList = knowledge.featuredProjects
    .map(
      (p) =>
        `- ${p.title} [${p.category}]: ${p.shortDescription} Architecture: ${p.architectureSummary} Stack: ${p.technologies.join(', ')}`
    )
    .join('\n');

  const githubList = knowledge.githubProjects
    .map(
      (p) =>
        `- ${p.title} (${p.category}): ${p.description}${
          p.technologies.length ? ` | Stack: ${p.technologies.join(', ')}` : ''
        } | Repo: ${p.githubUrl}`
    )
    .join('\n');

  const timelineList = knowledge.educationAndTimeline
    .map((t) => `- ${t.period}: ${t.title} at ${t.institution} — ${t.summary}`)
    .join('\n');

  return [
    `You are the Portfolio AI Assistant on ${knowledge.name}'s personal portfolio website.`,
    `Your role is to answer visitor, recruiter, and client questions accurately and concisely using ONLY the verified portfolio facts below.`,
    ``,
    `STRICT TRUTHFULNESS RULES:`,
    `1. NEVER invent work experience, employers, client names, salaries, GPA, certifications, benchmarks, live demo URLs, or unlisted skills.`,
    `2. If asked for information not present below (for example: hourly rates, unlisted tools, prior salaried jobs not shown, or GPA), clearly state that it is not listed in the portfolio and invite the visitor to reach out via Email (${knowledge.contact.email}) or LinkedIn.`,
    `3. Keep answers concise, well-structured, and plain text (avoid excessive markdown decoration; short bullet points are fine).`,
    ``,
    `VERIFIED PROFILE:`,
    `Name: ${knowledge.name}`,
    `Role: ${knowledge.role}`,
    `Location: ${knowledge.location}`,
    `Availability: ${knowledge.availabilityItems.join(', ')}`,
    `Overview: ${knowledge.aboutLead}`,
    `Career Goal: ${knowledge.careerGoal}`,
    ``,
    `SKILLS:`,
    skillList,
    ``,
    `FEATURED AI ARCHITECTURE PROJECTS:`,
    featuredList,
    ``,
    `PUBLIC GITHUB REPOSITORIES (${knowledge.githubProjects.length}):`,
    githubList,
    ``,
    `EDUCATION & JOURNEY:`,
    timelineList,
    ``,
    `CONTACT CHANNELS:`,
    `Email: ${knowledge.contact.email}`,
    `LinkedIn: ${knowledge.contact.linkedinUrl}`,
    `GitHub: ${knowledge.contact.githubUrl}`,
  ].join('\n');
}

export function isQuotaExhaustedError(err: unknown): boolean {
  const errRecord =
    err && typeof err === 'object'
      ? (err as { status?: unknown; code?: unknown; message?: unknown })
      : null;
  const numericStatus = typeof errRecord?.status === 'number' ? errRecord.status : null;
  const message =
    err instanceof Error
      ? err.message
      : typeof errRecord?.message === 'string'
        ? errRecord.message
        : String(err ?? '');
  const lower = message.toLowerCase();

  return (
    numericStatus === 429 ||
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit')
  );
}

export function mapGeminiApiError(err: unknown): { status: number; error: string } {
  const errRecord =
    err && typeof err === 'object'
      ? (err as { status?: unknown; code?: unknown; name?: unknown; message?: unknown })
      : null;
  const numericStatus = typeof errRecord?.status === 'number' ? errRecord.status : null;
  const message =
    err instanceof Error
      ? err.message
      : typeof errRecord?.message === 'string'
        ? errRecord.message
        : String(err ?? '');
  const lower = message.toLowerCase();

  if (isQuotaExhaustedError(err)) {
    return {
      status: 429,
      error:
        'The AI assistant has reached its Gemini API free-tier rate/daily quota limit. Please try again later, or configure a billing-enabled API key in Settings > Secrets.',
    };
  }

  if (
    numericStatus === 401 ||
    numericStatus === 403 ||
    lower.includes('api key') ||
    lower.includes('api_key') ||
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('permission')
  ) {
    return {
      status: 503,
      error:
        'The AI assistant service is not available right now. You can browse sections directly or use the Contact form.',
    };
  }

  if (numericStatus === 404 || lower.includes('404') || lower.includes('not_found')) {
    return {
      status: 502,
      error:
        'The configured AI model is temporarily unavailable. Please try again shortly or explore the sections below.',
    };
  }

  if (
    numericStatus === 503 ||
    numericStatus === 504 ||
    lower.includes('timeout') ||
    lower.includes('aborted') ||
    lower.includes('deadline') ||
    lower.includes('unavailable')
  ) {
    return {
      status: 503,
      error:
        'The AI assistant timed out or is temporarily busy. Please click Retry in a moment.',
    };
  }

  return {
    status: 502,
    error:
      'Unable to reach the AI assistant right now. Please try again shortly or explore the projects below.',
  };
}

export interface AssistantApiParsedResult {
  ok: boolean;
  reply?: string;
  error?: string;
  shouldRetry: boolean;
}

export function parseAssistantApiResponse(
  status: number,
  rawBody: string
): AssistantApiParsedResult {
  let parsed: { ok?: unknown; reply?: unknown; error?: unknown } | null = null;
  if (rawBody && rawBody.trim().startsWith('{')) {
    try {
      parsed = JSON.parse(rawBody) as { ok?: unknown; reply?: unknown; error?: unknown };
    } catch {
      parsed = null;
    }
  }

  if (
    status >= 200 &&
    status < 300 &&
    parsed?.ok === true &&
    typeof parsed.reply === 'string' &&
    parsed.reply.trim().length > 0
  ) {
    return {
      ok: true,
      reply: parsed.reply,
      shouldRetry: false,
    };
  }

  const transientHttp = status === 502 || status === 503 || status === 504 || status === 408;
  if (parsed && typeof parsed.error === 'string' && parsed.error.trim().length > 0) {
    return {
      ok: false,
      error: parsed.error,
      shouldRetry: false,
    };
  }

  if (status === 404) {
    return {
      ok: false,
      error:
        'Portfolio AI service endpoint (/api/chat) was not found on this host. You can browse projects directly or email mbox9016@gmail.com.',
      shouldRetry: false,
    };
  }

  if (transientHttp) {
    return {
      ok: false,
      error: `The AI Assistant server is temporarily busy or starting up (HTTP ${status}). Please click Retry in a moment.`,
      shouldRetry: true,
    };
  }

  return {
    ok: false,
    error: `Unexpected server response (HTTP ${status || 'unknown'}). Please try again or email mbox9016@gmail.com.`,
    shouldRetry: false,
  };
}
