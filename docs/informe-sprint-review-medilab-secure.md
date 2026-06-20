# Informe de Sprint Review - MediLab Secure

## 1. Resumen ejecutivo

`MediLab Secure` es un proyecto integrador construido desde cero para la asignatura `ISWZ3206 - Desarrollo de Software Seguro`. La solucion implementa una integracion entre dos sistemas web independientes:

- `System A`: portal principal de acceso clinico
- `System B`: servicio de resultados de laboratorio

El proyecto fue desarrollado con enfoque incremental por planes, iniciando con una fundacion tecnica limpia y evolucionando luego hacia controles de seguridad centrados en identidad, autorizacion, federacion de usuarios y cifrado de la comunicacion entre sistemas.

El resultado actual demuestra:

- arquitectura desacoplada de `4 capas`
- autenticacion centralizada con `Keycloak`
- autorizacion basada en roles
- preparacion y politica de `OTP / TOTP`
- federacion de usuarios con `OpenLDAP`
- cifrado de la trama `A -> B` mediante `Vault Transit`
- evidencia funcional del flujo clinico entre frontend, `System A API` y `System B API`

Tambien se identifica una observacion relevante para la exposicion final: hoy existe una interfaz visual completa para `System A`, mientras que `System B` se encuentra expuesto como API segura. Para una demostracion academica mas fuerte de `SSO` entre dos aplicaciones visibles, se recomienda incorporar un frontend minimo para `System B`.

## 2. Objetivo del sprint documentado

Documentar el avance tecnico y de seguridad implementado en `MediLab Secure`, dejando evidencia clara de:

- por que se eligio esta arquitectura
- que puntos de la consigna ya fueron cubiertos
- como se integran `System A`, `System B`, `Keycloak`, `Vault` y `OpenLDAP`
- que observaciones deben considerarse para la presentacion ante el profesor

## 3. Contexto del proyecto y justificacion

La consigna exige integrar dos aplicaciones web ejecutadas en entornos diferentes, con autenticacion, autorizacion, `SSO`, segundo factor, federacion de usuarios y comunicacion cifrada entre `Sistema A` y `Sistema B` usando un servicio externo de gestion criptografica.

Se eligio el caso `MediLab Secure` porque permite representar un flujo medico realista:

1. un usuario accede al portal clinico
2. consulta pacientes o un flujo de resultados
3. `System A` coordina la operacion
4. `System B` responde con resultados de laboratorio
5. la integracion debe proteger identidad, autorizacion y datos clinicos

Este escenario es adecuado para justificar controles de seguridad de nivel aplicativo y de integracion.

## 4. Construccion desde cero y enfoque por planes

La solucion se construyo desde cero bajo un esquema incremental:

### Plan 1 - Fundaciones tecnicas

Se creo el monorepo base con:

- `apps/system-a-web`
- `services/system-a-api`
- `services/system-b-api`
- `infra/docker`
- `docs`

Se establecio como estandar la arquitectura de `4 capas` en frontend y backend:

- `Presentation`
- `Application`
- `Domain`
- `Infrastructure`

Se implemento el flujo minimo funcional:

1. `System A Web` muestra pacientes
2. el usuario solicita resultados
3. `System A API` consulta a `System B API`
4. `System B API` entrega resultados clinicos
5. el frontend renderiza la respuesta

### Plan 2 - Centralizacion de identidad

Se incorporo `Keycloak` como proveedor central de identidad para:

- autenticacion
- emision de tokens `OIDC / JWT`
- sesion centralizada
- base para `SSO`

Los sistemas `A` y `B` fueron preparados para validar tokens emitidos por el mismo `realm`.

### Plan 3 - Autorizacion, SSO y OTP

Se extendio la base de identidad con:

- control de acceso por roles
- proteccion de rutas en frontend
- proteccion de endpoints en `System A API`
- proteccion de endpoints en `System B API`
- politica `TOTP` para segundo factor

Roles definidos:

- `admin`
- `doctor`
- `laboratory`
- `auditor`
- `patient`

Se agregaron vistas especificas por rol dentro de `System A`, por ejemplo:

- panel administrativo
- espacio de laboratorio
- acceso restringido segun rol

### Plan 4 - Federacion y cifrado de integracion

Se incorporaron los controles mas importantes de integracion segura:

- federacion de usuarios con `OpenLDAP`
- cifrado de peticiones y respuestas `A -> B` con `Vault Transit`

Esto permite demostrar que la identidad no depende solo de usuarios locales y que la trama clinica entre sistemas no viaja en claro dentro del flujo interno.

## 5. Arquitectura final implementada

## 5.1 Monorepo y stack

- Frontend principal: `React + TypeScript + Vite`
- Backends: `FastAPI`
- Persistencia: `PostgreSQL`
- Identidad: `Keycloak`
- Federacion: `OpenLDAP`
- Servicio criptografico: `HashiCorp Vault Transit`
- Orquestacion local: `Docker Compose`

## 5.2 Arquitectura de 4 capas

La arquitectura fue aplicada como regla transversal:

