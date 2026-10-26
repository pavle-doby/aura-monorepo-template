# Starting a New Project from the Template

Step-by-step guide to turn `aura-monorepo-template` into a new, running project from zero. Follow it top to bottom; each step assumes the previous one is done.

In the examples below the new project is called **Aura** (`aura`). Replace it with your own name.

## 0. Prerequisites

| Tool        | Version | Check                       |
| ----------- | ------- | --------------------------- |
| Node.js     | >= 22   | `node -v`                   |
| pnpm        | 11      | `pnpm -v`                   |
| Git         | any     | `git --version`             |
| Xcode       | latest  | iOS simulator (optional)    |
| Android SDK | latest  | Android emulator (optional) |

Install pnpm with `corepack enable` if it's missing (the exact version is pinned in `package.json` → `packageManager`).

You also need a free [Supabase](https://supabase.com) account.

## 1. Copy the template

Copy only the source, not `node_modules`, build output, or the template's git history:

```bash
cd ~/Projects
rsync -a \
  --exclude node_modules --exclude .next --exclude dist --exclude .turbo \
  --exclude .git --exclude .expo --exclude '*.tsbuildinfo' \
  aura-monorepo-template/ aura/
cd aura
git init -b main
```

## 2. Rename the project

Search for `aura` / `Aura` (case-insensitive) and replace it. Every place that matters:

| File                                            | What to change                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `package.json`                                  | `"name"`                                                            |
| `apps/api/src/openapi/spec.ts`                  | `info.title` (`"Aura API"` → `"Aura API"`) — see note below         |
| `packages/api-client/src/index.ts`              | `./generated/auraAPI.schemas` → `./generated/auraAPI.schemas`       |
| `apps/web/app/layout.tsx`                       | `applicationName`, `appleWebApp.title`                              |
| `apps/web/app/manifest.ts`                      | `name`, `short_name`, `description`                                 |
| `apps/web/public/offline.html`                  | `<title>` and the text                                              |
| `apps/web/public/sw.js`                         | `CACHE_NAME` (e.g. `aura-static-v1`)                                |
| `apps/web/utils/token-storage.ts`               | token keys (`aura_access_token`, `aura_refresh_token`)              |
| `apps/native/src/utils/token-storage.ts`        | token keys (same as web)                                            |
| `apps/native/app.json`                          | `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package` |
| `packages/i18n/src/locales/{en,sr}/metadata.ts` | `title`, `description`                                              |
| `packages/i18n/src/locales/{en,sr}/home.ts`     | `starter` text                                                      |
| `README.md`, `ARCHITECTURE.md`, `AGENTS.md`     | project name and description                                        |

> **OpenAPI title → generated file name.** Orval names the generated schemas file after the OpenAPI title: `"Aura API"` produces `src/generated/auraAPI.schemas.ts`. Change the title and the `index.ts` export together, or the API client import breaks.

Quick check that nothing was missed:

```bash
grep -rni "aura" . --exclude-dir=node_modules --exclude-dir=.git --exclude=pnpm-lock.yaml
```

The bundle ID / package (`com.aura.app`) must be unique if you ever publish to the App Store or Play Store; pick it now, since changing it later means a new app listing.

### Branding assets

Replace the placeholder images (keep the same file names and sizes):

- Web: `apps/web/public/favicon.png`, `apps/web/public/icons/*` (PWA icons, including the `maskable` ones), `apps/web/app/favicon.ico`
- Native: `apps/native/assets/images/*` and `apps/native/assets/expo.icon/`

Theme colors live in `@repo/ui-theme` (`packages/ui-theme/src/web/index.css` and `src/native/tokens.ts`). The web `themeColor` is in `apps/web/app/layout.tsx` and `manifest.ts`.

## 3. Install dependencies

```bash
pnpm install
```

This also sets up the Husky pre-commit hook (eslint + prettier on staged files).

## 4. Create the Supabase project

1. In the Supabase dashboard, create a new project. Save the database password.
2. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key**.
3. **Project Settings → Database → Connection string**: copy the **Transaction pooler** URI (port `6543`) and put your password in it. The DB client uses `prepare: false`, which matches the transaction pooler.
4. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (change to the production web URL later).
   - **Redirect URLs**: add `http://localhost:3000/auth/reset` (and the production `https://<web-domain>/auth/reset` later). Without this, password reset links don't work.
5. **Authentication → Sign In / Providers → Email**: decide on **Confirm email**.
   - **Off** (easiest for development): signup returns tokens and the user is logged in right away.
   - **On**: signup creates the account but returns empty tokens until the user confirms the email; they then log in normally.

## 5. Environment files

Copy each template and fill in the values from step 4:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/native/.env.example apps/native/.env
cp packages/db/.env.example packages/db/.env
```

| File               | Variable              | Value                                                                           |
| ------------------ | --------------------- | ------------------------------------------------------------------------------- |
| `apps/api/.env`    | `SUPABASE_URL`        | Project URL                                                                     |
|                    | `SUPABASE_API_KEY`    | anon / publishable key                                                          |
|                    | `DATABASE_URL`        | Transaction pooler URI                                                          |
|                    | `CORS_ENABLED_URL`    | `http://localhost:3000` (comma-separated origins)                               |
|                    | `WEB_APP_URL`         | `http://localhost:3000` (used in password reset links)                          |
| `packages/db/.env` | `DATABASE_URL`        | Same URI as the API (drizzle-kit uses it for migrations)                        |
| `apps/web/.env`    | `NEXT_PUBLIC_API_URL` | `http://localhost:7007/api`                                                     |
| `apps/native/.env` | `EXPO_PUBLIC_API_URL` | `http://localhost:7007/api` (see the comment in the file for emulators/devices) |

`.env` and `.env.local` files are gitignored. Both are loaded, but values in `.env` win over `.env.local`, and real environment variables win over both.

## 6. Create the database tables

The template ships without migrations, so the first one is generated from the schema in `packages/db-schema` (`users`, `user_preferences`, and their enums):

```bash
pnpm db:generate --name init   # writes packages/db/drizzle/0000_init.sql
pnpm db:migrate                # applies it to Supabase
```

Open `packages/db/drizzle/0000_init.sql` before migrating if you want to see what will be created. Commit the `drizzle/` folder; every later schema change gets its own migration the same way.

`pnpm db:studio` opens Drizzle Studio to browse the data.

## 7. Generate the API client

```bash
pnpm api-client:generate
```

This writes `apps/api/openapi.json` from the route registrations, then generates the React Query hooks in `packages/api-client/src/generated/`. Both are gitignored, so run this after every fresh clone and after any route or contract change.

## 8. Build once and verify

```bash
pnpm build
pnpm typecheck
pnpm lint
```

Run `pnpm build` before the first `pnpm typecheck`: the packages use TypeScript project references, and typecheck needs their build output.

## 9. Run it

```bash
pnpm dev        # API + web together
# or separately:
pnpm api        # http://localhost:7007  (health: /api/v1/health)
pnpm web        # http://localhost:3000
pnpm ios        # native, iOS simulator
pnpm android    # native, Android emulator
```

Smoke test:

1. Open `http://localhost:3000` → you're redirected to `/auth/login`.
2. Sign up → you land on the home page with your name and email.
3. Settings → change theme and language; reload, they stick.
4. Log out → back to the login page.
5. Forgot password → the email link opens `/auth/reset` and sets a new password.

The first native run builds the app (a few minutes). The native app needs a development build, not Expo Go; after changing `app.json` or adding a native library, run `npx expo prebuild --clean` in `apps/native` and rebuild.

### Make yourself an admin

Admin-only routes (`GET/POST/DELETE /api/v1/users`) check `users.role`. To promote your account, set `role` to `admin` on your row in Drizzle Studio or the Supabase table editor.

## 10. First commit

```bash
git add .
git commit -m "Init project from aura-monorepo-template"
```

Then create the remote repository and push. CI (`.github/workflows/ci.yml`) builds the API and web on pushes and PRs to `main`.

## 11. Deploy (when ready)

Follow [README.deploy.md](./README.deploy.md) to deploy the API and web as two Railway services. Afterwards, update:

- API `CORS_ENABLED_URL` and `WEB_APP_URL` → production web origin
- Web `NEXT_PUBLIC_API_URL` → `https://<api-domain>/api` (baked in at build time; redeploy after changing)
- Supabase **Site URL** and **Redirect URLs** → production web URL and `/auth/reset`
- Run migrations against the production database: `DATABASE_URL='<prod-uri>' pnpm db:migrate` (an exported variable wins over `packages/db/.env`)

## 12. Build your first feature

Follow the "End-to-end feature workflow" in [CLAUDE.md](./CLAUDE.md): `db-schema` table → migration → `contract` schemas and error codes → error messages + translations → API module → `pnpm api-client:generate` → web/native UI. The `users` module is the reference for every layer.

## Optional tooling

- **CodeGraph** (code navigation for AI agents): `codegraph init` at the repo root. `.mcp.json` already registers it for Claude Code.
- **shadcn MCP**: configured in `opencode.jsonc` for component context in `apps/web`.
- **Tunnels** (test webhooks or the PWA on a phone): `cloudflared tunnel --url http://localhost:7007` or `:3000`.

## Troubleshooting

| Symptom                                               | Fix                                                                                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Cannot find module './generated/...'`                | Run `pnpm api-client:generate`; check the `index.ts` export matches the OpenAPI title.             |
| `TS6305: Output file ... has not been built`          | Run `pnpm build` once, then `pnpm typecheck`.                                                      |
| Browser shows a CORS error                            | Add the exact web origin (no trailing slash) to `CORS_ENABLED_URL`, restart the API.               |
| Login works but every request is 401                  | `SUPABASE_URL` / `SUPABASE_API_KEY` in the API point to a different project than you signed up in. |
| Signup succeeds but the user isn't logged in          | Email confirmation is on in Supabase (step 4.5); confirm the email, then log in.                   |
| Reset link opens the Supabase site, not `/auth/reset` | Add `<WEB_APP_URL>/auth/reset` to Supabase Redirect URLs and check `WEB_APP_URL`.                  |
| `db:migrate` hangs or fails to connect                | Use the pooler URI with the password filled in; check `packages/db/.env`.                          |
| Native app can't reach the API                        | Android emulator needs `10.0.2.2`, a physical device needs your machine's LAN IP.                  |
| `native` typecheck can't find `@/global.css`          | Run `npx expo start` once in `apps/native`; it generates `expo-env.d.ts`.                          |
