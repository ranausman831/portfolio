import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCircularRevealMetrics,
  resolveInitialTheme,
  resolveOriginFromElement,
  supportsViewTransition,
  toggleThemeMode,
} from './theme.ts';

test('resolveInitialTheme honors explicit stored dark or light preference', () => {
  assert.equal(resolveInitialTheme('light', false), 'light');
  assert.equal(resolveInitialTheme('dark', true), 'dark');
});

test('resolveInitialTheme defaults to dark when no stored value and no light preference', () => {
  assert.equal(resolveInitialTheme(null, false), 'dark');
  assert.equal(resolveInitialTheme(undefined, false), 'dark');
  assert.equal(resolveInitialTheme('invalid', false), 'dark');
});

test('resolveInitialTheme respects system prefers-light when unstored', () => {
  assert.equal(resolveInitialTheme(null, true), 'light');
});

test('toggleThemeMode switches cleanly between dark and light', () => {
  assert.equal(toggleThemeMode('dark'), 'light');
  assert.equal(toggleThemeMode('light'), 'dark');
});

test('resolveOriginFromElement returns toggle button center and handles missing rect', () => {
  const center = resolveOriginFromElement(
    { left: 1180, top: 12, width: 40, height: 40 },
    { width: 1440, height: 900 }
  );
  assert.deepEqual(center, { x: 1200, y: 32 });

  const fallback = resolveOriginFromElement(null, { width: 1440, height: 900 });
  assert.deepEqual(fallback, { x: 720, y: 0 });
});

test('computeCircularRevealMetrics calculates exact enclosing radius from any origin', () => {
  const topRight = computeCircularRevealMetrics({ x: 1200, y: 32 }, { width: 1440, height: 900 });
  assert.equal(topRight.x, 1200);
  assert.equal(topRight.y, 32);
  // maxDx = 1200, maxDy = 868 -> hypot(1200, 868) = 1481.02 -> ceil = 1482
  assert.equal(topRight.endRadius, 1482);

  const mobileCorner = computeCircularRevealMetrics({ x: 320, y: 32 }, { width: 390, height: 844 });
  assert.equal(mobileCorner.endRadius, Math.ceil(Math.hypot(320, 812)));
});

test('supportsViewTransition disables View Transitions under reduced motion or missing API', () => {
  const mockDoc = { startViewTransition: () => ({}) };
  assert.equal(supportsViewTransition(mockDoc, false), true);
  assert.equal(supportsViewTransition(mockDoc, true), false);
  assert.equal(supportsViewTransition({}, false), false);
  assert.equal(supportsViewTransition(null, false), false);
});

