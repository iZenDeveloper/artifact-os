// The client-side GET coalescer (`src/lib/coalesced-get.ts`) keeps a
// module-level cache that briefly shares a settled result across identical
// keys. Under Vitest that cache persists across tests within a file, so a
// settled workspace read from one test could leak into the next same-key call.
// Clear it before every test so coalescing never crosses a test boundary.
import { beforeEach } from 'vitest';

import { resetCoalescedGet } from '../../src/lib/coalesced-get';

beforeEach(() => {
  resetCoalescedGet();
});
