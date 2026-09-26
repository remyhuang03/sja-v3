# Resource website submission and review

The directory combines curated entries in `data/nav` with approved PostgreSQL entries. New submissions do not change the public directory until approval.

- `POST /api/v2/website-apply`: JSON `{name, url, category, description, consent}`. Names contain 1–80 characters; descriptions are optional and limited to 300. `consent` must be true. URL schemes are HTTP/HTTPS with standard ports. Categories: `communities`, `tools`, `developers`, `assets`, `other`. Returns 201 and an ID; a duplicate pending/approved URL returns 409.
- `GET /api/v2/websites`: public approved entries, including `icon_path`. Review notes are excluded.
- `GET /api/v2/website-review?limit=20&offset=0`: review queue, authenticated with the existing Bearer `ADMIN_TOKEN`. Maximum page size is 100.
- `POST /api/v2/website-review`: authenticated JSON `{id, status, notes}`. Status is `approved` or `rejected`; rejection requires notes. Repeated/concurrent reviews return 409. Approval publishes atomically.

Icons are fetched only during authorized approval, never on public submission. Network requests reject private/reserved addresses, pin the checked DNS address, validate redirects, and enforce time and byte limits. PNG, JPEG, GIF, WebP, and PNG frames in ICO files are normalized to a local 32 × 32 PNG. Other formats or unavailable images fall back to a globe. Icon failure does not prevent approval.

Submission and review messages follow `sja_locale` (`zh`, `zh-Hant`, `en`, `ja`). Names, descriptions, URLs, and reviewer notes are preserved as submitted. No contact information or manually supplied favicon URL is required.
