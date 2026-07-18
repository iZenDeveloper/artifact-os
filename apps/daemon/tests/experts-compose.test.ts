import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { findExpertById, listExperts } from '../src/experts.js';
import { composeSystemPrompt } from '../src/prompts/system.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const EXPERTS_DIR = path.join(ROOT, 'experts');

describe('experts catalog + compose', () => {
  it('lists the five official marketing experts', async () => {
    const experts = await listExperts(EXPERTS_DIR);
    const ids = experts.map((e) => e.id).sort();
    assert.deepEqual(ids, [
      'ad-creative',
      'brand-voice',
      'content-repurposing',
      'marketing-strategist',
      'performance-marketer',
    ]);
    for (const expert of experts) {
      assert.ok(expert.title.length > 0, expert.id);
      assert.ok(expert.body.includes('# Persona'), expert.id);
      assert.ok(expert.body.includes('Active design system'), expert.id);
    }
  });

  it('injects Active expert between craft and skill', async () => {
    const experts = await listExperts(EXPERTS_DIR);
    const expert = findExpertById(experts, 'marketing-strategist');
    assert.ok(expert);

    const prompt = composeSystemPrompt({
      craftBody: '### typography\n\nUse tight tracking.',
      craftSections: ['typography'],
      expertBody: expert.body,
      expertName: expert.title,
      skillBody: '# Skill\n\nDo the pack.',
      skillName: 'content-repurposer',
      designSystemBody: '# Brand\n\nVoice: calm.',
      designSystemTitle: 'Personal Minimal',
      sessionMode: 'design',
    });

    const craftIdx = prompt.indexOf('## Active craft references');
    const expertIdx = prompt.indexOf('## Active expert — Marketing Strategist');
    const skillIdx = prompt.indexOf('## Active skill — content-repurposer');
    const brandIdx = prompt.indexOf('## Active design system — Personal Minimal');

    assert.ok(craftIdx > 0);
    assert.ok(expertIdx > craftIdx);
    assert.ok(skillIdx > expertIdx);
    assert.ok(brandIdx > 0 && brandIdx < craftIdx);
    assert.match(prompt, /operating as this specialist/i);
    assert.match(prompt, /Positioning lock/);
  });

  it('omits expert block when expertBody is empty', () => {
    const prompt = composeSystemPrompt({
      skillBody: '# Skill',
      sessionMode: 'design',
    });
    assert.equal(prompt.includes('## Active expert'), false);
  });
});
