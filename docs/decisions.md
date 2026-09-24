# Project decisions

Last updated: September 24, 2026. This document records durable decisions and current open work. Implementation status is separate from acceptance; accepted future work is not implemented automatically.

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

**Boundary:** TypeScript constrains authored data; future database/API payloads still need runtime validation before being treated as Recipe values.

## Daily featured recipes

**Status:** Implemented with local fixtures.

**Decision:** `fetchFeaturedRecipes()` returns up to three distinct recipes for the server's calendar day. `TopRecipes` renders the selection in order, with the first as Today's Recipe. `fetchRecipes(filters)` serves the independent results list.

**Reason:** Landing-page recommendations are independent of filtered results. Featured recipes are now omitted from filtered/search views, including empty results. The backend can later provide a separate limited query.

**Consequences:** Selection uses calendar dates to avoid daylight-saving elapsed-hour errors. This is deterministic selection, not a scheduled daily fetch or database cache. Backend daily caching and the production day/timezone policy remain to be designed.

## Responsive layout and image loading

**Status:** Implemented; earlier visual checks confirmed the main layout and image improvements.

**Decision:** Main content is full width below 1280px and centered at 80% from 1280px. Featured sections stack below 1280px. The results grid has one column below 768px, two from 768px, and three from 1024px. Navigation collapses below 1024px.

**Reason:** The previous 80% width and side-by-side featured layout were too cramped near 1052px. Content-dependent sizing also made empty results change page width.

**Consequences:** `main` uses auto horizontal margins, without `place-items-center`; the homepage wrapper fills its available width. Results reserve a 24rem minimum height, an empty-state message, and pagination space. These reduce collapse but do not guarantee identical page heights for different result counts.

**Decision:** Use separate Suspense boundaries for featured recipes and results. `FeaturedRecipeLoader` has a stable boundary; only `RecipeLoader` is keyed by URL filters. Each has its own skeleton. The route loading state reads the URL to show featured placeholders only for landing views; its pre-resolution fallback shows only results placeholders. Featured data is fetched only when the landing view renders; this is not a daily data cache. Use Next.js Image through `RecipeImage` for homepage photos, with responsive sizes, lazy loading for cards, and priority for Today's Recipe.

**Reason:** Data readiness does not imply image readiness. Original images were larger than needed for cards.

**Consequences:** Page and image placeholders share a light CSS shimmer that works before hydration and respects reduced motion. Image shimmer stops on success or failure. Square crops and 110% hover zoom are intentional. Tailwind v4's separate `scale` property must be included in the image transition.

## Filter drawer and classification cleanup

**Status:** Drawer and mixed category picker removed. The recipe classification migration is implemented.

**Decision:** Keep one search input and URL-derived summaries. Remove the drawer and mixed category picker because they interrupt page context and duplicate navigation filtering.

**Consequences:** Results no longer apply hidden local category, language, or drawer filters. The loading skeleton also omits these controls. Language filtering has no replacement UI yet.

**Open design:** Design grouped navigation alongside the existing search input. Settle navigation behavior before implementing it. Ingredient/equipment filters and a navigation language control remain proposals. Clarify recipe/source language versus UI language before implementation.

## Supabase integration

**Status:** Proposed, not implemented or selected as a finalized backend design.

**Proposal:** Store recipe records in Postgres and image files in Supabase Storage. Store object paths in records and resolve them into frontend `Recipe.pictureUrl` and `Step.imageUrl` values in the data layer. Database rows need not mirror frontend types exactly.

**Reason:** Separating records and files supports backend search and keeps component interfaces stable.

**Consequences if adopted:** Use database filtering/pagination instead of loading the full collection. Keep the featured query limited and separate. Public recipe images can use a public bucket with controlled writes; private images require a separate access/caching design. Allow only the actual project hostname and bucket in Next.js `remotePatterns`. The default image optimizer does not forward authentication headers.

References: [Supabase Storage](https://supabase.com/docs/guides/storage/quickstart), [bucket access](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Next.js 15 Image](https://nextjs.org/docs/15/app/api-reference/components/image).

## Open work

- **Priority: visually reassess screen flicker.** Earlier reports described whole-screen dimming/blurring during drawer/category interactions. Those controls are now removed; this does not establish the cause or prove all flicker resolved. Verify remaining navigation and URL search transitions in a browser.
- Keep the pending cornbread image request tracked independently of the visually verified landing-only design.
- Visually verify grouped All Recipes navigation at desktop and mobile widths, including keyboard focus, nested mobile-menu dismissal, scrolling, and long labels.
- TODO: Write the About story and create its page, then uncomment the About navigation item.
- Review recipe-specific classifications as the collection grows; do not silently relabel fixtures as part of unrelated UI work.
- Pagination versus infinite scroll is undecided. A future landing-page grid cap of roughly one or two pages is proposed; do not cap data or remove current pagination until the browsing design is settled.
- The user confirmed the search/drawer-removal visual checks passed before the featured-boundary split. Visual verification of the split remains separate from that confirmation.

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

**Status:** Implemented September 24, 2026; browser verification pending.

**Decision:** Navigation exposes All Recipes and Bakery. About is commented out with a TODO until its story/page exists. The separate `NavigationBar/AllRecipes` component uses HeroUI Dropdown, DropdownMenu, and grouped sections, with Next.js links. Desktop and mobile share the menu content; selecting a mobile category closes the navigation menu.

**Groups:** Meal (the shared meal vocabulary), Cuisine (the shared cuisine vocabulary except unknown), Dietary (Vegetarian), and Preparation (One pot). View all recipes returns to `/`, including featured content. Bakery links directly to `/?type=bakery`.

**URL behavior:** A navigation category starts a fresh selection. Search preserves that selection and narrows with AND. Tag parameters use the existing first-value, trim, and case-normalization rules; they also select results-only loading/rendering and reset results state on change. Tag matching is exact. Ingredient navigation and its URL parameter are removed for now, including the chocolate/cocoa alias, to avoid recipe-specific matching rules. Free-text search retains its existing ingredient matching. Unsupported `ingredient` parameters are ignored like other unrelated parameters. Empty categories retain the standard no-results message.

**Verification:** Test link destinations, keyboard opening/Escape/focus return, mobile selection callback, tag matching and combined filters, plus landing/loading visibility for the new parameters. Browser checks remain needed at 375px, 675px, 1023/1024px, 1052×963px, and 1279/1280px, especially while opening and resizing menus.

## Upcoming browsing work

**Result presentation:** Use existing image cards until a separate discussion decides between a grid and full-width result cards. Keep loading and empty states throughout.

**Filter model:** Tag URL support is implemented for the menu. Ingredient filtering is deferred. Broader validated filter types and removal of obsolete drawer filter structures remain separate work.

**Lower priority:** Add a globe control to navigation for language. Clarify whether it controls recipe/source language or interface language before implementation.