- `Presentation`: rutas, controladores, DTOs, componentes, vistas
- `Application`: casos de uso y coordinacion
- `Domain`: entidades, reglas y contratos
- `Infrastructure`: ORM, clientes HTTP, repositorios, integraciones externas

Decisiones de calidad:

- `Domain` no depende de `FastAPI`, `SQLAlchemy` ni librerias de UI
- `Presentation` no contiene logica de negocio
- el mapeo entre DTOs y modelos es explicito
- las dependencias van desde capas externas hacia internas, no al reves

## 5.3 Componentes desplegados

- `system-a-web`
- `system-a-api`
- `system-b-api`
- `postgres`
- `keycloak`
- `openldap`
- `vault`

Adicionalmente existen servicios de inicializacion:

- `keycloak-config` para configurar federacion LDAP
- `vault-init` para habilitar `Transit` y crear la llave criptografica

## 6. Flujo funcional y de seguridad

## 6.1 Flujo clinico base

1. el usuario ingresa a `System A Web`
2. se autentica mediante `Keycloak`
3. el frontend obtiene un `JWT`
4. el frontend invoca `System A API`
5. `System A API` valida el token y los roles
6. `System A API` invoca a `System B API`
7. `System B API` valida nuevamente el contexto de seguridad
8. `System B API` obtiene resultados de laboratorio
9. la respuesta vuelve a `System A`
10. `System A Web` presenta la informacion al usuario

## 6.2 Flujo cifrado con Vault

Cuando se consulta resultados de laboratorio, el flujo protegido funciona asi:

1. `System A Web` llama a `GET /api/v1/patients/{patient_id}/lab-results`
2. `System A API` valida el `JWT`
3. `System A API` arma la carga con el `patient_id`
4. `System A API` cifra la carga mediante `Vault Transit`
5. `System A API` envia a `System B API` solo el `ciphertext`
6. `System B API` usa `Vault Transit` para descifrar la solicitud
7. `System B API` consulta resultados clinicos
8. `System B API` cifra la respuesta con `Vault Transit`
9. `System A API` descifra la respuesta
10. `System A Web` recibe el resultado funcional esperado

Observacion tecnica importante:

- `Vault` no almacena los resultados clinicos
- `Vault` administra la operacion criptografica y la llave de `Transit`
- los datos se cifran y descifran bajo demanda

## 7. Implementacion de identidad y roles

## 7.1 Autenticacion

La autenticacion se centraliza en `Keycloak`, el cual:

- administra el `realm` `medilab-secure`
- autentica usuarios locales
- autentica usuarios federados desde `OpenLDAP`
- emite tokens `OIDC`

Los sistemas no gestionan passwords directamente. Ambos consumen la identidad emitida por el proveedor central.

## 7.2 Autorizacion

La autorizacion se aplica en dos niveles:

### Frontend

`System A Web` lee los roles del token y protege rutas y vistas.

Ejemplos:

- `Patients` solo para roles autorizados
- `Laboratory` para roles de validacion clinica
- `Admin` solo para administradores

### Backend

Los endpoints de `System A API` y `System B API` validan roles antes de ejecutar casos de uso.

Esto evita depender solo de la interfaz para la seguridad.

## 7.3 Rol actual por vista

Modelo visible actual:

- `admin`: acceso amplio, incluyendo panel administrativo
- `doctor`: acceso al flujo clinico principal
- `auditor`: acceso de consulta controlada
- `laboratory`: acceso al espacio de laboratorio y consulta dirigida de resultados

Esto permite demostrar que no todos los usuarios recorren la aplicacion de la misma manera.

## 7.4 Token utilizado

La comunicacion autenticada usa `Bearer Token` con formato `JWT`, emitido por `Keycloak`.

Dentro del token se transportan elementos como:

- `iss`
- `sub`
- `preferred_username`
- `realm_access.roles`
- `exp`

Los roles del usuario se extraen de `realm_access.roles`.

## 8. Segundo factor de autenticacion

Se configuro politica `TOTP` en `Keycloak` con soporte para aplicaciones autenticadoras compatibles.

Configuracion relevante:

- codigos de 6 digitos
- ventana temporal de 30 segundos
- accion requerida `CONFIGURE_TOTP`

Evidencia funcional esperada en demo:

1. el usuario inicia sesion
2. `Keycloak` solicita enrolamiento o validacion de `OTP`
3. el acceso queda protegido por segundo factor

## 9. Federacion de usuarios

La federacion se implemento con `OpenLDAP` integrado a `Keycloak`.

Objetivo:

- demostrar que no todos los usuarios deben existir localmente en el gestor de identidad
- centralizar autenticacion sin duplicar manualmente las cuentas

Usuarios federados de demostracion:

- `federated.lab`
- `federated.auditor`

Con esto se puede mostrar que una cuenta proveniente de un directorio externo aun puede autenticarse en el mismo `realm` y consumir la aplicacion.

## 10. Cumplimiento frente a la consigna

