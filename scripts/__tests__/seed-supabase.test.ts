// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeRecipe } from '../../src/components/__tests__/mockData';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  readFile: vi.fn(),
  upload: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: mocks.createClient,
}));
vi.mock('node:fs/promises', () => ({ readFile: mocks.readFile }));
vi.mock('../../src/data/exampleRecipes.ts', () => ({ exampleRecipes: [] }));

const originalArgv = process.argv;

describe('Supabase seed script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.stubEnv('SUPABASE_URL', 'https://example.invalid');
    vi.stubEnv('SUPABASE_SECRET_KEY', 'test-secret');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    process.argv = ['node', 'scripts/seed-supabase.mjs'];
    mocks.readFile.mockResolvedValue(Buffer.from('test image'));
    mocks.upload.mockResolvedValue({ error: null });
    mocks.upsert.mockResolvedValue({ error: null });
    mocks.createClient.mockReturnValue({
      storage: { from: () => ({ upload: mocks.upload }) },
      from: () => ({ upsert: mocks.upsert }),
    });
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  async function loadRecipes() {
    const { exampleRecipes } = await import('../../src/data/exampleRecipes');
    exampleRecipes.splice(
      0,
      exampleRecipes.length,
      makeRecipe({
        slug: 'first-recipe',
        pictureUrl: '/exampleRecipes/first.jpg',
      }),
      makeRecipe({
        slug: 'second-recipe',
        pictureUrl: '/exampleRecipes/second.png',
      }),
    );
    return exampleRecipes;
  }

  async function runScript() {
    await import('../seed-supabase.mjs');
  }

  it('seeds every local recipe when no slug is supplied', async () => {
    await loadRecipes();
    await runScript();

    expect(mocks.upload).toHaveBeenCalledTimes(2);
    expect(mocks.upsert.mock.calls.map(([row]) => row.slug)).toEqual([
      'first-recipe',
      'second-recipe',
    ]);
    expect(console.log).toHaveBeenLastCalledWith('Done: 2 recipes.');
  });

  it('uploads and upserts only the selected recipe', async () => {
    const recipes = await loadRecipes();
    process.argv.push('--slug', 'second-recipe');
    await runScript();

    expect(mocks.readFile).toHaveBeenCalledExactlyOnceWith(
      'public/exampleRecipes/second.png',
    );
    expect(mocks.upload).toHaveBeenCalledExactlyOnceWith(
      'recipes/second-recipe.png',
      Buffer.from('test image'),
      { contentType: 'image/png', upsert: true },
    );
    expect(mocks.upsert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        slug: 'second-recipe',
        ingredients: recipes[1].ingredients,
        steps: [{ detail: 'Cook everything together', image_path: null }],
        picture_path: 'recipes/second-recipe.png',
      }),
      { onConflict: 'slug' },
    );
    expect(console.log).toHaveBeenLastCalledWith('Done: 1 recipes.');
  });

  it.each([
    { args: ['--slug', 'missing-recipe'], error: /No local recipe found/ },
    { args: ['--slug', ''], error: /No local recipe found/ },
    { args: ['--slug'], error: /argument missing/ },
    { args: ['--slgu', 'second-recipe'], error: /Unknown option/ },
    { args: ['second-recipe'], error: /Unexpected argument/ },
  ])(
    'rejects invalid arguments $args before uploads',
    async ({ args, error }) => {
      await loadRecipes();
      process.argv.push(...args);

      await expect(runScript()).rejects.toThrow(error);
      expect(mocks.createClient).not.toHaveBeenCalled();
      expect(mocks.readFile).not.toHaveBeenCalled();
      expect(mocks.upload).not.toHaveBeenCalled();
      expect(mocks.upsert).not.toHaveBeenCalled();
    },
  );

  it('rejects duplicate local slugs before uploads', async () => {
    const recipes = await loadRecipes();
    recipes[1].slug = recipes[0].slug;
    process.argv.push('--slug', recipes[0].slug);

    await expect(runScript()).rejects.toThrow(/Duplicate slug/);
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
});
