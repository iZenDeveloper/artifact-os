import { describe, expect, it } from 'vitest';
import {
  classifyVerticalBrand,
  filterByBrandMode,
  pinVerticalOsSystems,
  seedBrandFilter,
  verticalOsQuickSwitchSystems,
} from '../../src/runtime/vertical-brand';

describe('classifyVerticalBrand', () => {
  it('maps known Vertical OS ids', () => {
    expect(classifyVerticalBrand({ id: 'personal-minimal' })).toBe('personal');
    expect(classifyVerticalBrand({ id: 'personal-bold' })).toBe('personal');
    expect(classifyVerticalBrand({ id: 'professional-clean' })).toBe('client');
  });

  it('strips prefixes on ids', () => {
    expect(classifyVerticalBrand({ id: 'user:personal-minimal' })).toBe('personal');
  });

  it('uses category for Vertical OS packs', () => {
    expect(
      classifyVerticalBrand({
        id: 'custom-p',
        category: 'Vertical OS · Personal Brand',
      }),
    ).toBe('personal');
    expect(
      classifyVerticalBrand({
        id: 'custom-c',
        category: 'Vertical OS · Client Brand',
      }),
    ).toBe('client');
  });

  it('returns other for official brands', () => {
    expect(classifyVerticalBrand({ id: 'linear-app', category: 'Productivity & SaaS' })).toBe(
      'other',
    );
  });
});

describe('filterByBrandMode', () => {
  const systems = [
    { id: 'personal-minimal', category: 'Vertical OS · Personal Brand' },
    { id: 'professional-clean', category: 'Vertical OS · Client Brand' },
    { id: 'airbnb', category: 'E-Commerce' },
  ];

  it('filters personal and client', () => {
    expect(filterByBrandMode(systems, 'personal').map((s) => s.id)).toEqual([
      'personal-minimal',
    ]);
    expect(filterByBrandMode(systems, 'client').map((s) => s.id)).toEqual([
      'professional-clean',
    ]);
    expect(filterByBrandMode(systems, 'all')).toHaveLength(3);
  });
});

describe('pinVerticalOsSystems', () => {
  it('pins Vertical OS systems first in stable order', () => {
    const systems = [
      { id: 'airbnb' },
      { id: 'professional-clean' },
      { id: 'personal-bold' },
      { id: 'personal-minimal' },
    ];
    expect(pinVerticalOsSystems(systems).map((s) => s.id)).toEqual([
      'personal-minimal',
      'personal-bold',
      'professional-clean',
      'airbnb',
    ]);
  });
});

describe('verticalOsQuickSwitchSystems', () => {
  it('returns present VOS systems in pin order', () => {
    const systems = [
      { id: 'airbnb' },
      { id: 'professional-clean' },
      { id: 'personal-minimal' },
    ];
    expect(verticalOsQuickSwitchSystems(systems).map((s) => s.id)).toEqual([
      'personal-minimal',
      'professional-clean',
    ]);
  });
});

describe('seedBrandFilter', () => {
  it('seeds from selected system mode', () => {
    expect(seedBrandFilter({ id: 'personal-minimal' })).toBe('personal');
    expect(seedBrandFilter({ id: 'professional-clean' })).toBe('client');
  });

  it('defaults to all for other systems', () => {
    expect(seedBrandFilter({ id: 'airbnb' })).toBe('all');
    expect(seedBrandFilter(null)).toBe('all');
  });
});
