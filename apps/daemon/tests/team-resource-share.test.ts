import { describe, expect, it } from 'vitest';
import {
  TeamResourceShareForbiddenError,
  createTeamResourceShareService,
} from '../src/collab/team-resource-share.js';
import type { ResourceHubPrincipal } from '../src/collab/resource-principal.js';

const unreachableRun = async (): Promise<string> => {
  throw new Error('Vela should not run when the permission gate stops sharing');
};
const principal: ResourceHubPrincipal = {
  memberId: 'wm-1',
  teamId: 't-1',
  role: 'member',
  lifecycleState: 'active',
};

describe('team resource share permission gate', () => {
  it('refuses a team member who cannot manage shared resources (403 marker)', async () => {
    const service = createTeamResourceShareService({
      kind: 'design_system',
      idPrefix: 'ds',
      resolveDir: () => '/tmp/ds',
      getPrincipal: () => principal,
      getCanShare: () => false,
      run: unreachableRun,
    });
    await expect(service.share('ds-1')).rejects.toBeInstanceOf(TeamResourceShareForbiddenError);
    expect(service.isShared('ds-1')).toBe(false);
  });

  it('stays a silent no-op when there is no team identity, without a permission error', async () => {
    const service = createTeamResourceShareService({
      kind: 'design_system',
      idPrefix: 'ds',
      resolveDir: () => '/tmp/ds',
      getPrincipal: () => null,
      getCanShare: () => false,
      run: unreachableRun,
    });
    expect(await service.share('ds-1')).toBeNull();
  });
});
