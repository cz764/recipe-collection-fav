# Project decisions

Last updated: October 12, 2026. This document records durable decisions and current open work. Implementation status is separate from acceptance; accepted future work is not implemented automatically.

## URL filters and data flow

**Status:** Cuisine/meal/type/tag filtering, submitted text search, and prop-based summaries are URL-driven. Grouped All Recipes navigation and a direct Bakery link are implemented; browser verification is pending.

**Decision:** `Home` awaits `searchParams`, then passes resolved values to `RecipeLoader`. The loader parses cuisine/meal/type/tag/q and passes normalized filters through `RecipeDisplaySection` to `SearchAndFilterBar`. Summaries derive directly from props, without synchronization effects or a second state copy.

**Reason:** Explicit data flow makes shared links, browser navigation, and a future backend easier to reason about.

**Consequences:** Values are trimmed and matched case-insensitively; all fields combine with AND. Repeated parameters use the first value, blanks are ignored, and unknown values yield no results. The URL-based Suspense key resets results state when cuisine/meal/type/tag/q changes, resetting pagination and initializing the search draft from the URL. Enter or the search button submits trimmed text as `q`, preserving other query parameters and scroll position. Empty submission removes `q`. Typing and clearing alone only edit the draft. Search text keeps its casing for display; matching is case-insensitive using the existing text matcher in the data layer. Browser history and shared URLs carry the applied search.

## Recipe classification

**Status:** Implemented in the model, fixtures, filtering, and existing meal links. Navigation redesign remains pending.

**Decision:** Shared readonly constants in `src/constants/recipe.ts` define the unions. `cuisine: Cuisine` is required, with `unknown` for recipes without an assigned cuisine. Mexican is a subset of Latin American for filtering, not the reverse. `meal: MealType` replaces the former meal-valued `type`. The new `type: TypeCollection[]` supports multiple dish classifications: appetizer, soup, bakery, entree, side dish, and other. Reserve other for recipes without a more specific classification.

**Decision:** Bakery means baked goods such as breads, cakes, pastries, and muffins, not all oven dishes. `tags: RecipeTag[]` uses curated dietary, product, and preparation labels. Chocolate stays in ingredients; tangzhong remains in recipe instructions rather than the tag vocabulary. Cuisine and meal are no longer duplicated in tags.

**Consequences:** Plain loaves use unknown cuisine; milk bread keeps Japanese cuisine. Cornbread biscuits are bakery/side dish, egg bites are entree, and dumplings are appetizer/entree. These editorial assignments can be reviewed independently. Type filters match any assigned type; separate query fields combine with AND. Existing breakfast/dessert navigation links now use `?meal=...`; old `?type=breakfast` links are not aliased. `?type=bakery` uses the new dish classification. Unknown cuisine is now valid; use `/?cuisine=invalid-cuisine` for empty-result checks (including in place of the older breakpoint skill example).

**Boundary:** TypeScript constrains authored data; database rows are validated at runtime by `toRecipe` in `src/server/recipeRow.ts` before being treated as Recipe values, and the Postgres enums enforce the same vocabularies on write.

## Daily featured recipes

**Status:** Implemented against the Supabase collection (October 12, 2026).

**Decision:** `fetchFeaturedRecipes()` returns up to three distinct recipes for the server's local calendar day. `TopRecipes` renders the selection in order, with the first as Today's Recipe. `fetchRecipes(filters)` serves the independent results list.

**Reason:** Landing-page recommendations are independent of filtered results. Featured recipes are omitted from filtered/search views, including empty results.

**Consequences:** `selectFeaturedRecipes` in `src/utils/featured.ts` seeds a small deterministic generator with the local date and draws three distinct recipes from the whole collection, so the picks look random but stay fixed until the day changes. The day is the Node server's local date; there is no scheduled job or database cache. Both loaders share one collection read per request through React `cache`.

## Responsive layout and image loading

**Status:** Implemented; earlier visual checks confirmed the main layout and image improvements.

**Decision:** Main content is full width below 1280px and centered at 80% from 1280px. Featured sections stack below 1280px. The results grid has one column below 768px, two from 768px, and three from 1024px. Navigation collapses below 1024px.

**Reason:** The previous 80% width and side-by-side featured layout were too cramped near 1052px. Content-dependent sizing also made empty results change page width.

