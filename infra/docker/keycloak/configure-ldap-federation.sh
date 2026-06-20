#!/bin/sh
set -eu

KEYCLOAK_URL="${KEYCLOAK_URL:-http://keycloak:8081}"
KEYCLOAK_REALM="${KEYCLOAK_REALM:-medilab-secure}"
KEYCLOAK_ADMIN_USER="${KEYCLOAK_ADMIN_USER:-admin}"
KEYCLOAK_ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin}"

until /opt/keycloak/bin/kcadm.sh config credentials \
  --server "${KEYCLOAK_URL}" \
  --realm master \
  --user "${KEYCLOAK_ADMIN_USER}" \
  --password "${KEYCLOAK_ADMIN_PASSWORD}" >/dev/null 2>&1; do
  sleep 3
done

if /opt/keycloak/bin/kcadm.sh get components -r "${KEYCLOAK_REALM}" -q name=medilab-ldap | grep -q '"name" : "medilab-ldap"'; then
  echo "LDAP federation already configured"
  exit 0
fi

/opt/keycloak/bin/kcadm.sh create components -r "${KEYCLOAK_REALM}" \
  -f /opt/keycloak-config/ldap-component.json

echo "LDAP federation configured for realm ${KEYCLOAK_REALM}"