| Requisito de la consigna | Estado actual | Evidencia en el proyecto |
| --- | --- | --- |
| Autenticacion | Cumplido | `Keycloak` centraliza login y emite `JWT` para `System A` y `System B` |
| Autorizacion | Cumplido | Restricciones por rol en frontend y en ambos backends |
| SSO | Cumplido a nivel de identidad, demostracion visual parcial | Ambos sistemas confian en la misma sesion y el mismo token; falta un frontend propio para `System B` si se desea prueba visual entre dos portales |
| Segundo factor | Cumplido | Politica `TOTP` y accion requerida `CONFIGURE_TOTP` |
| Federacion de usuarios | Cumplido | Integracion `Keycloak + OpenLDAP` |
| Invocar servicio A -> B con trama encriptada | Cumplido | `Vault Transit` cifra solicitud y respuesta entre `System A API` y `System B API` |
| Esquema agil y avance por sprint | Cumplido | Documentacion por planes y backlog tecnico en `docs/` |

## 11. Observaciones importantes para la revision del profesor

### 11.1 Sobre el SSO entre dos aplicaciones

Actualmente el proyecto demuestra `SSO` en la capa de identidad:

- un mismo proveedor de identidad
- una misma sesion centralizada
- un mismo `JWT`
- validacion compartida por `System A` y `System B`

Sin embargo, la prueba visual mas fuerte que podria pedir el profesor seria:

1. abrir `App A`
2. iniciar sesion
3. abrir `App B`
4. observar ingreso automatico o reutilizacion de sesion sin nuevo login

Para esa demostracion visible, hace falta construir un frontend propio para `System B`.

### 11.2 Sobre roles distintos entre aplicaciones

Hoy los roles se controlan sobre el ecosistema completo del proyecto y condicionan vistas y endpoints.

Si el profesor exige demostrar que un mismo usuario tiene permisos diferentes en `App A` y `App B`, lo ideal es implementar una de estas dos variantes:

- `client roles` distintos por aplicacion en `Keycloak`
- permisos diferenciados por frontend y por API usando mappings separados

La base actual ya permite hacerlo, pero la evidencia visual completa requiere `System B Web`.

### 11.3 Sobre Vault

`Vault` debe explicarse correctamente en la exposicion:

- no es una base de datos clinica
- no reemplaza a `PostgreSQL`
- no guarda historicos de resultados medicos
- se usa como servicio externo de operaciones criptograficas

Su valor en el proyecto es que `System A` y `System B` no comparten llaves embebidas en codigo para cifrar la trama.

## 12. Como explicar la demo en la exposicion

Secuencia recomendada:

1. presentar la arquitectura general: `System A Web`, `System A API`, `System B API`, `Keycloak`, `OpenLDAP`, `Vault`, `PostgreSQL`
2. mostrar que el usuario ingresa por `Keycloak`
3. evidenciar el rol del usuario en el portal
4. entrar a una seccion protegida, por ejemplo `Admin` o `Laboratory`
5. consultar resultados de un paciente
6. explicar que el frontend llama a `System A`
7. explicar que `System A` no consulta en claro a `System B`, sino que cifra con `Vault Transit`
8. explicar que `System B` descifra, procesa, vuelve a cifrar y responde
9. mostrar que un usuario federado desde `OpenLDAP` tambien puede autenticarse
10. cerrar indicando que la siguiente mejora natural es `System B Web` para exhibir `SSO` entre dos interfaces distintas

## 13. Observaciones tecnicas y decisiones de implementacion

- Se eligio `React + TypeScript` para mantener un frontend tipado y defendible academicamente.
- Se eligio `FastAPI` por claridad en DTOs, validacion y rapidez de integracion.
- Se aplico una arquitectura limpia de `4 capas` para poder justificar separacion de responsabilidades.
- Se uso `Keycloak` por cubrir autenticacion, autorizacion, `SSO`, `OIDC` y `OTP`.
- Se uso `OpenLDAP` para federacion realista de usuarios externos.
- Se uso `Vault Transit` para el cifrado `A -> B` sin exponer llaves en codigo.

## 14. Estado actual del proyecto

Implementado y documentado:

- monorepo completo
- `System A Web`
- `System A API`
- `System B API`
- autenticacion centralizada
- roles y restriccion de rutas
- politica `OTP`
- federacion LDAP
- cifrado de integracion con `Vault`
- documentacion tecnica de planes

Pendiente para una demostracion academica mas fuerte:

- frontend de `System B`
- evidencia visual directa de `SSO` entre dos portales
- diferenciacion visible de roles por aplicacion si el profesor lo exige de forma estricta

## 15. Conclusiones

`MediLab Secure` cumple el objetivo principal de construir una integracion segura entre dos sistemas, con una base tecnica ordenada y controles de seguridad reales sobre identidad, acceso y proteccion de la comunicacion.

El proyecto ya permite defender:

- autenticacion centralizada
- autorizacion por roles
- `OTP`
- federacion de usuarios
- cifrado de la trama `A -> B`

La observacion mas importante para el cierre del proyecto no es tecnica sino de evidencia visual: para que la consigna de `SSO` entre dos aplicaciones sea incuestionable en presentacion, conviene agregar un frontend ligero para `System B` y reutilizar la misma sesion de `Keycloak`.

Hasta ese punto, la implementacion actual ya constituye una base funcional, segura y defendible para la evaluacion.
