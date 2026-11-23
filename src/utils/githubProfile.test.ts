import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGitHubPublicSummary } from './githubProfile';

test('buildGitHubPublicSummary maps live GitHub user and events into 14-day activity buckets', () => {
  const now = new Date('2026-11-22T12:00:00Z');
  const summary = buildGitHubPublicSummary(
    {
      login: 'ranausman831',
      name: 'Muhammad Usman',
      bio: 'Agentic AI Engineer',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      html_url: 'https://github.com/ranausman831',
      public_repos: 18,
      followers: 12,
    },
    [
      {
        type: 'PushEvent',
        created_at: '2026-11-22T09:00:00Z',
        repo: { name: 'ranausman831/StudyMate-AI' },
      },
      {
        type: 'PushEvent',
        created_at: '2026-11-22T10:30:00Z',
        repo: { name: 'ranausman831/remote-mcp-server' },
      },
      {
        type: 'CreateEvent',
        created_at: '2026-11-19T14:00:00Z',
        repo: { name: 'ranausman831/StudyMate-AI' },
      },
    ],
    now
  );

  assert.equal(summary.available, true);
  assert.equal(summary.publicRepos, 18);
  assert.equal(summary.followers, 12);
  assert.equal(summary.recentEventsCount, 3);
  assert.equal(summary.activityWindowDays.length, 14);
  assert.equal(summary.activityWindowDays[13].date, '2026-11-22');
  assert.equal(summary.activityWindowDays[13].count, 2);
  assert.equal(summary.activityWindowDays[10].date, '2026-11-19');
  assert.equal(summary.activityWindowDays[10].count, 1);
  assert.deepEqual(summary.recentRepos, ['StudyMate-AI', 'remote-mcp-server']);
});

test('buildGitHubPublicSummary returns available=false without inventing stats when API data is absent', () => {
  const summary = buildGitHubPublicSummary(null, []);
  assert.equal(summary.available, false);
  assert.equal(summary.publicRepos, null);
  assert.equal(summary.followers, null);
  assert.equal(summary.activityWindowDays.length, 0);
  assert.equal(summary.profileUrl, 'https://github.com/ranausman831');
  assert.equal(summary.repositoriesUrl, 'https://github.com/ranausman831?tab=repositories');
});
