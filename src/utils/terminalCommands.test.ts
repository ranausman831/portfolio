import assert from 'node:assert/strict';
import test from 'node:test';
import {
  executeTerminalCommand,
  normalizeTerminalInput,
  type TerminalPortfolioContext,
} from './terminalCommands.ts';

const SAMPLE_CONTEXT: TerminalPortfolioContext = {
  name: 'Muhammad Usman',
  role: 'Agentic AI Engineer',
  location: 'Faisalabad, Pakistan',
  availabilityLabels: [
    'Available for Opportunities',
    'Open to AI Engineering Internships',
    'Open to Freelance Projects',
  ],
  aboutLead: 'BS Computer Science undergraduate at GCU Faisalabad.',
  careerGoal: 'Building dependable, tool-connected autonomous systems.',
  skillsByCategory: [
    { category: 'AI & Agentic AI', skills: ['LangChain', 'LangGraph', 'RAG', 'MCP'] },
    { category: 'Backend Development', skills: ['Python', 'FastAPI', 'Flask'] },
  ],
  featuredProjects: [
    {
      index: '01',
      title: 'AI SDR Agent',
      category: 'Autonomous Outreach Pipeline',
      stack: ['LangGraph', 'Gemini API'],
    },
  ],
  githubRepoCount: 18,
  githubProfileUrl: 'https://github.com/ranausman831',
  educationEntries: [
    {
      period: '2022 – 2026',
      title: 'BS Computer Science',
      institution: 'Government College University Faisalabad',
    },
  ],
  email: 'mbox9016@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/muhammad-usman-74431034b/',
};

test('normalizeTerminalInput trims and collapses internal whitespace', () => {
  assert.equal(normalizeTerminalInput('   skills   --all  '), 'skills --all');
});

test('executeTerminalCommand handles help, about, skills, projects, education, contact', () => {
  const helpResult = executeTerminalCommand('help', SAMPLE_CONTEXT);
  assert.equal(helpResult.action, 'output');
  assert.ok(helpResult.lines.some((line) => line.text.includes('about')));

  const aboutResult = executeTerminalCommand('ABOUT', SAMPLE_CONTEXT);
  assert.ok(aboutResult.lines.some((line) => line.text.includes('Muhammad Usman')));
  assert.ok(aboutResult.lines.some((line) => line.text.includes('Available for Opportunities')));

  const skillsResult = executeTerminalCommand('skills', SAMPLE_CONTEXT);
  assert.ok(skillsResult.lines.some((line) => line.text.includes('LangGraph')));

  const projectsResult = executeTerminalCommand('projects', SAMPLE_CONTEXT);
  assert.ok(projectsResult.lines.some((line) => line.text.includes('AI SDR Agent')));
  assert.ok(projectsResult.lines.some((line) => line.text.includes('18 Public GitHub Repos')));

  const eduResult = executeTerminalCommand('education', SAMPLE_CONTEXT);
  assert.ok(eduResult.lines.some((line) => line.text.includes('BS Computer Science')));

  const contactResult = executeTerminalCommand('contact', SAMPLE_CONTEXT);
  assert.ok(contactResult.lines.some((line) => line.href === 'mailto:mbox9016@gmail.com'));
});

test('executeTerminalCommand clears output for clear command', () => {
  const clearResult = executeTerminalCommand('clear', SAMPLE_CONTEXT);
  assert.equal(clearResult.action, 'clear');
  assert.equal(clearResult.lines.length, 0);
});

test('executeTerminalCommand gracefully handles empty, oversized, and unknown commands', () => {
  const emptyResult = executeTerminalCommand('   ', SAMPLE_CONTEXT);
  assert.equal(emptyResult.action, 'output');
  assert.ok(emptyResult.lines[0]?.text.includes('help'));

  const unknownResult = executeTerminalCommand('sudo rm -rf /', SAMPLE_CONTEXT);
  assert.ok(unknownResult.lines.some((line) => line.kind === 'error'));

  const oversizedResult = executeTerminalCommand('a'.repeat(130), SAMPLE_CONTEXT);
  assert.ok(oversizedResult.lines.some((line) => line.kind === 'error'));
});
