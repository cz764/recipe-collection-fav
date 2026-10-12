# Repository guidance

## Purpose and scope

Build a concise, ad-free collection of favorite recipes, focused on finding and cooking recipes. Keep changes small and reviewable. Preserve existing user edits and follow the requested scope; a documented future decision is not permission to implement it.

Read [docs/decisions.md](docs/decisions.md) for relevant decisions, implementation status, and open work. Keep durable guidance here and decision rationale there. Do not recreate a session-history or handoff file.

## Project structure

- `app/`: Next.js App Router pages, layouts, route loading states, and the `app/api/recipes` route handler that serves later result pages.
- `src/server/`: backend code that runs only in the Node.js server. `recipes.ts` reads Supabase through the client in `supabase.ts`, and `recipeRow.ts` validates rows into `Recipe`. Every module here starts with `import 'server-only'`, which fails the build if a client component imports it. Keep Supabase calls here.
- `src/api/`: browser-side calls to this app's own HTTP routes, currently `recipesClient.ts` for later result pages.
- `src/data/`: shared types and the example recipes, which now serve as seed data and test fixtures.
- `supabase/`: CLI config and SQL migrations. Enums there mirror `src/constants/recipe.ts`; change both together.
- `scripts/`: `seed-supabase.mjs` uploads example images and upserts the example recipes (`npm run seed:supabase`, reads `.env.local`).
- `src/components/`: UI components. Follow nearby component-folder and index-export conventions; keep small skeleton helpers beside their parent.
- `src/utils/`: reusable parsing and matching logic.
- `src/constants/`: shared constants.
- `src/hooks/`: reusable React hooks.
- `__tests__/` beside components or modules: Vitest and Testing Library tests.
- `public/`: local static assets and original example images.
- `src/globals.css`: shared styles and Tailwind/HeroUI setup.

## Implementation conventions

- Use TypeScript, the `@/` alias for `src/`, and existing Prettier configuration. Follow local component and naming patterns instead of introducing another styling or UI system.
- `Home` awaits URL search parameters. `RecipeLoader` normalizes them and calls data functions. Pass parsed filters through props to the results section and toolbar; derive URL summaries without copying them into state or effects.
- Results arrive as `RecipePage` objects. The server renders page one; `useRecipePages` fetches later pages from the route handler. Do not slice results on the client.
- Keep featured-recipe selection separate from filtered results. Keep backend access in the data layer rather than presentation components. Supabase env variables live in `.env.local` and stay server-only (no `NEXT_PUBLIC_` prefix): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` for the seed script only.
- Reuse `RecipeImage` for homepage recipe photos, including its responsive sizing and loading placeholder. Preserve reduced-motion support.
- Keep container widths independent of result count and loading state. Check empty results as well as populated results when changing layout.
- Treat current breakpoints as design choices that may change deliberately; consult the layout decision before altering them.
- For visual bugs, distinguish rerendering, remounting, layout changes, and overlay effects. Do not present an unverified hypothesis as the cause.

## Verification and review

- Run checks appropriate to the change. Useful commands with dependencies installed:
  - `npm run test -- --run <test-path>` for relevant tests.
  - `npx --no-install tsc --noEmit --incremental false` for TypeScript changes.
  - `npx --no-install prettier <changed-files> --check` for formatting.
  - `git diff --check` for whitespace errors in tracked diffs.
- Add behavior tests when they protect meaningful logic; do not add tests merely to assert CSS class strings. Documentation-only edits need structural/link checks, not an application test run.
- Tests never reach Supabase: mock `@/server/supabase` for data-layer tests and `@/server/recipes` for components, and build recipes with `makeRecipe` from `src/components/__tests__/mockData.ts` instead of the example fixtures. `vitest.setup.ts` stubs `server-only` so server modules can be imported in tests.
- Browser verification is needed to establish visual behavior; unit tests alone cannot prove that flicker or layout shifts are resolved. For responsive changes, use `.agents/skills/verify-recipe-breakpoints/SKILL.md` when available.
- Report what changed, checks performed, and any unverified behavior. Do not claim a browser check that was not run.
- Leave final review, further modifications, staging, commits, and pushes to the user unless they explicitly request otherwise. Do not automatically commit or push.
- Update affected decisions alongside intentional architecture or behavior changes. Keep accepted decisions, proposals, and unresolved bugs clearly distinguished.
