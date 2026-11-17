# Trato — Prototipo: plataforma de oficios (Clientes ↔ Prestadores)

Prototipo funcional de una app web que conecta a personas que necesitan contratar un oficio (plomería, electricidad, limpieza, pintura, mecánica, etc.) con prestadores que hoy trabajan de manera informal, sin canal confiable para darse a conocer ni ser verificados. Basado en el documento de problemática del equipo (ver `HCI Problemática y Población.pdf`).

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + TypeScript + Express
- **Base de datos / Auth / Storage**: Firebase (Firestore, Authentication, Storage)
- **Patrón**: MVC (ver [Arquitectura](#arquitectura-mvc))

---

## Índice

1. [Puesta en marcha](#puesta-en-marcha)
2. [Arquitectura (MVC)](#arquitectura-mvc)
3. [Modelo de roles y el flag de elegibilidad](#modelo-de-roles-y-el-flag-de-elegibilidad)
4. [Mapa de rutas / pantallas](#mapa-de-rutas--pantallas)
5. [Flujos funcionales](#flujos-funcionales)
6. [Sistema de diseño y mockups](#sistema-de-diseño-y-mockups)
7. [Accesibilidad](#accesibilidad)
8. [Seguridad — qué falta para producción](#seguridad--qué-falta-para-producción)

---

## Puesta en marcha

### 1. Crear el proyecto de Firebase

1. https://console.firebase.google.com/ → "Agregar proyecto" (ej. `trato-xxxxx`).
2. Activar:
   - **Authentication** → Sign-in method → **Correo electrónico/contraseña**.
   - **Firestore Database** → modo producción (reglas ya escritas en `firestore.rules`).
   - **Storage** (reglas en `storage.rules`).
3. Agregar una app web (ícono `</>`) → copiar `apiKey`, `authDomain`, `projectId`, `storageBucket`.
4. Configuración del proyecto → Cuentas de servicio → "Generar nueva clave privada" → se descarga un JSON (lo usa el backend).
5. Opcional: `firebase deploy --only firestore:rules,storage` tras `firebase login` / `firebase use --add`.

### 2. Variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

- `backend/.env`: pega el JSON completo de la cuenta de servicio en `FIREBASE_SERVICE_ACCOUNT` (una sola línea) + `FIREBASE_STORAGE_BUCKET`.
- `frontend/.env`: pega `apiKey`/`authDomain`/`projectId`/`storageBucket` de la app web. `VITE_USE_FIREBASE_EMULATORS=false`.

### 3. Instalar y compilar

```bash
npm install
npm run build:shared   # /shared lo consumen frontend y backend
```

### 4. Correr (dos terminales)

```bash
npm run dev:backend    # http://localhost:4000
npm run dev:frontend   # http://localhost:5173
```

### 5. Flujo de prueba manual end-to-end

1. `/registro` → crear cuenta (queda como **cliente**).
2. `/buscar` → en desarrollo (`npm run dev`), si no hay publicaciones reales se muestran 3 tarjetas de ejemplo con el aviso "Vista previa con datos de ejemplo".
3. `/perfil` → "Activar perfil de prestador" → lleva a `/perfil-prestador`: llenar oficio/zona/precio/descripción y subir foto de identificación + selfie (van a Firebase Storage).
4. `/admin/verificaciones` → aprobar la solicitud (panel sin restricción de rol en este prototipo, ver sección de seguridad).
5. Volver a `/perfil`: el switch "Prestador" en la barra superior ya está habilitado. Activarlo.
6. `/mis-publicaciones` → publicar un servicio.
7. Volver a "Cliente" con el switch y en `/buscar` filtrar por ese oficio/zona — debe aparecer la publicación real.

---

## Arquitectura (MVC)

```
/frontend   React + TS (Vite)
/backend    Node + TS (Express)
/shared     Tipos TS compartidos (User, ProviderProfile, ServiceListing, VerificationRequest)
```

| Capa | Backend | Frontend |
|---|---|---|
| **Modelo** | `backend/src/repositories/*.repository.ts` — único punto de acceso a Firestore por colección | Tipos de `@oficios/shared` |
| **Vista** | — | `frontend/src/pages/*.tsx` y `frontend/src/components/*.tsx` — componentes presentacionales |
| **Controlador** | `backend/src/controllers/*.controller.ts` recibe la request, llama a `services/`, responde | `frontend/src/hooks/*.ts` (`useAuth`, `useProviderEligibility`, `useServiceListings`) conectan vistas con la API sin meter lógica de negocio en los componentes |

El backend además tiene una capa de **servicios** (`backend/src/services/`) con la lógica de negocio real (elegibilidad de proveedor, alta de usuarios, publicación de servicios), que los controladores solo orquestan.

Todas las escrituras a Firestore/Storage pasan por el backend con Firebase Admin SDK; el frontend solo usa el SDK de Firebase para Auth y para subir archivos directamente a Storage (ID/selfie, ver `storage.rules`).

---

## Modelo de roles y el flag de elegibilidad

Una sola cuenta (`users/{uid}` en Firestore) puede tener dos roles:

- `client` — activo desde el registro, siempre disponible.
- `provider` — **apagado por defecto**. Se enciende solo cuando el backend confirma elegibilidad.

La pregunta "¿esta cuenta puede activar el modo prestador?" vive en **un único lugar**:

```
backend/src/services/providerEligibility.service.ts → evaluateProviderEligibility()
```

Hoy la regla es: `profileComplete && verification.status === 'approved'`. El equipo todavía no decide si hace falta aprobación manual de un admin o si basta con que los campos obligatorios estén llenos — por eso esta función es la única que debe cambiar si esa decisión cambia. Ningún otro módulo (el endpoint `GET /providers/eligibility`, el componente `RoleSwitch`, la publicación de servicios) reimplementa esta lógica; todos consultan el mismo resultado.

El switch cliente/prestador (`frontend/src/components/RoleSwitch.tsx`) queda deshabilitado y muestra qué falta (`eligibility.missingFields`, o "identidad aún no aprobada") hasta que `eligible` es `true`.

---

## Mapa de rutas / pantallas

| Ruta | Pantalla | Acceso | Qué hace |
|---|---|---|---|
| `/buscar` | Buscar servicios | público | Lista/filtra publicaciones activas por oficio y zona |
| `/login` | Entrar | público | Login con Firebase Auth |
| `/registro` | Crear cuenta | público | Alta de cuenta (rol cliente por defecto) |
| `/perfil` | Mi perfil | requiere sesión | Vista propia: datos de cliente (teléfono + verificación) y, si aplica, resumen del perfil de prestador con acceso a edición |
| `/perfil-prestador` | Editar perfil de prestador | requiere sesión | Formulario de oficio/zona/precio/descripción + subida de identificación/selfie para verificación |
| `/mis-publicaciones` | Mis publicaciones | requiere sesión + rol prestador activo | Publicar y listar los servicios propios |
| `/admin/verificaciones` | Panel admin | requiere sesión (sin rol admin real todavía, ver seguridad) | Aprobar/rechazar solicitudes de verificación de identidad pendientes |

---

## Flujos funcionales

### Registro y auto-reparación de cuentas

`POST /auth/register` crea el documento `users/{uid}` la primera vez. Si una cuenta se creó directo en Firebase Auth (por ejemplo, un usuario de prueba desde la consola) y nunca pasó por ese endpoint, `GET /auth/me` la detecta y la crea automáticamente usando los datos que Firebase Auth ya tiene (correo, nombre) — así ningún login se queda "colgado" por falta de documento en Firestore.

### Activar el modo prestador

1. `PUT /providers/profile` guarda oficio/zona/precio/descripción en `providerProfiles/{uid}` y calcula `profileComplete`.
2. `POST /providers/verification` sube la solicitud (`verificationRequests`) con las URLs de Storage de la identificación y la selfie, estado `pending`.
3. Un admin aprueba/rechaza con `POST /admin/verifications/:id/review` → esto reevalúa `evaluateProviderEligibility` y, si corresponde, enciende `users/{uid}.roles.provider`.
4. El frontend vuelve a consultar `GET /providers/eligibility` y habilita el switch.

### Publicar y buscar servicios

- `POST /listings` (requiere `eligibility.eligible === true`, verificado en el backend, no solo en la UI) crea una publicación.
- `GET /listings/search?oficio=&zonaCobertura=` es público y solo devuelve publicaciones `active: true`.

---

## Sistema de diseño y mockups

Dirección estética: panel flotante de esquinas redondeadas, con una paleta de **blanco + azul marino** que se invierte completa en modo oscuro.

### Paleta (`frontend/src/index.css`)

Hay tres variables de estado en `document.documentElement.dataset`: `theme` (`light`/`dark`, con botón propio), `highContrast` (`true`/`false`, fuerza máximo contraste sobre cualquier tema) y `fontSize`.

**Modo claro** (`data-theme` ausente o `"light"`):

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` / `--color-surface` | `#FFFFFF` | Fondo del panel y de tarjetas/inputs/barra superior |
| `--color-backdrop` | `#E7EAF0` | Fondo gris-azulado detrás del panel flotante |
| `--color-accent` | `#1D3461` (azul marino) | Acciones principales, pestaña activa |
| `--color-trust` | `#2B6E6B` (verde-azulado) | Insignia "Identidad verificada", avatar |
| `--color-danger` / `--color-success` | rojo / verde | Estados, distinguibles sin depender solo del color |

**Modo oscuro** (`data-theme="dark"`, botón "Modo oscuro"/"Modo claro" en la barra de accesibilidad) — paleta invertida:

| Token | Valor |
|---|---|
| `--color-bg` / `--color-surface` | `#0B1C36` / `#122A4C` (azul marino) |
| `--color-backdrop` | `#050A14` |
| `--color-accent` | `#FFFFFF` (blanco) |
| `--color-text` | `#F4F6FA` |

**Alto contraste** (`data-high-contrast="true"`, independiente del tema): fuerza negro/blanco puros + acento amarillo, para máxima legibilidad por encima de la marca.

### Tipografía

- Títulos: `Georgia` / slab-serif del sistema — remite a letrero de taller, no a serif editorial de alto contraste.
- Cuerpo: sans-serif humanista del sistema (`Avenir Next` / `Segoe UI` / `system-ui`).

### Forma del layout — app shell flotante

```
┌───────────────────────────────────────────────────────────────┐
│  fondo "--color-backdrop" (arena oscuro)                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Trato      [ Buscar ] [ Publicaciones ] [ Mi perfil ]     │  │ ← barra superior
│  │                 switch Cliente|Prestador  A A+ A++ ⬤ ⊙   │  │   (pill-tabs + icon cluster)
│  ├───────────┬─────────────────────────────────────────────┤  │
│  │  Buscar   │  <h1>Encuentra a alguien de confianza</h1>    │  │
│  │  servicios│                                                │  │
│  │  Mi perfil│  ┌───────────────────────────────────────┐    │  │
│  │  Publica- │  │ [Identidad verificada]                  │    │  │
│  │  ciones   │  │ Instalación eléctrica residencial       │    │  │ ← tarjeta: esquinas
│  │           │  │ Electricidad · Chihuahua centro         │    │  │   redondeadas,
│  │  Enlaces  │  │ $450 MXN                                 │    │  │   sombra suave,
│  │  Editar   │  └───────────────────────────────────────┘    │  │   se eleva al hover
│  │  prestador│  ┌───────────────────────────────────────┐    │  │
│  │  Panel    │  │ ...siguiente tarjeta...                 │    │  │
│  │  admin    │  └───────────────────────────────────────┘    │  │
│  └───────────┴─────────────────────────────────────────────┘  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

- Todo vive dentro de un panel con esquinas muy redondeadas (`--radius-lg: 24px`) y sombra suave, sobre un fondo de respaldo un tono más oscuro — efecto "flotante".
- **Barra superior**: logo, pestañas tipo pastilla (la activa tiene fondo blanco + sombra), clúster de controles a la derecha (tamaño de texto, alto contraste, switch de rol, avatar + salir).
- **Sidebar izquierdo** (solo con sesión iniciada; se oculta en pantallas angostas): accesos directos a Buscar, Mi perfil, Publicaciones, y una sección "Enlaces" con edición de prestador y panel admin.
- **Tarjetas**: esquinas redondeadas (16px), sombra en dos capas, se elevan 3px y la sombra crece al pasar el mouse. Entrada animada (fade + slide escalonado) respetando `prefers-reduced-motion`.
- **Insignia de confianza**: siempre ícono (✓) + texto ("Identidad verificada"), nunca un color solo.

### Vista "Mi perfil" (adapta cliente/prestador en la misma pantalla)

```
┌─────────────────────────────────────────┐
│  (●)  Nombre del usuario                 │
│       correo@ejemplo.com                 │
├─────────────────────────────────────────┤
│  Datos de cliente                        │
│  Correo: ...                             │
│  Teléfono: ... — verificado/sin verificar│
│  [ Número de teléfono ] [Verificar]      │
├─────────────────────────────────────────┤
│  Datos de prestador de servicios         │
│  (si no activo) → botón "Activar perfil" │
│  (si activo) → oficio/zona/precio/       │
│     estado de identidad + "Editar datos" │
└─────────────────────────────────────────┘
```

---

## Accesibilidad

Implementada de forma real, no como placeholder (la población objetivo incluye adultos mayores, baja escolaridad y discapacidad visual/auditiva):

- Tamaño de texto ajustable (`A` / `A+` / `A++`) y modo alto contraste, persistidos en `localStorage` (`AccessibilityContext`).
- HTML semántico, `aria-label`/`aria-describedby`/`aria-pressed` en controles interactivos, `role="alert"`/`role="status"` en errores y confirmaciones.
- Objetivos táctiles de mínimo 44px, foco de teclado visible (`:focus-visible`).
- Paleta con pares de color distinguibles sin depender solo del matiz (ocre vs. verde-azulado, no rojo/verde).
- Animaciones respetan `prefers-reduced-motion: reduce`.
- `lang="es-MX"` en el documento.

---

## Seguridad — qué falta para producción

- `/admin/verificaciones` hoy solo exige sesión iniciada, **no** un rol de administrador real. Falta un custom claim de Firebase Auth (`admin: true`) verificado en `backend/src/middleware/auth.middleware.ts` antes de llegar a `adminController`.
- `firestore.rules` y `storage.rules` ya bloquean toda escritura directa desde el cliente — todas las escrituras pasan por el backend (Firebase Admin SDK), que es quien aplica `providerEligibility.service.ts`.
- La verificación de identidad es **simulada**: no hay integración con un servicio real de verificación documental, solo revisión manual de las fotos subidas.
