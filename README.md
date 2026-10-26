# Aura Monorepo Template

A full-stack starter: web PWA, native app, and REST API in one pnpm + Turborepo monorepo. Only authentication is implemented (sign up, log in, log out, token refresh, forgot/reset password) plus the signed-in user's profile and preferences, so you can build features on top of a working architecture.

## Tech stack

| Layer        | Tech                                                        |
| ------------ | ----------------------------------------------------------- |
| Web          | Next.js 16 (App Router), React 19, Tailwind 4, shadcn/Radix |
| Native       | Expo SDK 57, Expo Router, NativeWind v4                     |
| API          | Express 5, Node >=22, Pino, OpenAPI 3.1                     |
| DB           | PostgreSQL (Supabase), Drizzle ORM, drizzle-kit             |
| Auth         | Supabase Auth with access and refresh tokens                |
| Shared types | `@repo/contract` (Zod schemas, drizzle-zod derived)         |
| API client   | Orval -> React Query + Axios (auto-generated)               |
| i18n         | i18next — Serbian (default), English                        |
| Build        | Turborepo, pnpm workspaces                                  |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the directory map, data flow, and key decisions.

## What's included

- **API**: `auth` (signup, login, signout, refresh, forgot/reset password), `users` (self, preferences, admin CRUD with pagination), `health`.
- **DB**: `users` and `user_preferences` tables (theme + language).
- **Web**: `/auth/{login,signup,forgot,reset}`, protected `/` (home) and `/settings` (theme + language), sidebar / mobile nav, PWA manifest + offline page.
- **Native**: `(auth)` login/signup, `(app)/(tabs)` home and settings, SecureStore tokens with refresh.

## Start a new project

Full step-by-step guide (Supabase setup, env values, troubleshooting): [README.template.md](./README.template.md). Short version:

1. Copy this folder and rename it. Search and replace `Aura` / `aura` (app name, `app.json` bundle IDs, token storage keys, `metadata` locale).
2. `git init` (if not already) and `pnpm install`.
3. Create a Supabase project. Copy the env templates and fill them in:
   - `apps/api/.env.example` → `apps/api/.env`
   - `apps/web/.env.example` → `apps/web/.env`
   - `apps/native/.env.example` → `apps/native/.env`
   - `packages/db/.env.example` → `packages/db/.env`
4. Create the first migration and apply it:

   ```bash
   pnpm db:generate --name init
   pnpm db:migrate
   ```

5. Generate the API client: `pnpm api-client:generate`.
6. Run it: `pnpm dev` (or `pnpm api`, `pnpm web`, `pnpm ios`, `pnpm android`).

For password reset emails, add `<WEB_APP_URL>/auth/reset` to the Supabase Auth redirect URLs.

## Scripts

```bash
# Build & quality
pnpm build
pnpm lint
pnpm typecheck
pnpm format

# API client (run after any route/schema change)
pnpm api-client:generate

# Database
pnpm db:generate --name <name>   # Generate Drizzle migration files
pnpm db:push                     # Push schema to DB (dev)
pnpm db:migrate                  # Run pending migrations
pnpm db:studio                   # Drizzle Studio UI
```

`pnpm typecheck` relies on project references, so run `pnpm build` once on a fresh clone first.

## Tunnels

Expose local apps to the internet with `cloudflared`, e.g. for webhook or PWA testing:

```bash
cloudflared tunnel --url http://localhost:7007   # API
cloudflared tunnel --url http://localhost:3000   # Web
```

## Deploy

See [README.deploy.md](./README.deploy.md) for the Railway setup (API and web as two services).

## Dev guide

See [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md) for conventions and the step-by-step guide for adding a feature.
