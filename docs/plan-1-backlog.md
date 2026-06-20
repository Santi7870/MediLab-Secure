# Plan 1 Backlog

## Story 1

As a medical operator, I want to open System A and see available patients so that I can start a clinical lookup flow.

Acceptance criteria:

- dashboard is reachable
- patients list is reachable
- patient data is rendered from the backend

## Story 2

As a medical operator, I want to request laboratory results for a selected patient so that I can review basic clinical information.

Acceptance criteria:

- selecting a patient opens the laboratory results route
- frontend requests data from `System A API`
- `System A API` requests data from `System B API`
- result rows are rendered in a table

## Story 3

As a reviewer, I want the architecture to stay separated by layers so that the project is defensible under clean architecture and clean code criteria.

Acceptance criteria:

- domain code is framework-agnostic
- presentation code does not contain business rules
- infrastructure details are isolated

## Story 4

As a user, I want controlled empty and error states so that the system is understandable when data or services are unavailable.

Acceptance criteria:

- empty results show a clear message
- unknown patient shows a controlled error
- upstream outage shows a controlled error
