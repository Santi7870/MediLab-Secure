# AGENT.md

## Project

MediLab Secure

Academic integration project for `ISWZ3206 - Desarrollo de Software Seguro`.

## Fixed technical decisions

- Monorepo structure
- `React + TypeScript + Vite` for `System A Web`
- `FastAPI` for `System A API` and `System B API`
- `PostgreSQL` as the official local database in `Docker Compose`
- 4-layer architecture in all services:
  - `Presentation`
  - `Application`
  - `Domain`
  - `Infrastructure`

## Monorepo structure

- `apps/system-a-web`
- `services/system-a-api`
- `services/system-b-api`
- `infra/docker`
- `docs`

## Plan 1 scope

Plan 1 delivers the technical foundation only.

Included:

- `System A Web` frontend
- `System A API`
- `System B API`
- local orchestration with `Docker Compose`
- patient list flow
- lab results lookup flow
- `A -> B` server-to-server integration
- unit and integration tests
- baseline documentation

Explicitly out of scope in Plan 1:

- real login
- authorization by roles
- `Keycloak`
- `SSO`
- `OTP / MFA`
- user federation
- `Vault Transit`
- encrypted payloads
- final `SAST` audit

## Required functional flow in Plan 1

1. User opens `System A Web`
2. User sees a dashboard and patient list
3. User requests lab results for a selected patient
4. `System A Web` calls `System A API`
5. `System A API` validates the patient and calls `System B API`
6. `System B API` returns lab results
7. `System A Web` renders the result table or an empty/error state

## Public endpoints

### System A API

- `GET /health`
- `GET /api/v1/patients`
- `GET /api/v1/patients/{patient_id}/lab-results`

### System B API

- `GET /health`
- `GET /api/v1/lab-results/{patient_id}`

## Domain models

### Patient

- `id`
- `full_name`
- `document_number`

### LabResult

- `id`
- `patient_id`
- `test_name`
- `result_value`
- `unit`
- `reference_range`
- `status`
- `collected_at`

## Quality rules

- Inner layers must not depend on outer layers
- `Domain` must not depend on framework code
- `Presentation` must not hold business rules
- DTO to domain mapping must be explicit
- Naming must stay in consistent technical English

## Risks to watch

- leaking HTTP or ORM concerns into `Domain`
- coupling `System A API` directly to `System B` response DTOs
- putting screen logic directly in React page components
- skipping controlled error handling for missing patients or upstream failures
- breaking the future path to `Keycloak` and `Vault` by hardcoding assumptions now

## Acceptance target for Plan 1

Plan 1 is complete only if:

- the monorepo structure exists
- the frontend builds
- both FastAPI services expose `/health`
- `System A API` calls `System B API`
- the frontend consumes real data from `System A API`
- error and empty states are handled
- docs explain the architecture and flow clearly

## Future plans kept as context

### Plan 2

Identity centralization with `Keycloak`

Current implementation status:

- `Keycloak` realm import prepared in `infra/docker/keycloak/realm-export.json`
- frontend login wired through `keycloak-js`
- `System A API` validates bearer tokens
- `System B API` validates bearer tokens
- `System A API` forwards bearer token to `System B API`
- Keycloak test port fixed to `8081` to avoid collision with an existing local app on `8080`

### Plan 3

Authorization, `SSO`, and `OTP`

Current implementation status:

- `System A API` now enforces role-based access with `403` responses for unauthorized roles
- `System B API` now enforces role-based access with the same role model
- `System A Web` reads realm roles from Keycloak tokens and protects routes in the UI
- frontend error handling now distinguishes `401` and `403`
- Keycloak realm import now enables `CONFIGURE_TOTP` as a required action
- demo users for `doctor`, `admin`, `laboratory`, and `auditor` are prepared for Plan 3 reviews

Operational note:

- Keycloak realm changes in `infra/docker/keycloak/realm-export.json` require a fresh realm import to take effect when the container already has prior state

### Plan 4

User federation and `A -> B` encryption with `Vault Transit`

Current implementation status:

- local `OpenLDAP` directory prepared for federated users
- `Keycloak` federation bootstrap prepared through an admin configuration job
- demo federated users defined as `federated.lab` and `federated.auditor`
- local `Vault` dev service prepared with a `Transit` key for encrypted medical payloads
- `System A API` now encrypts the request payload before invoking `System B API`
- `System B API` exposes an encrypted query endpoint and decrypts the request through `Vault Transit`
- `System B API` encrypts the laboratory response back to `System A API`
- admin UI now surfaces federation and encrypted service-flow evidence

### Plan 5

Audit evidence, academic closure, and final presentation
