// Combined electron-builder afterPack orchestrator. electron-builder exposes a
// single afterPack slot, so this runs the packaged-app hooks in the required
// order: the launcher insertion FIRST (it must precede any adhoc bundle sign so
// that sign covers the swapped-in Go binary), then the web-standalone hook. Each
// inner hook runs only when its own config env var is present, so this is safe to
// wire unconditionally.
const LAUNCHER_CONFIG_ENV = "OD_TOOLS_PACK_LAUNCHER_HOOK_CONFIG";
const WEB_STANDALONE_CONFIG_ENV = "OD_TOOLS_PACK_WEB_STANDALONE_HOOK_CONFIG";

module.exports = async function packagedAfterPack(context) {
  const launcherConfig = process.env[LAUNCHER_CONFIG_ENV];
  if (launcherConfig != null && launcherConfig.length > 0) {
    await require("./launcher-after-pack.cjs")(context);
  }
  const webStandaloneConfig = process.env[WEB_STANDALONE_CONFIG_ENV];
  if (webStandaloneConfig != null && webStandaloneConfig.length > 0) {
    await require("./web-standalone-after-pack.cjs")(context);
  }
};
