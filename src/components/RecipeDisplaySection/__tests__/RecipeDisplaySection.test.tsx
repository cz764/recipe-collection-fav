import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { pushMock } from '../../../../vitest.setup';
import { RecipeDisplaySection } from '..';
import { makeRecipe } from '@/components/__tests__/mockData';
import { ITEMS_PER_PAGE } from '@/constants';

vi.mock('next/navigation', async (importOriginal) => {
  const original = await importOriginal<typeof import('next/navigation')>();
  return {
    ...original,
    useRouter: () => ({ push: pushMock }),
    usePathname: () => '/',
    useSearchParams: vi.fn(() => new URLSearchParams()),
  };
});

describe('RecipeDisplaySection', () => {
  const mockRecipeList = [
    makeRecipe({ id: '1', name: 'Spaghetti Carbonara' }),
    makeRecipe({ id: '2', name: 'Chicken Curry' }),
    makeRecipe({ id: '3', name: 'Caesar Salad' }),
  ];
  const getSearchInput = () => screen.getByLabelText('Search Input');
  beforeEach(() => {
    pushMock.mockClear();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReturnType<typeof useSearchParams>,
    );
  });

  it('renders server results and search without drawer or category picker', () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(getSearchInput()).toBeVisible();
    expect(screen.getByText('3 recipes')).toBeVisible();
    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.queryByLabelText('Open Filters')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows an empty state for empty server results', () => {
    render(
      <RecipeDisplaySection recipeList={[]} urlFilters={{ q: 'missing' }} />,
    );
    expect(getSearchInput()).toHaveValue('missing');
    expect(screen.getByText('No recipes found.')).toBeVisible();
    expect(screen.getByText('0 recipes')).toBeVisible();
  });

  it('submits on Enter, preserving other URL parameters and encoding search text', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        'cuisine=chinese&meal=breakfast&type=entree&extra=keep',
      ) as ReturnType<typeof useSearchParams>,
    );
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
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
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
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
        recipeList={mockRecipeList}
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
        recipeList={mockRecipeList}
        urlFilters={{ q: 'egg' }}
      />,
    );
    await userEvent.clear(getSearchInput());
    await userEvent.type(getSearchInput(), '{Enter}');
    expect(pushMock).toHaveBeenCalledWith('/', { scroll: false });
  });

  describe('pagination', () => {
    const createManyRecipes = (count: number) =>
      Array.from({ length: count }, (_, i) =>
        makeRecipe({ id: `${i + 1}`, name: `Recipe ${i + 1}` }),
      );

    it('does not show pagination when recipes fit on one page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('shows pagination when recipes exceed one page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 1);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('displays correct items on first page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 3);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.getByText('Recipe 1')).toBeVisible();
      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE}`)).toBeVisible();
      expect(
        screen.queryByText(`Recipe ${ITEMS_PER_PAGE + 1}`),
      ).not.toBeInTheDocument();
    });

    it('displays correct items on second page', async () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 3);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      await userEvent.click(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      );

      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE + 1}`)).toBeVisible();
      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE + 3}`)).toBeVisible();
      expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
    });

    it('calculates total pages correctly', () => {
      // 2 full pages + 1 partial = 3 pages
      const recipes = createManyRecipes(ITEMS_PER_PAGE * 2 + 1);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      expect(
        within(pagination).getByRole('button', { name: /pagination item 1/ }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 3/ }),
      ).toBeVisible();
      expect(
        within(pagination).queryByRole('button', { name: /pagination item 4/ }),
      ).not.toBeInTheDocument();
    });

    it('calculates total pages correctly when evenly divisible', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE * 2);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      expect(
        within(pagination).getByRole('button', {
          name: /pagination item 1/,
        }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      ).toBeVisible();
      expect(
        within(pagination).queryByRole('button', { name: /pagination item 3/ }),
      ).not.toBeInTheDocument();
    });
  });
});
