# Informe de Sprint - MediLab Secure

**Asignatura:** ISWZ3206 - Desarrollo de Software Seguro
**Proyecto:** MediLab Secure (construido desde cero)
**Fecha:** 2026-06-19

---

## 1. Resumen ejecutivo

`MediLab Secure` integra dos aplicaciones web independientes con controles de
seguridad reales sobre identidad, autorizacion y proteccion de la comunicacion
entre servicios. Todo el sistema fue construido desde cero bajo arquitectura
limpia de `4 capas` y orquestado localmente con `Docker Compose`.

Caso de negocio: portal clinico (`System A`) que consulta resultados de
laboratorio de un servicio independiente (`System B`).

Implementado en este sprint:

- Arquitectura desacoplada de `4 capas` en frontend y backends
- Autenticacion centralizada con `Keycloak` (`OIDC / JWT`)
- Autorizacion basada en roles (`RBAC`) en frontend y en ambos backends
- Politica de segundo factor `TOTP / OTP`
- Federacion de usuarios con `OpenLDAP`
- Cifrado de la trama `A -> B` con `HashiCorp Vault Transit`
- Flujo clinico funcional extremo a extremo

---

## 2. Arquitectura

### 2.1 Stack tecnologico

| Capa | Tecnologia |
| --- | --- |
| Frontend `System A` | React + TypeScript + Vite |
| Backend `System A API` | FastAPI (Python) |
| Backend `System B API` | FastAPI (Python) |
| Persistencia | PostgreSQL 16 (schemas `system_a` y `system_b`) |
| Identidad / SSO | Keycloak 26 (realm `medilab-secure`) |
| Federacion | OpenLDAP |
| Servicio criptografico | HashiCorp Vault 1.17 (motor Transit) |
| Orquestacion | Docker Compose |

### 2.2 Arquitectura de 4 capas

Regla transversal en todos los servicios:

- `Presentation`: rutas, controladores, DTOs, componentes, vistas
- `Application`: casos de uso y coordinacion
- `Domain`: entidades, contratos y reglas (sin dependencias externas)
- `Infrastructure`: ORM, clientes HTTP, repositorios, integraciones externas

Reglas de calidad aplicadas:

- `Domain` no depende de `FastAPI`, `SQLAlchemy` ni librerias de UI
- `Presentation` no contiene logica de negocio
- mapeo DTO <-> dominio explicito (ver `infrastructure/mappers`)
- dependencias solo hacia capas internas

### 2.3 Componentes desplegados (docker-compose)

Servicios de aplicacion: `system-a-web` (5173), `system-a-api` (8001),
`system-b-api` (8002), `postgres` (5432), `keycloak` (8081), `openldap` (8389),
`vault` (8200).

Servicios de inicializacion:

- `keycloak-config`: configura federacion LDAP en el realm
- `vault-init`: habilita motor `transit` y crea la llave `medilab-lab-results`

Redes segmentadas: `app-network`, `identity-network`, `vault-network`.

---

## 3. Sistema A y Sistema B

### 3.1 System A (portal clinico)

- `System A Web`: frontend React, unico portal con UI completa actual
- `System A API`: orquesta el flujo, valida pacientes y llama a `System B API`

Endpoints `System A API`:

- `GET /health`
- `GET /api/v1/patients` — roles `doctor`, `admin`, `auditor`
- `GET /api/v1/patients/{patient_id}/lab-results` — roles `doctor`, `admin`, `laboratory`, `auditor`

### 3.2 System B (servicio de laboratorio)

- `System B API`: entrega resultados de laboratorio; hoy expuesto solo como API segura (sin frontend propio)

Endpoints `System B API`:

- `GET /health`
- `GET /api/v1/lab-results/{patient_id}` — roles `doctor`, `admin`, `laboratory`, `auditor`
- `POST /api/v1/lab-results/query` — endpoint cifrado (recibe/responde `ciphertext`)

### 3.3 Flujo funcional A -> B

