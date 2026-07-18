# Client Package layout (canonical)

Agency / freelancer deliverable tree. Same shape for **agent-written folders**
and **Export Client Package** zip from the app.

```
{package-slug}/
  PACKAGE.md                 # human readme + how to use
  brand.json                 # machine: brandSlug, platforms, dates
  notes/
    delivery.md              # strategy + QA checklist
  captions/
    xhs.txt                  # one platform per file
    tiktok.txt
    linkedin.txt
    …
    README.md                # only when no captions extracted
  source/
    index.html               # original pack (optional but preferred)
  index.html                 # optional preview summary (agent runs)
```

## brand.json (v1)

```json
{
  "schema": "artifact-os.client-package.v1",
  "title": "Campaign name",
  "brandSlug": "professional-clean",
  "projectId": "optional",
  "deliveredAt": "2026-07-18",
  "platforms": [
    { "id": "linkedin", "label": "LinkedIn", "file": "captions/linkedin.txt" }
  ]
}
```

## captions/{platform}.txt

```
# LinkedIn
# Best time: Tue–Thu 08:00–10:00 (guidance)

{ready-to-paste post body}

#hashtags if any
```

- UTF-8 plain text  
- First lines may be `#` comments for label / meta  
- Body must be pasteable without stripping markdown tables

## Naming

| Input | Rule |
|-------|------|
| package-slug | From title: alnum + hyphen, ≤60 |
| platform stem | `xhs` · `tiktok` · `linkedin` · `threads` · `email` · `facebook` · `youtube` · `instagram` · `other` |
| collisions | `linkedin-2.txt` if two LinkedIn variants |

## App zip filename

`{package-slug}-client-package.zip`

## Relationship to other exports

| Export | Contents |
|--------|----------|
| **Export as ZIP** | Project tree / design handoff (engineer) |
| **Export Client Package** | Captions + notes + brand (marketer → client) |
| **Export as PDF** | Visual PDF of the pack |
