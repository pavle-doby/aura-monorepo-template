# Architecture

High-level map of the monorepo. Each node is a workspace package or app; arrows indicate major dependency directions (consumers → providers).

```
aura-monorepo-template/           # pnpm + Turborepo monorepo
│
├── apps/                         # Deployable applications
│   ├── api/                      # REST API (Express 5, Node >=22)
│   │   ├── src/modules/          #   auth, users, health
│   │   ├── src/middleware/       #   Auth (Supabase JWT), validation, roles, pagination, errors
│   │   ├── src/routes/           #   /api: public (/v1/auth, /v1/health) and private (/v1/users)
│   │   ├── src/openapi/          #   Generates openapi.json from code
│   │   └── openapi.json          #   OpenAPI 3.1 spec (generated, consumed by Orval)
│   │
│   ├── web/                      # Next.js 16 web app (React 19, App Router), installable PWA
│   │   └── app/                  #   auth/[mode], home (/), settings
│   │
│   └── native/                   # Expo SDK 57 app (iOS/Android), second client of the same API
│       ├── src/app/              #   Expo Router: (auth) login/signup, (app)/(tabs) home/settings
│       └── metro.config.js       #   NativeWind + resolves @react-navigation/native from expo-router
│
├── packages/                     # Shared libraries (workspace:*)
│   ├── db-schema/                # Drizzle table + relation definitions (source of truth)
│   │   └── src/schemas/          #   users, user-preferences, enums, relations
│   ├── db/                       # Drizzle client, migrations (drizzle/), env
│   ├── contract/                 # Zod schemas + shared DTO types (drizzle-zod derived), typed errors
│   ├── api-client/               # Auto-generated React Query hooks (Orval)
│   │   ├── src/generated/        #   ⚠️ DO NOT EDIT — regenerate via pnpm api-client:generate
│   │   └── src/lib/apiClient.ts  #   Axios instance with bearer token + refresh
│   ├── shared/                   # Client hooks: API error → localized message, Zod locale
│   ├── i18n/                     # i18next for web, SSR and native (`react-native` export)
│   │   └── src/locales/{sr,en}/  #   Serbian (default) and English
│   ├── ui-web/                   # Web component library (shadcn/Radix, Tailwind 4)
│   ├── ui-native/                # React Native components (NativeWind v4, rn-primitives)
│   ├── ui-theme/                 # Design tokens shared by web and native
│   ├── eslint-config/            # Shared ESLint rules (base, next, react-internal)
│   └── typescript-config/        # Shared tsconfig presets (base, nextjs, react-library)
```

### API module organization

Each feature in `apps/api/src/modules/` follows the same layout:

```
<feature>/
├── routes/        # Express routers and middleware chain
├── controllers/   # Read res.locals, call service, send response
├── services/      # Business logic, typed errors
├── repository/    # Drizzle queries only
└── openapi/       # OpenAPI path registrations
```

## Auth flow

1. Client calls `POST /api/v1/auth/signup` or `/login`. The API authenticates with Supabase Auth, creates or reads the `users` row (plus `user_preferences`), and returns `{ user, preferences, accessToken, refreshToken }`.
2. Clients store the tokens (web: `localStorage`, native: SecureStore) and send `Authorization: Bearer <accessToken>`.
3. `handleAuth` verifies the token with Supabase on every private route and puts the Supabase user in `res.locals.user`.
4. On a 401 the Axios client calls `POST /api/v1/auth/refresh` once, retries, and otherwise signs the user out.
5. Forgot password emails a Supabase recovery link to `<WEB_APP_URL>/auth/reset`; the reset form posts the token hash and new password to `/api/v1/auth/reset-password`.

## Data flow

```
┌──────────────────────────────────────────────────────────────────┐
│  db-schema  ──(drizzle-zod)──▶  contract  ──▶  api (validation)  │
│      │                               │                           │
│      ▼                               ▼                           │
│     db  ◀──── api (queries) ◀──── Supabase PostgreSQL            │
│                   │                                              │
│                   ▼                                              │
│            openapi.json  ──(Orval)──▶  api-client                │
│                                            │                     │
│                                    ┌───────┴───────┐             │
│                                    ▼               ▼             │
│                                   web            native          │
└──────────────────────────────────────────────────────────────────┘
```

## Key decisions

| Decision         | Choice                                | Why                                                              |
| ---------------- | ------------------------------------- | ---------------------------------------------------------------- |
| API style        | REST + OpenAPI                        | Enables Orval code-gen; type-safe across all clients             |
| Auth             | Supabase Auth (JWT)                   | API client supplies and refreshes bearer tokens                  |
| DB               | Drizzle ORM + PostgreSQL via Supabase | Type-safe SQL-first; schema-to-Zod via drizzle-zod               |
| Schema ownership | `db-schema` → `contract`              | Single source of truth; prevents drift between DB and validation |
| API client       | Orval (code-gen)                      | `src/generated/` is always in sync with `openapi.json`           |
| Styling          | Tailwind 4 (web), NativeWind (native) | Shared token values via `ui-theme`                               |
| i18n             | i18next                               | Serbian default and English secondary                            |
| Build            | Turborepo                             | Task graph, caching, watch mode across all packages              |
