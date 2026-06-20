# Plan 1 Flow A to B

## Objective

Demonstrate a clean, minimal medical flow before identity and encryption are added.

## Sequence

1. `System A Web` calls `GET /api/v1/patients`
2. `System A API` reads patients from its own persistence layer
3. `System A Web` calls `GET /api/v1/patients/{patient_id}/lab-results`
4. `System A API` verifies the patient exists in its domain
5. `System A API` calls `System B API` at `GET /api/v1/lab-results/{patient_id}`
6. `System B API` returns laboratory results from its persistence layer
7. `System A API` maps the external payload to domain models
8. `System A Web` renders the normalized result data

## Error handling

- missing patient in `System A API`: `404`
- `System B API` unavailable or invalid response: `502`
- no lab records: empty array and controlled empty state in UI
