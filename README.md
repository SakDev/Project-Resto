# Resto

Security-first infrastructure scaffold for a collaborative restaurant picker app.

## What is included

- Next.js App Router + TypeScript
- Tailwind CSS UI foundation
- React Query provider setup
- Typed domain models for rooms, members, restaurants, votes, and ranking
- API route skeletons for room creation, room join, health, and restaurant search
- Server-only provider abstraction with mock fallback
- Supabase-ready browser/server client stubs
- Environment validation via Zod
- Middleware-based security headers and CSP
- Initial SQL migration scaffold for rooms / members / restaurants / votes

## Security posture of this scaffold

- Third-party restaurant providers are expected to be called **server-side only**.
- Environment variables are validated on boot.
- API routes validate JSON payloads before domain logic executes.
- Middleware adds CSP and several protective response headers.
- Next.js `poweredByHeader` is disabled.
- Supabase service-role usage is isolated to server-only modules.

## Local development

1. Copy env template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your secrets later when ready.

3. Install / verify packages:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Validate the scaffold:

   ```bash
   npm run check
   npm run build
   ```

## Project structure

```text
src/
  app/                  App Router pages + API routes
  components/           UI and provider components
  features/             Domain modules (rooms, restaurants, voting)
  lib/                  Config, env, security, supabase, utilities
  types/                Shared types
supabase/migrations/    SQL scaffolding for later Supabase setup
```

## Agent handoff / project philosophy

See [`AGENTS.md`](./AGENTS.md) for the authoritative product philosophy, mobile-first design rules, security posture, and iteration guidance for future agents or contributors.

## What still needs wiring

- Real Supabase schema deployment and RLS policies
- Real Google Places adapter implementation
- Auth and guest-session persistence
- Realtime subscriptions / presence
- Production analytics and monitoring
- Test suite (unit, integration, e2e)

## Recommended next implementation steps

1. Add real Supabase credentials to `.env.local`.
2. Apply `supabase/migrations/0001_initial_schema.sql` in your Supabase project.
3. Replace the mock restaurant provider with a Google Places adapter.
4. Persist room creation and join flows into Supabase.
5. Add vote APIs and result finalization service.
