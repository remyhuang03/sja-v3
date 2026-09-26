# Showcase submission API

The Go backend owns this API. The frontend uses the same-origin endpoint `/api/v2/project-display-apply`.

Send a multipart form containing `meta` JSON, `cover`, and `avatar`. Successful submissions return HTTP 201 with an application ID. Validation errors return JSON with a localized `message`. The `sja_locale` cookie selects `zh`, `zh-Hant`, `en`, or `ja`; API clients can also send `X-SJA-Locale` when no preference cookie is present.

Review endpoints require a Bearer key. PostgreSQL transactions publish approved applications atomically. See the [backend API documentation](https://github.com/remyhuang03/sja-backend#api) for fields, limits, and response details.

The browser crops covers to 4:3 (1200 × 900) and avatars to 1:1 (256 × 256), then encodes PNG before upload. The backend validates the decoded image, normalizes dimensions and aspect ratio for all clients, and re-encodes PNG. Publication returns all project links and their default flag, not only the default URL. The interactive editor and published showcase use the same `ProjectCard` component; contextual popovers edit text, images, and multiple links without changing card geometry.
