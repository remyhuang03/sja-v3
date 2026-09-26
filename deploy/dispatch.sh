#!/usr/bin/env bash
set -euo pipefail
# The dedicated CI SSH key may only stream a tagged image to this command.
if [[ ${SSH_ORIGINAL_COMMAND:-} =~ ^(frontend|backend)\ ([a-f0-9]{40})$ ]]; then
  exec sudo /usr/local/sbin/sja-deploy "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
fi
printf 'Only SJA deployments are permitted.\n' >&2
exit 1
