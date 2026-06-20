#!/bin/sh
set -eu

export VAULT_ADDR="${VAULT_ADDR:-http://vault:8200}"
export VAULT_TOKEN="${VAULT_TOKEN:-root}"
export VAULT_TRANSIT_KEY="${VAULT_TRANSIT_KEY:-medilab-lab-results}"

until vault status >/dev/null 2>&1; do
  sleep 2
done

vault secrets enable transit >/dev/null 2>&1 || true
vault write -f "transit/keys/${VAULT_TRANSIT_KEY}" >/dev/null 2>&1 || true

echo "Vault Transit initialized with key ${VAULT_TRANSIT_KEY}"
