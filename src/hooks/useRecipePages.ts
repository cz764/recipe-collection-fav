import { useCallback, useRef, useState } from 'react';
import { fetchRecipePage } from '@/api/recipesClient';
import { AUTO_LOAD_LIMIT } from '@/constants';
import type { RecipePage, RecipeQuery } from '@/data/filter';

export type LoadStatus = 'idle' | 'loading' | 'error';
export type LoadSource = 'auto' | 'manual';

/**
 * Accumulates result pages for one filter selection. The first page comes from
 * the server render; later pages are fetched from the recipes route. Automatic
 * (scroll-triggered) loads are capped at AUTO_LOAD_LIMIT; manual loads are not.
 */
export function useRecipePages(
  initialPage: RecipePage,
  urlFilters: RecipeQuery = {},
) {
  const [pages, setPages] = useState<RecipePage[]>([initialPage]);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [autoLoads, setAutoLoads] = useState(0);
  // Refs guard against stale callbacks, e.g. an observer firing mid-update.
  const autoLoadCount = useRef(0);
  const inFlight = useRef(false);

  const lastPage = pages[pages.length - 1];
  const { hasMore } = lastPage;
  const autoLoadExhausted = autoLoads >= AUTO_LOAD_LIMIT;

  const loadMore = useCallback(
    async (source: LoadSource = 'manual') => {
      if (inFlight.current || !hasMore) return;
      if (source === 'auto' && autoLoadCount.current >= AUTO_LOAD_LIMIT) {
        return;
      }
      inFlight.current = true;
      setStatus('loading');
      try {
        const next = await fetchRecipePage(urlFilters, lastPage.page + 1);
        setPages((previous) => [...previous, next]);
        if (source === 'auto') {
          autoLoadCount.current += 1;
          setAutoLoads(autoLoadCount.current);
        }
        setStatus('idle');
      } catch (error) {
        console.error(error);
        setStatus('error');
      } finally {
        inFlight.current = false;
      }
    },
    [hasMore, lastPage.page, urlFilters],
  );

  return {
    recipes: pages.flatMap((page) => page.recipes),
    total: lastPage.total,
    hasMore,
    status,
    autoLoadExhausted,
    loadMore,
  };
}
