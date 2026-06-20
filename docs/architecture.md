# MediLab Secure Architecture - Plan 1

## Monorepo

- `apps/system-a-web`: React frontend for System A
- `services/system-a-api`: orchestration API for patients and A -> B flow
- `services/system-b-api`: laboratory results API
- `infra/docker`: reserved for future environment assets
- `docs`: project documentation

## Four-layer structure

All services use the same layering rule:

1. `Presentation`
2. `Application`
3. `Domain`
4. `Infrastructure`

Expected dependency direction:

- `Presentation` depends on `Application`
- `Application` depends on `Domain`
- `Infrastructure` implements `Domain` contracts
- `Domain` depends on nothing external

## Initial flow

1. User opens `System A Web`
2. Frontend requests patients from `System A API`
3. User selects a patient
4. Frontend requests laboratory results from `System A API`
5. `System A API` validates the patient
6. `System A API` requests laboratory data from `System B API`
7. `System B API` returns seeded laboratory records
8. `System A Web` renders the results table
