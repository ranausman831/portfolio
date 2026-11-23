export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'portfolio_theme_mode';

export function resolveInitialTheme(
  storedValue: string | null | undefined,
  prefersLight = false
): ThemeMode {
  if (storedValue === 'light') return 'light';
  if (storedValue === 'dark') return 'dark';
  return prefersLight ? 'light' : 'dark';
}

export function toggleThemeMode(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export interface CircularRevealOrigin {
  x: number;
  y: number;
}

export interface CircularRevealMetrics {
  x: number;
  y: number;
  endRadius: number;
}

export interface ElementRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export function resolveOriginFromElement(
  rect: ElementRectLike | null | undefined,
  viewport: ViewportSize
): CircularRevealOrigin {
  const safeWidth = Math.max(1, Number.isFinite(viewport.width) ? viewport.width : 1440);
  const safeHeight = Math.max(1, Number.isFinite(viewport.height) ? viewport.height : 900);

  if (!rect || !Number.isFinite(rect.left) || !Number.isFinite(rect.top)) {
    return { x: Math.round(safeWidth * 0.5), y: 0 };
  }

  const rawX = rect.left + Math.max(0, rect.width) * 0.5;
  const rawY = rect.top + Math.max(0, rect.height) * 0.5;

  return {
    x: Math.min(safeWidth, Math.max(0, rawX)),
    y: Math.min(safeHeight, Math.max(0, rawY)),
  };
}

export function computeCircularRevealMetrics(
  origin: CircularRevealOrigin,
  viewport: ViewportSize
): CircularRevealMetrics {
  const safeWidth = Math.max(1, Number.isFinite(viewport.width) ? viewport.width : 1440);
  const safeHeight = Math.max(1, Number.isFinite(viewport.height) ? viewport.height : 900);
  const x = Math.min(safeWidth, Math.max(0, Number.isFinite(origin.x) ? origin.x : safeWidth * 0.5));
  const y = Math.min(safeHeight, Math.max(0, Number.isFinite(origin.y) ? origin.y : 0));

  const maxDx = Math.max(x, safeWidth - x);
  const maxDy = Math.max(y, safeHeight - y);
  const endRadius = Math.ceil(Math.hypot(maxDx, maxDy));

  return { x, y, endRadius };
}

export function supportsViewTransition(
  doc: { startViewTransition?: unknown } | null | undefined,
  prefersReducedMotion: boolean
): boolean {
  if (prefersReducedMotion || !doc) return false;
  return typeof doc.startViewTransition === 'function';
}