1. usuario ingresa a `System A Web` y se autentica via `Keycloak`
2. frontend obtiene `JWT` y llama a `System A API`
3. `System A API` valida token y roles
4. `System A API` valida el paciente y llama a `System B API`
5. `System B API` valida contexto, consulta resultados y responde
6. `System A Web` renderiza tabla de resultados o estado vacio/error

Manejo de errores: `404` paciente inexistente, `502` fallo upstream/Vault,
estado vacio controlado en UI.

---

## 4. Autenticacion

Centralizada en `Keycloak`, realm `medilab-secure`:

- emite tokens `OIDC / JWT`
- los servicios **no** gestionan passwords; consumen identidad del proveedor central
- frontend usa `keycloak-js` con `Authorization Code Flow + PKCE (S256)`, cliente publico `system-a-web`
- ambos backends validan `Bearer Token` con `KeycloakTokenValidator`

Token: el backend extrae `iss`, `sub`, `preferred_username`, `exp` y
`realm_access.roles`. Sin token o token invalido => `401`.

Usuarios demo (realm import): `doctor.demo`, `admin.demo`, `laboratory.demo`,
`auditor.demo` (password `DemoPass123!`), todos con accion requerida
`CONFIGURE_TOTP`.

---

## 5. Autorizacion (RBAC)

Roles del realm: `patient`, `doctor`, `laboratory`, `admin`, `auditor`.

Doble capa de control:

**Frontend** (`System A Web`): lee roles del token y protege rutas/vistas con
`RoleGuard` y `AuthGate`. Vistas por rol: panel `Admin`, `Laboratory`,
`Patients`, pagina de acceso denegado.

**Backend** (ambas APIs): dependencia `require_any_role(...)` valida roles antes
de ejecutar el caso de uso. Si el rol no es autorizado => `403`. La seguridad no
depende solo de la UI.

| Recurso | Roles permitidos |
| --- | --- |
| Listado de pacientes (A) | doctor, admin, auditor |
| Resultados de lab (A y B) | doctor, admin, laboratory, auditor |
| Panel administrativo (UI) | admin |

---

## 6. Segundo factor (OTP / TOTP)

Politica `TOTP` configurada en el realm:

- algoritmo `HmacSHA1`, 6 digitos, periodo 30s
- apps soportadas: FreeOTP, Google Authenticator, Microsoft Authenticator
- accion requerida `CONFIGURE_TOTP` activa por defecto para usuarios demo

En la demo: al iniciar sesion, `Keycloak` solicita enrolar/validar OTP antes de
conceder acceso.

---

## 7. Federacion de usuarios

`OpenLDAP` integrado a `Keycloak` via `keycloak-config`
(`configure-ldap-federation.sh` + `ldap-component.json`).

- demuestra que los usuarios no deben existir localmente en el gestor de identidad
- usuarios federados demo: `federated.lab`, `federated.auditor`
- una cuenta de directorio externo se autentica en el mismo realm y consume la app

---

## 8. Cifrado de la trama A -> B con Vault

`HashiCorp Vault` (motor **Transit**) cifra la comunicacion interna entre APIs.
**Vault no almacena datos clinicos**; solo realiza operaciones criptograficas y
custodia la llave `medilab-lab-results`. Ningun servicio embebe llaves en codigo.

Flujo cifrado (al consultar resultados):

1. `System A API` arma la carga con `patient_id`
2. `System A API` cifra la carga con `Vault Transit` (`transit/encrypt/{key}`)
3. envia a `System B API` solo el `ciphertext` (`POST /api/v1/lab-results/query`)
4. `System B API` descifra con `Vault Transit` (`transit/decrypt/{key}`)
5. `System B API` consulta resultados y **cifra la respuesta**
6. `System A API` descifra la respuesta y la entrega al frontend

Implementacion: `VaultTransitCipher` (en ambos servicios) usa cliente HTTP
async contra Vault; codifica payload JSON en base64 antes de cifrar. Fallo de
Vault => `502`.

