export interface GitHubActivityDay {
  date: string;
  label: string;
  count: number;
}

export interface GitHubPublicSummary {
  available: boolean;
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  profileUrl: string;
  repositoriesUrl: string;
  publicRepos: number | null;
  followers: number | null;
  recentEventsCount: number;
  activityWindowDays: GitHubActivityDay[];
  recentRepos: string[];
}

interface RawGitHubUser {
  login?: string;
  name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  html_url?: string;
  public_repos?: number;
  followers?: number;
}

interface RawGitHubEvent {
  type?: string;
  created_at?: string;
  repo?: {
    name?: string;
  };
}

/**
 * Pure transformer that builds a real recent-activity summary strictly from
 * live GitHub REST API responses without inventing any counts or metrics.
 */
export function buildGitHubPublicSummary(
  user: RawGitHubUser | null,
  events: RawGitHubEvent[],
  now: Date = new Date()
): GitHubPublicSummary {
  const username = user?.login || 'ranausman831';
  const profileUrl = user?.html_url || 'https://github.com/ranausman831';
  const repositoriesUrl = `${profileUrl}?tab=repositories`;

  if (!user || typeof user.public_repos !== 'number') {
    return {
      available: false,
      username,
      name: 'Muhammad Usman',
      bio: null,
      avatarUrl: null,
      profileUrl,
      repositoriesUrl,
      publicRepos: null,
      followers: null,
      recentEventsCount: 0,
      activityWindowDays: [],
      recentRepos: [],
    };
  }

  // Build 14-day UTC bucket map strictly from real public events
  const countsByDate = new Map<string, number>();
  const recentReposSet = new Set<string>();

  for (const event of events) {
    if (event.created_at) {
      const dateKey = event.created_at.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        countsByDate.set(dateKey, (countsByDate.get(dateKey) || 0) + 1);
      }
    }
    if (event.repo?.name) {
      const shortName = event.repo.name.includes('/')
        ? event.repo.name.split('/').slice(1).join('/')
        : event.repo.name;
      if (shortName) {
        recentReposSet.add(shortName);
      }
    }
  }

  const activityWindowDays: GitHubActivityDay[] = [];
  for (let offset = 13; offset >= 0; offset--) {
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
    const isoDate = day.toISOString().slice(0, 10);
    const label = day.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
    activityWindowDays.push({
      date: isoDate,
      label,
      count: countsByDate.get(isoDate) || 0,
    });
  }

  return {
    available: true,
    username,
    name: user.name || 'Muhammad Usman',
    bio: user.bio || null,
    avatarUrl: user.avatar_url || null,
    profileUrl,
    repositoriesUrl,
    publicRepos: user.public_repos,
    followers: typeof user.followers === 'number' ? user.followers : null,
    recentEventsCount: events.length,
    activityWindowDays,
    recentRepos: Array.from(recentReposSet).slice(0, 5),
  };
}
