import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRepoCaseStudyProject,
  computeLuminance,
  filterGitHubProjectsByCategory,
  filterInsightsByTopic,
  filterProjectsByTechnology,
  filterSkillsByCategory,
  samplePortraitVoxels,
  validateContactMessage,
} from './voxelPortraitMath';
import {
  FEATURED_PROJECTS,
  GITHUB_PROJECTS,
  SKILLS_DATA,
  TECHNICAL_INSIGHTS,
} from '../data/portfolioData';

test('computeLuminance calculates accurate sRGB perceptual luminance', () => {
  assert.equal(computeLuminance(0, 0, 0), 0);
  assert.equal(Math.round(computeLuminance(255, 255, 255) * 1000) / 1000, 1);
  assert.ok(computeLuminance(0, 255, 0) > computeLuminance(255, 0, 0));
});

test('samplePortraitVoxels maps RGBA pixel grid to centered 3D voxels with Z depth', () => {
  // 2x2 image: bright white top-left, dark black bottom-right
  const rgba = new Uint8ClampedArray([
    255, 255, 255, 255,
    128, 128, 128, 255,
    64, 64, 64, 255,
    0, 0, 0, 255,
  ]);
  const voxels = samplePortraitVoxels(rgba, 2, 2, 2, 2.0, 0.5);
  assert.equal(voxels.length, 4);

  // Top-left voxel should have +Y, -X and higher luminance than bottom-right
  const topLeft = voxels[0];
  const bottomRight = voxels[3];
  assert.ok(topLeft.x < 0);
  assert.ok(topLeft.y > 0);
  assert.ok(bottomRight.x > 0);
  assert.ok(bottomRight.y < 0);
  assert.ok(topLeft.zDepth > bottomRight.zDepth);
});

test('samplePortraitVoxels handles empty or invalid buffers safely', () => {
  assert.deepEqual(samplePortraitVoxels([], 0, 0, 10), []);
  assert.deepEqual(samplePortraitVoxels([255, 0, 0, 255], 4, 4, 4), []);
});

test('filterSkillsByCategory returns exact matching categories across all 17 skills', () => {
  const all = filterSkillsByCategory(SKILLS_DATA, 'All');
  assert.equal(all.length, 17);

  const agentic = filterSkillsByCategory(SKILLS_DATA, 'AI & Agentic AI');
  assert.equal(agentic.length, 7);

  const backend = filterSkillsByCategory(SKILLS_DATA, 'Backend Development');
  assert.equal(backend.length, 4);
  assert.ok(backend.some((s) => s.name === 'Python'));
  assert.ok(backend.some((s) => s.name === 'FastAPI'));
  assert.ok(backend.some((s) => s.name === 'Flask'));
  assert.ok(backend.some((s) => s.name === 'REST APIs'));

  const integration = filterSkillsByCategory(SKILLS_DATA, 'AI Integration');
  assert.equal(integration.length, 3);

  const automation = filterSkillsByCategory(SKILLS_DATA, 'Automation');
  assert.equal(automation.length, 3);
  assert.ok(automation.some((s) => s.name === 'n8n'));
  assert.ok(automation.some((s) => s.name === 'Human-in-the-Loop Workflows'));
});

test('filterProjectsByTechnology filters featured projects accurately', () => {
  assert.equal(filterProjectsByTechnology(FEATURED_PROJECTS, 'All').length, 5);
  const ragProjects = filterProjectsByTechnology(FEATURED_PROJECTS, 'RAG');
  assert.equal(ragProjects.length, 2);
  assert.ok(ragProjects.some((p) => p.title === 'Intern AI Support Chatbot'));
  assert.ok(ragProjects.some((p) => p.title === 'PDF Research Assistant'));
});

test('filterGitHubProjectsByCategory covers all 18 repositories with real ranausman831 links', () => {
  assert.equal(filterGitHubProjectsByCategory(GITHUB_PROJECTS, 'All').length, 18);
  assert.ok(
    GITHUB_PROJECTS.every((p) => p.githubUrl.startsWith('https://github.com/ranausman831/'))
  );
  assert.equal(filterGitHubProjectsByCategory(GITHUB_PROJECTS, 'Agentic AI & MCP').length, 3);
  assert.equal(filterGitHubProjectsByCategory(GITHUB_PROJECTS, 'Android Development').length, 1);
  assert.equal(filterGitHubProjectsByCategory(GITHUB_PROJECTS, 'AI & Machine Learning').length, 5);
});

test('validateContactMessage rejects invalid fields and accepts valid input', () => {
  const invalid = validateContactMessage({
    name: 'A',
    email: 'not-an-email',
    subject: 'Hi',
    message: 'Short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactMessage({
    name: 'Recruiter',
    email: 'hiring@company.com',
    subject: 'Agentic AI Role',
    message: 'We would love to discuss an Agentic AI engineering opportunity.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('filterInsightsByTopic filters across all 9 engineering notes accurately', () => {
  assert.equal(filterInsightsByTopic(TECHNICAL_INSIGHTS, 'All').length, 9);
  const mcpNotes = filterInsightsByTopic(TECHNICAL_INSIGHTS, 'Model Context Protocol');
  assert.equal(mcpNotes.length, 1);
  assert.equal(mcpNotes[0]?.statusLabel, 'Engineering Note · In Preparation (Unpublished)');
});

test('buildRepoCaseStudyProject returns 10-part case studies for key GitHub projects and null when absent', () => {
  const resumeRepo = GITHUB_PROJECTS.find((r) => r.id === 'ai-resume-reviewer');
  assert.ok(resumeRepo);
  const adapted = buildRepoCaseStudyProject(resumeRepo);
  assert.ok(adapted);
  assert.ok(adapted.caseStudy.problemStatement.length > 10);
  assert.ok(adapted.caseStudy.keyFeatures.length >= 3);
  assert.equal(adapted.caseStudy.liveDemoUrl, null);

  const basicRepo = GITHUB_PROJECTS.find((r) => r.id === 'listing-project');
  assert.ok(basicRepo);
  assert.equal(buildRepoCaseStudyProject(basicRepo), null);
});
