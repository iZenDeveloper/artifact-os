import { describe, expect, test } from "vitest";

import {
  beginDesktopSession,
  clearReportedCrash,
  endDesktopSessionCleanly,
  markDesktopSessionRunning,
  type DesktopSessionState,
} from "../../src/main/session-lifecycle.js";

// In-memory fs so the pure lifecycle logic is exercised without touching disk.
function makeStore(initial?: string) {
  const files = new Map<string, string>();
  if (initial != null) files.set("state.json", initial);
  return {
    readFile: (p: string) => {
      const v = files.get(p);
      if (v == null) throw new Error("ENOENT");
      return v;
    },
    writeFile: (p: string, d: string) => {
      files.set(p, d);
    },
    state: () => JSON.parse(files.get("state.json")!) as DesktopSessionState,
  };
}

const FIXED = new Date("2026-07-09T12:00:00.000Z");
const io = (store: ReturnType<typeof makeStore>) => ({ readFile: store.readFile, writeFile: store.writeFile });

function begin(store: ReturnType<typeof makeStore>, sessionId: string, version = "0.14.0") {
  return beginDesktopSession({ stateFilePath: "state.json", sessionId, version, now: () => FIXED, ...io(store) });
}
const running = (s: ReturnType<typeof makeStore>) => markDesktopSessionRunning({ stateFilePath: "state.json", ...io(s) });
const quit = (s: ReturnType<typeof makeStore>) => endDesktopSessionCleanly({ stateFilePath: "state.json", ...io(s) });
const clear = (s: ReturnType<typeof makeStore>) => clearReportedCrash({ stateFilePath: "state.json", ...io(s) });

describe("desktop session lifecycle", () => {
  test("first run reports nothing and writes a not-yet-running marker", () => {
    const store = makeStore();
    expect(begin(store, "s1").previousUncleanSession).toBeNull();
    expect(store.state()).toMatchObject({ sessionId: "s1", reachedRunning: false, clean: false, unreportedCrash: null });
  });

  test("reached-running then crashed → next launch reports it and persists it as unreportedCrash", () => {
    const store = makeStore();
    begin(store, "a");
    running(store);
    // 'a' crashes (no clean). Next launch:
    const { previousUncleanSession } = begin(store, "b");
    expect(previousUncleanSession).toMatchObject({ sessionId: "a", version: "0.14.0" });
    // ...and it's persisted so a failed report can retry.
    expect(store.state().unreportedCrash).toMatchObject({ sessionId: "a" });
  });

  test("never reached running → not reported (startup failure, not a crash)", () => {
    const store = makeStore();
    begin(store, "a"); // no markDesktopSessionRunning
    expect(begin(store, "b").previousUncleanSession).toBeNull();
  });

  test("graceful quit → next launch reports nothing", () => {
    const store = makeStore();
    begin(store, "a");
    running(store);
    quit(store);
    expect(store.state().clean).toBe(true);
    expect(begin(store, "b").previousUncleanSession).toBeNull();
  });

  test("a failed report retries next launch; clearReportedCrash stops it", () => {
    const store = makeStore();
    begin(store, "a");
    running(store);
    // 'a' crashed; 'b' launches and detects it but the report FAILS (never cleared).
    expect(begin(store, "b").previousUncleanSession?.sessionId).toBe("a");
    running(store); // b runs fine
    // 'b' quits cleanly, but a's crash was never reported → 'c' still retries it.
    quit(store);
    expect(begin(store, "c").previousUncleanSession?.sessionId).toBe("a");
    // Now the report succeeds → clear it → 'd' reports nothing.
    clear(store);
    expect(begin(store, "d").previousUncleanSession).toBeNull();
  });

  test("markRunning and clean preserve a carried-forward unreportedCrash", () => {
    const store = makeStore();
    begin(store, "a");
    running(store);
    begin(store, "b"); // carries a's crash into b's marker
    running(store); // must not drop unreportedCrash
    expect(store.state().unreportedCrash).toMatchObject({ sessionId: "a" });
    quit(store); // must not drop it either
    expect(store.state().unreportedCrash).toMatchObject({ sessionId: "a" });
  });

  test("never throws on a corrupt marker and still stamps this run", () => {
    const store = makeStore("}{ not json");
    expect(() => begin(store, "s5")).not.toThrow();
    expect(store.state().sessionId).toBe("s5");
  });
});
