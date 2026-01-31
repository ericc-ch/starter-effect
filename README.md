# Verion

## Tech Stack

- **API** (`apps/api`): Hono, oRPC, Better Auth, Drizzle ORM
- **Web** (`apps/web`): Vite, React, TanStack Router + Query, Tailwind CSS v4, shadcn/ui
- **Shared** (`packages/shared`): oRPC contracts, Drizzle schemas, Zod validation
- **Database**: SQLite via Cloudflare D1
- **Deployment**: Cloudflare Workers via Alchemy

## Prerequisites

- Node.js 20+
- pnpm 10+

## Getting Started

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy environment files and fill in the values:

   ```sh
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

   Generate secrets with:

   ```sh
   openssl rand -base64 32
   ```

3. Start the dev server:

   ```sh
   pnpm run dev
   ```

## Scripts

| Command              | Description           |
| -------------------- | --------------------- |
| `pnpm run dev`       | Start all services    |
| `pnpm run typecheck` | Run TypeScript checks |
| `pnpm run test`      | Run tests with Vitest |
| `pnpm run lint`      | Lint with oxlint      |
| `pnpm run format`    | Format with Prettier  |

## Project Structure

```
apps/
  api/          # Hono API with oRPC
  web/          # Vite + React frontend
packages/
  shared/       # Shared contracts and schemas
```
