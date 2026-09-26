# Repository conventions

- Write documentation, code comments, and commit messages in English.
- Keep user-facing text in the Simplified Chinese, Traditional Chinese, English, and Japanese message catalogs. Preserve proper names and user-authored content.
- Keep this repository frontend-only. Business APIs and database access belong in `sja-backend`.
- Run lint, type checking, translation validation, and a production build for application changes.
- Deploy application changes through the existing GitHub Actions workflow on `main`.
- Never commit credentials or generated upload data.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
