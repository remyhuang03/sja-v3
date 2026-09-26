# Showcase submission API

The Go backend owns this API. The frontend uses the same-origin endpoint `/api/v2/project-display-apply`.

Send a multipart form containing `meta` JSON, `cover`, and `avatar`. Successful submissions return HTTP 201 with an application ID. Validation errors return JSON with a localized `message`. The `sja_locale` cookie selects `zh`, `en`, or `ja`; API clients can also send `X-SJA-Locale` when no preference cookie is present.

Review endpoints require a Bearer key. PostgreSQL transactions publish approved applications atomically. See the [backend API documentation](https://github.com/remyhuang03/sja-backend#api) for fields, limits, and response details.
