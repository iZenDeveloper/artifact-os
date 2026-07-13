import { expect, test } from '@/playwright/suite';
import { createFakeAgentRuntimes } from '@/playwright/fake-agents';
import {
  createProjectViaApi,
  gotoEntryHome,
  gotoProject,
  putAppConfig,
  seedBrowserConfig,
} from '@/playwright/amr';
import { T } from '@/timeouts';

let codexEnv: Record<string, string>;

test.beforeAll(async () => {
  const runtimes = await createFakeAgentRuntimes(['codex']);
  codexEnv = runtimes.codex.env;
});

test('[P1] preview delivery status restores after navigation and retries a persisted delivery failure', async ({ page }) => {
  test.setTimeout(T.xlong);
  const projectId = `preview-run-status-${Date.now()}`;
  const now = Date.now();

  const browserConfig = {
    mode: 'daemon',
    apiKey: '',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-sonnet-4-5',
    agentId: 'codex',
    skillId: null,
    designSystemId: null,
    onboardingCompleted: true,
    agentModels: { codex: { model: 'default', reasoning: 'default' } },
    agentCliEnv: { codex: codexEnv },
  };
  await seedBrowserConfig(page, browserConfig);
  await putAppConfig(page, browserConfig);

  const { conversationId } = await createProjectViaApi(page, projectId, 'Preview status recovery');
  const userResponse = await page.request.put(
    `/api/projects/${projectId}/conversations/${conversationId}/messages/user-preview-status`,
    {
      data: {
        role: 'user',
        content: 'Create an editorial landing page',
        createdAt: now - 50_000,
      },
    },
  );
  expect(userResponse.ok(), await userResponse.text()).toBeTruthy();

  const failedResponse = await page.request.put(
    `/api/projects/${projectId}/conversations/${conversationId}/messages/assistant-preview-status`,
    {
      data: {
        role: 'assistant',
        content: 'The design result was not delivered.',
        agentId: 'codex',
        sessionMode: 'design',
        runId: 'run-preview-status',
        runStatus: 'succeeded',
        resultDeliveryState: 'delivery_failed',
        createdAt: now - 50_000,
        startedAt: now - 45_000,
        endedAt: now - 3_000,
        preTurnFileNames: [],
        events: [{ kind: 'status', label: 'error', detail: 'The design result was not delivered.' }],
      },
    },
  );
  expect(failedResponse.ok(), await failedResponse.text()).toBeTruthy();

  await gotoProject(page, projectId);
  const status = page.getByTestId('preview-run-status');
  await expect(status).toContainText('Delivery needs attention');
  await expect(status).toContainText('Elapsed 0:42');
  await expect(page.getByTestId('preview-run-status-retry')).toBeVisible();
  await expect(page.getByTestId('preview-run-status-view-details')).toBeVisible();

  // The status is derived from the persisted assistant message, so leaving the
  // project cannot erase a delivery failure or its recovery affordances.
  await gotoEntryHome(page);
  await gotoProject(page, projectId);
  await expect(page.getByTestId('preview-run-status')).toContainText('Delivery needs attention');
  await expect(page.getByTestId('preview-run-status')).toContainText('Elapsed 0:42');

  await page.getByTestId('preview-run-status-retry').click();
  await expect
    .poll(async () => {
      const response = await page.request.get(
        `/api/projects/${projectId}/conversations/${conversationId}/messages`,
      );
      if (!response.ok()) return [];
      const body = (await response.json()) as { messages?: Array<{ role: string; runStatus?: string }> };
      return body.messages?.filter((message) => message.role === 'assistant') ?? [];
    }, { timeout: T.long })
    .toHaveLength(2);

  await expect
    .poll(async () => {
      const response = await page.request.get(`/api/projects/${projectId}/files`);
      if (!response.ok()) return [];
      const body = (await response.json()) as { files?: Array<{ name: string }> };
      return body.files?.map((file) => file.name) ?? [];
    }, { timeout: T.long })
    .toContain('real-daemon-smoke.html');
});