**Consequences:** `main` uses auto horizontal margins, without `place-items-center`; the homepage wrapper fills its available width. Results reserve a 24rem minimum height, an empty-state message, and pagination space. These reduce collapse but do not guarantee identical page heights for different result counts.

**Decision:** Use separate Suspense boundaries for featured recipes and results. `FeaturedRecipeLoader` has a stable boundary; only `RecipeLoader` is keyed by URL filters. Each has its own skeleton. The route loading state reads the URL to show featured placeholders only for landing views; its pre-resolution fallback shows only results placeholders. Featured data is fetched only when the landing view renders; this is not a daily data cache. Use Next.js Image through `RecipeImage` for homepage photos, with responsive sizes, lazy loading for cards, and priority for Today's Recipe. The details route's `loading.tsx` renders `RecipeDetailSkeleton` (October 13, 2026), which mirrors the `RecipeContent` layout, in place of the earlier full-page spinner; the generic `Loader` component was removed with it. The skeleton's visual match to the loaded page is not yet browser-verified.

**Reason:** Data readiness does not imply image readiness. Original images were larger than needed for cards.

**Consequences:** Page and image placeholders share a light CSS shimmer that works before hydration and respects reduced motion. Image shimmer stops on success or failure. Square crops and 110% hover zoom are intentional. Tailwind v4's separate `scale` property must be included in the image transition.

## Filter drawer and classification cleanup

**Status:** Drawer and mixed category picker removed. The recipe classification migration is implemented.

**Decision:** Keep one search input and URL-derived summaries. Remove the drawer and mixed category picker because they interrupt page context and duplicate navigation filtering.

**Consequences:** Results no longer apply hidden local category, language, or drawer filters. The loading skeleton also omits these controls. Language filtering has no replacement UI yet.

**Open design:** Design grouped navigation alongside the existing search input. Settle navigation behavior before implementing it. Ingredient/equipment filters and a navigation language control remain proposals. Clarify recipe/source language versus UI language before implementation.

## Supabase integration

**Status:** Accepted and implemented October 12, 2026. The user applied the migration, seeded the project, and confirmed the local dev server works against it.

**Details route:** `/details/<slug>` replaced `/details/<id>` on October 12, 2026. Cards, featured tiles, and Today's recipe link by slug; old id links are not redirected.

**Decision:** Supabase Postgres holds recipe records and Supabase Storage holds images in the public `recipe-images` bucket. The Next.js server is the Node.js backend: `src/server/recipes.ts` reads with `@supabase/supabase-js` over PostgREST, and no separate service or GraphQL layer exists. Everything under `src/server/` imports `server-only`, so a client component importing backend code fails the build; `src/api/` holds only browser calls to the app's own routes. GraphQL was rejected because the app is the only consumer with three fixed queries.

**Schema:** One `recipes` table (`supabase/migrations/`). Postgres enums mirror the cuisine, meal, dish type, tag, and language vocabularies in `src/constants/recipe.ts`; update both together. `ingredients` and `steps` are JSONB arrays; `prep`, `tags`, `type`, and `equipments` are arrays. `picture_path` and step `image_path` store bucket object paths (or absolute URLs). A unique `slug` column (dashed recipe name) backs the `/details/<slug>` route; fixtures carry their slugs explicitly so reseeding upserts the same rows. Row level security allows public reads only; writes go through the dashboard or the service-role seed script. Length limits on name and description are not enforced because existing descriptions exceed the old comment limits.

**Data layer:** `toRecipe` validates every row at runtime against the shared vocabularies before it becomes a `Recipe`, and resolves image paths to public URLs. Invalid rows throw rather than being skipped, so schema drift is loud. Filtering, text search, and paging run in Node over the full collection loaded once per request: `filterRecipes` keeps the existing matcher semantics and `paginateRecipes` returns a `RecipePage` with `total` and `hasMore`. This follows the user's choice to defer database-side search design; moving filters into SQL is a contained change inside `fetchRecipes` when the collection grows. `getRecipeBySlug` serves the details page; an unknown slug calls `notFound()` and query failures reach the route error boundary (see Route error handling).

