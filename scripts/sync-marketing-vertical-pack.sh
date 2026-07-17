#!/usr/bin/env bash
# Thin wrapper — prefer: pnpm exec tsx scripts/sync-marketing-vertical-pack.ts
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/usr/local/opt/node@24/bin:${PATH:-}"
cd "$ROOT"
exec pnpm exec tsx scripts/sync-marketing-vertical-pack.ts
