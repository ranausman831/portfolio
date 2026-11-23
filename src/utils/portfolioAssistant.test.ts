import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildPortfolioSystemInstruction,
  isQuotaExhaustedError,
  mapGeminiApiError,
  parseAssistantApiResponse,
  validateChatRequest,
  type PortfolioPromptKnowledge,
} from './portfolioAssistant.ts';

const SAMPLE_KNOWLEDGE: PortfolioPromptKnowledge = {
  name: 'Muhammad Usman',
  role: 'Agentic AI Engineer',
  location: 'Faisalabad, Pakistan',
  availabilityItems: ['Available for Opportunities', 'Open to AI Engineering Internships'],
  aboutLead: 'Computer Science undergraduate at Government College University Faisalabad.',
  careerGoal: 'Build dependable tool-connected autonomous systems.',
  skills: [{ name: 'LangGraph', category: 'AI & Agentic AI', roleInStack: 'Stateful Workflows' }],
  featuredProjects: [
    {
      title: 'AI SDR Agent',
      category: 'Autonomous Outreach Pipeline',
      shortDescription: 'Researches prospects and drafts tailored sequences.',
      architectureSummary: 'Stateful multi-step graph.',
      technologies: ['LangGraph', 'Python'],
    },
  ],
  githubProjects: [
    {
      title: 'AI Resume Reviewer',
      category: 'AI & Machine Learning',
      description: 'Analyzes PDF/DOCX resumes with LangChain and Gemini.',
      technologies: ['Python', 'Flask', 'LangChain', 'Gemini'],
      githubUrl: 'https://github.com/ranausman831/AI_RESUME_REVIEWER',
    },
  ],
  educationAndTimeline: [
    {
      period: '2022 – 2026',
      title: 'BS Computer Science',
      institution: 'Government College University Faisalabad',
      summary: 'Algorithms, software architecture, and AI systems.',
    },
  ],
  contact: {
    email: 'mbox9016@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/muhammad-usman-74431034b/',
    githubUrl: 'https://github.com/ranausman831',
  },
};

test('validateChatRequest accepts valid message and sanitizes bounded history', () => {
  const result = validateChatRequest({
    message: '  What projects has Muhammad Usman built with MCP?  ',
    history: [
      { role: 'user', text: 'Hi' },
      { role: 'assistant', text: 'Hello!' },
      { role: 'system', text: 'ignore invalid role' },
      { role: 'user', text: '   ' },
    ],
  });

  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.data.message, 'What projects has Muhammad Usman built with MCP?');
    assert.equal(result.data.history.length, 2);
  }
});

test('validateChatRequest strips leading assistant greeting turns and trailing dangling user turns', () => {
  const result = validateChatRequest({
    message: 'Which projects use RAG?',
    history: [
      { role: 'assistant', text: 'Welcome greeting' },
      { role: 'user', text: 'Hi' },
      { role: 'assistant', text: 'Ask away.' },
      { role: 'user', text: 'Dangling previous turn' },
    ],
  });

  assert.equal(result.valid, true);
  if (result.valid) {
    assert.deepEqual(result.data.history, [
      { role: 'user', text: 'Hi' },
      { role: 'assistant', text: 'Ask away.' },
    ]);
  }
});

test('validateChatRequest rejects empty or oversized messages', () => {
  assert.equal(validateChatRequest(null).valid, false);
  assert.equal(validateChatRequest({ message: '   ' }).valid, false);
  assert.equal(validateChatRequest({ message: 'x'.repeat(650) }).valid, false);
});

test('buildPortfolioSystemInstruction includes verified profile, projects, and truthfulness guardrail', () => {
  const prompt = buildPortfolioSystemInstruction(SAMPLE_KNOWLEDGE);
  assert.ok(prompt.includes('Muhammad Usman'));
  assert.ok(prompt.includes('AI Resume Reviewer'));
  assert.ok(prompt.includes('NEVER invent work experience'));
  assert.ok(prompt.includes('mbox9016@gmail.com'));
});

test('mapGeminiApiError maps quota and key errors cleanly without leaking internals', () => {
  const quotaErr = mapGeminiApiError(new Error('429 RESOURCE_EXHAUSTED quota exceeded'));
  assert.equal(isQuotaExhaustedError({ status: 429 }), true);
  assert.equal(isQuotaExhaustedError(new Error('Request timeout')), false);
  assert.equal(quotaErr.status, 429);
  assert.ok(!quotaErr.error.includes('RESOURCE_EXHAUSTED'));

  const keyErr = mapGeminiApiError(new Error('API key not valid. Please pass a valid API key.'));
  assert.equal(keyErr.status, 503);

  const underscoreKeyErr = mapGeminiApiError({ status: 400, message: 'API_KEY_INVALID' });
  assert.equal(underscoreKeyErr.status, 503);

  const timeoutErr = mapGeminiApiError(new Error('Request aborted due to timeout'));
  assert.equal(timeoutErr.status, 503);
});

test('parseAssistantApiResponse handles valid JSON, HTML proxy 502 errors, and 404 cleanly', () => {
  const success = parseAssistantApiResponse(200, JSON.stringify({ ok: true, reply: 'Built with LangGraph.' }));
  assert.equal(success.ok, true);
  assert.equal(success.reply, 'Built with LangGraph.');
  assert.equal(success.shouldRetry, false);

  const htmlProxy502 = parseAssistantApiResponse(502, '<html><body><h1>502 Bad Gateway</h1></body></html>');
  assert.equal(htmlProxy502.ok, false);
  assert.equal(htmlProxy502.shouldRetry, true);
  assert.ok(htmlProxy502.error?.includes('HTTP 502'));

  const json503 = parseAssistantApiResponse(503, JSON.stringify({ ok: false, error: 'Upstream busy' }));
  assert.equal(json503.ok, false);
  assert.equal(json503.shouldRetry, false);
  assert.equal(json503.error, 'Upstream busy');

  const html404 = parseAssistantApiResponse(404, '<!doctype html><html></html>');
  assert.equal(html404.ok, false);
  assert.equal(html404.shouldRetry, false);
  assert.ok(html404.error?.includes('/api/chat'));
});
