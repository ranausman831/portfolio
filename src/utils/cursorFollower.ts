export type CursorVariant = 'default' | 'action' | 'project' | 'portrait' | 'input';

export interface CursorInteractionState {
  variant: CursorVariant;
  label: string | null;
}

export interface ElementLike {
  tagName?: string;
  getAttribute?: (name: string) => string | null;
  closest?: (selector: string) => ElementLike | null;
}

export function shouldEnableCustomCursor(
  hasFinePointer: boolean,
  prefersReducedMotion: boolean
): boolean {
  return hasFinePointer && !prefersReducedMotion;
}

export function resolveCursorInteraction(target: ElementLike | null): CursorInteractionState {
  if (!target || typeof target.closest !== 'function') {
    return { variant: 'default', label: null };
  }

  // Interactive controls inside cards take priority over the card itself
  const inputEl = target.closest('input, textarea, select');
  if (inputEl) {
    return { variant: 'input', label: null };
  }

  const interactiveControl = target.closest('button, a, [role="tab"], [role="button"]');
  if (interactiveControl) {
    const customLabel = interactiveControl.getAttribute?.('data-cursor-label') ?? null;
    return { variant: 'action', label: customLabel };
  }

  const customRegion = target.closest('[data-cursor]');
  const regionType = customRegion?.getAttribute?.('data-cursor');
  if (regionType === 'project') {
    return { variant: 'project', label: 'Inspect' };
  }
  if (regionType === 'portrait') {
    return { variant: 'portrait', label: '3D Tilt' };
  }

  return { variant: 'default', label: null };
}
