---
name: verify-recipe-breakpoints
description: "Verify responsive layouts in the recipe website when changing container widths, navigation, featured recipes, result grids, or filter-summary wrapping. Use for breakpoint checks, not general data or backend changes."
---

# Verify Recipe Breakpoints

Verify the affected layout; do not redesign unrelated UI or treat an inspection request as permission to edit it.

1. Read the repository's `AGENTS.md` and the responsive-layout decision in `docs/decisions.md`. Inspect the changed components and actual breakpoint classes; use updated requirements when a task intentionally changes them.
2. Use available browser tooling and the running local app. Follow the browser tool's setup instructions. If browser access is unavailable, report that limitation and provide the unchecked viewport/state cases instead of claiming visual verification.
3. Check a narrow phone width (375px) and both sides of each affected breakpoint. Current boundaries are 640px, 768px, 1024px, and 1280px; inspect boundary minus 1px and boundary width where relevant. Include the previously problematic 675px width and 1052×963px viewport for changes to navigation or featured recipes. Record CSS viewport dimensions, not window outer dimensions.
4. Confirm expected main width/centering, navigation mode, featured stacking, and grid columns. Check horizontal overflow, clipped labels, squeezed controls, and the result count with wrapping summaries. Resize in both directions when checking an open menu.
5. Exercise populated results and a no-match URL such as `/?cuisine=unknown`. Check the loading skeleton and image placeholders when the change affects their geometry. For reported flicker, distinguish backdrop dimming, sideways movement, and content/image remounts; record observations separately from hypotheses.
6. Report tested viewports/states, findings with reproduction steps, and anything not verified. Leave final review, edits, and commits to the user unless explicitly requested.

Keep the report brief. Add screenshots or measured dimensions only when they help demonstrate a finding.