**Configuration:** `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are server-only (no `NEXT_PUBLIC_` prefix) and read from `.env.local`, which stays untracked; there is no committed example file by the user's choice. `next.config.ts` allows Next.js Image only for the project hostname and the recipe bucket path. `npm run seed:supabase` uploads `public/exampleRecipes` images and upserts the fixtures by slug using `SUPABASE_SECRET_KEY`. The fixtures remain as seed data and as the source for mock-based tests.

**Testing:** Unit tests mock `getSupabaseClient` and cover row mapping, filters, paging, featured selection, and the route handler. Filter semantics live in `src/utils/__tests__/recipe.test.ts` on mock recipes. Integration tests against a real or local Supabase project are not set up.

**Removed:** The Add recipe page. The user is the only author and adds records directly in Supabase; a web form was judged not worth the UX effort.

References: [Supabase Storage](https://supabase.com/docs/guides/storage/quickstart), [bucket access](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Next.js 15 Image](https://nextjs.org/docs/15/app/api-reference/components/image).

## Infinite results loading

**Status:** Accepted and implemented October 12, 2026; browser verification pending.

**Decision:** Results load in pages of `ITEMS_PER_PAGE` from the server, with no client-side slicing. The server render supplies page one. `GET /api/recipes` returns later pages as JSON for the same URL filters plus a `page` parameter, using the same parsing rules as the page loader. Scrolling near the end of the list fetches the next page automatically up to `AUTO_LOAD_LIMIT` (six) times; after that, or whenever the observer is unavailable, a Load more button continues the list. The button is always rendered while more results exist, so the footer stays reachable and the list works without JavaScript observers.

**Reason:** The user preferred infinite scroll over pagination, combined with filters and search, and wanted a cap so the page does not grow without bound.

**Consequences:** `useRecipePages` accumulates pages, reports loading and error states, and ignores stale automatic triggers. The URL-keyed Suspense boundary still resets accumulated pages when filters change. Page numbers are not written to the URL, so a shared link always starts at page one. The earlier HeroUI pagination control and its tests are removed.

## Route error handling

**Status:** Accepted and implemented October 13, 2026; browser verification pending.

**Decision:** `app/error.tsx` is the single route error boundary for both `/` and `/details/<slug>`. It logs the error, explains that recipes could not load, and offers Try again (Next.js `reset`) plus a link home. `app/not-found.tsx` covers unknown routes; `app/details/[slug]/not-found.tsx` gives a recipe-specific message. The details page no longer catches query errors itself: a missing row calls `notFound()`, and any thrown error (Supabase outage, missing env, invalid row) propagates to the boundary.

**Reason:** Before this, `/` had no boundary and showed the Next.js default error page, and the details page reported every failure as a missing recipe, hiding outages. Not-found and failure are different user situations and need different messages.

**Consequences:** The layout fetches nothing, so no `global-error.tsx` is added. The recipes route handler keeps returning a 500 JSON body, and Load more keeps its inline alert; the boundary applies only to server-rendered page content. Tests mock `next/navigation`'s `notFound` to assert which path the details page takes.

## Open work

- On October 12, 2026 the user reported the earlier open items (flicker reassessment, cornbread image request, grouped navigation checks) as done, except the About page. The sections below keep their history.
- **Supabase go-live:** create the project, apply the migration (`supabase link` then `supabase db push`, or paste the SQL into the dashboard), fill `.env.local`, run `npm run seed:supabase`, and verify the homepage, filters, details page, and image optimization in a browser.
- **Browser-verify infinite loading:** automatic loading near the list end, the Load more button after six automatic pages, error and retry, and filter changes resetting the list. This needs more than twelve recipes, or a temporarily lower `ITEMS_PER_PAGE`.
- **Search design session:** decide whether filtering and search move into Postgres, and how the current matcher semantics (partial on name/description/cuisine, exact on tags/ingredients/equipment) carry over.
- TODO: Write the About story and create its page, then uncomment the About navigation item.
- Review recipe-specific classifications as the collection grows; do not silently relabel fixtures as part of unrelated UI work.

## Featured image navigation bug

**Finding:** Breakfast/Dessert navigation previously changed the key of a boundary containing both results and featured recipes, remounting featured images. The user observed the cornbread thumbnail remain pending with `complete: false`, `naturalWidth: 0`, and an empty `currentSrc`; this is not evidence of a successfully loaded image merely hidden by opacity.

**Change:** Move featured fetching/rendering outside the filter-keyed results boundary. The earlier reconciliation test covered preservation of both pending and loaded featured image nodes across meal/search changes. It has since been replaced with tests for the accepted landing-only design. Results still reset their draft and pagination through their own key.

**Verification:** The user retested after the boundary split: the Mexican cornbread thumbnail still hangs in fetching when navigating to Breakfast. The split did not resolve the reported bug. The reconciliation test only establishes component preservation under its test conditions, not successful browser image loading. Root cause remains unresolved; do not claim the remount was the cause of the stalled request.

**Data-layer inspection:** `fetchFeaturedRecipes()` synchronously selects up to three records from local fixtures. It does not fetch image bytes or make network requests. No defect in that selection function has been established; the pending image request is a separate browser/Next.js image-loading path. Future investigation should inspect its exact URL, network timing, optimizer/server logs, and direct image loading before selecting a fix.

**Pause:** Further implementation is deferred at the user’s request. The existing boundary split remains in place for review; revisit the unresolved request in a later session.

## Landing-only featured recipes

**Status:** Accepted September 24, 2026; visibility and loading behavior implemented. The user confirmed the visual check passed.

**Decision:** The homepage keeps featured recipes, search, and the all-recipe grid. Any nonblank supported `cuisine`, `meal`, `type`, `tag`, or `q` selects a results-only view. Derive this from the URL, not navigation history. Blank or unrelated parameters preserve the landing view; invalid nonblank filters still select results/empty state. Repeated parameters follow the existing first-value rule.

**Reason:** Featured recipes support discovery on arrival. After a category selection or search, users see their requested results immediately. This is a product decision, not a fix for the pending cornbread image request.

**Consequences:** Results-only views do not mount `FeaturedRecipeLoader`, call its featured-data function, show the featured skeleton, or render its divider. Returning to an unfiltered URL restores featured recipes. Clearing search while retaining Bakery stays in the results view. Search still combines with category filters using AND. The existing cards, pagination, and empty-state message remain.

**Deferred grid limit:** As the collection grows, consider limiting the homepage grid to roughly one or two pages. Decide the cap and how users reach the rest of the collection alongside pagination versus infinite scroll. No cap is implemented now.

## Grouped recipe navigation

**Status:** Implemented September 24, 2026; the user reported the browser checks done on October 12, 2026.

**Decision:** Navigation exposes All Recipes and Bakery. About is commented out with a TODO until its story/page exists. The separate `NavigationBar/AllRecipes` component uses HeroUI Dropdown, DropdownMenu, and grouped sections, with Next.js links. Desktop and mobile share the menu content; selecting a mobile category closes the navigation menu.

**Groups:** Meal (the shared meal vocabulary), Cuisine (the shared cuisine vocabulary except unknown), Dietary (Vegetarian), and Preparation (One pot). View all recipes returns to `/`, including featured content. Bakery links directly to `/?type=bakery`.

**URL behavior:** A navigation category starts a fresh selection. Search preserves that selection and narrows with AND. Tag parameters use the existing first-value, trim, and case-normalization rules; they also select results-only loading/rendering and reset results state on change. Tag matching is exact. Ingredient navigation and its URL parameter are removed for now, including the chocolate/cocoa alias, to avoid recipe-specific matching rules. Free-text search retains its existing ingredient matching. Unsupported `ingredient` parameters are ignored like other unrelated parameters. Empty categories retain the standard no-results message.

**Verification:** Test link destinations, keyboard opening/Escape/focus return, mobile selection callback, tag matching and combined filters, plus landing/loading visibility for the new parameters. Browser checks remain needed at 375px, 675px, 1023/1024px, 1052×963px, and 1279/1280px, especially while opening and resizing menus.

## Upcoming browsing work

**Result presentation:** Use existing image cards until a separate discussion decides between a grid and full-width result cards. Keep loading and empty states throughout. Paging is settled by the infinite results loading decision above.

**Filter model:** Tag URL support is implemented for the menu. Ingredient filtering is deferred. Broader validated filter types remain separate work. The obsolete drawer-era matchers (`matchCategory`, `matchFilters`, `everySet`, `parseCategorySelection`, the `FilterMap` type) and the empty drawer folder were removed on October 12, 2026; `matchRecipe` and `matchCuisine` stay because `filterRecipes` uses them for server-side search.

**Lower priority:** Add a globe control to navigation for language. Clarify whether it controls recipe/source language or interface language before implementation.
