# Project decisions

Last updated: September 22, 2026. This document records durable decisions and current open work. Implementation status is separate from acceptance; accepted future work is not implemented automatically.

## URL filters and data flow

**Status:** Cuisine/type filtering and prop-based summaries implemented; migration of all applied controls to the URL is incomplete.

**Decision:** `Home` awaits `searchParams`, then passes resolved values to `RecipeLoader`. The loader parses cuisine/type and passes normalized filters through `RecipeDisplaySection` to `SearchAndFilterBar`. Summaries derive directly from props, without synchronization effects or a second state copy.

**Reason:** Explicit data flow makes shared links, browser navigation, and a future backend easier to reason about.

**Consequences:** Values are trimmed and matched case-insensitively; both fields combine with AND. Repeated parameters use the first value, blanks are ignored, and unknown values yield no results. The URL-based Suspense key resets results state when cuisine/type changes. Search, category selection, and the existing drawer still apply additional local filtering; wiring those controls to URL updates is pending.

## Daily featured recipes

**Status:** Implemented with local fixtures.

**Decision:** `fetchFeaturedRecipes()` returns up to three distinct recipes for the server's calendar day. `TopRecipes` renders the selection in order, with the first as Today's Recipe. `fetchRecipes(filters)` serves the independent results list.

**Reason:** A search with zero matches must not remove or break featured recipes. The backend can later provide a separate limited query.

**Consequences:** Selection uses calendar dates to avoid daylight-saving elapsed-hour errors. This is deterministic selection, not a scheduled daily fetch or database cache. Backend daily caching and the production day/timezone policy remain to be designed.

## Responsive layout and image loading

**Status:** Implemented; earlier visual checks confirmed the main layout and image improvements.

**Decision:** Main content is full width below 1280px and centered at 80% from 1280px. Featured sections stack below 1280px. The results grid has one column below 768px, two from 768px, and three from 1024px. Navigation collapses below 1024px.

**Reason:** The previous 80% width and side-by-side featured layout were too cramped near 1052px. Content-dependent sizing also made empty results change page width.

**Consequences:** `main` uses auto horizontal margins, without `place-items-center`; the homepage wrapper fills its available width. Results reserve a 24rem minimum height, an empty-state message, and pagination space. These reduce collapse but do not guarantee identical page heights for different result counts.

**Decision:** Keep data fetching inside the homepage Suspense boundary and use the shared recipe skeleton. Use Next.js Image through `RecipeImage` for homepage photos, with responsive sizes, lazy loading for cards, and priority for Today's Recipe.

**Reason:** Data readiness does not imply image readiness. Original images were larger than needed for cards.

**Consequences:** Page and image placeholders share a light CSS shimmer that works before hydration and respects reduced motion. Image shimmer stops on success or failure. Square crops and 110% hover zoom are intentional. Tailwind v4's separate `scale` property must be included in the image transition.

## Filter drawer and classification cleanup

**Status:** Drawer removal accepted but pending. Data cleanup requires a separate design/work session.

**Decision:** Remove the drawer in a future scoped change because it interrupts page context and overlaps navigation filtering. The current completed step only removes local drawer summaries; URL summaries remain.

**Consequences:** The drawer and button still exist. Local drawer filters can still constrain results without appearing in the toolbar summary. This is an intermediate state, not the intended final UX.

**Open design:** Separate cuisine, meal type, dietary labels, and cooking methods. The existing category picker mixes them, and fixtures include `cuisine: 'baking'` and inconsistent casing. Review cuisine, type, maximum time, and curated tags first. Ingredient/equipment filters and a navigation language control remain proposals. Clarify recipe/source language versus UI language before implementation.

## Supabase integration

**Status:** Proposed, not implemented or selected as a finalized backend design.

**Proposal:** Store recipe records in Postgres and image files in Supabase Storage. Store object paths in records and resolve them into frontend `Recipe.pictureUrl` and `Step.imageUrl` values in the data layer. Database rows need not mirror frontend types exactly.

**Reason:** Separating records and files supports backend search and keeps component interfaces stable.

**Consequences if adopted:** Use database filtering/pagination instead of loading the full collection. Keep the featured query limited and separate. Public recipe images can use a public bucket with controlled writes; private images require a separate access/caching design. Allow only the actual project hostname and bucket in Next.js `remotePatterns`. The default image optimizer does not forward authentication headers.

References: [Supabase Storage](https://supabase.com/docs/guides/storage/quickstart), [bucket access](https://supabase.com/docs/guides/storage/buckets/fundamentals), [Next.js 15 Image](https://nextjs.org/docs/15/app/api-reference/components/image).

## Open work

- **Priority: reproduce screen flicker.** User reports brief whole-screen dimming/blurring when opening the drawer/category dropdown or selecting a category. The drawer has an animated opaque backdrop; Select defaults to a transparent backdrop. Both lock scrolling. These findings do not establish the cause of every reported interaction. An interaction test confirms a loaded image retains its DOM node and loading state through these actions; browser reproduction is still needed. No speculative flicker fix has been applied.
- Remove the drawer in a separately scoped change, then settle remaining filter controls and reset behavior.
- Schedule classification/data cleanup separately; do not silently relabel fixtures as part of unrelated UI work.
- Complete URL-driven controls after deciding the filter UX.
- Reset the current page when local applied filters/search/categories change. This remains lower priority; URL changes already remount the results subtree.
- Pagination versus infinite scroll is undecided.
- Explicit visual confirmation of filter-summary wrapping remains pending.
