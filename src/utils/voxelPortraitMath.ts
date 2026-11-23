import {
  CASE_STUDY_BY_REPO_ID,
  type GitHubProjectCategory,
  type GitHubProjectItem,
  type InsightTopic,
  type ProjectItem,
  type SkillCategory,
  type SkillItem,
  type TechnicalInsightItem,
} from '../data/portfolioData';

export interface VoxelSample {
  gx: number;
  gy: number;
  x: number;
  y: number;
  zDepth: number;
  r: number;
  g: number;
  b: number;
  luminance: number;
  isEdgeAccent: boolean;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

/**
 * Computes perceived luminance (0..1) from 8-bit sRGB channels.
 */
export function computeLuminance(r: number, g: number, b: number): number {
  const rn = Math.max(0, Math.min(255, r)) / 255;
  const gn = Math.max(0, Math.min(255, g)) / 255;
  const bn = Math.max(0, Math.min(255, b)) / 255;
  return 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
}

/**
 * Samples a raw RGBA pixel buffer into a 3D voxel relief grid centered at origin.
 * Preserves the exact facial identity colors while mapping luminance + radial framing
 * into crisp 3D Z extrusion and subtle edge accents.
 */
export function samplePortraitVoxels(
  rgba: Uint8ClampedArray | number[],
  imgWidth: number,
  imgHeight: number,
  gridSize: number,
  worldSpan: number = 3.2,
  depthScale: number = 0.55
): VoxelSample[] {
  if (imgWidth <= 0 || imgHeight <= 0 || gridSize <= 0 || rgba.length < imgWidth * imgHeight * 4) {
    return [];
  }

  const voxels: VoxelSample[] = [];
  const step = worldSpan / gridSize;
  const halfSpan = (gridSize - 1) * step * 0.5;

  for (let gy = 0; gy < gridSize; gy++) {
    // Flip Y so top of image maps to +Y in Three.js world space
    const vNorm = gy / Math.max(1, gridSize - 1);
    const py = Math.min(imgHeight - 1, Math.floor(vNorm * (imgHeight - 1)));

    for (let gx = 0; gx < gridSize; gx++) {
      const uNorm = gx / Math.max(1, gridSize - 1);
      const px = Math.min(imgWidth - 1, Math.floor(uNorm * (imgWidth - 1)));

      const idx = (py * imgWidth + px) * 4;
      const r = rgba[idx] ?? 0;
      const g = rgba[idx + 1] ?? 0;
      const b = rgba[idx + 2] ?? 0;
      const a = rgba[idx + 3] ?? 255;

      if (a < 20) continue;

      const lum = computeLuminance(r, g, b);

      // Elliptical portrait silhouette weighting centered on head & shoulders
      const dx = (uNorm - 0.48) / 0.42;
      const dy = (vNorm - 0.50) / 0.50;
      const radialDist = Math.sqrt(dx * dx + dy * dy);
      const radialFalloff = Math.max(0, 1 - radialDist * 0.62);

      // Gently dim bright neutral studio wall pixels near outer upper/side margins so subject pops on dark obsidian
      const isNeutralLightWall =
        gridSize >= 8 &&
        lum > 0.62 &&
        Math.abs(r - g) < 18 &&
        Math.abs(g - b) < 18 &&
        radialDist > 0.76 &&
        vNorm < 0.82;

      const bgAttenuation = isNeutralLightWall ? 0.34 : 1.0;
      const zDepth = isNeutralLightWall
        ? 0.04
        : (0.12 + lum * 0.44 + radialFalloff * 0.44) * depthScale;

      // Detect crisp frame edge voxels for subtle architectural border accent
      const isBorder = gx === 0 || gx === gridSize - 1 || gy === 0 || gy === gridSize - 1;
      const isCornerTick =
        (gx < 3 && gy < 3) ||
        (gx >= gridSize - 3 && gy < 3) ||
        (gx < 3 && gy >= gridSize - 3) ||
        (gx >= gridSize - 3 && gy >= gridSize - 3);

      voxels.push({
        gx,
        gy,
        x: gx * step - halfSpan,
        y: halfSpan - gy * step,
        zDepth,
        r: (r / 255) * bgAttenuation,
        g: (g / 255) * bgAttenuation,
        b: (b / 255) * bgAttenuation,
        luminance: lum,
        isEdgeAccent: isBorder && isCornerTick,
      });
    }
  }

  return voxels;
}

export function filterSkillsByCategory(
  skills: SkillItem[],
  category: SkillCategory
): SkillItem[] {
  if (category === 'All') {
    return skills;
  }
  return skills.filter((skill) => skill.category === category);
}

export function filterProjectsByTechnology(
  projects: ProjectItem[],
  techFilter: string
): ProjectItem[] {
  if (!techFilter || techFilter === 'All') {
    return projects;
  }
  const needle = techFilter.toLowerCase();
  return projects.filter((project) =>
    project.technologies.some((tech) => tech.toLowerCase().includes(needle))
  );
}

export function filterGitHubProjectsByCategory(
  projects: GitHubProjectItem[],
  category: GitHubProjectCategory
): GitHubProjectItem[] {
  if (category === 'All') {
    return projects;
  }
  return projects.filter((project) => project.category === category);
}

export function validateContactMessage(input: ContactFormInput): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedSubject = input.subject.trim();
  const trimmedMessage = input.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (trimmedName.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  if (trimmedSubject.length < 3) {
    errors.subject = 'Please add a short subject (at least 3 characters).';
  } else if (trimmedSubject.length > 180) {
    errors.subject = 'Subject must be 180 characters or fewer.';
  }

  if (trimmedMessage.length < 10) {
    errors.message = 'Please write a message of at least 10 characters.';
  } else if (trimmedMessage.length > 5000) {
    errors.message = 'Message must be 5,000 characters or fewer.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterInsightsByTopic(
  insights: TechnicalInsightItem[],
  topic: InsightTopic
): TechnicalInsightItem[] {
  if (topic === 'All') {
    return insights;
  }
  return insights.filter((item) => item.topic === topic);
}

export function buildRepoCaseStudyProject(repo: GitHubProjectItem): ProjectItem | null {
  const details = CASE_STUDY_BY_REPO_ID[repo.id];
  if (!details) return null;

  return {
    id: repo.id,
    index: repo.index,
    title: repo.title,
    category: repo.category,
    shortDescription: repo.description,
    architectureSummary: details.systemArchitecture,
    technologies: repo.technologies.length ? repo.technologies : ['Python / Repository Source'],
    pipelineNodes: details.pipelineNodes,
    visualVariant: 'chatbot',
    githubUrl: repo.githubUrl,
    caseStudy: {
      overview: details.overview,
      problemStatement: details.problemStatement,
      proposedSolution: details.proposedSolution,
      systemArchitecture: details.systemArchitecture,
      keyFeatures: details.keyFeatures,
      developmentChallenges: details.developmentChallenges,
      myContribution: details.myContribution,
      liveDemoUrl: details.liveDemoUrl,
    },
  };
}
