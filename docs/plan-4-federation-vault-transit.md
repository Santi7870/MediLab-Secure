# Plan 4 - User Federation and Vault Transit

## Scope delivered

Plan 4 adds the remaining integration-heavy security controls:

- federated users through `Keycloak + OpenLDAP`
- encrypted service payloads between `System A API` and `System B API` through `Vault Transit`

## Federation design

The project now includes a local `OpenLDAP` service with users under:

- `ou=users,dc=medilab,dc=local`

Demo federated users:

- `federated.lab`
- `federated.auditor`

Password for both:

- `DemoPass123!`

`Keycloak` is configured after startup through an admin automation container that creates an LDAP user federation provider named `medilab-ldap`.

## Encrypted A -> B flow

The browser flow remains unchanged:

1. `System A Web` calls `System A API`
2. `System A API` validates the bearer token from `Keycloak`
3. `System A API` encrypts `{ "patient_id": ... }` with `Vault Transit`
4. `System A API` sends ciphertext to `System B API`
5. `System B API` decrypts the ciphertext with the same transit key
6. `System B API` loads laboratory records
7. `System B API` encrypts the result payload with `Vault Transit`
8. `System A API` decrypts the response payload
9. `System A Web` receives the same functional response as before

## Vault setup

`Vault` runs in dev mode for academic local orchestration:

- address: `http://localhost:8200`
- token: `root`
- transit key: `medilab-lab-results`

An init service enables the transit engine and creates the key automatically.

## API contract impact

Public frontend contract remains unchanged:

- `GET /api/v1/patients`
- `GET /api/v1/patients/{patient_id}/lab-results`

Internal service contract added in `System B API`:

- `POST /api/v1/lab-results/query`

Request body:

- `{ "ciphertext": "vault:v..." }`

Response body:

- `{ "ciphertext": "vault:v..." }`

## Demo evidence

For the sprint review, the strongest sequence is:

1. sign in with a local privileged user such as `admin.demo`
2. show `Admin` panel with federation and transit notes
3. sign out
4. sign in with a federated LDAP user such as `federated.lab`
5. show that authentication still passes through `Keycloak`
6. invoke the patient laboratory flow
7. show `System A -> Vault -> System B -> Vault -> System A`

## Operational note

Because federation is configured by a startup job, the easiest reset path is:

- recreate `keycloak`
- recreate `keycloak-config`
- recreate `openldap`
- recreate `vault`
- recreate `vault-init`
