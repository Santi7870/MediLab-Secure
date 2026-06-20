# Plan 3 - Authorization, SSO, and OTP

## Scope delivered

Plan 3 extends the identity baseline from Plan 2 with three controls:

- role-based authorization in `System A API`
- role-based authorization in `System B API`
- OTP/TOTP enrollment policy in `Keycloak`

The frontend also consumes realm roles from the Keycloak token and uses route guards so the access model is visible during the demo.

## Role model

Realm roles defined in Keycloak:

- `doctor`
- `admin`
- `laboratory`
- `auditor`
- `patient`

Current route policy:

- `GET /api/v1/patients`: `doctor`, `admin`, `auditor`
- `GET /api/v1/patients/{patient_id}/lab-results`: `doctor`, `admin`, `laboratory`, `auditor`
- `GET /api/v1/lab-results/{patient_id}`: `doctor`, `admin`, `laboratory`, `auditor`

## SSO interpretation in this project

This repository currently exposes one business UI: `System A Web`.

SSO is implemented at the identity layer through the shared `Keycloak` realm and central browser session:

- the browser authenticates against `Keycloak`
- `System A Web` receives an OIDC session and bearer token
- `System A API` validates that token
- `System A API` forwards the token to `System B API`
- `System B API` validates the same identity context

This gives centralized authentication and a shared session model across the integration path. For a stronger visual SSO demonstration between two separate web portals, a future enhancement can add a minimal `System B` UI client bound to the same realm.

## OTP / MFA policy

The imported realm now defines:

- TOTP as the OTP policy type
- 6 digit codes
- 30 second period
- supported authenticator apps:
  - FreeOTP
  - Google Authenticator
  - Microsoft Authenticator

The `CONFIGURE_TOTP` required action is enabled and assigned to demo users so the first login flow prompts OTP setup.

## Demo users

All demo users use password `DemoPass123!` and are configured with required OTP enrollment:

- `doctor.demo`
- `admin.demo`
- `laboratory.demo`
- `auditor.demo`

## Important reset note

If `Keycloak` already imported an earlier realm state, updating `realm-export.json` is not enough by itself. Re-import requires removing the prior realm state and starting the container again.
