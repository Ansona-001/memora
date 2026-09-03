# Memora

A private, Netflix-inspired photo and video memory application for couples,
built with React, TypeScript, Vite, Material UI, and Supabase.

See [docs/product-requirements.md](docs/product-requirements.md) for the full
product and architecture specification.

## Prerequisites

- Node.js 20+
- pnpm
- Docker Desktop (for the local Supabase stack)

## Setup

Install dependencies:

```bash
pnpm install
```

Copy the environment template and fill in your Supabase project values:

```bash
cp .env.example .env
```

### Local Supabase

Start the local Supabase stack (requires Docker):

```bash
npx supabase start
```

This prints a local API URL and anon key — put them in `.env` as
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Stop the stack with
`npx supabase stop`.

Apply database migrations:

```bash
npx supabase db reset
```

## Development

```bash
pnpm dev
```

## Scripts

| Script                 | Description                                    |
| ----------------------- | ----------------------------------------------- |
| `pnpm dev`              | Start the Vite dev server                       |
| `pnpm build`            | Type-check and build for production             |
| `pnpm preview`          | Preview the production build locally            |
| `pnpm lint`              | Run ESLint                                       |
| `pnpm format`           | Format the codebase with Prettier                |
| `pnpm format:check`     | Check formatting without writing changes         |
| `pnpm typecheck`        | Run the TypeScript compiler with no output       |
| `pnpm test`             | Run unit tests once with Vitest                  |
| `pnpm test:watch`       | Run unit tests in watch mode                     |
| `pnpm test:coverage`    | Run unit tests with coverage                     |
| `pnpm e2e`              | Run Playwright end-to-end tests                  |
| `pnpm validate`         | Run format check, lint, typecheck, tests, build  |

Run `pnpm validate` before considering any change complete.

## Project structure

See [docs/product-requirements.md](docs/product-requirements.md) section 3
for the full repository layout and section 21 for the phased build plan this
project follows.
