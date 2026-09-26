# Deployment and continuous delivery

## Production

The canonical site is `sja.remya.top`, hosted on `remya@134.195.211.13`.

The deprecated domain `sjaplus.top` responds with HTTP 308 redirects to the canonical domain, preserving paths, query strings, and request methods. Caddy manages separate HTTPS certificates for both domains. The old domain does not serve an independent application or write to a separate database.

| Resource | Location |
| --- | --- |
| Compose configuration | `/opt/sja/sja-v3/compose.yaml` |
| Database password and review key | `/opt/sja/sja-v3/.env`, mode `0600` |
| Current image versions | `/opt/sja/releases.env` |
| Previous image versions | `/opt/sja/releases.env.previous` |
| Deployment log | `/opt/sja/deployments.log` |
| Caddy site | `/etc/caddy/conf.d/sja.caddy` |

Next.js listens on `127.0.0.1:3030`; Go listens on `127.0.0.1:3031`. Host Caddy terminates TLS and renews certificates. PostgreSQL 18 is available only inside the Compose network. This deployment began with a fresh database. Other sites retain their own proxy configurations.

## GitHub Actions

Each repository runs its own CI. Pull requests run verification and image builds. Pushes to `main` and manual workflow runs on `main` deploy the corresponding service after verification succeeds.

Frontend checks cover lint, types, translation catalogs, production build, and production dependency audit. Backend checks cover formatting, `go vet`, race tests, and integration tests against PostgreSQL. GitHub runners build images tagged with the full commit SHA and stream them to the server over SSH. The server needs no GitHub repository or container registry token.

Configure these values in both repositories:

| Type | Name | Purpose |
| --- | --- | --- |
| Secret | `DEPLOY_SSH_KEY` | Dedicated deployment private key |
| Secret | `DEPLOY_KNOWN_HOSTS` | Pinned SSH host public key |
| Variable | `DEPLOY_HOST` | Server address |
| Variable | `DEPLOY_USER` | SSH user |

The authorized deployment key uses `restrict,command="/opt/sja/deploy/dispatch.sh"`. It accepts only `frontend <SHA>` or `backend <SHA>`. The installed `/usr/local/sbin/sja-deploy` serializes releases with a file lock, waits for container health, and restores the previous image after a failed rollout.

Database migrations run on backend startup in transactions protected by a PostgreSQL advisory lock. Future migrations must remain compatible with the previous application version: reverting an image does not revert database changes.

Compose, Caddy, and deployment scripts are infrastructure configuration. Application image releases do not overwrite them. Review infrastructure changes, synchronize them separately, and validate the resulting server configuration.

## Operations

```sh
ssh remya@134.195.211.13
cd /opt/sja/sja-v3
sudo docker compose --env-file .env --env-file /opt/sja/releases.env ps
sudo docker compose --env-file .env --env-file /opt/sja/releases.env logs --tail=100 backend
curl -fsS https://sja.remya.top/api/readyz
```

Retrieve `ADMIN_TOKEN` from the protected server environment file for the review page. Never commit it or include it in public logs. Review endpoints are disabled when no key is configured.

For a manual rollback, set the affected image in `/opt/sja/releases.env` to a retained commit SHA, then run:

```sh
sudo docker compose --env-file .env --env-file /opt/sja/releases.env up -d --no-build --wait
```

## Backups

Back up database and image volumes together. Run on the server from `/opt/sja/sja-v3`:

```sh
umask 077
mkdir -p /opt/sja/backups
sudo docker compose exec -T db pg_dump -U sja -d sja -Fc > /opt/sja/backups/sja.dump
sudo docker run --rm -v sja_backend_data:/data:ro alpine:3.23 tar -C /data -czf - . > /opt/sja/backups/media.tar.gz
```

Stop writes before restoring and preserve a backup of the current database and image volume. Validate `pg_restore` against an isolated database before replacing live data.
