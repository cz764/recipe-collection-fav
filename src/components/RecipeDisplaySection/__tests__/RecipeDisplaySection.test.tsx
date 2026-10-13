import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { pushMock } from '../../../../vitest.setup';
import { RecipeDisplaySection } from '..';
import { makeRecipe } from '@/components/__tests__/mockData';
import { AUTO_LOAD_LIMIT, ITEMS_PER_PAGE } from '@/constants';
import type { RecipePage } from '@/data/filter';

vi.mock('next/navigation', async (importOriginal) => {
  const original = await importOriginal<typeof import('next/navigation')>();
  return {
    ...original,
    useRouter: () => ({ push: pushMock }),
    usePathname: () => '/',
    useSearchParams: vi.fn(() => new URLSearchParams()),
  };
});

const pageOf = (
  names: string[],
  overrides: Partial<RecipePage> = {},
): RecipePage => ({
  recipes: names.map((name) => makeRecipe({ id: name, name })),
  page: 1,
  pageSize: ITEMS_PER_PAGE,
  total: names.length,
  hasMore: false,
  ...overrides,
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('RecipeDisplaySection', () => {
  const threeRecipes = pageOf([
    'Spaghetti Carbonara',
    'Chicken Curry',
    'Caesar Salad',
  ]);
  const getSearchInput = () => screen.getByLabelText('Search Input');
  beforeEach(() => {
    pushMock.mockClear();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>,
    );
  });

  it('renders server results and search without drawer or category picker', () => {
    render(<RecipeDisplaySection initialPage={threeRecipes} />);
    expect(getSearchInput()).toBeVisible();
    expect(screen.getByText('3 recipes')).toBeVisible();
    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.queryByLabelText('Open Filters')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows an empty state for empty server results', () => {
    render(
      <RecipeDisplaySection
        initialPage={pageOf([])}
        urlFilters={{ q: 'missing' }}
      />,
    );
    expect(getSearchInput()).toHaveValue('missing');
    expect(screen.getByText('No recipes found.')).toBeVisible();
    expect(screen.getByText('0 recipe')).toBeVisible();
  });

  it('submits on Enter, preserving other URL parameters and encoding search text', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        'cuisine=chinese&meal=breakfast&type=entree&extra=keep',
      ) as ReturnType<typeof useSearchParams>,
    );
    render(<RecipeDisplaySection initialPage={threeRecipes} />);
    await userEvent.type(getSearchInput(), ' egg & cheese ');
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByText('3 recipes')).toBeVisible();
    await userEvent.type(getSearchInput(), '{Enter}');
    expect(pushMock).toHaveBeenCalledWith(
      '/?cuisine=chinese&meal=breakfast&type=entree&extra=keep&q=egg+%26+cheese',
      { scroll: false },
    );
  });

  it('submits using the search button', async () => {
    render(<RecipeDisplaySection initialPage={threeRecipes} />);
    await userEvent.type(getSearchInput(), 'egg');
    await userEvent.click(screen.getByLabelText('Search'));
    expect(pushMock).toHaveBeenCalledWith('/?q=egg', { scroll: false });
  });

  it('removes q on empty submission while retaining filters', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('q=egg&cuisine=chinese') as ReturnType<
        typeof useSearchParams
      >,
    );
    render(
      <RecipeDisplaySection
        initialPage={threeRecipes}
        urlFilters={{ q: 'egg', cuisine: 'chinese' }}
      />,
    );
    expect(getSearchInput()).toHaveValue('egg');
    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), '   {Enter}');
    expect(pushMock).toHaveBeenCalledWith('/?cuisine=chinese', {
      scroll: false,
    });
  });

  it('uses the bare pathname when the final query parameter is removed', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('q=egg') as ReturnType<typeof useSearchParams>,
    );
    render(
      <RecipeDisplaySection
        initialPage={threeRecipes}
        urlFilters={{ q: 'egg' }}
      />,
    );
    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), '{Enter}');
    expect(pushMock).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('removes a filter from the URL when its chip is closed', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('type=bakery&q=dough&extra=keep') as ReturnType<
        typeof useSearchParams
      >,
    );
    render(
      <RecipeDisplaySection
        initialPage={threeRecipes}
        urlFilters={{ type: 'bakery', q: 'dough' }}
      />,
    );
    const typeChip = screen.getByText('Type: Bakery').closest('div')!;
    await userEvent.click(
      within(typeChip).getByRole('button', { name: 'close chip' }),
    );
    expect(pushMock).toHaveBeenCalledWith('/?q=dough&extra=keep', {
      scroll: false,
    });
  });

  describe('loading more results', () => {
    const fetchMock = vi.fn<typeof fetch>();
    const firstPage = pageOf(['Recipe 1', 'Recipe 2'], {
      total: 5,
      hasMore: true,
    });

    beforeEach(() => {
      fetchMock.mockReset();
      vi.stubGlobal('fetch', fetchMock);
    });
    afterEach(() => vi.unstubAllGlobals());

    it('hides Load more when the server page is the last one', () => {
      render(<RecipeDisplaySection initialPage={threeRecipes} />);
      expect(
        screen.queryByRole('button', { name: 'Load more' }),
      ).not.toBeInTheDocument();
    });

    it('fetches the next page with the current filters and appends it', async () => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse(
          pageOf(['Recipe 3', 'Recipe 4'], {
            page: 2,
            total: 5,
            hasMore: true,
          }),
        ),
      );
      render(
        <RecipeDisplaySection
          initialPage={firstPage}
          urlFilters={{ cuisine: 'chinese', q: 'egg & cheese' }}
        />,
      );
      expect(screen.getByText('5 recipes')).toBeVisible();
      await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/recipes?cuisine=chinese&q=egg+%26+cheese&page=2',
      );
      expect(await screen.findByText('Recipe 3')).toBeVisible();
      expect(screen.getByText('Recipe 1')).toBeVisible();
      expect(screen.getByText('Recipe 4')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Load more' })).toBeVisible();

      fetchMock.mockResolvedValueOnce(
        jsonResponse(pageOf(['Recipe 5'], { page: 3, total: 5 })),
      );
      await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
      expect(await screen.findByText('Recipe 5')).toBeVisible();
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/recipes?cuisine=chinese&q=egg+%26+cheese&page=3',
      );
      expect(
        screen.queryByRole('button', { name: 'Load more' }),
      ).not.toBeInTheDocument();
    });

    it('reports a failed fetch and lets the user retry', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'nope' }, 500));
      render(<RecipeDisplaySection initialPage={firstPage} />);
      await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Could not load more recipes.',
      );

      fetchMock.mockResolvedValueOnce(
        jsonResponse(pageOf(['Recipe 3'], { page: 2, total: 5 })),
      );
      await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
      expect(await screen.findByText('Recipe 3')).toBeVisible();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      consoleError.mockRestore();
    });

    describe('automatic loading on scroll', () => {
      let intersect: (() => void) | undefined;
      const observe = vi.fn();
      const disconnect = vi.fn();

      beforeEach(() => {
        intersect = undefined;
        observe.mockClear();
        disconnect.mockClear();
        vi.stubGlobal(
          'IntersectionObserver',
          class {
            constructor(callback: IntersectionObserverCallback) {
              intersect = () =>
                callback(
                  [{ isIntersecting: true } as IntersectionObserverEntry],
                  this as unknown as IntersectionObserver,
                );
            }
            observe = observe;
            disconnect = disconnect;
          },
        );
      });

      it('loads pages while scrolling until the automatic limit, then leaves Load more', async () => {
        let page = 1;
        fetchMock.mockImplementation(async () => {
          page += 1;
          return jsonResponse(
            pageOf([`Auto page ${page}`], { page, total: 100, hasMore: true }),
          );
        });
        render(<RecipeDisplaySection initialPage={firstPage} />);
        expect(observe).toHaveBeenCalledTimes(1);

        for (let load = 1; load <= AUTO_LOAD_LIMIT; load += 1) {
          await act(async () => intersect?.());
          expect(
            await screen.findByText(`Auto page ${load + 1}`),
          ).toBeVisible();
        }
        expect(fetchMock).toHaveBeenCalledTimes(AUTO_LOAD_LIMIT);
        expect(fetchMock).toHaveBeenLastCalledWith(
          `/api/recipes?page=${AUTO_LOAD_LIMIT + 1}`,
        );

        // Observation stops after the limit; only the button loads more now.
        const observations = observe.mock.calls.length;
        await act(async () => intersect?.());
        expect(fetchMock).toHaveBeenCalledTimes(AUTO_LOAD_LIMIT);
        expect(observe).toHaveBeenCalledTimes(observations);
        await userEvent.click(
          screen.getByRole('button', { name: 'Load more' }),
        );
        await waitFor(() =>
          expect(fetchMock).toHaveBeenCalledTimes(AUTO_LOAD_LIMIT + 1),
        );
      });

      it('does not observe when there is nothing more to load', () => {
        render(<RecipeDisplaySection initialPage={threeRecipes} />);
        expect(observe).not.toHaveBeenCalled();
      });
    });
  });
});
