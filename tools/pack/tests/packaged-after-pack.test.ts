import { access, chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const packagedAfterPack = require("../resources/packaged-after-pack.cjs") as (context: unknown) => Promise<void>;

const LAUNCHER_CONFIG_ENV = "OD_TOOLS_PACK_LAUNCHER_HOOK_CONFIG";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function buildBundle(): Promise<{ appOutDir: string; context: unknown; macDir: string; product: string; root: string }> {
  const root = await mkdtemp(join(tmpdir(), "od-packaged-afterpack-"));
  const product = "Open Design";
  const appOutDir = root;
  const macDir = join(appOutDir, `${product}.app`, "Contents", "MacOS");
  await mkdir(macDir, { recursive: true });
  await writeFile(join(macDir, product), "ELECTRON-BINARY", "utf8");
  await chmod(join(macDir, product), 0o755);
  const context = { appOutDir, electronPlatformName: "darwin", packager: { appInfo: { productFilename: product } } };
  return { appOutDir, context, macDir, product, root };
}

afterEach(() => {
  delete process.env[LAUNCHER_CONFIG_ENV];
});

describe("combined packaged after-pack orchestrator", () => {
  it("runs the launcher insertion when its config env is set", async () => {
    const { context, macDir, product, root } = await buildBundle();
    try {
      const launcherBinaryPath = join(root, "go-launcher");
      await writeFile(launcherBinaryPath, "GO-LAUNCHER", "utf8");
      const configPath = join(root, "launcher-hook.json");
      await writeFile(configPath, JSON.stringify({ launcherBinaryPath, relocatedName: "od-electron", version: 1 }), "utf8");
      process.env[LAUNCHER_CONFIG_ENV] = configPath;

      await packagedAfterPack(context);

      expect(await readFile(join(macDir, "od-electron"), "utf8")).toBe("ELECTRON-BINARY");
      expect(await readFile(join(macDir, product), "utf8")).toBe("GO-LAUNCHER");
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });

  it("is a no-op when no hook config env is set", async () => {
    const { context, macDir, product, root } = await buildBundle();
    try {
      await packagedAfterPack(context);
      // Electron binary untouched; no od-electron sibling created.
      expect(await readFile(join(macDir, product), "utf8")).toBe("ELECTRON-BINARY");
      expect(await pathExists(join(macDir, "od-electron"))).toBe(false);
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});
