/**
 * "清空并替换目录" (replace working directory) atomic flow. Mirrors
 * `desktop-pick-and-import.test.ts` for the working-dir endpoint added
 * after the original import-folder trust gate (PR #974). The renderer
 * triggers `WorkingDirPill` → host bridge → `dialog:pick-and-replace-
 * working-dir` IPC; the main process picks the folder, mints an HMAC
 * token, and POSTs `/api/projects/:id/working-dir`. Without the
 * atomic IPC, a packaged daemon (`isDesktopAuthGateActive() === true`)
 * would 403 the renderer-driven path with "desktop import token
 * rejected".
 */
import { describe, expect, it, vi } from "vitest";

import { pickAndReplaceWorkingDir } from "@open-design/desktop/main";

const TEST_SECRET = Buffer.from(
  "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJyg=",
  "base64",
);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}

function pendingResponse(): Response {
  return jsonResponse(
    {
      error: {
        code: "DESKTOP_AUTH_PENDING",
        message: "desktop auth required but secret not yet registered",
        retryable: true,
      },
    },
    503,
  );
}

describe("pickAndReplaceWorkingDir", () => {
  it("retries once on 503 DESKTOP_AUTH_PENDING after re-registering", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(pendingResponse())
      .mockResolvedValueOnce(jsonResponse({ project: { id: "p1" }, baseDir: "/Users/u/proj", entryFile: "index.html" }, 200));
    const registerDesktopAuth = vi.fn(async () => true);
    const mintToken = vi
      .fn<(secret: Buffer, baseDir: string) => string>()
      .mockReturnValueOnce("first-token")
      .mockReturnValueOnce("second-token");

    const result = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:1234",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      mintToken,
      projectId: "p1",
      registerDesktopAuth,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.response).toMatchObject({ baseDir: "/Users/u/proj", entryFile: "index.html" });
    }
    expect(registerDesktopAuth).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(mintToken).toHaveBeenCalledTimes(2);
    // Each mint binds to the trimmed baseDir — never a divergent path.
    expect(mintToken).toHaveBeenNthCalledWith(1, TEST_SECRET, "/Users/u/proj");
    expect(mintToken).toHaveBeenNthCalledWith(2, TEST_SECRET, "/Users/u/proj");
  });

  it("returns structured failure when re-registration succeeds but the second POST is still 503", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(pendingResponse())
      .mockResolvedValueOnce(pendingResponse());
    const registerDesktopAuth = vi.fn(async () => true);

    const result = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:1234",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "p1",
      registerDesktopAuth,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/HTTP 503/);
    }
    expect(registerDesktopAuth).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("does NOT invoke registerDesktopAuth when the first POST returns 200", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(jsonResponse({ project: { id: "p2" }, baseDir: "/Users/u/proj2", entryFile: null }, 200));
    const registerDesktopAuth = vi.fn(async () => true);

    const result = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:1234",
      baseDir: "/Users/u/proj2",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "p2",
      registerDesktopAuth,
    });

    expect(result.ok).toBe(true);
    expect(registerDesktopAuth).not.toHaveBeenCalled();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on a non-503 failure (e.g. 403 token mismatch)", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(jsonResponse({ error: { code: "FORBIDDEN" } }, 403));
    const registerDesktopAuth = vi.fn(async () => true);

    const result = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:1234",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "p1",
      registerDesktopAuth,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/HTTP 403/);
      expect(result.details).toMatchObject({ error: { code: "FORBIDDEN" } });
    }
    expect(registerDesktopAuth).not.toHaveBeenCalled();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("returns a structured failure when fetch itself throws (network error)", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockRejectedValueOnce(new TypeError("ECONNREFUSED"));

    const result = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:1234",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "p1",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/daemon fetch failed.*ECONNREFUSED/);
    }
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("composes the URL from apiBaseUrl + encoded project id, not a renderer protocol scheme", async () => {
    const fetchImpl = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(jsonResponse({ baseDir: "/Users/u/proj", entryFile: null }, 200));

    await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:17456",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "p-with.dot_id",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url] = fetchImpl.mock.calls[0];
    expect(typeof url).toBe("string");
    expect(url as string).toBe("http://127.0.0.1:17456/api/projects/p-with.dot_id/working-dir");
    expect(url as string).not.toMatch(/^od:\/\//);
  });

  it("rejects an empty or malformed project id without ever fetching", async () => {
    const fetchImpl = vi.fn<typeof globalThis.fetch>();

    const empty = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:17456",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "",
    });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.reason).toMatch(/project id/);

    const bad = await pickAndReplaceWorkingDir({
      apiBaseUrl: "http://127.0.0.1:17456",
      baseDir: "/Users/u/proj",
      desktopAuthSecret: TEST_SECRET,
      fetchImpl,
      projectId: "../etc/passwd",
    });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.reason).toMatch(/disallowed/);

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
