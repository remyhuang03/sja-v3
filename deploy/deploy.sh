#!/usr/bin/env bash
set -euo pipefail
service=${1:?service required}
revision=${2:?revision required}
[[ $service =~ ^(frontend|backend)$ && $revision =~ ^[a-f0-9]{40}$ ]] || exit 2
cd /opt/sja/sja-v3
exec 9>/opt/sja/deploy.lock
flock -w 600 9
# Docker accepts a gzip-compressed image archive on stdin.
docker load
image="sja-${service}:${revision}"
docker image inspect "$image" >/dev/null
release=/opt/sja/releases.env
if [[ ! -f $release ]]; then
  printf 'FRONTEND_IMAGE=sja-frontend:local\nBACKEND_IMAGE=sja-backend:local\n' > "$release"
fi
cp "$release" "${release}.previous"
key="${service^^}_IMAGE"
awk -F= -v key="$key" -v image="$image" '$1 != key { print } END { print key "=" image }' "$release" > "${release}.next"
mv "${release}.next" "$release"
compose=(docker compose --env-file .env --env-file "$release")
if "${compose[@]}" up -d --no-build --no-deps --wait --wait-timeout 120 "$service" && curl --fail --silent --retry 5 --retry-delay 2 --retry-all-errors http://127.0.0.1:3031/api/readyz >/dev/null; then
  printf '%s %s %s\n' "$(date -u +%FT%TZ)" "$service" "$revision" >> /opt/sja/deployments.log
else
  cp "${release}.previous" "$release"
  "${compose[@]}" up -d --no-build --no-deps --wait --wait-timeout 120 "$service"
  printf 'Deployment failed; previous image restored.\n' >&2
  exit 1
fi
