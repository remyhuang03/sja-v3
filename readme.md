# SJA Plus frontend

SJA Plus analyzes and compares Scratch projects. The production site is [sja.remya.top](https://sja.remya.top).

This repository contains the Next.js application, shadcn/ui components, and static content. The adjacent [sja-backend](https://github.com/remyhuang03/sja-backend) repository owns analysis, comparison, SVG reports, showcase submissions, review, and PostgreSQL access.

## Run with Docker

Clone both repositories into the same parent directory, then run here:

```sh
cp .env.example .env
# Generate separate values with openssl rand -hex 32 for POSTGRES_PASSWORD and ADMIN_TOKEN.
docker compose up -d --build --wait
```

Open `http://localhost:3030`. Frontend and API ports bind only to loopback. PostgreSQL has no published host port. The `postgres_data` and `backend_data` volumes retain database records and uploaded images. Do not run `docker compose down -v` on a deployment whose data you intend to keep.

## Development

Use Node.js 24 LTS. The application uses Next.js 16, React 19, and Tailwind CSS 4. Exact dependency versions are recorded in `package-lock.json`; TypeScript 6 and ESLint 9 match the current Next.js tooling requirements.

```sh
npm ci
API_INTERNAL_URL=http://127.0.0.1:3031 npm run dev
npm run lint
npm run typecheck
npm run check:i18n
npm run build
```

`API_INTERNAL_URL` is read when starting the development server or building. Production images default to `http://backend:8080`. The public deployment uses Caddy to send `/api/*` directly to Go and all other requests to Next.js.

## Internationalization

The site supports Simplified Chinese (`zh`, the default), Traditional Chinese (`zh-Hant`), English (`en`), and Japanese (`ja`) through `next-intl`. The header selector stores the choice in the `sja_locale` cookie for one year. Server rendering, metadata, client components, API messages, and newly generated reports use that preference. Existing URLs and query parameters are preserved; the site does not add locale path prefixes. Reports retain the language selected when they were generated.

Translations live in `messages/{zh,zh-Hant,en,ja}.json`. Keep keys stable and update all four catalogs together. The `ui` namespace contains interface and legal text, `content` contains news summaries and changelog entries, and `articles` contains localized Markdown. English article source files are retained under `data/news/md-articles`. Proper names and user-submitted content are not automatically translated. API/report catalogs live in the backend repository.

`npm run check:i18n` checks catalog parity, message syntax, interpolation variables, and message references. Write technical documentation and source comments in English; translated interface content belongs in the locale catalogs.

## Features and data handling

- Analyze SB3, CC3, and JSON projects and generate sortable SVG reports.
- Compare block types and connections. Scores do not compare assets or prove plagiarism.
- Submit showcase images and links; administrators review them at `/project-display-review` using the review key.
- Submit resource websites at `/nav/submit`; the website tab of `/project-display-review` approves or rejects them.
- Edit showcase cards in place, with image cropping and a floating multiple-link editor.
- Browse localized news, resources, and historical release notes.

Successfully processed original projects are retained privately for 30 days, then deleted by an hourly cleanup task. Reports remain available permanently. Multipart temporary files are cleaned when requests finish. Showcase submissions and images persist for review and publication. The review key stays in page memory and must be entered again after a reload.

See [deployment and backups](deploy/README.md) and the [showcase API](docs/api-project-apply.md). Contact: [me@remya.top](mailto:me@remya.top).

## Resource icons

Maintain only website names and URLs in `data/nav/sites.json`. `npm run icons:fetch` reads each site's icon metadata (including relative URLs and redirects), falls back to `/favicon.ico`, and saves normalized 32-pixel PNGs in the ignored `public/site-icons` directory. Development and production builds run it automatically. Fetches have time and size limits; unavailable or unsupported icons use a neutral globe without failing the build. Icons are served locally and refreshed on each build, so visitors do not contact an external favicon service.

## Appearance

The header theme control switches between light and dark palettes. The preference is stored locally under `sja_theme` and restored before paint; new visitors default to dark. Shared theme tokens cover forms, navigation, legal pages, and Markdown articles as well as the homepage.

User-submitted websites are stored in PostgreSQL. Only approved entries are public, and duplicate pending/approved URLs are rejected. Approval triggers best-effort icon discovery in the backend, with public-address-only connections, DNS rebinding protection, response/time limits, and PNG normalization. Unsupported or unavailable icons use a globe. Submitted-site icons persist in the backend media volume; they do not require a frontend rebuild. See [website API](docs/api-websites.md).
