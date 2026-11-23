import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCursorInteraction,
  shouldEnableCustomCursor,
  type ElementLike,
} from './cursorFollower';

function makeMockTarget(matches: Record<string, Record<string, string> | true>): ElementLike {
  return {
    closest(selector: string) {
      if (selector in matches) {
        const val = matches[selector];
        return {
          getAttribute(attr: string) {
            return typeof val === 'object' ? (val[attr] ?? null) : null;
          },
          closest: () => null,
        };
      }
      return null;
    },
  };
}

test('shouldEnableCustomCursor requires fine pointer and no reduced motion', () => {
  assert.equal(shouldEnableCustomCursor(true, false), true);
  assert.equal(shouldEnableCustomCursor(false, false), false);
  assert.equal(shouldEnableCustomCursor(true, true), false);
  assert.equal(shouldEnableCustomCursor(false, true), false);
});

test('resolveCursorInteraction prioritizes interactive controls over project cards', () => {
  const buttonInsideCard = makeMockTarget({
    'button, a, [role="tab"], [role="button"]': true,
    '[data-cursor]': { 'data-cursor': 'project' },
  });
  assert.deepEqual(resolveCursorInteraction(buttonInsideCard), {
    variant: 'action',
    label: null,
  });

  const projectCardSurface = makeMockTarget({
    '[data-cursor]': { 'data-cursor': 'project' },
  });
  assert.deepEqual(resolveCursorInteraction(projectCardSurface), {
    variant: 'project',
    label: 'Inspect',
  });

  const portraitStage = makeMockTarget({
    '[data-cursor]': { 'data-cursor': 'portrait' },
  });
  assert.deepEqual(resolveCursorInteraction(portraitStage), {
    variant: 'portrait',
    label: '3D Tilt',
  });

  const inputField = makeMockTarget({
    'input, textarea, select': true,
  });
  assert.deepEqual(resolveCursorInteraction(inputField), {
    variant: 'input',
    label: null,
  });

  assert.deepEqual(resolveCursorInteraction(null), {
    variant: 'default',
    label: null,
  });
});
