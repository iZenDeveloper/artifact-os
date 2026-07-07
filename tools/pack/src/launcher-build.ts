import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CONTRACT_SELF_VERSION_SYMBOL = "github.com/nexu-io/open-design/launcher/internal/contract.SelfVersion";

function goArchForNodeArch(nodeArch: string): string {
  switch (nodeArch) {
    case "arm64":
      return "arm64";
    case "x64":
      return "amd64";
    default:
      return nodeArch;
  }
}

/**
 * Build the Go fossil launcher binary for the packaged app. Compiles
 * launcher/cmd/launcher, baking the packaged version into contract.SelfVersion so
 * the launcher knows its own version for the handoff comparison. Local mac builds
 * target the host arch (electron-builder's default); goos/goarch can be overridden
 * for cross-compilation.
 */
export async function buildLauncherBinary(input: {
  goarch?: string;
  goos?: string;
  outPath: string;
  selfVersion: string;
  workspaceRoot: string;
}): Promise<{ outPath: string }> {
  const launcherModuleRoot = join(input.workspaceRoot, "launcher");
  await mkdir(dirname(input.outPath), { recursive: true });
  const goos = input.goos ?? "darwin";
  const goarch = input.goarch ?? goArchForNodeArch(process.arch);
  await execFileAsync(
    "go",
    [
      "build",
      "-trimpath",
      "-ldflags",
      `-X ${CONTRACT_SELF_VERSION_SYMBOL}=${input.selfVersion}`,
      "-o",
      input.outPath,
      "./cmd/launcher",
    ],
    {
      cwd: launcherModuleRoot,
      env: { ...process.env, CGO_ENABLED: "0", GOOS: goos, GOARCH: goarch },
      maxBuffer: 20 * 1024 * 1024,
    },
  );
  return { outPath: input.outPath };
}