---

## 9. Cumplimiento frente a la consigna

| Requisito | Estado | Evidencia |
| --- | --- | --- |
| Autenticacion | Cumplido | Keycloak centraliza login, emite JWT para A y B |
| Autorizacion (RBAC) | Cumplido | `require_any_role` en backends + `RoleGuard` en frontend |
| SSO | Parcial (identidad si, evidencia visual no) | mismo IdP/realm/token; falta frontend de B |
| Segundo factor (OTP) | Cumplido | politica TOTP + `CONFIGURE_TOTP` |
| Federacion de usuarios | Cumplido | Keycloak + OpenLDAP |
| Trama A -> B cifrada | Cumplido | Vault Transit cifra solicitud y respuesta |
| Esquema agil por sprint | Cumplido | documentacion por planes en `docs/` |

---

## 10. Retroalimentacion del profesor (acciones para el siguiente sprint)

El profesor indico los siguientes puntos a cubrir. Estado actual y plan:

### 10.1 Demostrar SSO real entre las dos aplicaciones
**Estado:** pendiente de evidencia visual.
Hoy el SSO existe a nivel de identidad (mismo realm, misma sesion, mismo token
validado por A y B), pero solo `System A` tiene UI. Para la prueba visible:
abrir App A, iniciar sesion, abrir App B y entrar **sin nuevo login**
reutilizando la sesion de Keycloak.

### 10.2 Construir frontend para App 2 (System B)
**Estado:** pendiente (requisito habilitante de 10.1 y 10.3).
Crear `apps/system-b-web` (React + TS + Vite, misma arquitectura de 4 capas),
registrar cliente `system-b-web` en el realm y cablear `keycloak-js`. Es el
trabajo base para demostrar SSO entre dos portales visibles.

### 10.3 Un mismo usuario con roles diferentes en App A y App B
**Estado:** pendiente.
Migrar de **realm roles** a **client roles** por aplicacion en Keycloak, de modo
que un usuario tenga, por ejemplo, rol `doctor` en `system-a-web` y rol
`auditor` (o sin acceso) en `system-b-web`. Demostrar que al iniciar sesion en
una app, ambas quedan autenticadas y cada una aplica **sus propios roles**.

### 10.4 Demostrar uso de Vault en la exposicion
**Estado:** implementado; falta guion de evidencia.
Mostrar en vivo: payload cifrado (`ciphertext`) viajando entre A y B, llave en
Vault (`vault read transit/keys/medilab-lab-results`), y explicar que Vault solo
cifra/descifra, no guarda datos clinicos.

**Resumen de pendientes:**
1. `apps/system-b-web` (frontend App 2)
2. cliente `system-b-web` + client roles por app en Keycloak
3. evidencia visual de SSO entre los dos portales
4. guion de demo de Vault

---

## 11. Guion sugerido para la demo

1. presentar arquitectura: Web A, API A, API B, Keycloak, OpenLDAP, Vault, PostgreSQL
2. login via Keycloak; mostrar OTP
3. evidenciar rol del usuario y vistas restringidas (Admin / Laboratory)
4. consultar resultados de un paciente
5. mostrar que A no consulta en claro a B: cifra con Vault Transit
6. mostrar que B descifra, procesa, recifra y responde
7. autenticar un usuario federado desde OpenLDAP
8. (proximo sprint) abrir System B Web y evidenciar SSO + roles diferenciados

---

## 12. Conclusiones

El sprint entrega una integracion segura entre dos sistemas con base tecnica
ordenada y controles reales: autenticacion centralizada, RBAC, OTP, federacion
y cifrado de la trama `A -> B`. La unica brecha relevante es de **evidencia
visual de SSO entre dos portales**, que se cierra construyendo el frontend de
`System B` y diferenciando roles por aplicacion mediante client roles en
Keycloak — exactamente los puntos sugeridos por el profesor.
