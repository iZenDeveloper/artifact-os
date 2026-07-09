# Release "what's new" highlights

Optional per-release notes for the post-update card the app shows on the home
surface after updating. `publish-metadata` looks for
`tools/release/whats-new/<baseVersion>.md` (for example `0.14.1.md`) and, when
present, extracts:

- `title`: the first Markdown heading, or the first non-empty line.
- `body`: the first following paragraph or short bullet list.

No file means no highlights: the app falls back to generic "Open Design has
been updated" copy that links to the release notes. Without an explicit
`linkUrl`, the card links to the GitHub release (stable) or the releases index
(other channels).

Example:

```markdown
# Faster packaged updates

- Payload updates can apply on startup when the user allows silent updates.
- The home screen still shows a lightweight What's New card after restart.
```

`RELEASE_WHATS_NEW_PATH` overrides the lookup path for tests and fixtures.
Legacy JSON files at `tools/release/whats-new/<baseVersion>.json` are still
accepted for compatibility with the original #5071 fixture shape. JSON
`imageUrl` / `linkUrl` values must be HTTPS, and malformed JSON files fail the
publish.
